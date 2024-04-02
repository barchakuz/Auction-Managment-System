import React, { useState } from "react";
import Drawer from "./Drawer";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
  notification,
} from "antd";
import { auctionState, addProductCate } from "../helpers";
import Upload from "./Upload";
import moment from "moment";
import { useAuth } from "../hooks/context";
import { getDatabase, ref, set, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { firebaseApp } from "../features/Authentication/firebase";
import {  Space } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const { Option } = Select;

const handleEndDateConfirm = (startTime, endTime) => {
  const st = moment(startTime, "M/D/YYYY, h:mm:ss A");
  const et = moment(endTime, "M/D/YYYY, h:mm:ss A");

  if (et.diff(st, "seconds") < 1) {
    alert("End date must be greater than start date");
    return true;
  }
  return false;
};

const disabledDate = (current) => {
  // Can not select days before today and today
  return current && current < dayjs();
};

const AddProduct = ({ onClose, onFinish, data }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

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

  const onSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then(
        async ({
          startTime,
          endTime,
          name,
          price,
          description,
          category,
          bidState,
        }) => {
          if (handleEndDateConfirm(startTime.toDate(), endTime.toDate())) {
          } else {
            const database = getDatabase(firebaseApp);
            if (data) {
              const productRef = ref(database, `products/${data.mpid}`);
              const updateData = {
                name,
                price,
                description,
                startTime: startTime
                  ? startTime.toDate().toLocaleString()
                  : data.startTime,
                endTime: endTime
                  ? endTime.toDate().toLocaleString()
                  : data.endTime,
                category,
                bidState,
              };
              if (images.length > 0) {
                const imageUrls = await uploadImages();
                updateData.images = imageUrls;
              }
              await update(productRef, updateData);

              setImages([]);
              setLoading(false);
              notification.success({
                message: "Product Updated",
                key: "product-updated-notification",
                placement: "bottomRight",
              });
              onClose();
              if (onFinish) onFinish();
            } else if (images.length > 0) {
              const imageUrls = await uploadImages();
              const productRef = ref(
                database,
                `products/${Date.now().toString()}`
              );
              await set(productRef, {
                userId: user.userId,
                uid: user.uid,
                pid: Date.now().toString(),
                name,
                price,
                description,
                startTime: startTime.toDate().toLocaleString(),
                endTime: endTime.toDate().toLocaleString(),
                category,
                bidState,
                isSold: false,
                images: imageUrls,
              });

              setImages([]);
              setLoading(false);
              notification.success({
                message: "Product Added",
                key: "product-added-notification",
                placement: "bottomRight",
              });
              onClose();
              if (onFinish) onFinish();
            } else {
              setLoading(false);
              message.error("Select an image to continue");
            }
          }
        }
      )
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <Drawer
      title={data ? "Manage Product" : "Add Product"}
      onClose={onClose}
      open
      onSubmit={onSubmit}
      isLoading={loading}
    >
      <Form layout="vertical" form={form} initialValues={data}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Please enter product name" }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          <Form.Item
  name="price"
  label="Price for Auction (USD)"
  rules={[
    { required: true, message: "Please enter the price" },
    {
      pattern: /^[0-9]+(?:\.[0-9]{1,2})?$/, // regex for numeric values with optional two decimal places
      message: "Please enter a valid numeric value for the price",
    },
  ]}
>
  <Input
    style={{ width: "100%" }}
    placeholder="0.00"
    prefix={<Typography.Text className="text-grey">$ </Typography.Text>}
  />
</Form.Item>

        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Bidding Start Date Time"
              rules={[
                {
                  required: true,
                  message: "Please enter bidding start date and time",
                },
              ]}
            >
              <DatePicker  disabledDate={(current) => current.isBefore(moment().subtract(1,"day"))}  showTime />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endTime"
              label="Bidding End Date Time"
              rules={[
                {
                  required: true,
                  message: "Please enter bidding end date and time",
                },
              ]}
            >
              <DatePicker  disabledDate={(current) => current.isBefore(moment().subtract(1,"day"))} showTime />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Product Category"
              rules={[
                {
                  required: true,
                  message: "Please select category",
                },
              ]}
            >
              <Select placeholder="Select category">
                {addProductCate.map((category) => (
                  <Option value={category.value} key={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="bidState"
              label="Bid State"
              rules={[
                {
                  required: true,
                  message: "Please select bid state",
                },
              ]}
            >
              <Select placeholder="Select bid state">
                {auctionState.map((as) => (
                  <Option value={as.value} key={as.value}>
                    {as.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Product Description"
              rules={[
                {
                  required: true,
                  message: "Please enter product description",
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Enter description" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Typography.Text>Product Images</Typography.Text>
      <div style={{ minHeight: 150, marginTop: 6 }}>
        <Upload onChange={setImages} />
      </div>
    </Drawer>
  );
};

export default AddProduct;
