import React from "react";
import { Layout } from "antd";
import Navbar from './components/Navbar';
import { Content } from "antd/lib/layout/layout";
import NormalDistribution from "./components/NormalDistribution";

const App = () => {


  return(
    <div className="App">
      <Navbar />
       <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{margin: '2vh 2vw'}}>
          <Content>
            <NormalDistribution/>
          </Content>
        </Layout>
      </Layout>
    </div>
  )
};

export default App;
