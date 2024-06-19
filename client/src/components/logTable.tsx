import { useEffect, useState } from "react";
import { FaTerminal } from "react-icons/fa";
import styled from "styled-components";
import axios from "axios";

function LogTable() {
  const [logs, setLogs] = useState("");
  const [lastLogSize, setLastLogSize] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(fetchLogs, 5000);
    return () => clearInterval(intervalId);
  }, []); 


  function fetchLogs() {
    axios
      .get("http://localhost:2000/api/logs", {
        headers: {
          Range: `bytes=${lastLogSize}-`,
        },
        
          responseType: "text"
      })
      .then((response) => {
        console.log('rez',response)
        if (response.data) {
          console.log(response.data);
          setLogs((prevLogs) => prevLogs + response.data);
          setLastLogSize((prevSize) => prevSize + response.data.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching logs:", error);
      });
  }

  fetchLogs()

  const colorizeLogs = (logString: string) => {
    const lines = logString.split("\n");
    return lines.map((line, index) => {
      if (line.includes("error") || line.includes("ERROR")) {
        return <ErrorLog key={index}>{line}</ErrorLog>;
      } else if (line.includes("warn") || line.includes("WARN")) {
        return <WarnLog key={index}>{line}</WarnLog>;
      } else if (line.includes("info") || line.includes("INFO")) {
        return <InfoLog key={index}>{line}</InfoLog>;
      } else {
        return <DefaultLog key={index}>{line}</DefaultLog>;
      }
    });
  };

  return (
    <SLogTable>
      <h3>
        <FaTerminal /> System Logs
      </h3>
      <LogContainer>{colorizeLogs(logs)}</LogContainer>
    </SLogTable>
  );
}

export default LogTable;

const SLogTable = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100vh;

  h3 {
    margin-bottom: 1rem;
  }
`;

const LogContainer = styled.pre`
  flex-grow: 1;
  background-color: #000000;
  color: #eeeeee;
  padding: 0.8rem;
  overflow-y: auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 2rem;
`;

const ErrorLog = styled.div`
  color: red;
`;

const WarnLog = styled.div`
  color: orange;
`;

const InfoLog = styled.div`
  color: green;
`;

const DefaultLog = styled.div`
  color: #eeeeee;
`;
