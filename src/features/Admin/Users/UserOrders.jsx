import React, { useState, useEffect } from "react";
import { Button, Col, Empty, Row, Space, message, notification } from "antd";
import Toolbar from "../../../components/Toolbar";
import Loader from "../../../components/Loader";
import { orderStatus } from "../../../helpers/order";
import { get, getDatabase, ref, update } from "firebase/database";
import { firebaseApp } from "../../Authentication/firebase";
import OrderCard from "../../../components/OrderCard";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const UserOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [filterList, setFilterList] = useState(null);
  const [orderData, setOrderData] = useState([]);

  const onFilter = (_filters) => {
    const tmp = [...orderData].filter((order) => {
      if (_filters.status && _filters.status !== "all") {
        return order.status === _filters.status;
      }

      return true;
    });

    setFilterList(tmp);
    setFilters(_filters);
  };

  const getUser = async () => {
    const db = getDatabase(firebaseApp);
    const valueRef = ref(db, `users/`);
    const snapshot = await get(valueRef);
    let _u;

    snapshot.forEach(function (childSnapshot) {
      const u = childSnapshot.val();
      const key = childSnapshot.key;

      if (key === id) {
        _u = { ...u, userId: key };
        setUser(_u);
      }
    });
    return _u;
  };

  const loadOrdersData = async () => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `order`);
      const u = await getUser();
      const snapshot = await get(valueRef);
      const orders = [];
      snapshot.forEach(function (childSnapshot) {
        const uorder = childSnapshot.val();
        if (u.userType === "seller") {
          if (uorder.sellerId === u.userId) orders.push(uorder);
        } else {
          if (uorder.buyerId === u.userId) orders.push(uorder);
        }
      });

      const ids = orders.map((o) => o.pid);
      const filtered = orders.filter(
        ({ pid }, index) => !ids.includes(pid, index + 1)
      );
      setOrderData(filtered);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateOrderStatus = (oid, status) => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `order`);
      get(valueRef)
        .then((snapshot) => {
          snapshot.forEach(function (childSnapshot) {
            let key = childSnapshot.key;
            let uorder = childSnapshot.val();
            if (uorder.oid === oid)
              update(ref(db, `order/${key}`), { status: status });
          });
        })
        .then(() => {
          loadOrdersData();
          notification.success({
            message: "Order Status Updated",
            key: "order-s-updated-notification",
            placement: "bottomRight",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadOrdersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space size={20} direction="vertical" className="w-100 global-padding">
      <Button
        size="middle"
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/app/users")}
      >
        Users
      </Button>
      <Toolbar
        toolbarFilters={[]}
        selectProps={{
          placeholder: "Select Status",
          options: orderStatus,
          name: "status",
        }}
        filters={filters}
        onFilterChange={(filter) => onFilter({ ...filters, ...filter })}
      />

      {(filterList || orderData).length ? (
        <Row gutter={[20, 20]}>
          {(filterList || orderData).map((order) => (
            <Col key={order.oid} span={24}>
              <OrderCard
                {...order}
                user={user}
                onUpdate={updateOrderStatus}
                admin
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

export default UserOrders;
