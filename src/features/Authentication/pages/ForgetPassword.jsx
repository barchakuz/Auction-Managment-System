import React, { useState } from "react";
import { Button, Form, Input, Space, Typography, notification } from "antd";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebaseApp } from "../firebase";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }) => {
    const auth = getAuth(firebaseApp);
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        notification.success({
          message: "Reset password email has been sent",
          key: "reset-password-notification",
          placement: "bottomRight",
        });
        navigate("/login");
      })
      .catch(function (e) {
        console.error(e);
        setLoading(false);
      });
  };
  return (
    <div className="w-100 h-100 bg-dark d-flex align-center justify-center flex-column">
      <Typography.Title className="font-white" style={{ letterSpacing: 16 }}>
        SKYEBY
      </Typography.Title>
      <Typography.Title className="font-white" level={2}>
        Need a new password?
      </Typography.Title>
      <Typography.Text className="font-white">
        Enter your email and we'll send you a password reset link.
      </Typography.Text>

      <Form
        style={{ maxWidth: 400, marginTop: 20 }}
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        className="w-100"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email Address" style={{ minHeight: 45 }} />
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            className="ant-btn-override"
            htmlType="submit"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            Email reset link
          </Button>
        </Form.Item>
      </Form>
      <Space
        align="center"
        className="w-100"
        size={12}
        style={{ maxWidth: 400, justifyContent: "flex-end" }}
      >
        <Button
          type="text"
          className="font-white"
          style={{ padding: 0 }}
          onClick={() => navigate("/login")}
        >
          I have my password
        </Button>
      </Space>
    </div>
  );
};

export default ForgetPassword;
