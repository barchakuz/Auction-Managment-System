import React, { useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, List, Popover, Space, Typography } from "antd";
import { get, getDatabase, ref, update } from "firebase/database";
import { firebaseApp } from "../features/Authentication/firebase";
import { useAuth } from "../hooks/context";

const ENTITY_LINK_MAP = {
  products: "/app/products/:id",
  disputes: "/app/disputes",
};

const Content = ({ items, onView }) => {
  useEffect(() => {
    onView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <List
      style={{ maxHeight: 280, maxWidth: 250, overflow: "auto" }}
      itemLayout="vertical"
      dataSource={items}
      renderItem={(item) => (
        <List.Item style={{ padding: "10px 12px" }}>
          {item.message}.{" "}
          {item.entityID && item.entity && ENTITY_LINK_MAP[item.entity] && (
            <a
              href={ENTITY_LINK_MAP[item.entity].replace(":id", item.entityID)}
            >
              View
            </a>
          )}
        </List.Item>
      )}
    />
  );
};

const Header = ({ title }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const changeNotificationState = async () => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `notification`);
      const snapshot = await get(valueRef);
      snapshot.forEach(function (childSnapshot) {
        const notification = childSnapshot.val();
        if (notification.userId === user.userId && notification.notifyStatus) {
          update(ref(db, `notification/${childSnapshot.key}`), {
            notifyStatus: false,
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadNotification = async () => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `notification`);
      const snapshot = await get(valueRef);
      let nf = [];
      snapshot.forEach(function (childSnapshot) {
        const notification = childSnapshot.val();

        if (
          (notification.userId === user.userId ||
            (notification.adminId &&
              user.adminId &&
              notification.adminId === user.adminId)) &&
          notification.notifyStatus &&
          notification.message
        ) {
          nf.push(notification);
        }
      });

      setNotifications(nf);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Space
      className="w-100"
      style={{ justifyContent: "space-between" }}
      align="center"
    >
      <Typography.Title style={{ margin: 0 }}>{title}</Typography.Title>

      <Popover
        overlayInnerStyle={{ padding: 0 }}
        content={
          <Content items={notifications} onView={changeNotificationState} />
        }
        placement="bottomLeft"
        trigger="click"
      >
        <Button type="text">
          <Badge size="small" count={notifications.length}>
            <BellOutlined style={{ fontSize: "1.125rem" }} />
          </Badge>
        </Button>
      </Popover>
    </Space>
  );
};

export default Header;
