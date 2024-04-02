import React from "react";
import { Upload as AntUpload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
const { Dragger } = AntUpload;

const props = {
  name: "file",
  multiple: true,
};

const Upload = ({ onChange, onDrop }) => {
  const handleChange = (info) => {
    if (onChange) onChange(info.fileList.map((file) => file.originFileObj));
  };
  return (
    <Dragger
      {...props}
      onChange={handleChange}
      onDrop={onDrop}
      customRequest={({ onSuccess }) => onSuccess("Ok")}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">Support for a single or bulk upload.</p>
    </Dragger>
  );
};

export default Upload;
