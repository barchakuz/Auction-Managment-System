import React from "react";
import { Drawer as AntDrawer, Button, Space } from "antd";

const Drawer = ({
  title,
  placement = "right",
  onClose,
  open,
  children,
  width = 500,
  onSubmit,
  isLoading,
  ...props
}) => {
  return (
    <AntDrawer
      {...props}
      width={width}
      title={title}
      placement={placement}
      onClose={onClose}
      open={open}
      extra={
        onSubmit ? (
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSubmit} type="primary" loading={isLoading}>
              Submit
            </Button>
          </Space>
        ) : null
      }
    >
      {children}
    </AntDrawer>
  );
};

export default Drawer;
