import React, { useState } from "react";
import Drawer from "./Drawer";
import { Col, Form, Input, Row, Typography, notification } from "antd";
import { useAuth } from "../hooks/context";
import { getDatabase, ref, set } from "firebase/database";
import Upload from "./Upload";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { firebaseApp } from "../features/Authentication/firebase";

const AddDispute = ({ onClose, onFinish }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadImages = async () => {
    const imageRefs = [];
    const storage = getStorage(firebaseApp);

    for (const imageUri of images) {
      const imageRef = storageRef(storage, `${user.userId}/${Date.now()}.jpg`);
      await uploadBytesResumable(imageRef, imageUri);
      const imageUrl = await getDownloadURL(imageRef);
      imageRefs.push(imageUrl);
    }

    return imageRefs;
  };

  const saveDisputeNotification = async (did) => {
    try {
      const database = getDatabase(firebaseApp);
      const disputeRef = ref(database, `notification/${Date.now().toString()}`);
      set(disputeRef, {
        adminId: 1,
        notifyStatus: true,
        message: `${user.userName} has filed a dispute`,
        entity: "disputes",
        entityID: did,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then(async ({ title, description }) => {
        setLoading(true);
        try {
          const db = getDatabase();
          const did = Date.now().toString();
          const orderRef = ref(db, `dispute/${did}`);
          const orderData = {
            did,
            userId: user.userId,
            userName: user.userName,
            userEmail: user.email,
            userMno: user.mobileno,
            status: "active",
            title,
            description,
          };
          if (images.length) {
            const imageUrls = await uploadImages();
            orderData.images = imageUrls;
          }

          set(orderRef, orderData).then(() => {
            saveDisputeNotification(did);
            setLoading(false);
            notification.success({
              message: "Your Dispute has been sent to admin",
              key: "dispute-success-notification",
              placement: "bottomRight",
            });
            onClose();
            if (onFinish) onFinish();
          });
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <Drawer
      title="Add Dispute"
      onClose={onClose}
      open
      width={400}
      onSubmit={onSubmit}
      isLoading={loading}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Dispute Title"
              rules={[
                { required: true, message: "Please enter dispute title" },
              ]}
            >
              
              <Input placeholder="Enter dispute title" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Dispute Details"
              rules={[
                {
                  required: true,
                  message: "Please enter dispute details",
                },
              ]}
              
            >
              <Input.TextArea rows={4} placeholder="Enter dispute details" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Typography.Text>Dispute Images</Typography.Text>
      <div style={{ minHeight: 150, marginTop: 6 }}>
        <Upload onChange={setImages} />
      </div>
    </Drawer>
    
  );
};


export default AddDispute;
