import React from "react";
import { PlusCircleFilled } from "@ant-design/icons";
import { Button, Input, Space, Select } from "antd";

const Toolbar = ({
  filters,
  onAdd,
  buttonText = "Add New",
  isSearchable,
  onFilterChange,
  selectProps,
}) => {
  return (
    <Space
      className="w-100"
      align="center"
      style={{ justifyContent: "space-between" }}
    >
      <Space>
        {onAdd ? (
          <Button icon={<PlusCircleFilled />} type="primary" onClick={onAdd}>
            {buttonText}
          </Button>
        ) : (
          <div></div>
        )}
      </Space>
      <Space>
        {selectProps && (
          <Select
            style={{ minWidth: 100 }}
            defaultValue={filters[selectProps.name]}
            options={selectProps.options}
            placeholder={selectProps.placeholder}
            onChange={(value) => onFilterChange({ [selectProps.name]: value })}
          />
        )}
        {isSearchable && (
          <Input.Search
            allowClear
            placeholder="Search by name"
            enterButton="Search"
            size="middle"
            defaultValue={filters.query}
            onSearch={(query) => onFilterChange({ query })}
          />
        )}
      </Space>
    </Space>
  );
};

export default Toolbar;
