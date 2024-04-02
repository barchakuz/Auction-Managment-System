import React, { useMemo } from "react";
import queryString from "query-string";
import { Space, Table as AntTable, Tag, Button, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Toolbar from "./Toolbar";

const OrderMap = {
  ascend: "ASC",
  descend: "DESC",
};

const TableActions = ({ type, row, onAction, actions = [] }) => {
  if (type === "actions") {
    return (
      <Space size="middle">
        {actions.map((action) => (
          <Tooltip title={action.tooltip ? action.tooltip(row) : ""}>
            <Button
              disabled={action.disabled ? action.disabled(row) : false}
              className="no-hover-text"
              type="text"
              style={{ padding: 0 }}
              key={action.value}
              color={action.color}
              onClick={() => onAction(action.value, row)}
            >
              <Tag>
                {action.icon} {action.label}
              </Tag>
            </Button>
          </Tooltip>
        ))}
      </Space>
    );
  }
  return undefined;
};

const Table = ({
  columns,
  data,
  isLoading,
  totalCount,
  onAction,
  isRowClickable,
  actions = [],
  toolbar = false,
  onAdd,
  scrollProps = {},
  isSearchable,
  toolbarFilters,
  onFilter,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const filters = {
    pageSize: 10,
    current: 1,
    ...queryString.parse(location.search),
  };

  const onNavigate = (_filters) => {
    if (onFilter) {
      onFilter(_filters);
    } else {
      navigate(
        queryString.stringifyUrl({
          url: location.pathname,
          query: JSON.parse(JSON.stringify(_filters)),
        })
      );
    }
  };

  const cols = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        render:
          column.key === "actions" ||
          (column.type && column.type !== "dropdown")
            ? (_, row) => (
                <TableActions
                  actions={actions}
                  onAction={onAction}
                  type={column.type || column.key}
                  row={row}
                />
              )
            : column.render,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Space direction="vertical" size={20} className="w-100">
      {toolbar && (
        <Toolbar
          toolbarFilters={toolbarFilters}
          filters={filters}
          onAdd={onAdd}
          isSearchable={isSearchable}
          onFilterChange={(filter) => onNavigate({ ...filters, ...filter })}
        />
      )}
      <AntTable
        bordered
        pagination={
          totalCount !== null && totalCount !== undefined
            ? {
                total: totalCount,
                pageSize: Number(filters.pageSize),
                current: Number(filters.current),
              }
            : false
        }
        tableLayout="auto"
        scroll={{ ...scrollProps }}
        onRow={
          isRowClickable
            ? (record) => {
                return {
                  onClick: () => onAction("redirect", record),
                };
              }
            : undefined
        }
        loading={isLoading}
        columns={cols}
        dataSource={data}
        onChange={(p, _, s) =>
          onNavigate({ ...p, orderBy: s.field, order: OrderMap[s.order] })
        }
      />
    </Space>
  );
};
export default Table;
