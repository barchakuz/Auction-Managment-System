import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 45,
    }}
    spin
  />
);

const Loader = () => <Spin indicator={antIcon} />;

export default Loader;
