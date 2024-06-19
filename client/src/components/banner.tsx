import React from "react";
import styled, { keyframes } from "styled-components";
import lockImg from "../assets/lock.jpg";
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const reveal = keyframes`
  0% {
    transform: translateY(50%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const BannerContainer = styled.div`
  background-color:rgba (255, 255, 255, 1);
  height: 300px;
  padding: 2rem;
  display: flex;
  flex-direction:row;
  align-items: center;
  justify-content: space-around;
  text-align: center;

  img{
    animation: ${fadeIn} 0.3s ease-in-out 0.5s 1 normal both;
    width:500px;
  }
  @media(max-width:767px){
    flex-direction:column;
    margin-bottom:230px;
  }
`;

const BannerTitle = styled.h1`
  color: rgb(32, 33, 36);
  font-size: 3rem;
  font-family: zeitung, sans-serif;
  font-weight: bold;
  opacity: 0;
  animation: ${fadeIn} 0.3s ease-in-out 0.5s 1 normal both;
  @media (max-width: 767px) {
    & {
      font-size: 2.123rem;
    }
  }
`;
const BannerSubtitle = styled.p`
  color: rgb(95, 99, 104);
  font-size: 20px;
  text-align: left;
  font-weight: bold;
  margin-bottom: 10px;
  opacity: 0;
  animation: ${reveal} 0.3s ease-in-out 0.6s 1 normal both;
  @media (max-width: 767px) {
    & {
      font-size: 1.123rem;
    }
  }
`;

// Banner Component
const Banner: React.FC = () => {
  return (
    <BannerContainer>
      <div>
        <BannerTitle>DATA Protection</BannerTitle>
        <BannerSubtitle>Protect your data from breaches</BannerSubtitle>
      </div>

      <img src={lockImg} />
    </BannerContainer>
  );
};

export default Banner;
