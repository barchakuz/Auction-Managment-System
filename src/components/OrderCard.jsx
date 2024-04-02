import React, { useState, useEffect } from "react";
import { Descriptions, Badge, Space, Button, Tooltip } from "antd";
import { get, getDatabase, ref } from "firebase/database";
import { capitalize } from "../helpers";
import { NumericFormat } from "react-number-format";
import {
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const OrderCard = ({
  oid,
  user,
  buyerId,
  sellerId,
  pid,
  price,
  status,
  onUpdate,
  admin,
  billingDetails,
  onPay,
}) => {
  const [, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mno, setMno] = useState("");
  const [pdata, setPdata] = useState(undefined);

  const loadBuyerData = () => {
    try {
      const db = getDatabase();
      const valueRef = ref(
        db,
        `users/${user.userType === "seller" ? buyerId : sellerId}`
      );
      get(valueRef)
        .then((snapshot) => {
          const userData = snapshot.val();
          setName(userData.userName);
          setMno(userData.mobileno);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const loadProductData = () => {
    try {
      const db = getDatabase();
      const valueRef = ref(db, `products`);
      get(valueRef)
        .then((snapshot) => {
          snapshot.forEach(function (childSnapshot) {
            var userProduct = childSnapshot.val();
            if (userProduct.pid === pid) {
              setPdata(userProduct);
            }
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadBuyerData();
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Descriptions
      title="Order Details"
      bordered
      extra={
        user.userType === "seller" && !admin ? (
          <Space size={10}>
            {status === "pending" ? (
              <>
                <Tooltip title="Mark as cancelled">
                  <Button onClick={() => onUpdate(oid, "cancelled")}>
                    <CloseOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="Mark as active">
                  <Button onClick={() => onUpdate(oid, "active (not paid)")}>
                    <CheckOutlined />
                  </Button>
                </Tooltip>
              </>
            ) : null}
            {status.includes("active") ? (
              <Tooltip title="Mark as complete">
                <Button onClick={() => onUpdate(oid, "completed")}>
                  <ShoppingOutlined />
                </Button>
              </Tooltip>
            ) : null}
          </Space>
        ) : user.userType === "buyer" &&
          !admin &&
          status.includes("active (not paid)") ? (
          <Tooltip title="Pay">
            <Button onClick={onPay}>
              Pay<DollarOutlined />
            </Button>
          </Tooltip>
        ) : null
      }
    >
      <Descriptions.Item style={{fontWeight:'bold'}} label="Order ID"><span style={{fontWeight:'normal'}}>{oid}</span></Descriptions.Item>
      <Descriptions.Item style={{fontWeight:'bold'}}
        label={user.userType === "seller" ? "Buyer Name" : "Seller Name"}
      >
       <span style={{fontWeight:'normal'}}>{name}</span> 
      </Descriptions.Item>
      <Descriptions.Item  style={{fontWeight:'bold'}} label="Mobile No"> <span style={{fontWeight:'normal'}}>{mno}</span></Descriptions.Item>
      <Descriptions.Item  style={{fontWeight:'bold'}} label="Product Name">
      <span style={{fontWeight:'normal'}}>{pdata?.name ?? "-"}</span>
      </Descriptions.Item>
      <Descriptions.Item  style={{fontWeight:'bold'}} label="Price" span={2}>
      <span style={{fontWeight:'normal'}}>
      <NumericFormat
          value={price}
          displayType="text"
          thousandSeparator
          prefix="USD "
        />
      </span>
   
      </Descriptions.Item>
      <Descriptions.Item style={{fontWeight:'bold'}} label="Status" span={3}>
      <span style={{fontWeight:'normal'}}> <Badge status="processing" text={capitalize(status)} /></span>
       
      </Descriptions.Item>
      {billingDetails ? (
        <Descriptions.Item style={{fontWeight:'bold'}}  label="Billing Details">
          Name: {billingDetails.name}
          <br />
          Email: {billingDetails.email}
          <br />
          Mobile No: {billingDetails.mobileNo}
          <br />
          Address: {billingDetails.address}
          {billingDetails.method ? (
            <>
              <br />
              Payment Method: {billingDetails.method}
              <br></br>
             Note: { billingDetails.method === 'card'? billingDetails.message :" Pay On Delivery"}
            </>
          ) : null}
        </Descriptions.Item>
      ) : null}
    </Descriptions>
  );
};

export default OrderCard;
