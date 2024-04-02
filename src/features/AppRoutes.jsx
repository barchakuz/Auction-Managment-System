import React from "react";
import { Routes, Route } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import NotFound from "../components/NotFound";
import { PrivateRoutes } from "../routes/ConditionalRoutes";
import Products from "./Products/Products";
import Orders from "./Orders/Orders";
import Disputes from "./Disputes/Disputes";
import { useAuth } from "../hooks/context";
import Users from "./Admin/Users/Users";
import Navbar from "../components/Navigatiom/Navbar";
import MainBanner from "../components/TopSlider/MainBanner.jsx"
import Home from "./Home";
import WinList from "./WinList/WinList";

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <PrivateRoutes>
      <Wrapper>
        <Routes>

          {user?.userType === "admin" ? (
            <>
              <Route path="/" element={<Users />} />
              <Route path="/users/*" element={<Users />} />
            </>
          ) : (
            <>
            
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
             {/* <Route path="/" element={<MainBanner />} /> */}
              {/* <Route path="/" element={<Products />} /> */}
              <Route path="/products/*" element={<Products />} />
              <Route path="/orders/*" element={<Orders />} />
              <Route path="/wins/*" element={<WinList />} />
            </>
          )}
          <Route path="/disputes/*" element={<Disputes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Wrapper>
    </PrivateRoutes>
  );
};

export default AppRoutes;
