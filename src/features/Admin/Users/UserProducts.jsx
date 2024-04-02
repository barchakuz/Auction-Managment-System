import React, { useState, useEffect } from "react";
import { firebaseApp } from "../../Authentication/firebase";
import { get, getDatabase, ref, remove } from "firebase/database";
import Toolbar from "../../../components/Toolbar";
import { Button, Col, Empty, Row, Space, notification } from "antd";
import Loader from "../../../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../../helpers";
import ProductCard from "../../../components/ProductCard";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/context";

const UserProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
  });
  const [filterList, setFilterList] = useState(null);
  const [productList, setProductList] = useState([]);

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
      }
    });
    return _u;
  };

  const loadProductData = async () => {
    const prods = [];
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      const u = await getUser();
      const snapshot = await get(valueRef);
      snapshot.forEach(function (childSnapshot) {
        const userProduct = childSnapshot.val();
        if (
          userProduct.userId === u.userId &&
          Object.keys(userProduct).length > 3
        )
          prods.push({ ...userProduct, mpid: childSnapshot.key });
      });
      setProductList(prods);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const deleteProduct = async (row) => {
    const database = getDatabase(firebaseApp);
    const productRef = ref(database, `products/${row.mpid}`);
    await remove(productRef);
    loadProductData();
    notification.success({
      message: "Product Deleted",
      key: "product-deleted-notification",
      placement: "bottomRight",
    });
  };

  const handleActions = (action, row) => {
    if (action === "delete") {
      deleteProduct(row);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProductData();
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
          placeholder: "Select Category",
          options: categories,
          name: "category",
        }}
        isSearchable
        filters={filters}
        onFilterChange={(filter) => onFilter({ ...filters, ...filter })}
      />

      {(filterList || productList).length ? (
        <Row gutter={[20, 20]}>
          {(filterList || productList).map((prod) => (
            <Col key={prod.pid} xs={24} sm={24} md={24} lg={12} xl={6}>
              <ProductCard
                {...prod}
                onAction={(action) => handleActions(action, prod)}
                user={user}
                isLoading={loading}
                onRefresh={loadProductData}
                onClick={() =>
                  navigate(`/app/users/products/${id}/${prod.pid}`)
                }
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

export default UserProducts;
