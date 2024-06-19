import React from "react";
import styled from "styled-components";
import Console from "../components/console";
import ConfigTable from "../components/configTable";
import LogTable from "../components/logTable";
import Footer from "../components/footer";
import Banner from "../components/banner";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  color: #fff;
  padding: 1rem;
  display:flex;
  flex-direction:column;
  justify-content:center;
`;


const Content = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 1rem;
  @media(max-width:767px){
    flex-direction:column;
  }
`;

const Dashboard = () => {
  return (
    <Container>
      <Banner/>
      <Header>
        <Console />
      </Header>

      <Content>
        <ConfigTable />

        <LogTable />
      </Content>
      <Footer />
    </Container>
  );
};

export default Dashboard;
