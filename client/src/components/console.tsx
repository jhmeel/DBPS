import { useEffect, useState } from "react";
import { axiosInstance } from "../utils";
import styled from "styled-components";
const SConsole = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  h3 {
    margin-bottom: 1rem;
  }

  .console-output,
  pre {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #000000;
    color: green;
    padding: 1rem;
    overflow-y: auto;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.9rem;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

function Console() {
  const [processData, setProcessData] = useState({
    adapter: [],
    data: "",
  });

  useEffect(() => {
    const fetchProcessData = async () => {
      try {
        const response = await axiosInstance().get("/api/event", {
          responseType: "text",
        });

        setProcessData({
          adapter: response?.config?.adapter,
          data: response?.data,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchProcessData();
  }, []);

  return (
    <SConsole>
      <h3>Active Processes</h3>
      <div className="console-output">
        Network Adapters- {processData.adapter.toString()}
        <pre>{processData.data}</pre>
      </div>
    </SConsole>
  );
}

export default Console;
