import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Categories from "./components/categories";
import BestProduct from "./components/BestProduct";
import Footer from "./components/Footer";
import Brands from "./components/Brands";
import AdsNav from "../adsNav/AdsNav";

function Home() {
  const user = useSelector((state) => state.auth.loggedIn);
  const admin = useSelector((state) => state.auth.isAdmin);
  const Udetails = useSelector((state) => state.auth.user);

  return (
    <div>
      <Header user={user} admin={admin} Udetails={Udetails} />
      <Landing />
      <Categories />
      <AdsNav />
      <BestProduct />
      <Brands />
      <Footer />
      {/* {user && (
        <>
          {admin && <h1> welcome admin {Udetails.firstName}</h1>}
          {!admin && <h1> welcome {Udetails.firstName} </h1>}
        </>
      )}
      {!user && <h1> welcome guest</h1>}

      {admin && !opendash ? (
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      ) : (
        <></>
      )}
      {!user && (
        <>
          <button onClick={() => navigate("/Login")}>Login page</button>
          <button onClick={() => navigate("/register")}>register page</button>
        </>
      )} */}

      {/* {Error ? (
        <>
          <h1>there is an error in fetching user login again</h1>
        </>
      ) : (
        <></>
      )} */}
    </div>
  );
}

export default Home;
