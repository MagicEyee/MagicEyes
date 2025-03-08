import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useInView } from "motion/react";
import "./bestProduct.css"; // Assuming you have a CSS file for styling
import { Box, Container } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
const BestProducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const List = ["Latest Products", "Best Sellers", "Sale Products"];
  const ref = useRef(null);
  const isInView = useInView(ref);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const latestResponse = await axios.get("/product/latestProduct");
        const bestSellersResponse = await axios.get("/product/bestSeller");
        const saleResponse = await axios.get("/product/saleProduct");
        setLatestProducts(latestResponse.data.data);
        setBestSellers(bestSellersResponse.data.data);
        setSaleProducts(saleResponse.data.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  const handleShowClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleCartClick = async (id) => {
    try {
      const response = await axios.post(
        `/user/addTocart/${id}`,
        {
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Added to cart", response.data);
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const handleWishListClick = async (id) => {
    try {
      await axios.post(
        `/user/addtoWishList/${id}`,
        {
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const renderProduct = (product, i) => {
    console.log(product);
    return (
      <motion.div
        style={{
          width: "260px",
          borderRadius: "5px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid #2a9d8f",
          display: "flex",
          flexDirection: "column",
        }}
        key={product._id}
        layout
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 100 },
        }}
        initial={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.3, delay: 0.2 * i, easing: "linear" }}
      >
        <img
          src={product.images[0].secure_url}
          alt={product.name}
          className="product-image"
        />
        <div className="product-icons">
          <button className="eye" onClick={() => handleShowClick(product._id)}>
            <VisibilityIcon />
          </button>
          <button
            onClick={() => handleCartClick(product._id)}
            className="add-to-cart"
          >
            <AddShoppingCartIcon />
          </button>
          <button
            onClick={() => handleWishListClick(product._id)}
            className="add-to-wishlist"
          >
            <FavoriteBorderIcon />
          </button>
        </div>
        <div className="product-info">
          <h3 className="ProductName">{product.Name}</h3>
          {product.salePrice ? (
            <div className="sale-price">
              <span className="original-price">{product.salePrice}EGP</span>
              <p className="Sale">{product.price}EGP</p>
            </div>
          ) : (
            <p className="justOPrice">{product.price} EGP</p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <Container
      sx={
        {
          // display: "flex",
          // justifyContent: "space-around",
          // flexWrap: "wrap",
          // gap: "20px",
          // alignItems: "center",
          // padding: "30px 0",
          // overflowX: "auto",
          // scrollbarWidth: "none",
          // scrollbarColor: "transparent transparent",
          // "&::-webkit-scrollbar": {
          //   display: "none",
          // },
        }
      }
    >
      <div className="best-products">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            padding: "10px",
            alignItems: "center",
            overflowX: "auto",
            flexWrap: "wrap",
          }}
        >
          {List.map((item, i) => {
            return (
              <button
                onClick={() => setActive(i)}
                className={`${
                  active === i ? "active-work" : ""
                } portfolio__list-item text-cs `}
                key={i}
                style={{
                  backgroundColor: " transparent",
                  cursor: "pointer",
                }}
              >
                <h2>{item}</h2>
              </button>
            );
          })}
        </Box>
        <AnimatePresence>
          {active === 0 && (
            <AnimatePresence>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "20px",
                  padding: "30px 0",
                }}
              >
                {latestProducts.map(renderProduct)}
              </Box>
            </AnimatePresence>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {active === 1 && (
            <AnimatePresence>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "20px",
                  padding: "30px 0",
                }}
              >
                {bestSellers.map(renderProduct)}
              </Box>
            </AnimatePresence>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {active === 2 && (
            <AnimatePresence>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "20px",
                  padding: "30px 0",
                }}
              >
                {saleProducts.map(renderProduct)}
              </Box>
            </AnimatePresence>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
};

export default BestProducts;
