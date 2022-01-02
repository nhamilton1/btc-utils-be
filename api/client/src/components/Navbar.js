import React from 'react'
import { Layout, Space } from 'antd';
const { Header } = Layout;

const Navbar = () => {

    return (
      <Layout className="layout">
        <Header className="header">
            <div className="logo" />
            <Space direction="horizontal">
            </Space>
        </Header>
      </Layout>
    )
}

export default Navbar
