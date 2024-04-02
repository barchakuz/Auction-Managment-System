import React from "react";
import { Empty } from "antd";

const EmptyMessage = (props) => (
  <Empty {...props} image={Empty.PRESENTED_IMAGE_SIMPLE} />
);

export default EmptyMessage;
