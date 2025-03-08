import { useEffect, useState } from "react";
import { Box, Button, Container, Typography, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Home/components/Header";
import SubLanding from "../SubLanding";
import Footer from "../Home/components/Footer";
import { useSelector } from "react-redux";
import "./Cart.css";
const Cart = () => {
  const [cartt, setCart] = useState({ products: [], totalPrice: 0 });
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.loggedIn);
  const admin = useSelector((state) => state.auth.isAdmin);
  const Udetails = useSelector((state) => state.auth.user);
  console.log(token);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:3001/user/getCart");
        setCart(response.data.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    // const fetchRecommendedProducts = async () => {
    //   try {
    //     const response = await axios.get(
    //       "http://localhost:3001/products/recommended"
    //     );
    //     setRecommendedProducts(response.data.data);
    //   } catch (error) {
    //     console.error("Error fetching recommended products:", error);
    //   }
    // };

    fetchCart();
    // fetchRecommendedProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      await axios.post(
        `http://localhost:3001/user/deleteFromCart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await axios.get("http://localhost:3001/user/getCart");
      setCart(response.data.data);
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setCart((prevCart) => {
      const updatedProducts = prevCart.products.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      return { ...prevCart, products: updatedProducts };
    });
  };
  const MoveToWishList = async (productId, quantity) => {
    await axios
      .post(
        `http://localhost:3001/user/addToWishList/${productId}`,
        {
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async () => {
        handleDelete(productId);
      });
  };
  const handleUpdate = async (productId, quantity) => {
    console.log(productId, quantity);
    try {
      await axios.patch(
        `http://localhost:3001/user/editCart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await axios.get("http://localhost:3001/user/getCart");
      setCart(response.data.data);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleContinue = () => {
    navigate("/place-order");
  };

  return (
    <>
      <Header user={user} admin={admin} Udetails={Udetails} />
      <SubLanding image={"/cart.jpg"} Name={"Your Cart"} />
      <Container>
        <Box sx={{ padding: "20px 0" }}>
          <Typography
            variant="h4"
            sx={{
              marginBottom: "20px",
              fontFamily: "var(--font-headding2)",
              fontWeight: "700",
              fontSize: "35px",
              color: "#2a9d8f",
            }}
          >
            My Cart
          </Typography>
          {cartt.products.map((item) => (
            <Box
              key={item._id}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                "@media (max-width: 900px)": {
                  flexDirection: "column",
                  alignItems: "Center",
                  textAlign: "center",
                },
              }}
            >
              <img
                src={item.imageLink}
                alt={item.Name}
                className="product-imagee"
              />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  "@media (max-width: 900px)": {
                    flexDirection: "column",
                    alignItems: "Center",
                    textAlign: "center",
                    gap: "10px",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "black",
                    fontWeight: "600",
                    fontSize: "20px",
                    fontFamily: "var(--font-paragraph)",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#2a9d8f",
                      fontSize: "22px",
                      marginRight: "   10px",
                      fontFamily: "var(--font-headding2)",
                    }}
                  >
                    Name:
                  </span>
                  {item.Name}
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "600",
                    fontSize: "20px",
                    fontFamily: "var(--font-paragraph)",
                  }}
                  variant="body1"
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#2a9d8f",
                      fontSize: "22px",
                      marginRight: "   10px",
                      fontFamily: "var(--font-headding2)",
                    }}
                  >
                    Price:
                  </span>
                  EGP {item.price}
                </Typography>
                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.productId,
                      parseInt(e.target.value)
                    )
                  }
                  sx={{
                    width: "100px",
                    marginRight: "20px",
                    "@media (max-width: 900px)": {
                      width: "100%",
                      marginTop: "10px",
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: "black",
                    fontWeight: "600",
                    fontSize: "20px",
                    fontFamily: "var(--font-paragraph)",
                  }}
                  variant="body1"
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#2a9d8f",
                      fontSize: "22px",
                      marginRight: "   10px",
                      fontFamily: "var(--font-headding2)",
                    }}
                  >
                    Total:
                  </span>
                  ${item.price * item.quantity}
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "15px",
                  }}
                >
                  <Button
                    sx={{
                      marginBottom: "10px",
                      fontSize: "15px",
                      fontWeight: "700",
                      borderColor: "#2a9d8f",
                      color: "#2a9d8f",
                      fontFamily: "var(--font-headding2)",
                      "@media (max-width: 900px)": {
                        width: "100%",
                        marginTop: "10px",
                      },
                    }}
                    variant="outlined"
                    color="primary"
                    onClick={() => handleUpdate(item.productId, item.quantity)}
                  >
                    Update
                  </Button>
                  <Button
                    sx={{
                      marginBottom: "10px",
                      fontSize: "15px",
                      fontWeight: "700",
                      borderColor: "#2a9d8f",
                      color: "#2a9d8f",
                      fontFamily: "var(--font-headding2)",
                      "@media (max-width: 900px)": {
                        width: "100%",
                        marginTop: "10px",
                      },
                    }}
                    variant="outlined"
                    color="primary"
                    onClick={() =>
                      MoveToWishList(item.productId, item.quantity)
                    }
                  >
                    Move to Wishlist
                  </Button>
                  <Button
                    onClick={() => {
                      handleDelete(item.productId);
                    }}
                    sx={{
                      marginBottom: "10px",
                      fontSize: "15px",
                      fontFamily: "var(--font-headding2)",
                      "@media (max-width: 900px)": {
                        width: "100%",
                        marginTop: "10px",
                      },
                    }}
                    variant="contained"
                    color="error"
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              "@media (max-width: 900px)": {
                flexDirection: "column-reverse",
              },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                marginBottom: "10px",
                fontSize: "18px",
                fontWeight: "700",
                backgroundColor: "#2a9d8f",
                color: "black",
                fontFamily: "var(--font-headding2)",
                "@media (max-width: 900px)": {
                  width: "100%",

                  marginTop: "10px",
                },
              }}
              onClick={handleContinue}
            >
              proceed to checkout
            </Button>
            <Typography
              sx={{
                color: "black",
                fontWeight: "600",
                fontSize: "20px",
                fontFamily: "var(--font-paragraph)",
              }}
            >
              <span
                style={{
                  fontWeight: "600",
                  color: "#2a9d8f",
                  fontSize: "22px",
                  marginRight: "   10px",
                  fontFamily: "var(--font-headding2)",
                }}
              >
                Sub Total Price:
              </span>
              ${cartt.totalPrice}
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
              fontSize: "35px",
              color: "#2a9d8f",
            }}
          >
            You Might Like
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {recommendedProducts.map((product) => (
              <Box
                key={product.id}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "10px",
                  width: "200px",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "150px" }}
                />
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1">Price: ${product.price}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
