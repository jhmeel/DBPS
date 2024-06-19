import React from "react";
import styled from "styled-components";
import { AiOutlineBell, AiTwotoneSecurityScan } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  return (
    <HeaderRenderer>
     <div className="logo-cont"><AiTwotoneSecurityScan fontSize={40}/> <span style={{fontSize:'20px',fontFamily:'Open Sans',fontWeight:'600'}}>Secur</span></div>

      <nav>
        <ul>
          <li className="nav-icon" title="Notification">
            <AiOutlineBell />
          </li>
          <li
            className="nav-icon"
            title="Dashboard"
            onClick={() => navigate("https://github.com/jhmeel/DBMS.git")}
          >
            <FaGithub />
          </li>
        </ul>
      </nav>
    </HeaderRenderer>
  );
};

export default Header;

const HeaderRenderer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  z-index: 1000;
  top: 0;
  width: 100%;
  height: 70px;
  padding:10px;
  background-color: rgba(255, 255, 255);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  transform: 0.5s;
  border-bottom: 1px solid #ededed;
  .logo-cont{
    display:flex;
    align-items:center;
    gap:5px;
  }
  .logo {
    width: 90px;
    height: auto;
    cursor: pointer;
    position: relative;
    left:-20px;
  }
  nav ul {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .nav-icon {
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 40px;
    border-radius: 30%;
    border: 1px solid #ededed;
    background-color: #fff;
    cursor: pointer;
  }
`;
