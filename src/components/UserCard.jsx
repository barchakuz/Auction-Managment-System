import React from "react";
import { Card, Space, Tooltip, Typography } from "antd";
import { capitalize, getAvatar } from "../helpers";
import {
  CheckOutlined,
  ShopOutlined,
  ShoppingOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

const UserCard = ({
  userName,
  userType,
  email,
  mobileno,
  onUpdate,
  userId,
  status,
  onNavigate,
}) => {
  return (
    <Card
      style={{ width: "100%" }}
      cover={<img alt={userName} src={getAvatar(userName)} />}
      actions={[
        ...(userType === "seller"
          ? [
              <Tooltip title="See Products">
                <ShopOutlined
                  key="products"
                  onClick={() => onNavigate(`/app/users/products/${userId}`)}
                />
              </Tooltip>,
            ]
          : []),
        <Tooltip title="View Orders">
          <ShoppingOutlined
            key="orders"
            onClick={() => onNavigate(`/app/users/orders/${userId}`)}
          />
        </Tooltip>,
        <Tooltip title={status === "allowed" ? "Block User" : "Allow User"}>
          {status === "allowed" ? (
            <StopOutlined
              key="block"
              onClick={() => onUpdate(userId, "blocked")}
            />
          ) : (
            <CheckOutlined
              key="block"
              onClick={() => onUpdate(userId, "allowed")}
            />
          )}
        </Tooltip>,
      ]}
    >
      <Meta
        style={{ textAlign: "center" }}
        title={`${userName} (${capitalize(userType)})`}
        description={
          <Space direction="vertical">
            <Typography.Text className="font-grey">{email}</Typography.Text>
            <Typography.Text className="font-grey">{mobileno}</Typography.Text>
          </Space>
        }
      />
    </Card>
  );
};

export default UserCard;
