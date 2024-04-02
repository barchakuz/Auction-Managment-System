import { useLayoutEffect, useState } from "react";
import {
  AuditOutlined,
  PoweroffOutlined,
  ShopFilled,
  ShoppingOutlined,
  TeamOutlined,
  HomeOutlined,
 
} from "@ant-design/icons";
import { Avatar, Badge, Layout, Menu, Space, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize, getAvatar } from "../helpers";
import { useMediaQuery } from "react-responsive";
import { useMemo } from "react";
import { useAuth } from "../hooks/context";

const { Sider } = Layout;

const getItem = (label, key, icon, children) => ({
  key,
  icon,
  children,
  label,
});

const items = [ 
  getItem("Home", "home", <HomeOutlined />),
  getItem("Products", "products", <ShopFilled />),
  getItem("Orders", "orders", <ShoppingOutlined />),
  getItem("Dispute", "disputes", <AuditOutlined />),
  getItem("Logout", "logout", <PoweroffOutlined />),
];

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  const navigate = useNavigate();
  const location = useLocation();
  const paths = location.pathname
    .split("/")
    .filter((path) => path !== "/")
    .filter(Boolean);

  const [collapsed, setCollapsed] = useState(false);

  useLayoutEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const onLogout = () => setUser(null);

  const onNavigate = () => {};

  const getItems = useMemo(() => {
    if (user.userType === "admin")
      return [
        getItem("Users", "users", <TeamOutlined />),
        getItem("Disputes", "disputes", <AuditOutlined />),
        getItem("Logout", "logout", <PoweroffOutlined />),
      ];
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sider
      width={285}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
    >
      <Space
        size={10}
        className="w-100 isClickable"
        onClick={onNavigate}
        style={{
          padding: collapsed ? "10px 24px" : "12px 16px",
        }}
      >
        <Avatar
          style={{
            verticalAlign: "middle",
          }}
          src={getAvatar(user?.userName)}
          size={collapsed ? "default" : "large"}
        />
        {!collapsed && (
          <Space size={0} direction="vertical">
            <Typography.Text className="fw-bold text-white text-capital">
              {`${user?.userName} (${capitalize(user?.userType)})`}
            </Typography.Text>
            <Space size={5} direction="horizontal">
              <Badge dot color="green" />
              <Typography.Text className="text-white" style={{ fontSize: 12 }}>
                Logged In
              </Typography.Text>
            </Space>
          </Space>
        )}
      </Space>

      <Menu
        theme="dark"
        selectedKeys={paths.length === 1 ? ["dashboard"] : paths.slice(1)}
        onSelect={(item) =>
          item.key === "logout"
            ? onLogout()
            : item.key === "dashboard"
            ? navigate("/app")
            : navigate(`/app/${item.key}`)
        }
        mode="inline"
        items={getItems}
      />
    </Sider>
  );
};
export default Sidebar;
