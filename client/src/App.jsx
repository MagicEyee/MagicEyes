import "./App.css";
import Login from "./components/login/login";
import Register from "./components/register/register";
import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./services/store/reducers/AuthSlice";
import Cookies from "js-cookie";
import Contacts from "./components/contacts/contacts";
import Cart from "./components/Cart/Cart";
import WishList from "./components/WishList/WishList";
import Product from "./components/Product/Product";
import FaceTracking from "./components/Product/FaceTracking";
import GetFace from "./components/Product/GetFace";
import Shop from "./components/Product/Shop";
import ProceedToCheckOut from "./components/Cart/ProceedToCheckOut";
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const opendash = useSelector((state) => state.auth.opendash);

  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (Cookies.get("jwt2")) {
      axios
        .get("http://localhost:3001/user/getMe", {
          headers: { Authorization: `Bearer ${Cookies.get("jwt2")}` },
        })
        .then((response) => {
          const allData = { ...response.data, token: Cookies.get("jwt2") };
          dispatch(setUser(allData));
        })
        .catch((error) => {
          console.log(error);
          Cookies.remove("jwt2");
        });
    }
    if (Cookies.get("jwt")) {
      axios
        .get("http://localhost:3001/user/getMe", {
          headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
        })
        .then((response) => {
          const allData = { ...response.data, token: Cookies.get("jwt") };
          dispatch(setUser(allData));
        })
        .catch((error) => {
          console.log(error);
          Cookies.remove("jwt2");
          Cookies.remove("jwt");
        });
    }
  }, []);
  useEffect(() => {
    if (opendash) {
      navigate("/dashboard");
    }
  }, [opendash]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/category/:id" element={<Profile />} />
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contact" element={<Contacts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<WishList />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/products" element={<Shop />} />
      <Route path="/products/category/:categoryId" element={<Shop />} />
      <Route path="/products/brand/:brandId" element={<Shop />} />
      <Route path="/place-order" element={<ProceedToCheckOut />} />
      {/* <Route path="/test" is element={<FaceTracking />} /> */}
      {/* <Route path="/test" element={<GetFace glassesImage={"/tryOn.png"} />} /> */}
      {/* <Route path="/wishlist" is element={<Cart />} /> */}
      <Route path="*" element={<>404</>} />
    </Routes>
  );
}

export default App;
