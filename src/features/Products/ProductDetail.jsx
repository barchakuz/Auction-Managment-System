import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Image,
  Input,
  Row,
  Space,
  Typography,
  message,
  notification,
} from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { firebaseApp } from "../Authentication/firebase";
import { get, getDatabase, ref, set, update } from "firebase/database";
import Loader from "../../components/Loader";
import CountdownTimer from "../../components/CountdownTimer";
import moment from "moment";
import { useAuth } from "../../hooks/context";
import { numericFormatter } from "react-number-format";
import BidderDetail from "../../components/BidderDetail";
import SellerProfile from "../SellerProfile";
import { SellerProfileCard } from "../../components/ProductSeller/SellerProfileCard";

const getSeconds = (endTime) => {
  const startTime = moment(endTime, "M/D/YYYY, h:mm:ss A");
  const currentTime = moment();
  const secondsDifference = startTime.diff(currentTime, "seconds");

  return secondsDifference;
};

const PlaceBid = ({ onSaveBid, isLoading }) => {
  const [amount, setAmount] = useState(undefined);
  return (
    <Row gutter={[10, 10]} className="w-100">
      <Col span={14}>
        <Input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          prefix={<Typography.Text className="text-grey">$ </Typography.Text>}
          style={{ minHeight: 45 }}
          placeholder="0.00"
        />
      </Col>
      <Col span={10}>
        <Button
          block
          type="primary"
          className="ant-btn-override"
          style={{ minHeight: 45 }}
          onClick={() => {
            onSaveBid(amount);
            setAmount(undefined);
          }}
          loading={isLoading}
        >
          Place Bid
        </Button>
      </Col>
    </Row>
  );
};

const ProductDetail = ({ back = "/app/products" }) => {
  const { id, userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active] = useState(0);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [puser, setPuser] = useState([]);

  const [showBid, setShowBid] = useState(true);
  const [placingBid, setPlacingBid] = useState(false);
  const [showBidder, setShowBidder] = useState(null);


    const loadUsers = async () => {
      try {
        const db = getDatabase();
        const valueRef = ref(db, `users/`);
         get(valueRef)
          .then((snapshot) => {
            const users = [];
            snapshot.forEach(function (childSnapshot) {
              const user =  childSnapshot.val();
              if (user.uid === userId) {
                users.push({ ...user, userId: childSnapshot.key });
              }
            });
  
             setPuser(users);
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



  const getProduct = async (stateChanged = false) => {
    try {
      const db = getDatabase(firebaseApp);
      const products = ref(db, `products`);
      const bids = ref(db, `Bid`);
      const userBids = [];
      let prod = {};
      const prodSnapshot = await get(products);
      const bidSnapshot = await get(bids);
      prodSnapshot.forEach(function (childSnapshot) {
        const p = childSnapshot.val();
        if (p.pid === id) {
          prod = p;
        }
      });
      bidSnapshot.forEach(function (childSnapshot) {
        const userBid = childSnapshot.val();
        if (userBid.pid === id) {
          userBids.push(userBid);
        }
      });
      const p = {
        ...prod,
        bids: userBids.slice().sort((a, b) => b.price - a.price),
      };
      if (!stateChanged) handleState(p);
      setProduct({ ...p });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const saveBidNotification = async () => {
    try {
      const database = getDatabase(firebaseApp);
      const bidRef = ref(database, `notification/`);
      set(bidRef, {
        userId: product.userId,
        nid: Date.now().toString(),
        notifyStatus: true,
        message: `${user.userName} has bid on ${product.name}`,
        entity: "products",
        entityID: product.pid,
      });

    } catch (error) {
      console.error(error);
    }
  };

  // const saveWins = async () => {
  //   try {
  //     const database = getDatabase(firebaseApp);
  //     const bidRef = ref(database, `wins/`);
  //     set(bidRef, {
  //       userId: product.userId,
  //       wid: Date.now().toString(),
  //       message: `you ${user.userName} buy this product.`,
  //       entity: "products",
  //       entityID: product.pid,
  //       buyerid:user.id,
  //     });
      
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onSaveBid = async (amount) => {
    const price =
      product.bids && product.bids.length
        ? product.bids[0].price
        : product.price;
    try {
      if (parseFloat(amount) > parseFloat(price)) {
        const database = getDatabase(firebaseApp);
        const bidRef = ref(database, `Bid/${Date.now().toString()}`);
        await set(bidRef, {
          sellerId: product.userId,
          buyerId: user.userId,
          buyerName: user.userName,
          price: amount,
          pid: product.pid,
        });
        await saveBidNotification();
        setPlacingBid(false);
        getProduct(true);
        notification.success({
          message: `Your bid added : $${amount}`,
          key: "bid-notification",
          placement: "bottomRight",
        });
      } else {
        setPlacingBid(false);
        message.error(
          `Bid amount should be greater than current bid: $ ${parseFloat(
            price
          )} `
        );
      }
    } catch (error) {
      setPlacingBid(false);
      console.error(error);
    }
  };

  const handleState = async (_product) => {
    try {
      const startTime = moment(_product.endTime, "M/D/YYYY, h:mm:ss A");
      const currentTime = moment();
      let secondsDifference = startTime.diff(currentTime, "seconds");
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `products`);
      if (isNaN(secondsDifference)) {
        secondsDifference = -2;
      }

      if (_product.bidState === "live" && secondsDifference < -1) {
        const snapshot = await get(valueRef);
        snapshot.forEach(function (childSnapshot) {
          const id = childSnapshot.key;
          const userProduct = childSnapshot.val();
          if (userProduct.pid === _product.pid) {
            update(ref(db, `products/${id}`), { bidState: "ended" });
          }
        });
        getProduct(true);
      } else if (_product.bidState === "ended" && secondsDifference > -1) {
        const snapshot = await get(valueRef);
        snapshot.forEach(function (childSnapshot) {
          const id = childSnapshot.key;
          const userProduct = childSnapshot.val();
          if (userProduct.pid === _product.pid) {
            update(ref(db, `products/${id}`), { bidState: "live" });
          }
        });
        getProduct(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setLoading(true);
    getProduct();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Space
        direction="vertical"
        size={40}
        style={{ overflow: "auto" }}
        className="global-padding h-100 w-100 bg-white"
      >
          {puser.length >= 0 ? (
        puser.map((p)=>( (
          <div style={{display:"flex",alignItems:'center', cursor:"pointer", justifyContent:'center' , marginTop:'-2rem',marginBottom:'-2rem'}}>
          <SellerProfileCard props={p} />
          </div>
        )))
   
      ):''}
      {console.log(".....email",puser.map((p)=>( console.log(p.email))))}
        <Button
          size="middle"
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(back)}
        >
          Products
        </Button>
        {loading ? (
          <Space
            className="w-100 h-100"
            direction="vertical"
            align="center"
            style={{ justifyContent: "center" }}
          >
            <Loader />
          </Space>
        ) : product && product.pid ? (
          <Row
            className="h-100 w-100"
            gutter={[24, 24]}
            style={{ padding: "0px 20px 20px 20px" }}
          >
            <Col xs={24} sm={24} md={24} lg={10}>
              <Space size={8} direction="vertical" className="w-100">
                <Image
                  src={product.images ? product.images[active] : ""}
                  height={550}
                  alt={product.name}
                  width="100%"
                  preview={false}
                />
                {product.images ? (
                  <Image.PreviewGroup>
                    {product.images.map((image, index) => (
                      <Image
                        key={index}
                        className="isClickable"
                        src={image}
                        height={100}
                        width={100}
                        alt={product.name + index}
                        style={{objectFit:'cover'}}
                        // onClick={() => setActive(index)}
                      />
                    ))}
                  </Image.PreviewGroup>
                ) : null}
              </Space>
            </Col>
            <Col xs={24} sm={24} md={24} lg={14}>
              <Space
                direction="vertical"
                className="w-100 h-100"
                style={{ justifyContent: "space-between" }}
              >
                <Space direction="vertical" className="w-100">
                  <Typography.Title style={{ margin: "4px 0px" }}>
                    {product.name}
                  </Typography.Title>
                  <Typography.Title
                    level={5}
                    style={{ margin: "8px 0px", fontWeight: 400 }}
                  >
                    {product.description}
                  </Typography.Title>
                  <Card
                    bordered
                    style={{ background: "transparent" }}
                    title={
                      <Space
                        direction="vertical"
                        style={{ padding: "10px 0px" }}
                      >
                        <Space align="center" size={6}>
                          <Typography.Text className="text-grey">
                            Bid End Date
                          </Typography.Text>
                          <Typography.Text className="text-grey">
                            {product.endTime}
                          </Typography.Text>
                        </Space>
                        {getSeconds(product.endTime) > -1 && (
                          <Space size={16} className="w-100">
                            <ClockCircleOutlined />
                            <CountdownTimer
                              seconds={getSeconds(product.endTime)}
                            />
                          </Space>
                        )}
                      </Space>
                    }
                  >
                    <Space
                      align="start"
                      className="w-100"
                      style={{ justifyContent: "space-between" }}
                    >
                      <Space direction="vertical">
                        <Typography.Text className="text-grey">
                          {product.bidState !== "sold"
                            ? product.bidState !== "ended"
                              ? `Current Bid`
                              : `End Bid`
                            : `Last Bid`}
                        </Typography.Text>
                        <Typography.Title level={2} style={{ margin: 0 }}>
                          {numericFormatter(
                            (product.bids && product.bids.length
                              ? product.bids[0].price
                              : product.price
                            ).toString(),
                            {
                              displayType: "text",
                              thousandSeparator: true,
                              prefix: "$",
                              fixedDecimalScale: true,
                              decimalScale: 2,
                            }
                          )}
                        </Typography.Title>
                      </Space>
                      <Button
                        type="link"
                        style={{
                          padding: 0,
                          height: "fit-content",
                        }}
                        onClick={() => setShowBid(!showBid)}
                      >
                        {`${
                          product.bids && product.bids.length
                            ? product.bids.length
                            : 0
                        } Bid(s)`}
                      </Button>
                    </Space>
                    {product.bidState !== "sold" &&
                    product.bidState !== "ended" &&
                    user.userType === "buyer" ? (
                      <>
                        <Divider />
                        <PlaceBid
                          onSaveBid={onSaveBid}
                          isLoading={placingBid}
                        />
                      </>
                    ) : null}

                    {product.bids && product.bids.length && showBid ? (
                      <>
                        <Divider />
                        <Typography.Title level={4}>
                          Highest Bids
                        </Typography.Title>
                        <Space
                          direction="vertical"
                          size={10}
                          className="w-100"
                          style={{
                            padding: "10px 0px",
                            maxHeight: 188,
                            overflow: "scroll",
                          }}
                        >
                          {product.bids.map((bid, index) => (
                            <Space
                              style={{ justifyContent: "space-between" }}
                              align="center"
                              key={index}
                              className="w-100"
                            >
                              <Button
                                type="link"
                                onClick={() => {
                                  if (user.userType !== "buyer")
                                    setShowBidder(bid);
                                }}
                              >
                                <Space size={10}>
                                  <UserOutlined />
                                  <Typography.Text>
                                    {bid.buyerName}
                                  </Typography.Text>
                                </Space>
                              </Button>
                              <Typography.Text>
                                <b>
                                  {numericFormatter(bid.price.toString(), {
                                    displayType: "text",
                                    thousandSeparator: true,
                                    prefix: "$",
                                    fixedDecimalScale: true,
                                    decimalScale: 2,
                                  })}
                                </b>
                              </Typography.Text>
                            </Space>
                          ))}
                        </Space>
                      </>
                    ) : null}
                  </Card>
                  <Typography.Text className="text-grey">
                    Bid for the {product.name}
                  </Typography.Text>
                </Space>
              </Space>
            </Col>
          </Row>
        ) : (
         
         <Empty />
  
        )}
      </Space>
      {showBidder && (
        <BidderDetail {...showBidder} onClose={() => setShowBidder(null)} />
      )}
      <button style={{backgroundColor:'#287df6', cursor:'pointer', width:'100px', marginTop:'50px',textAlign:'center',margin:'auto', color:'white',paddingLeft:'8px', paddingRight:'8px' ,paddingTop:'7px', paddingBottom:'7px', borderRadius:'10%'}} onClick={() => window.location.reload(false)} >Reload</button>
    </>
  );
};

export default ProductDetail;
