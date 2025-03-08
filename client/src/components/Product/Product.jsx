import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography, TextField } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../Home/components/Header";
import SubLanding from "../SubLanding";
import Footer from "../Home/components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom } from "swiper/modules";

import "swiper/css/thumbs";
import "swiper/css";
import "swiper/css/zoom";
import "swiper/css/navigation";
import "./product.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  //   const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/get/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    // const fetchRecommendedProducts = async () => {
    //   try {
    //     const response = await axios.get(
    //       "/products/recommended"
    //     );
    //     setRecommendedProducts(response.data.data);
    //   } catch (error) {
    //     console.error("Error fetching recommended products:", error);
    //   }
    // };

    fetchProduct();
    // fetchRecommendedProducts();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post("/cart", {
        productId: product._id,
        quantity,
      });
      alert("Product added to cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post("/wishlist", {
        productId: product._id,
      });
      alert("Product added to wishlist");
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {" "}
      <Header />{" "}
      <SubLanding image={product.images[0].secure_url} Name={product.Name} />
      <Container>
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "25px",
              padding: "20px 0",
              flexDirection: {
                sm: "column",
                xs: "column",
                md: "column",
                lg: "row",
              },
            }}
          >
            <Box
              sx={{
                flex: 1,
                marginRight: { md: "20px" },
                width: {
                  xs: "80%",
                  sm: "70%",
                  md: "50%",
                  lg: "50%",
                },
                "@media (max-width : 450px)": {
                  width: "100%",
                },
              }}
            >
              <Swiper
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1",
                  "--swiper-navigation-color": "#2a9d8f",
                  "--swiper-pagination-color": "#2a9d8f",
                }}
                spaceBetween={10}
                navigation={true}
                zoom={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs, Zoom]}
                className="mySwiper2"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      border: "1px solid #2a9d8f",
                      borderRadius: "10px",
                    }}
                  >
                    <div className="swiper-zoom-container">
                      <img
                        src={image.secure_url}
                        alt={product.name}
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                style={{
                  marginTop: "10px",
                  border: "1px solid #2a9d8f",
                  borderRadius: "10px",
                  height: "fit-content",
                }}
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                className="mySwiper"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.secure_url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: 1,
                        borderRadius: "10px",
                        objectFit: "contain",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
            <Box
              sx={{
                flex: 1,

                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "100%",
                  lg: "50%",
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  marginBottom: "20px",
                  fontFamily: "var(--font-headding2)",
                  fontWeight: "700",
                  fontSize: "40px",
                  color: "#2a9d8f",
                }}
              >
                {product.Name}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  marginBottom: "10px",
                  fontFamily: "var(--font-headding2)",
                  fontWeight: "600",
                  fontSize: "30px",
                  color: "#2a9d8f",
                }}
              >
                Price:{" "}
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "20px",
                    color: "#000000",
                    fontFamily: "var(--font-paragraph)",
                    textDecoration: product.sale ? "line-through" : "none",
                  }}
                >
                  EGP{product.price}
                  {product.sale && (
                    <span> - ${product.price - product.sale}</span>
                  )}
                </span>
                {product.sale && <span>Sale: ${product.sale}</span>}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: "20px" }}>
                {product.shortDescription}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  sx={{
                    width: "130px",
                    marginRight: "20px",
                    "@media(max-width:480px)": {
                      marginBottom: "20px",
                      width: "100%",
                      marginRight: "0px",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToWishlist}
                  sx={{
                    flex: 1,
                    height: "56px",
                  }}
                  startIcon={<FontAwesomeIcon icon={faHeart} />}
                >
                  Add to Wishlist
                </Button>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                startIcon={<FontAwesomeIcon icon={faCartShopping} />}
                sx={{ marginBottom: "20px", width: "100%", height: "56px" }}
              >
                Add to Cart
              </Button>
              {product.tryOn && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginBottom: "20px", width: "100%", height: "56px" }}
                >
                  Try On
                </Button>
              )}
              <Typography
                variant="body1"
                sx={{
                  marginBottom: "10px",
                  fontFamily: "var(--font-headding2)",
                  fontWeight: "600",
                  fontSize: "30px",
                  color: "#2a9d8f",
                }}
              >
                Estimated Delivery:
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    color: "#000000",
                    fontFamily: "var(--font-paragraph)",
                  }}
                >
                  SKLAFHJLJSDAOIYFGH
                  {product.estimatedDelivery}
                </span>
              </Typography>
              <Typography
                sx={{
                  marginBottom: "10px",
                  fontFamily: "var(--font-headding2)",
                  fontWeight: "600",
                  fontSize: "30px",
                  color: "#2a9d8f",
                }}
                variant="body1"
              >
                Return Policy:
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    color: "#000000",
                    fontFamily: "var(--font-paragraph)",
                  }}
                >
                  {" "}
                  OIFEDHLKGJO
                </span>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ padding: "20px 0" }}>
            <Typography
              variant="h4"
              sx={{
                marginBottom: "20px",
                fontFamily: "var(--font-headding2)",
                fontWeight: "700",
                fontSize: "40px",
                color: "#2a9d8f",
              }}
            >
              Description
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "20px",
                fontFamily: "var(--font-paragraph)",
                fontWeight: "600",
                fontSize: "20px",
                color: "#000000",
                lineHeight: "1.5",
                maxWidth: "750px",
                "@media(max-width: 600px)": {
                  maxWidth: "100%",
                },
              }}
            >
              {product.description}
            </Typography>
          </Box>
          <Box sx={{ padding: "20px 0" }}>
            <Typography
              variant="h4"
              sx={{
                marginBottom: "20px",
                fontFamily: "var(--font-headding2)",
                fontWeight: "700",
                fontSize: "40px",
                color: "#2a9d8f",
              }}
            >
              You Might Like
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {/* {recommendedProducts.map((recommendedProduct) => (
                <Box
                  key={recommendedProduct.id}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px",
                    width: "200px",
                  }}
                >
                  <img
                    src={recommendedProduct.image}
                    alt={recommendedProduct.name}
                    style={{ width: "100%", height: "150px" }}
                  />
                  <Typography variant="h6">
                    {recommendedProduct.name}
                  </Typography>
                  <Typography variant="body1">
                    Price: ${recommendedProduct.price}
                  </Typography>
                </Box>
              ))} */}
            </Box>
          </Box>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default Product;
