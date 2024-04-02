import { Layout } from "antd";
import React from "react";
import Sidebar from "./Sidebar";

const Wrapper = ({ children }) => {
  return (
    <Layout className="h-100">
      <Sidebar />
      <Layout style={{ overflow: "auto", background: "#FAFAFA" }}>
        {children}
      </Layout>
    </Layout>
  );
};

export default Wrapper;
