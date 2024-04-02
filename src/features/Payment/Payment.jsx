import { get, getDatabase, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firebaseApp } from "../Authentication/firebase";
import {
  Card,
  Col,
  Empty,
  Row,
  Space,
  Typography,
  Button,
  Image,
  Steps,
  Radio,
  Result,
  message,
  notification,
  Form,
  Input,
} from "antd";
import Loader from "../../components/Loader";
import {
  ArrowLeftOutlined,
  DollarOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { NumericFormat } from "react-number-format";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useAuth } from "../../hooks/context";

const Payment = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [method, setMethod] = useState("cod");
  const [isPaying, setPaying] = useState(false);
  const [messages, setMessages]=useState('')

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/create-payment-intent/${btoa(
        order.price
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };

  const getProduct = async (id) => {
    let p;
    const db = getDatabase(firebaseApp);
    const valueRef = ref(db, `products`);
    const snapshot = await get(valueRef);
    snapshot.forEach(function (childSnapshot) {
      const userProduct = childSnapshot.val();
      if (userProduct.pid === id) {
        p = userProduct;
      }
    });
    return p;
  };

  const loadOrdersData = async () => {
    try {
      const db = getDatabase(firebaseApp);
      const valueRef = ref(db, `order`);
      const snapshot = await get(valueRef);
      let o;
      snapshot.forEach(function (childSnapshot) {
        const uorder = childSnapshot.val();
        if (uorder.oid == id) {
          o = uorder;
        }
      });

      if (o) {
        o.product = await getProduct(o.pid);
      }

      setOrder(o);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const updateOrderStatus = (billingDetails) => {
    try {
      const db = getDatabase();
      const valueRef = ref(db, `order`);
      get(valueRef)
        .then((snapshot) => {
          snapshot.forEach(function (childSnapshot) {
            let key = childSnapshot.key;
            let uorder = childSnapshot.val();
            if (uorder.oid === id)
              update(ref(db, `order/${key}`), {
                status: "active (paid)",
                billingDetails,
              });
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      alert(e.message);
    }
  };

  const onPay = async () => {
    setPaying(true);
    if (method === "card") {
      if (elements == null) {
        return;
      }

      const { error: paymentErr } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      if (!paymentErr) {
        try {
          const values = await form.validateFields();
          const { clientSecret, error } =
            await fetchPaymentIntentClientSecret();
          if (error) {
            message.error("Unable to proceed payment");
            setPaying(false);
          } else {
            const { error: intentErr, paymentIntent } =
              await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                  card: elements.getElement(CardElement),
                },
              });

            if (intentErr) {
              message.error("Payment confirmation error");
              setPaying(false);
            } else if (paymentIntent) {
              notification.success({
                message: "Payment Successful",
                key: "payment-success-notification",
                placement: "bottomRight",
              });
              updateOrderStatus({ ...values, method });
              setCurrent(1);
              setPaying(false);
            }
          }
        } catch (e) {
          setPaying(false);
        }
      } else {
        message.error("Payment method is not correct");
        setPaying(false);
      }
    } else {
      form
        .validateFields()
        .then((values) => {
          setPaying(false);
          setCurrent(1);
          updateOrderStatus({ ...values, method });
        })
        .catch((err) => {
          setPaying(false);
          console.error(err);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    loadOrdersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return order && order.product ? (
    <Space
      direction="vertical"
      size={40}
      style={{ overflow: "auto" }}
      className="global-padding h-100 w-100 bg-white"
    >
      <Button
        size="middle"
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/app/orders")}
      >
        Orders
      </Button>
      <Row
        className="h-100 w-100"
        gutter={[24, 24]}
        style={{ padding: "0px 20px 20px 20px" }}
      >
        <Col xs={24} sm={24} md={24} lg={10}>
          <Space size={8} direction="vertical" className="w-100">
            <Image
              src={order.product.images ? order.product.images[0] : ""}
              height={550}
              alt={order.product.name}
              width="100%"
              preview={false}
            />
            {order.product.images ? (
              <Image.PreviewGroup>
                {order.product.images.map((image, index) => (
                  <Image
                    key={index}
                    className="isClickable"
                    src={image}
                    height={100}
                    width={100}
                    alt={order.product.name + index}
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
                {order.product.name}
              </Typography.Title>
              <Typography.Title
                level={5}
                style={{ margin: "8px 0px", fontWeight: 400 }}
              >
                {order.product.description}
              </Typography.Title>
              <Card bordered style={{ background: "transparent" }}>
                {order.status.includes("active (not paid)") ? (
                  <Space direction="vertical" className="w-100">
                    <Steps
                      current={current}
                      items={[
                        {
                          title: "Pay",
                          icon: isPaying ? (
                            <LoadingOutlined />
                          ) : (
                            <DollarOutlined />
                          ),
                        },
                        {
                          title: "Done",
                          icon: <SmileOutlined />,
                        },
                      ]}
                    />
                    {current === 0 ? (
                      <>
                        <Radio.Group
                          style={{ margin: "16px 0px" }}
                          onChange={(event) => setMethod(event.target.value)}
                          value={method}
                          disabled={isPaying}
                        >
                          <Space direction="vertical" size={10}>
                            <Radio value="cod">Cash on Delivery</Radio>
                            <Radio value="card">Pay by card</Radio>
                          </Space>
                        </Radio.Group>
                        {method === "card" && <CardElement />}
                        <Typography.Title
                          level={5}
                          style={{ margin: "0px 0px 8px 0px" }}
                        >
                          Billing Details
                        </Typography.Title>
                        <Form
                          layout="vertical"
                          form={form}
                          initialValues={{
                            email: user?.email,
                            name: user?.userName,
                            mobileNo: user?.mobileno,
                            message:`Admin have received your money $ ${order.price} from buyer ${user?.email}.Your money is hold by admin.After Some legal process you will get your money with in 1 to 2 days `,
                          }}
                        >
                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter name",
                                  },
                                ]}
                              >
                                <Input placeholder="Enter name" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter email",
                                  },
                                ]}
                              >
                                <Input placeholder="Enter email" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                name="mobileNo"
                                label="Mobile Number"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter mobile number",
                                  },
                                ]}
                              >
                                <Input placeholder="Enter mobile number" />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                              style={{display:'none'}}
                                name="message"
                                label=""
                                rules={[
                                  {
                                    message: "Please enter mobile number",
                                  },
                                ]}
                              >
                                <Input placeholder="message" value={messages} />
                              </Form.Item>
                            </Col>
                            <Col span={24}>
                              <Form.Item
                                name="address"
                                label="Address"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter address",
                                  },
                                ]}
                              >
                                <textarea
                                  className={`ant-input css-dev-only-do-not-override-15rg2km ${
                                    form.getFieldError("address") &&
                                    form.getFieldError("address").length
                                      ? "ant-input-status-error"
                                      : ""
                                  }`}
                                  placeholder="Enter address"
                                ></textarea>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                        <Space
                          align="end"
                          className="w-100"
                          direction="vertical"
                        >
                          <Typography.Title level={4} style={{ margin: 0 }}>
                            Total
                          </Typography.Title>
                          <Typography.Title level={5} style={{ margin: 0 }}>
                            <NumericFormat
                              value={
                                order.price
                                  ? order.price
                                  : order.product.price
                              }
                              displayType="text"
                              thousandSeparator
                              prefix="$"
                              fixedDecimalScale
                              decimalScale={2}
                            />
                          </Typography.Title>
                          <Button
                            type="primary"
                            onClick={onPay}
                            loading={isPaying}
                          >
                            Pay Now
                          </Button>
                        </Space>
                      </>
                    ) : (
                      <Result
                        status="success"
                        title={`Successfully Purchased ${order.product.name}`}
                        subTitle={`Order number: ${id}.`}
                        extra={[
                          <Button
                            type="primary"
                            key="buy"
                            onClick={() => navigate("/app/products")}
                          >
                            Buy Other Products
                          </Button>,
                        ]}
                      />
                    )}
                  </Space>
                ) : (
                  <Result
                    title="You have already paid"
                    extra={
                      <Button
                        type="primary"
                        onClick={() => navigate("/app/orders")}
                      >
                        Go to orders
                      </Button>
                    }
                  />
                )}
              </Card>
            </Space>
          </Space>
        </Col>
      </Row>
    </Space>
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
  );
};

export default Payment;
