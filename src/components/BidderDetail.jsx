import React, { useEffect, useState } from "react";
import Drawer from "./Drawer";
import { Col, Row, Space } from "antd";
import { NumericFormat } from "react-number-format";
import { get, getDatabase, ref } from "firebase/database";
import Loader from "./Loader";

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const BidderDetail = ({ onClose, buyerName, price, buyerId }) => {
  const [loading, setLoading] = useState(false);
  const [buyer, setBuyer] = useState(null);

  const getBuyers = async () => {
    try {
      const db = getDatabase();
      const valueRef = ref(db, "users/" + buyerId);
      const snapshot = await get(valueRef);
      const userData = snapshot.val();
      setBuyer(userData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    getBuyers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Drawer
      onClose={onClose}
      open
      width={350}
      closable={false}
      title="User Profile"
    >
      {loading ? (
        <Space
          className="w-100 h-100"
          direction="vertical"
          align="center"
          style={{ justifyContent: "center" }}
        >
          <Loader />
        </Space>
      ) : (
        <>
          <Row>
            <Col span={24}>
              <DescriptionItem title="Bidder Name" content={buyerName} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Bidder Mobile No"
                content={buyer?.mobileno ?? "-"}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Bidder Email"
                content={buyer?.email ?? "-"}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Bid Amount"
                content={
                  <NumericFormat
                    value={price}
                    displayType="text"
                    thousandSeparator
                    prefix="$"
                    fixedDecimalScale
                    decimalScale={2}
                  />
                }
              />
            </Col>
          </Row>
        </>
      )}
    </Drawer>
  );
};

export default BidderDetail;
