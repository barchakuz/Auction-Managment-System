import React from "react";
import { Routes, Route } from "react-router-dom";
import DisputeList from "./DisputeList";

const Disputes = () => {
  return (
    <Routes>
      <Route path="/" element={<DisputeList />} />
    </Routes>
  );
};

export default Disputes;
