/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { axiosInstance } from "../utils";
import { FaClipboardList } from "react-icons/fa";
import styled from "styled-components";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";

function ConfigTable() {
  const [config, setConfig] = useState(
    `
    ipLists:
    whitelist:
      - 192.168.1.100
      - 10.0.0.1
    blacklist:
      - 172.16.0.10
  
    encryption:
     encryptionKey: your-secret-encryption-key
     encryptionAlgorithm: aes-256-cbc
  
    policies:
    - name: PII Protection
      description: Protect Personally Identifiable Information (PII)
      rules:
        - name: Detect SSN
          pattern: \b\d{3}-\d{2}-\d{4}\b
          action: encrypt
        - name: Detect Credit Card Numbers
          pattern: \b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b
          action: encrypt
  
    - name: Financial Data Protection
      description: Protect financial data
      rules:
        - name: Detect Bank Account Numbers
          pattern: \b\d{9,17}\b
          action: block
  
    - name: IP Protection
      description: Protect intellectual property
      rules:
        - name: Detect Source Code
          pattern: \.(?:js|py|java|cpp|cs|php)
          action: quarantine
  
    - name: Network Intrusion Detection
      description: Detect and block network intrusion attempts
      rules:
        - name: Detect SQL Injection
          pattern: SELECT.*?FROM.*?\b(?:information_schema|mysql|performance_schema|sys|pg_catalog)\b
          action: block
        - name: Detect XSS Attack
          pattern: /<script>|<\/script>|<script\b[^<>]*>[^<>]*<\/script>/i
          action: block

    `
  );

  const [updateConfigLoading, setUpdateConfigLoading] = useState<boolean>(false);

  const handleConfigChange = (e: any) => {
    setConfig(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setUpdateConfigLoading(true);
      const response = await axiosInstance().post("/api/config", { config });
      toast.success(response.data);
      setUpdateConfigLoading(false);
    } catch (err: any) {
      setUpdateConfigLoading(false);
      toast.error(err.response.data.error);
    }
  };


  
  return (
    <SConfigTable>
      <h3>
        <FaClipboardList /> Config
      </h3>
      <textarea value={config} onChange={handleConfigChange} />
      <button disabled={updateConfigLoading} onClick={handleSubmit}>
        {updateConfigLoading ? (
          <>
            <BiLoader className="loader" />{" "}
            <span style={{ color: "#fff" }}>Applying config</span>
          </>
        ) : (
          "Update Config"
        )}
      </button>

      <button className="clear-config" onClick={() => setConfig("")}>
        Clear
      </button>
    </SConfigTable>
  );
}

export default ConfigTable;

const SConfigTable = styled.div`
  width: 100%;
  textarea {
    width: 100%;
    min-height: 300px;
    font-family: monospace;
    font-size: 0.9rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    color: #4c5d9b;
    outline: none;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #1f4fa7;
    color: #fff;
    border: none;
    border-radius: 2px;
    cursor: pointer;
  }
  .clear-config {
    background-color: transparent;
    color: #1f4fa7;
    margin-left: 10px;
    border: 1px solid #1f4fa7;
  }
`;
