import React, { useState, useEffect } from "react";
import { Space, Typography } from "antd";

const CountdownTimer = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const remainingSeconds = timeLeft % 60;
  return (
    <Space
      style={{ justifyContent: "space-between" }}
      className="w-100"
      align="center"
    >
      <Space size={0} direction="vertical" className="text-center">
        <Typography.Text className="text-main">
          <b>{days}</b>
        </Typography.Text>
        <p className="text-dull">DAYS</p>
      </Space>
      <Space size={0} direction="vertical" className="text-center">
        <Typography.Text className="text-main">
          <b>{hours}</b>
        </Typography.Text>
        <p className="text-dull">HOURS</p>
      </Space>
      <Space size={0} direction="vertical" className="text-center">
        <Typography.Text className="text-main">
          <b>{minutes}</b>
        </Typography.Text>
        <p className="text-dull">MINUTES</p>
      </Space>
      <Space size={0} direction="vertical" className="text-center">
        <Typography.Text className="text-main">
          <b>{remainingSeconds}</b>
        </Typography.Text>
        <p className="text-dull">SECONDS</p>
      </Space>
    </Space>
  );
  //   <View style={styles.container}>
  //     <View style={styles.timeContainer}>
  //       <Text style={styles.timeText}>{days}</Text>
  //       <Text style={styles.labelText}>DAYS</Text>
  //     </View>
  //     <View style={styles.timeContainer}>
  //       <Text style={styles.timeText}>{hours}</Text>
  //       <Text style={styles.labelText}>HOURS</Text>
  //     </View>
  //     <View style={styles.timeContainer}>
  //       <Text style={styles.timeText}>{minutes}</Text>
  //       <Text style={styles.labelText}>MINUTES</Text>
  //     </View>
  //     <View style={styles.timeContainer}>
  //       <Text style={styles.timeText}>{remainingSeconds}</Text>
  //       <Text style={styles.labelText}>SECONDS</Text>
  //     </View>
  //   </View>;
};

export default CountdownTimer;
