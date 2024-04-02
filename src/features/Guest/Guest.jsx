import React, { useState } from "react";
import { Button, Divider, Space, Typography } from "antd";
import GuestProducts from "./GuestProducts";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { numericFormatter } from "react-number-format";

const Guest = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState({ products: 0, users: 0, orders: 0 });
  const isMobile = useMediaQuery({ query: "(max-width: 650px)" });

  return (
    <Space className="w-100 h-100" direction="vertical">
      <Space
        className="bg-dark"
        align="start"
        style={{
          padding: "40px 0px 60px 40px",
          width: "calc(100% - 40px)",
          clipPath: "polygon(100% 0, 100% 65%, 0% 100%, 0 100%, 0 0)",
        }}
        direction="vertical"
      >
        <Space
          align="center"
          style={{
            justifyContent: "space-between",
            width: "calc(100vw - 60px)",
          }}
        >
          <Space>
            <Typography.Title
              level={4}
              className="font-white isClickable"
              style={{ letterSpacing: 5, margin: 0 }}
              onClick={() => window.location.reload()}
            >
              SKYEBY
            </Typography.Title>
          </Space>
          <Space style={{ paddingRight: 40 }}>
            <Button onClick={() => navigate("/login")}>
              <b>Login</b>
            </Button>
          </Space>
        </Space>
        <Space
          align="center"
          style={{
            maxHeight: 600,
            justifyContent: "space-between",
            width: "calc(100vw - 60px)",
          }}
        >
          <Space
            style={{ padding: "40px 0px 40px 0px" }}
            size={30}
            direction="vertical"
          >
            <Typography.Title className="font-white" style={{ margin: 0 }}>
              Skyeby is an auction platform <br /> where you can bid on products{" "}
              <br />
              or sell your products for auction
            </Typography.Title>
            <Button
              className="ant-btn-override"
              onClick={() => navigate("/signup")}
            >
              <b>Get Started</b>
            </Button>
          </Space>
          {!isMobile && (
            <img
              style={{
                scale: "0.85",
                position: "relative",
                bottom: 85,
                right: -50,
                zIndex: -1,
              }}
              src="/assets/images/cover.png"
              alt="cover"
              height="100%"
              width="100%"
            />
          )}
        </Space>
      </Space>

      <GuestProducts setCount={setCount} />
      <div style={{ padding: "0px 20px" }}>
        <Divider />
      </div>
      <Space
        direction={isMobile ? "vertical" : "horizontal"}
        align="center"
        style={{
          padding: "0px 40px 30px 40px",
          width: "calc(100vw - 80px)",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography.Text className="text-grey">
            Copyright © {new Date().getFullYear()} Skyeby. All rights reserved.
          </Typography.Text>
        </div>
        <Space align="center" size={50}>
          <Typography.Text>
            <b>
              <span style={{ color: "#1677ff" }}>
                {numericFormatter(count.products.toString(), {
                  thousandSeparator: true,
                  displayType: "text",
                })}
              </span>{" "}
              Products
            </b>
          </Typography.Text>
          <Typography.Text>
            <b>
              <span style={{ color: "#1677ff" }}>
                {numericFormatter(count.users.toString(), {
                  thousandSeparator: true,
                  displayType: "text",
                })}
              </span>{" "}
              Users
            </b>
          </Typography.Text>
          <Typography.Text>
            <b>
              <span style={{ color: "#1677ff" }}>
                {numericFormatter(count.orders.toString(), {
                  thousandSeparator: true,
                  displayType: "text",
                })}
              </span>{" "}
              Orders
            </b>
          </Typography.Text>
        </Space>
      </Space>
    </Space>
  );
};

export default Guest;
