import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../Home/components/Header";
import { useSelector } from "react-redux";
import SubLanding from "../SubLanding";
import {
  Box,
  Button,
  Container,
  FormControl,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import axios from "axios";
const ProceedToCheckOut = () => {
  const [cartt, setCart] = useState({ products: [], totalPrice: 0 });
  const [adresses, setAddresses] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [ShippingPrice, setShippingPrice] = useState(0);
  const [cashPrice, setCashPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [error, setError] = useState(null);
  const [adress, setAddress] = useState(null);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/user/getCart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    const fetchAdresses = async () => {
      try {
        const response = await axios.get("/user/getAllAdressForMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddresses(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
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

    fetchCart();
    fetchAdresses();
  }, [token]);

  const user = useSelector((state) => state.auth.user);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const LoggedIn = useSelector((state) => state.auth.loggedIn);

  const initialValues = {
    address: "",
    paymentMethod: "",
  };

  const validationSchema = Yup.object({
    address: Yup.string().required("Address is required"),
    paymentMethod: Yup.string().required("Payment method is required"),
  });

  const handleOrderConfirmation = async (values, { isSubmitting }) => {
    await axios
      .post(
        "/order/createOrder",
        {
          paymentMethod: values.paymentMethod,
          deliveryAddressID: values.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        alert("Order placed successfully!");
        isSubmitting(false);
      });
  };

  return (
    <div>
      <Header admin={isAdmin} user={LoggedIn} Udetails={user} />
      <SubLanding Name={"Plcae Order"} />
      <Container>
        <Box
          sx={{
            marginTop: "20px",
            marginBottom: "20px",

            borderBottom: "1px solid #2a9d8f",
          }}
        >
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
            Your Order Details
          </Typography>
          <Box sx={{}}>
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
                  className="product-imageee"
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
                      Quantity:
                    </span>
                    {item.quantity}
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
                      Total:
                    </span>
                    ${item.price * item.quantity}
                  </Typography>
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
        </Box>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleOrderConfirmation}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            console.log(values);
            return (
              <Form>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                    borderBottom: "1px solid #2a9d8f",
                    gap: "20px",
                    "@media (max-width: 900px)": {
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    },
                  }}
                >
                  <FormControl
                    sx={{
                      width: "100%",
                    }}
                  >
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
                      Choose Your Delivery Address
                    </Typography>
                    <RadioGroup overlay name="adress" sx={{ gap: 2 }}>
                      {adresses && (
                        <>
                          {adresses.map((add, i) => (
                            <Box
                              onClick={async () => {
                                setFieldValue("address", add._id);
                                await axios
                                  .get("/shipping/getShippingPrice/" + add.city)
                                  .then((res) => {
                                    console.log(res.data.data);
                                    setShippingPrice(
                                      res.data.data.shippingPrice
                                    );
                                  });
                              }}
                              sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                "@media (max-width:500px)": {
                                  flexDirection: "column",
                                },
                                gap: "10px",
                                mb: 2,
                                fontSize: "14px",
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "10px",
                                background: "white",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                transition: "background 0.3s ease-in-out",
                                "&:hover": {
                                  background: "#f5f5f5",
                                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                                },
                              }}
                              key={i}
                            >
                              <Radio
                                checked={values.address === add._id}
                                sx={{
                                  color: "#2a9d8f !important",
                                }}
                                name="address"
                                value={add._id}
                                variant="soft"
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 2,
                                  width: "100%",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  color: "#636363",
                                  lineHeight: "24px",
                                  textTransform: "capitalize",
                                  textDecoration: "none",
                                  cursor: "pointer",
                                  transition: "color 0.3s ease-in-out",
                                  "&:hover": {
                                    color: "#2a9d8f",
                                  },
                                }}
                              >
                                <Typography
                                  level="body-sm"
                                  sx={{
                                    width: "320px",
                                    "@media(max-width:1200px)": {
                                      width: "30%",
                                    },
                                    "@media(max-width:950px)": {
                                      width: "40%",
                                    },
                                    "@media(max-width:680px)": {
                                      width: "100%",
                                    },

                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",

                                    mt: 1,
                                    fontFamily: "var(--font-headding2)",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textTransform: "capitalize",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "color 0.3s ease-in-out",
                                    color: "#2a9d8f",
                                    "&:hover": {},
                                  }}
                                >
                                  Name:
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "black",
                                      fontSize: "14px",
                                      marginLeft: "10px",
                                      fontFamily: "var(--font-paragraph)",
                                    }}
                                  >
                                    {add.fullName}
                                  </span>
                                </Typography>
                                <Typography
                                  level="body-sm"
                                  sx={{
                                    mt: 1,
                                    width: "320px",
                                    "@media(max-width:1200px)": {
                                      width: "30%",
                                    },
                                    "@media(max-width:950px)": {
                                      width: "40%",
                                    },
                                    "@media(max-width:680px)": {
                                      width: "100%",
                                    },

                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",

                                    fontFamily: "var(--font-headding2)",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textTransform: "capitalize",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "color 0.3s ease-in-out",
                                    color: "#2a9d8f",
                                    "&:hover": {},
                                  }}
                                >
                                  City:
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "black",
                                      fontSize: "14px",
                                      marginLeft: "10px",
                                      fontFamily: "var(--font-paragraph)",
                                    }}
                                  >
                                    {add.city}
                                  </span>
                                </Typography>
                                <Typography
                                  level="body-sm"
                                  sx={{
                                    width: "320px",
                                    "@media(max-width:1200px)": {
                                      width: "30%",
                                    },
                                    "@media(max-width:950px)": {
                                      width: "40%",
                                    },
                                    "@media(max-width:680px)": {
                                      width: "100%",
                                    },

                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",

                                    mt: 1,
                                    fontFamily: "var(--font-headding2)",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textTransform: "capitalize",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "color 0.3s ease-in-out",
                                    color: "#2a9d8f",
                                    "&:hover": {},
                                  }}
                                >
                                  State:
                                  <Typography
                                    style={{
                                      fontWeight: "600",
                                      color: "black",
                                      fontSize: "14px",
                                      marginLeft: "10px",
                                      fontFamily: "var(--font-paragraph)",
                                    }}
                                  >
                                    {add.state}
                                  </Typography>
                                </Typography>
                                <Typography
                                  level="body-sm"
                                  sx={{
                                    mt: 1,
                                    width: "320px",
                                    "@media(max-width:1200px)": {
                                      width: "30%",
                                    },
                                    "@media(max-width:950px)": {
                                      width: "40%",
                                    },
                                    "@media(max-width:680px)": {
                                      width: "100%",
                                    },

                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",

                                    fontFamily: "var(--font-headding2)",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textTransform: "capitalize",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "color 0.3s ease-in-out",
                                    color: "#2a9d8f",
                                    "&:hover": {},
                                  }}
                                >
                                  Street:
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "black",
                                      fontSize: "14px",
                                      marginLeft: "10px",
                                      fontFamily: "var(--font-paragraph)",
                                    }}
                                  >
                                    {add.streetName}
                                  </span>
                                </Typography>
                                <Typography
                                  level="body-sm"
                                  sx={{
                                    mt: 1,
                                    width: "320px",
                                    "@media(max-width:1200px)": {
                                      width: "30%",
                                    },
                                    "@media(max-width:950px)": {
                                      width: "40%",
                                    },
                                    "@media(max-width:680px)": {
                                      width: "100%",
                                    },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontFamily: "var(--font-headding2)",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textTransform: "capitalize",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "color 0.3s ease-in-out",
                                    color: "#2a9d8f",
                                  }}
                                >
                                  fullAddress:
                                  <Typography
                                    style={{
                                      fontWeight: "600",
                                      color: "black",
                                      width: "100%",
                                      fontSize: "14px",
                                      marginLeft: "10px",
                                      fontFamily: "var(--font-paragraph)",
                                    }}
                                  >
                                    {add.fullAddress}
                                  </Typography>
                                </Typography>
                                <Typography
                                  level="body-sm"
                                  sx={{
                                    width: "320px",
                                    "@media(max-width:1200px)": {
                                      width: "30%",
                                    },
                                    "@media(max-width:950px)": {
                                      width: "40%",
                                    },
                                    "@media(max-width:680px)": {
                                      width: "100%",
                                    },
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mt: 1,
                                    fontFamily: "var(--font-headding2)",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textTransform: "capitalize",
                                    textDecoration: "none",
                                    cursor: "pointer",
                                    transition: "color 0.3s ease-in-out",
                                    color: "#2a9d8f",
                                    "&:hover": {},
                                  }}
                                >
                                  phone Number:
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "black",
                                      fontSize: "14px",
                                      marginLeft: "10px",
                                      fontFamily: "var(--font-paragraph)",
                                    }}
                                  >
                                    {add.phoneNumber}
                                  </span>
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#2a9d8f",
                      border: "1px solid #2a9d8f",
                      fontWeight: "700",
                      fontSize: "16px",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      fontFamily: "var(--font-headding2)",
                      "&:hover": { backgroundColor: "#25776d", color: "white" },
                    }}
                    onClick={() => {}}
                  >
                    Create New Address
                  </Button>

                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error-text"
                  />
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                    borderBottom: "1px solid #2a9d8f",
                    gap: "20px",
                    "@media (max-width: 900px)": {
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    },
                  }}
                >
                  <FormControl
                    sx={{
                      width: "100%",
                    }}
                  >
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
                      Choose Your payment method
                    </Typography>
                    <RadioGroup overlay name="payment" sx={{ gap: 2 }}>
                      {[
                        {
                          name: "instapay",
                          price: 0,
                        },
                        {
                          name: "Cash on delivery",
                          price: 10,
                        },
                        {
                          name: "Vodafone Cash",
                          price: 0,
                        },
                      ].map((add, i) => (
                        <Box
                          onClick={async () => {
                            setFieldValue("paymentMethod", add.name);
                            setCashPrice(add.price);
                          }}
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            mb: 2,
                            fontSize: "14px",
                            cursor: "pointer",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                            background: "white",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            transition: "background 0.3s ease-in-out",
                            "&:hover": {
                              background: "#f5f5f5",
                              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                            },
                          }}
                          key={i}
                        >
                          <Radio
                            checked={values.paymentMethod === add.name}
                            sx={{
                              color: "#2a9d8f !important",
                            }}
                            name="payment"
                            value={add.name}
                            variant="soft"
                          />
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              width: "100%",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#636363",
                              lineHeight: "24px",
                              textTransform: "capitalize",
                              textDecoration: "none",
                              cursor: "pointer",
                              transition: "color 0.3s ease-in-out",
                              "&:hover": {
                                color: "#2a9d8f",
                              },
                            }}
                          >
                            <Typography
                              level="body-sm"
                              sx={{
                                mt: 1,
                                fontFamily: "var(--font-headding2)",
                                fontWeight: "700",
                                fontSize: "18px",
                                maxWidth: "300px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                textTransform: "capitalize",
                                textDecoration: "none",
                                cursor: "pointer",
                                transition: "color 0.3s ease-in-out",
                                color: "#2a9d8f",
                              }}
                            >
                              payment method:
                            </Typography>
                            <span
                              style={{
                                fontWeight: "600",
                                color: "black",
                                fontSize: "14px",
                                marginLeft: "10px",
                                fontFamily: "var(--font-paragraph)",
                              }}
                            >
                              {add.name}
                            </span>
                          </Box>
                        </Box>
                      ))}
                    </RadioGroup>
                    <ErrorMessage
                      name="paymentMethod"
                      component="div"
                      className="error-text"
                    />
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                    borderBottom: "1px solid #2a9d8f",
                    gap: "20px",
                    "@media (max-width: 900px)": {
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      width: "100%",
                      marginBottom: "20px",
                      fontFamily: "var(--font-headding2)",
                      fontWeight: "700",
                      fontSize: "35px",
                      color: "#2a9d8f",
                    }}
                  >
                    Total
                  </Typography>

                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "700",
                        fontSize: "25px",
                        color: "#2a9d8f",
                        fontFamily: "var(--font-headding2)",
                      }}
                    >
                      Subtotal:
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "14px",
                        marginLeft: "10px",
                        fontFamily: "var(--font-paragraph)",
                      }}
                      level="body-sm"
                    >
                      EGP {cartt.totalPrice}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "700",
                        fontSize: "25px",
                        color: "#2a9d8f",
                        fontFamily: "var(--font-headding2)",
                      }}
                      level="body-sm"
                    >
                      Shipping Price:
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "14px",
                        marginLeft: "10px",
                        fontFamily: "var(--font-paragraph)",
                      }}
                      level="body-sm"
                    >
                      {" "}
                      EGP {ShippingPrice}
                    </Typography>
                  </Box>
                  {cashPrice > 0 && (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        position: "relative",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "700",
                          fontSize: "25px",
                          color: "#2a9d8f",
                          fontFamily: "var(--font-headding2)",
                        }}
                        level="body-sm"
                      >
                        cash on delivery:
                      </Typography>
                      <Typography
                        style={{
                          fontWeight: "600",
                          color: "black",
                          fontSize: "14px",
                          marginLeft: "10px",
                          fontFamily: "var(--font-paragraph)",
                        }}
                        level="body-sm"
                      >
                        EGP {cashPrice}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                      gap: "10px",
                      flexWrap: "wrap",

                      "&::after": {
                        content: "''",
                        position: "absolute",
                        top: "-15px",
                        left: 0,
                        width: "250px",
                        height: "1px",
                        background: "#000000",
                        borderRadius: "5px",
                        opacity: 0.3,
                        transition: "opacity 0.3s ease-in-out",
                      },

                      "&::before": {
                        content: "''",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "#2a9d8f",
                        borderRadius: "5px",
                        opacity: 0.3,
                        transition: "opacity 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        width: "130px",
                        fontWeight: "700",
                        fontSize: "25px",
                        color: "#2a9d8f",
                        fontFamily: "var(--font-headding2)",
                      }}
                      level="body-sm"
                    >
                      Total:
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "14px",
                        marginLeft: "10px",
                        fontFamily: "var(--font-paragraph)",
                      }}
                    >
                      EGP {cartt.totalPrice + ShippingPrice + cashPrice}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  sx={{
                    width: "250px",
                    height: "60px",
                    backgroundColor: "#2a9d8f",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "700",
                    fontFamily: "var(--font-headding2)",
                    cursor: "pointer",
                    transition: "background 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "#25776d",
                    },
                    marginBottom: "20px",
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Confirm Order
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </div>
  );
};

export default ProceedToCheckOut;
