import React from "react";
import { Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/context";
import { capitalize } from "../../helpers";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <>
      <Space
        size={16}
        direction="vertical"
        className="w-100 h-100 global-padding"
      >
        <Typography.Title level={2}>
          Welcome, {capitalize(user.userName)}
        </Typography.Title>
      </Space>
    </>
  );
};

export default Dashboard;
