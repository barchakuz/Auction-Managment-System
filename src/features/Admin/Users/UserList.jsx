import React, { useState, useEffect } from "react";
import { get, getDatabase, ref, update } from "firebase/database";
import { Col, Empty, Row, Space, notification } from "antd";
import Loader from "../../../components/Loader";
import Toolbar from "../../../components/Toolbar";
import UserCard from "../../../components/UserCard";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";

const userFilters = [
  { label: "All", value: "all" },
  { label: "Seller", value: "seller" },
  { label: "Buyer", value: "buyer" },
];

const Users = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [filterList, setFilterList] = useState();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
  });

  const onFilter = (_filters) => {
    const tmp = [...userList].filter((user) => {
      let f = [];

      if (_filters.type && _filters.type !== "all") {
        f.push(user.userType === _filters.type);
      }
      if (_filters.query) {
        f.push(
          user.userName.toLowerCase().includes(_filters.query.toLowerCase())
        );
      }

      return f.length === 0 || f.every((f) => f === true);
    });

    setFilterList(tmp);
    setFilters(_filters);
  };

  const loadUsers = async () => {
    try {
      const db = getDatabase();
      const valueRef = ref(db, `users/`);
      get(valueRef)
        .then((snapshot) => {
          const users = [];
          snapshot.forEach(function (childSnapshot) {
            const user = childSnapshot.val();
            if (user.userType !== "admin") {
              users.push({ ...user, userId: childSnapshot.key });
            }
          });

          setUserList(users);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateUser = async (uid, status) => {
    try {
      const db = getDatabase();
      const valueRef = ref(db, `users/`);
      get(valueRef)
        .then((snapshot) => {
          snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.key === uid) {
              update(ref(db, `users/${uid}`), { status: status }).then((v) => {
                notification.success({
                  message: "Status updated sucessfully",
                  key: "user-status-notification",
                  placement: "bottomRight",
                });
              });
            }
          });
          loadUsers();
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadUsers();
  }, []);

  return (
    <Space size={20} direction="vertical" className="w-100 global-padding">
      <Header title="Users" />
      <Toolbar
        toolbarFilters={[]}
        selectProps={{
          placeholder: "Select Type",
          options: userFilters,
          name: "type",
        }}
        isSearchable
        filters={filters}
        onFilterChange={(filter) => onFilter({ ...filters, ...filter })}
      />

      {(filterList || userList).length ? (
        <Row gutter={[20, 20]}>
          {(filterList || userList).map((user) => (
            <Col key={user.userId} xs={24} sm={24} md={24} lg={12} xl={6}>
              <UserCard {...user} onUpdate={updateUser} onNavigate={navigate} />
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
export default Users;
