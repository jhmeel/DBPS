import React from "react";
import styled from "styled-components";
import { BiLoader } from "react-icons/bi";

const MainLoader = () => {
  return (
    <Loader>
      <BiLoader className="loader" />
    </Loader>
  );
};

export default MainLoader;

const Loader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background: #fff;
  background-size: 200% 200%;
  cursor: progress;

  .loader {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
