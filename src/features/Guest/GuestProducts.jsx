import React, { useState, useEffect } from "react";
import { firebaseApp } from "../Authentication/firebase";
import { get, getDatabase, ref } from "firebase/database";
import { Col, Empty, Row, Space, Typography } from "antd";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard";

const getCount = async () => {
  try {
    const db = getDatabase(firebaseApp);
    const valueRef = ref(db, `order`);
    const orderSnapshot = await get(valueRef);
    const orders = [];
    const users = [];
    const userRef = ref(db, `users/`);
    const userSnapshot = await get(userRef);
    userSnapshot.forEach(function (childSnapshot) {
      const user = childSnapshot.val();
      if (user.userType !== "admin") {
        users.push(user);
      }
    });

    orderSnapshot.forEach(function (childSnapshot) {
      const uorder = childSnapshot.val();
      orders.push(uorder);
    });

    return { orders: orders.length, users: users.length };
  } catch (error) {
    console.error(error);
  }
};

const GuestProducts = ({ setCount }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  const loadProductData = async () => {
    const prods = [];
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      const snapshot = await get(valueRef);
      snapshot.forEach(function (childSnapshot) {
        const userProduct = childSnapshot.val();
        if (userProduct && Object.keys(userProduct).length > 3)
          prods.push({ ...userProduct, mpid: childSnapshot.key });
      });
      const { orders, users } = await getCount();
      setCount({ products: prods.length, orders, users });
      setProductList(prods.slice(0, 8));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space
      size={20}
      style={{ width: "calc(100vw - 80px)", padding: 40 }}
      direction="vertical"
    >
      <Typography.Title level={2}>Featured Products</Typography.Title>
      {productList.length ? (
        <Row gutter={[20, 20]}>
          {productList.map((prod) => (
            <Col key={prod.pid} xs={24} sm={24} md={24} lg={6} xl={6}>
              <ProductCard
                {...prod}
                user={{}}
                isLoading={loading}
                onRefresh={loadProductData}
                onClick={() => navigate("/login")}
              />
            </Col>
          ))}
        </Row>
      ) : loading ? (
        <Space
          className="w-100 h-100"
          direction="vertical"
          align="center"
          style={{ justifyContent: "center" }}
        >
          <Loader />
        </Space>
      ) : (
        <Empty />
      )}
    </Space>
  );
};

export default GuestProducts;
