import express from "express";
import yaml from "js-yaml";
import fs from "fs";
import winston from "winston";
import crypto from "crypto";
import os from "os";
import process from "process";
import url from "url";
import ipaddr from "ipaddr.js";
import cors from "cors";
import bodyParser from "body-parser";


const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-validator" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

const app = express();
app.use(bodyParser.json())
app.use(express.json());

app.use(cors("*"));
app.use((req, res, next) => {
  logger.info(req.headers);
  next();
});
// Load configuration from YAML file
const configFile = "config.yaml";
let config;
try {
  const fileContents = fs.readFileSync(configFile, "utf8");
  config = yaml.load(fileContents);
} catch (e) {
  console.error(`Error loading configuration file: ${e}`);
  process.exit(1);
}

const requestValidator = (config, logger) => {
  const { encryptionKey, encryptionAlgorithm } = config.encryption;

  return (req, res, next) => {
    const { headers, body, method, originalUrl } = req;
    const parsedUrl = url.parse(originalUrl, true);
    const clientIp = ipaddr.process(req.connection.remoteAddress).toString();

    if (["/api/logs", "/api/event", "/api/config"].includes(req.url)) {
      return next();
    }

    const { whitelist, blacklist } = config.ipLists;
    if (whitelist.length > 0 && !whitelist.includes(clientIp)) {
      logger.warn(`Request from ${clientIp} rejected: IP not in whitelist`);
      return res.status(403).send("Forbidden");
    }
    if (blacklist.includes(clientIp)) {
      logger.warn(`Request from ${clientIp} rejected: IP in blacklist`);
      return res.status(403).send("Forbidden");
    }

    const rules = config.policies.flatMap((policy) => policy.rules);
    for (const rule of rules) {
      const { pattern, action } = rule;
      const regex = new RegExp(pattern, "g");

      if (Object.values(body).some((value) => regex.test(value))) { 
        logger.warn(`Request matched rule: ${JSON.stringify(rule)}`);
    
        switch (action) { 
          case "block":
            return res.status(403).send("Forbidden");
          case "encrypt":
            const encryptedBody = encryptSensitiveData(
              body,
              regex,
              encryptionKey,
              encryptionAlgorithm
            );
            req.body = encryptedBody;
            break;
          case "quarantine":
            logger.info(`Request quarantined: ${JSON.stringify(req)}`);
            return res.status(200).send("Request quarantined");

          default:
            logger.warn(
              `Unknown action ${action} for rule: ${JSON.stringify(rule)}`
            );
        }
      }
    }

    next();
  };
};

const encryptSensitiveData = (
  body,
  regex,
  encryptionKey,
  encryptionAlgorithm
) => {
  const encryptedBody = { ...body };
  for (const [key, value] of Object.entries(body)) {
    encryptedBody[key] = value.replace(regex, (matched) =>
      encrypt(matched, encryptionKey, encryptionAlgorithm)
    );
  }
  return encryptedBody;
};

const encrypt = (data, encryptionKey, encryptionAlgorithm) => {
  const cipher = crypto.createCipher(encryptionAlgorithm, encryptionKey);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted; 
};

// Middleware to validate incoming requests
app.use(requestValidator(config, logger));

// Endpoint to update configuration
app.post("/api/config", (req, res) => {
  const newConfig = req.body;
  try {
    fs.writeFileSync(configFile, yaml.dump(newConfig)); 
    config = newConfig;
    logger.info("Configuration updated successfully");
    res.status(200).send("Configuration updated successfully");
  } catch (e) {
    logger.error(`Error updating configuration: ${e}`);
    res.status(500).send("Error updating configuration");
  }
});

const eventHandler = (req, res) => {
  const eventDetails = {
    eventType: "server-status",
    timestamp: Date.now(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    osInfo: {
      platform: os.platform(),
      release: os.release(),
      arch: os.arch(),
      cpus: os.cpus().length,
      loadAvg: os.loadavg(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
    },
  };
  res.json(eventDetails);
};

const streamLogs = () => {
  return (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(': keep-alive\n\n');

    const filePath = 'logs/combined.log';
    let fileSize = 0;

    const sendNewLogs = () => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error reading log file:', err);
          return;
        }

        // If the file has grown, read the new data and send it to the client
        if (stats.size > fileSize) {
          const stream = fs.createReadStream(filePath, {
            start: fileSize,
            end: stats.size
          });

          stream.on('data', chunk => {
            res.write(`data: ${chunk.toString()}\n\n`);
          });

          stream.on('end', () => {
            fileSize = stats.size;
          });
        }
      });
    };

    const intervalId = setInterval(sendNewLogs, 1000);

    req.on('close', () => {
      clearInterval(intervalId);
    });
  };
};

app.get("/api/logs", streamLogs());

app.get("/api/event", eventHandler);

const port = process.env.PORT || 2000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
