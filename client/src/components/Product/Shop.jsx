/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Pagination,
} from "@mui/material";
import axios from "axios";
import Header from "../Home/components/Header";
import SubLanding from "../SubLanding";
import Footer from "../Home/components/Footer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./shop.css";
import Stack from "@mui/material/Stack";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(true);
  const Categoryy = useParams().categoryId;
  const Brandd = useParams().brandId;
  const token = useSelector((state) => state.auth.token);

  const user = useSelector((state) => state.auth.loggedIn);
  const admin = useSelector((state) => state.auth.isAdmin);
  const Udetails = useSelector((state) => state.auth.user);

  const handleShowClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleCartClick = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/user/addTocart/${id}`,
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
        `http://localhost:3001/user/addtoWishList/${id}`,
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
  useEffect(() => {
    async function fetchCategory(Category) {
      try {
        const response = await axios.get(
          `/category/getProductsInCategory/${Category}`
        );
        console.log(response.data.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    async function fetchBrand(brand) {
      try {
        const response = await axios.get(
          `/product/getProductsByBrand/${brand}`
        );

        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    if (Categoryy) {
      setPage(1);
      fetchCategory(Categoryy);
    }
    if (Brandd) {
      setPage(1);
      fetchBrand(Brandd);
    }
  }, []);
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, colorsRes, brandsRes] = await Promise.all([
          axios.get("http://localhost:3001/category/getAll"),
          axios.get("http://localhost:3001/product/getAllcolor"),
          axios.get("http://localhost:3001/Brands"),
        ]);
        setCategories(categoriesRes.data);
        setColors(colorsRes.data.data);
        setBrands(brandsRes.data.data);

        // setTags(tagsRes.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/product/getAll`
        );
        setProducts(response.data.data);
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchFilters();
    if (!Categoryy && !Brandd) {
      fetchProducts();
    }
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const displayedProducts = products.slice((page - 1) * 12, page * 12);

  const handleCategory = async (category) => {
    setOpen(false);
    // fetchProducts(category);
    await axios
      .get(`/category/getProductsInCategory/${category._id}`)
      .then((response) => {
        setProducts(response.data);
      });
  };
  const handleColors = async (color) => {
    setOpen(false);
    // fetchProducts(category);
    await axios.get(`/product/getProductsByColor/${color}`).then((response) => {
      console.log(response.data.data);
      setProducts(response.data.data);
    });
  };
  const handleBrand = async (brand) => {
    // setOpen(false);
    // fetchProducts(category);
    await axios
      .get(`/product/getProductsByBrand/${brand.name}`)
      .then((response) => {
        console.log(response.data.data);
        setProducts(response.data.data);
      });
  };

  const renderProduct = (product, i) => {
    return (
      <div
        style={{
          width: "240px",
          borderRadius: "5px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid #2a9d8f",
          display: "flex",
          flexDirection: "column",
        }}
        key={product._id}
        // onClick={() => handleProductClick(product._id)}
      >
        {product.images.length > 0 ? (
          <img
            src={product.images[0].secure_url}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div>
            <div
              style={{
                width: "180px",
                height: "180px",
                backgroundColor: "#ddd",
              }}
            ></div>
          </div>
        )}
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
      </div>
    );
  };
  return (
    <>
      <Header user={user} admin={admin} Udetails={Udetails} />
      <SubLanding image={"/shop.jpg"} Name={"Shop"} />
      <Container>
        <Button
          onClick={() => setOpen(!open)}
          variant="contained"
          sx={{
            fontFamily: "var(--font-paragraph2)",
            color: "#000000",
            border: "1px solid #2a9d8f",
            backgroundColor: "#2a9d8f",
            marginTop: "10px",
            marginLeft: "10px",
            width: "fit-content",
          }}
          startIcon={<FilterListIcon />}
        >
          Filter
        </Button>
        <Box sx={{ display: "flex", padding: "20px 0" }}>
          <Box
            sx={{
              width: open ? "210px" : "0px",
              marginRight: "20px",
              overflow: "hidden",
              transition: "0.3s ",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: "10px",
                fontFamily: "var(--font-headding2)",
                fontWeight: "700",
                fontSize: "30px",
                color: "#2a9d8f",
              }}
            >
              Categories
            </Typography>
            {categories.map((category) => (
              <Button
                onClick={() => handleCategory(category)}
                key={category._id}
                variant="outlined"
                sx={{
                  fontFamily: "var(--font-paragraph2)",
                  color: "#000000",
                  border: "1px solid #2a9d8f",
                  marginBottom: "10px",
                  marginLeft: "10px",
                  width: "fit-content",
                }}
              >
                {category.name}
              </Button>
            ))}
            <Typography
              variant="h6"
              sx={{
                marginBottom: "10px",
                marginTop: "20px",
                fontFamily: "var(--font-headding2)",
                fontWeight: "700",
                fontSize: "30px",
                color: "#2a9d8f",
              }}
            >
              Colors
            </Typography>
            {colors.map((color) => (
              <Button
                onClick={() => handleColors(color)}
                key={color._id}
                variant="outlined"
                sx={{
                  fontFamily: "var(--font-paragraph2)",
                  marginBottom: "10px",
                  marginLeft: "10px",
                  width: "fit-content",
                  color: "#000000",
                  border: "1px solid #2a9d8f",
                }}
              >
                {color}
              </Button>
            ))}

            <Typography
              variant="h6"
              sx={{
                marginBottom: "10px",
                fontFamily: "var(--font-headding2)",
                fontWeight: "700",
                fontSize: "30px",
                color: "#2a9d8f",
                marginTop: "20px",
              }}
            >
              Brands
            </Typography>
            {brands.map((brand) => (
              <Button
                key={brand._id}
                onClick={() => handleBrand(brand)}
                variant="outlined"
                sx={{
                  marginBottom: "10px",
                  marginLeft: "10px",
                  width: "fit-content",
                  fontFamily: "var(--font-paragraph2)",
                  color: "#000000",
                  border: "1px solid #2a9d8f",
                }}
              >
                {brand.name}
              </Button>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 4,
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: "20px",
              padding: "30px 0",
              //   justifyContent: "center",
              alignItems: "center",
            }}
          >
            {displayedProducts.map(renderProduct)}
            <Stack
              spacing={2}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginTop: "20px",
                marginBottom: "20px",
                justifyContent: "center",
              }}
            >
              <Pagination
                count={Math.ceil(products.length / 12)}
                page={page}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Shop;
