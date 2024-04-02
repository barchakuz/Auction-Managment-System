import React from "react";
import { Routes, Route } from "react-router-dom";
import OrderList from "./OrderList";
import Payment from "../Payment/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Mz2mOFtSbngplj5sp2Pba79HaKul9b9pMxJVUMIxtBDlY7j82LjeL9iP94NY1zVbmFF4VA4fC8pN9diQIKQMtQs00o0rhpcgv"
);

const Orders = () => {
  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path="/payment/:id" element={<Payment />} />
      </Routes>
    </Elements>
  );
};

export default Orders;
