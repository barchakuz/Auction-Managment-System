import React, { useState } from "react";
import { Button, Form, Input, Space, Typography } from "antd";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "../firebase";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useAuth } from "../../../hooks/context";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const adminLogin = async () => {
    const db = getDatabase(firebaseApp);
    const valueRef = ref(db, "users");
    get(valueRef)
      .then((snapshot) => {
        const userData = snapshot.val();
        const user = {
          ...userData,
          // adminId: 1,
        };
        console.log(".................user Type => .................",user.type)
        if (user.userType === "admin") {
          setUser(user);
          navigate("/app");
        } else {
          message.error("Admin does not exist");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSubmit = async ({ email, password }) => {
    const auth = getAuth(firebaseApp);
    setLoading(true);
    if (email === "admin@gmail.com") {
      await adminLogin();
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);

        const db = getDatabase();
        const valueRef = ref(db, "users/" + result.user.uid);
        get(valueRef)
          .then((snapshot) => {
            const userData = snapshot.val();
            const user = {
              ...userData,
              userId: result.user.uid,
              isVerified: result.user.emailVerified,
            };
            // console.log("......................user data...................", user);
            if (user.status === "allowed" && result.user.emailVerified) {
              if (user.userType === "seller" || user.userType === "buyer" || user.userType === "admin") {
                setUser(user);
                navigate("/app");
              } else {
                message.error("User does not exist");
              }
            } else {
              message.error(
                "Sorry, your account is disabled by admin or non verified"
              );
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
          });
      } catch (error) {
        if (error.message) {
          message.error(error.message);
        } else {
          console.error(error);
        }
        setLoading(false);
      }
    }
  };
  return (
    <div className="w-100 h-100 bg-dark d-flex align-center justify-center flex-column">
      <Typography.Title className="font-white" style={{ letterSpacing: 16 }}>
        SKYEBY
      </Typography.Title>
      <Typography.Title
        className="font-white"
        level={1}
        style={{ textAlign: "left" }}
      >
        Login
      </Typography.Title>
      <Form
        style={{ maxWidth: 400 }}
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

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" style={{ minHeight: 45 }} />
        </Form.Item>

        <Form.Item>
          <Button
            className="ant-btn-override"
            block
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginTop: 10 }}
          >
            Submit
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
          onClick={() => navigate("/reset-password")}
        >
          Forgot?
        </Button>
        <Button
          type="text"
          className="font-white"
          style={{ padding: 0 }}
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button>
      </Space>
    </div>
  );
};

export default Login;
