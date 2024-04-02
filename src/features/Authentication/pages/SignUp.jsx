import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Radio,
  Space,
  Typography,
  message,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { firebaseApp } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";
import { Upload, message as antMessage } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const SignUp = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userPicture, setUserPicture] = useState(null);

  const onSubmit = async ({ email, password, username, mno, cnic, type }) => {
    const auth = getAuth(firebaseApp);
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(result.user);

      const database = getDatabase(firebaseApp);
      const userRef = ref(database, `users/${result.user.uid}`);
      set(userRef, {
        userName: username,
        uid: Date.now().toString(),
        email: email,
        password: password,
        mobileno: mno,
        cnic,
        userType: type,
        status: "allowed",
      });
      form.resetFields();
      notification.success({
        message:
          "Registered Successfully! Please check your email to verify your account",
        key: "registration-success-notification",
        placement: "bottomRight",
      });
      navigate("/login");
    } catch (error) {
      if (error.message) {
        message.error(error.message);
      } else {
        console.error(error);
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="w-100 h-100 bg-dark d-flex align-center flex-column"
      style={{ overflow: "auto" }}
    >
      <Typography.Title className="font-white" style={{ letterSpacing: 16 }}>
        SKYEBY
      </Typography.Title>
      <Typography.Title className="font-white" level={1}>
        Sign up
      </Typography.Title>

      <Form
        form={form}
        initialValues={{ type: "buyer" }}
        style={{ maxWidth: 400, marginTop: 20 }}
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
        className="w-100"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Please input your username!" },
            {
              pattern: /^[A-Za-z]+$/, // regex for only letters (no symbols or numbers)
              message: "Username must contain only letters",
            },
          ]}
        >
          <Input placeholder="Username" style={{ minHeight: 45 }} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              pattern: /^[0-9]{5}-[0-9]{7}-[0-9]$/, // CNIC format regex
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input placeholder="Email Address" style={{ minHeight: 45 }} />
        </Form.Item>

        <Form.Item
          name="mno"
          rules={[
            { required: true, message: "Please input your mobile number!" },
            {
              pattern: /^[0-9]{11}$/, // regex for exactly 11 digits
              message: "Mobile number must be 11 digits and contain only numbers",
            },
          ]}
        >
          <Input placeholder="Mobile No" style={{ minHeight: 45 }} />
        </Form.Item>

        <Form.Item
          name="cnic"
          rules={[
            { required: true, message: "Please input your cnic no!" },
            {
              pattern: /^[0-9]{5}-[0-9]{7}-[0-9]$/, // CNIC format regex
              message: "Please enter a valid CNIC!",
            },
          ]}
        >
          <Input placeholder="CNIC No" style={{ minHeight: 45 }} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" style={{ minHeight: 45 }} />
        </Form.Item>

        {/* Picture Component Added */}
        <Form.Item
          name="userPicture"
          label={<span style={{ color: "white" }}>User CNIC Picture</span>}
          rules={[
            {
              required: true,
              message: "Please upload your picture!",
            },
          ]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          style={{ color: "white" }} // Set the color for the uploaded picture name text
        >
          <Upload
            beforeUpload={(file) => {
              const isJpg = file.type === "image/jpeg";
              if (!isJpg) {
                antMessage.error("You can only upload JPG file!");
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                antMessage.error("Image must be smaller than 2MB!");
              }
              setUserPicture(file); // Save the file in state
              return false;
            }}
            maxCount={2}
            listType="picture"
            accept=".jpg"
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="type">
          <Radio.Group>
            <Radio value="buyer" className="font-white radio-label">
              Buyer{" "}
            </Radio>
            <Radio value="seller" className="font-white radio-label">
              Seller{" "}
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            className="ant-btn-override"
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
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Button>
      </Space>
    </div>
  );
};

export default SignUp;