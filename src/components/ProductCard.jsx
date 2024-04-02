import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Image,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import { capitalize } from "../helpers";
import moment from "moment";
import CountdownTimer from "./CountdownTimer";
import { NumericFormat } from "react-number-format";
import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { firebaseApp } from "../features/Authentication/firebase";

const DISABLED_TOOLTIP = "You can not perform any actions";

const ProductDescription = ({
  price,
  option,
  secondsDifference,
  onClick,
  user,
}) => {
  return (
    <Space size={16} direction="vertical" className="w-100">
      {secondsDifference > -1 ? (
        <Row align="middle">
          <Col span={3}>
            <ClockCircleOutlined />
          </Col>
          <Col span={21}>
            <CountdownTimer seconds={secondsDifference} />
          </Col>
        </Row>
      ) : (
        <div
          style={{ minHeight: 40 }}
          className="d-flex align-center justify-center"
        >
          <Typography.Text className="font-green">
            <b> Auction Finished</b>
          </Typography.Text>
        </div>
      )}
      <Typography.Text>
        <b>
          Initial Price:{" "}
          <NumericFormat
            value={price}
            displayType="text"
            thousandSeparator
            prefix="$"
            fixedDecimalScale
            decimalScale={2}
          />
        </b>
      </Typography.Text>
      {user.userType !== "seller" && (
        <Button type="primary" block onClick={onClick}>
          {option}
        </Button>
      )}
    </Space>
  );
};

const ProductCard = ({
  isLoading,
  images = [],
  name,
  bidState,
  price,
  endTime,
  onClick,
  user,
  pid,
  onAction,
  onRefresh,
}) => {
  const [topBidder, setTopBidder] = useState();
  const startTime = moment(endTime, "M/D/YYYY, h:mm:ss A");
  const currentTime = moment();
  let secondsDifference = startTime.diff(currentTime, "seconds");

  const handleState = async () => {
    if (isNaN(secondsDifference)) {
      secondsDifference = -2;
    }
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      if (bidState === "live" && secondsDifference < -1) {
        const snapshot = await get(valueRef);
        snapshot.forEach(function (childSnapshot) {
          const id = childSnapshot.key;
          const userProduct = childSnapshot.val();
          if (userProduct.pid === pid) {
            update(ref(db, `products/${id}`), { bidState: "ended" });
          }
        });
        if (onRefresh) onRefresh();
      } else if (bidState === "ended" && secondsDifference > -1) {
        const snapshot = await get(valueRef);
        snapshot.forEach(function (childSnapshot) {
          const id = childSnapshot.key;
          const userProduct = childSnapshot.val();
          if (userProduct.pid === pid) {
            update(ref(db, `products/${id}`), { bidState: "live" });
          }
        });
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadBiddersData = async () => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `Bid`);
      const snapshot = await get(valueRef);
      const ulist = [];
      snapshot.forEach(function (childSnapshot) {
        var userwhoBid = childSnapshot.val();
        if (userwhoBid.pid === pid) ulist.push(userwhoBid);
      });
      const oneBidder = ulist.length
        ? ulist.sort((a, b) => b.price - a.price)
        : [];
      if (oneBidder.length) setTopBidder(oneBidder[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const saveBidNotification = async () => {
    try {
      const database = getDatabase(firebaseApp);
      const bidRef = ref(database, `notification/${Date.now().toString()}`);
      if (topBidder)
        set(bidRef, {
          userId: topBidder.buyerId,
          notifyStatus: true,
          message: `Bid for ${name} has ended`,
        });
    } catch (error) {
      console.error(error);
    }
  };

  const endBidding = async () => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      const snapshot = await get(valueRef);
      snapshot.forEach(function (childSnapshot) {
        const id = childSnapshot.key;
        const userProduct = childSnapshot.val();
        if (userProduct.pid === pid) {
          if (topBidder) {
            update(ref(db, `products/${id}`), {
              isSold: true,
              bidState: "sold",
            }).then(() => {
              const orderRef = ref(db, `order/${Date.now().toString()}`);
              set(orderRef, {
                oid: Date.now().toString(),
                buyerId: topBidder.buyerId,
                sellerId: topBidder.sellerId,
                pid: topBidder.pid,
                price: topBidder.price,
                status: "pending",
              }).then(async () => {
                await saveBidNotification();
                notification.success({
                  message: "Check at orders",
                  key: "end-bidding-notification",
                  placement: "bottomRight",
                });
              });
            });
          } else {
            update(ref(db, `products/${id}`), {
              isSold: false,
              bidState: "ended",
            });
            message.info(
              "No bids have been placed on your product. You can update or delete your product"
            );
          }
        }
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleState();
    loadBiddersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      className="h-100"
      loading={isLoading}
      hoverable
      cover={
        <div style={{ position: "relative" }}>
          <Image
            height={175}
            width="100%"
            alt={name}
            src={images[0]}
            preview={false}
            style={{objectFit:'cover'}}
          />
          <Tag
            color={bidState === "live" ? "success" : "error"}
            style={{ position: "absolute", top: 10, left: 10 }}
          >
            <b>{capitalize(bidState)}</b>
          </Tag>
        </div>
      }
      actions={
        onAction
          ? user.userType === "seller"
            ? [
                <Tooltip title="View Bidding">
                  <EyeOutlined key="eye" onClick={() => onAction("view")} />
                </Tooltip>,
                <Tooltip
                  title={
                    bidState === "sold" || bidState === "live"
                      ? DISABLED_TOOLTIP
                      : "Edit Product"
                  }
                >
                  <EditOutlined
                    key="edit"
                    onClick={() => {
                      if (bidState !== "sold" && bidState !== "live") {
                        onAction("edit");
                      }
                    }}
                  />
                </Tooltip>,
                <Tooltip
                  title={
                    bidState === "live" ? DISABLED_TOOLTIP : "Delete Product"
                  }
                >
                  <DeleteOutlined
                    key="delete"
                    onClick={() => {
                      if (bidState !== "live") onAction("delete");
                    }}
                  />
                </Tooltip>,
                ...(bidState === "upcoming"
                  ? [
                      <Tooltip title="Tap to live">
                        <CheckOutlined
                          key="live"
                          onClick={() => {
                            onAction("live");
                          }}
                        />
                      </Tooltip>,
                    ]
                  : bidState === "ended"
                  ? [
                      <Tooltip title="End Bidding">
                        <CloseOutlined key="end-bidding" onClick={endBidding} />
                      </Tooltip>,
                    ]
                  : []),
              ]
            : user.userType === "admin"
            ? [
                <Tooltip
                  title={
                    bidState === "live" ? DISABLED_TOOLTIP : "Delete Product"
                  }
                >
                  <DeleteOutlined
                    key="delete"
                    onClick={() => {
                      if (bidState !== "live") onAction("delete");
                    }}
                  />
                </Tooltip>,
              ]
            : undefined
          : undefined
      }
    >
      <Card.Meta
        title={name}
        description={
          <ProductDescription
            bidState={bidState}
            secondsDifference={secondsDifference}
            price={price}
            endTime={endTime}
            option={
              user.userType === "admin"
                ? "View"
                : bidState !== "sold"
                ? bidState !== "ended"
                  ? "Bid Now"
                  : "View"
                : "Biddings"
            }
            user={user}
            onClick={onClick}
          />
        }
      />
    </Card>
  );
};

export default ProductCard;
