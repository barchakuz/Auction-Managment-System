import React from "react";
import { Badge, Descriptions, Tooltip, Space, Button, Image } from "antd";
import { capitalize } from "../helpers";
import { CheckOutlined } from "@ant-design/icons";

const DisputeCard = ({
  title,
  userName,
  userMno,
  userEmail,
  status,
  description,
  onUpdate,
  did,
  user,
  images = [],
}) => {
  return (
    <Descriptions
      title="Dispute Details"
      bordered
      extra={
        user.userType === "admin" ? (
          <Space size={10}>
            {status === "active" ? (
              <Tooltip title="Mark as resolved">
                <Button onClick={() => onUpdate(did)}>
                  <CheckOutlined />
                </Button>
              </Tooltip>
            ) : null}
          </Space>
        ) : null
      }
    >
      <Descriptions.Item label="Title">{title || "-"}</Descriptions.Item>
      <Descriptions.Item label="Name">{userName}</Descriptions.Item>
      <Descriptions.Item label="Mobile No">{userMno}</Descriptions.Item>
      <Descriptions.Item label="Email">{userEmail}</Descriptions.Item>
      <Descriptions.Item label="Description" span={2}>
        {description}
      </Descriptions.Item>
      <Descriptions.Item label="Status" span={3}>
        <Badge status="processing" text={capitalize(status)} />
      </Descriptions.Item>
      {images && images.length > 0 && (
        <Descriptions.Item label="Images" span={3}>
          <Image.PreviewGroup>
            {images.map((image, index) => (
              <Image
                key={index}
                className="isClickable"
                src={image}
                height={100}
                width={100}
                alt={title + index}
              />
            ))}
          </Image.PreviewGroup>
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};

export default DisputeCard;
