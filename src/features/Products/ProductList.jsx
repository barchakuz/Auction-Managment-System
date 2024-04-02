import React, { useState, useEffect } from "react";
import { firebaseApp } from "../Authentication/firebase";
import { get, getDatabase, ref, remove, update } from "firebase/database";
import { useAuth } from "../../hooks/context";
import Toolbar from "../../components/Toolbar";
import { Badge, Col, Empty, Image, Row, Space, notification } from "antd";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { capitalize, categories } from "../../helpers";
import ProductCard from "../../components/ProductCard";
import AddProduct from "../../components/AddProduct";
import Table from "../../components/Table";
import { NumericFormat } from "react-number-format";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Header from "../../components/Header";

const actions = [
  {
    label: "Edit",
    value: "edit",
    icon: <EditOutlined />,
    disabled: (row = {}) => row.bidState === "sold" || row.bidState === "live",
    tooltip: (row = {}) =>
      row.bidState === "sold"
        ? "You can't perform any action on sold auction!"
        : row.bidState === "live"
        ? "You can't perform any action on live auction!"
        : "",
  },
  {
    label: "Delete",
    value: "delete",
    icon: <DeleteOutlined />,
    disabled: (row = {}) => row.bidState === "live",
    tooltip: (row = {}) =>
      row.bidState === "live"
        ? "You can't perform any action on live auction!"
        : "",
  },
];

const columns = [
  {
    title: "Bid State",
    dataIndex: "bidState",
    key: "bidState",
    render: (bidState) => (
      <Badge
        status={bidState === "live" ? "success" : "error"}
        text={capitalize(bidState)}
      />
    ),
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image) => (
      <Image
        src={image}
        alt="prod-image"
        width={50}
        height={50}
        preview={false}
      />
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Initial Price",
    dataIndex: "price",
    key: "price",
    render: (price) => (
      <NumericFormat
        value={price}
        displayType="text"
        thousandSeparator
        prefix="$"
        fixedDecimalScale
        decimalScale={2}
      />
    ),
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    width: 200,
  },
];

const ProductList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
  });
  const [filterList, setFilterList] = useState(null);
  const [productList, setProductList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [prod, setProd] = useState(undefined);

  const onFilter = (_filters) => {
    const tmp = [...productList].filter((prod) => {
      let f = [];
      if (_filters.category && _filters.category !== "all") {
        f.push(
          prod.category === _filters.category ||
            prod.bidState === _filters.category
        );
      }
      if (_filters.query) {
        f.push(prod.name.toLowerCase().includes(_filters.query.toLowerCase()));
      }

      return f.length === 0 || f.every((f) => f === true);
    });

    setFilterList(tmp);
    setFilters(_filters);
  };

  const loadProductData = async () => {
    const prods = [];
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      const snapshot = await get(valueRef);
      snapshot.forEach(function (childSnapshot) {
        const userProduct = childSnapshot.val();
        if (user.userType === "seller") {
          if (
            userProduct.userId === user.userId &&
            Object.keys(userProduct).length > 3
          )
            prods.push({ ...userProduct, mpid: childSnapshot.key });
        } else {
          if (userProduct && Object.keys(userProduct).length > 3) {
            prods.push({ ...userProduct, loadsAt: Date.now() });
          }
        }
      });
      setLoading(false);
      setProductList(prods);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const deleteProduct = async (row) => {
    const database = getDatabase(firebaseApp);
    const productRef = ref(database, `products/${row.mpid}`);
    await remove(productRef);
    loadProductData();
    notification.success({
      message: "Product Deleted",
      key: "product-deleted-2-notification",
      placement: "bottomRight",
    });
  };

  const changeNavState = async (prod) => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      get(valueRef).then((snapshot) => {
        snapshot.forEach(function (childSnapshot) {
          const id = childSnapshot.key;
          const userProduct = childSnapshot.val();
          if (userProduct.pid === prod.pid) {
            update(ref(db, `products/${id}`), { bidState: "live" });
          }
        });
      });
      loadProductData();
      notification.success({
        message: "Your auction is live now",
        key: "auction-live-notification",
        placement: "bottomRight",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleActions = (action, row) => {
    if (action === "edit") {
      setProd({
        ...row,
        startTime: dayjs(row.startTime),
        endTime: dayjs(row.endTime),
      });
      setShowAdd(true);
    } else if (action === "delete") {
      deleteProduct(row);
    } else if (action === "view") {
      navigate(`/app/products/${row.pid}`);
    } else if (action === "live") {
      changeNavState(row);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Space size={20} direction="vertical" className="w-100 global-padding">
        <Header title="Products" />
        <Toolbar
          onAdd={
            user.userType === "seller" ? () => setShowAdd(true) : undefined
          }
          buttonText="Add Product"
          toolbarFilters={[]}
          selectProps={{
            placeholder: "Select Category",
            options: categories,
            name: "category",
          }}
          isSearchable
          filters={filters}
          onFilterChange={(filter) => onFilter({ ...filters, ...filter })}
        />

        {user.userType === "12345" ? (
          <div>
            <Table
              onAction={handleActions}
              columns={columns}
              scrollProps={{ y: 350 }}
              data={(filterList || productList).map((prod) => ({
                ...prod,
                image: prod.images ? prod.images[0] : "",
              }))}
              isLoading={loading}
              actions={actions}
            />
          </div>
        ) : (
          <>
            {(filterList || productList).length ? (
              <Row gutter={[20, 20]}>
                {(filterList || productList).map((prod) => (
                  <Col key={prod.pid} xs={24} sm={24} md={24} lg={12} xl={6}>
                    <ProductCard
                      {...prod}
                      onAction={(action) => handleActions(action, prod)}
                      user={user}
                      onRefresh={loadProductData}
                      isLoading={loading}
                      onClick={() => navigate(`/app/products/${prod.pid}/${prod.uid}`)}
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
          </>
        )}
      </Space>
      {showAdd && (
        <AddProduct
          data={prod}
          onClose={() => setShowAdd(false)}
          onFinish={loadProductData}
        />
      )}
    </>
  );
};

export default ProductList;
