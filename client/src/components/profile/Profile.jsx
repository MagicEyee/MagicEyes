import {
  Box,
  Button,
  Typography,
  Link,
  TextField,
  Container,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Home/components/Header";
import SubLanding from "../SubLanding";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import Footer from "../Home/components/Footer";
function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [adressData, setadressData] = useState({});
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState({});
  const navigate = useNavigate();
  const List = ["My Orders", "My Addresses"];
  const [active, setActive] = useState(0);
  const user = useSelector((state) => state.auth.loggedIn);
  const admin = useSelector((state) => state.auth.isAdmin);
  const Udetails = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const getAddress = async (id) => {
    try {
      const response = await axios.get("/adress/getAdress/" + id);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!Udetails) {
      navigate("/login");
    }
    if (Udetails) {
      setUserDetails(Udetails);
    }
  }, [Udetails, navigate]);

  useEffect(() => {
    const fetchOrdersAndAddresses = async () => {
      try {
        const ordersResponse = await axios.get("/order/getAllOredrsForMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const ordersData = ordersResponse.data.data;

        const addressesData = {};
        const allAdresses = await axios.get("/user/getAllAdressForMe", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        for (const order of ordersData) {
          const address = await getAddress(order.deliveryAddressID);
          addressesData[order.deliveryAddressID] = address;
        }

        setOrders(ordersData);
        setAddresses(allAdresses.data.data);
        setadressData(addressesData);
      } catch (error) {
        console.error("Error fetching orders and addresses:", error);
      }
    };

    fetchOrdersAndAddresses();
  }, []);

  const handleLogout = () => {
    // Handle logout logic
    axios.post("/api/user/logout").then(() => {
      navigate("/login");
    });
  };

  return (
    <Box>
      <Header user={user} admin={admin} Udetails={Udetails} />
      <SubLanding image={"./Profile.jpg"} Name={"Your Account"} />
      <Container>
        <Box sx={{ padding: "20px" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              padding: "10px",
              border: "1px solid #2a9d8f",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: "20px",
                color: "#2a9d8f",
                fontWeight: "600",
                fontSize: "30px",
                fontFamily: "var(--font-headding2)",
              }}
            >
              Personal Data
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <TextField
                className="profileDetail"
                label="First Name"
                value={userDetails.firstName}
                disabled={true}
              />
              <TextField
                className="profileDetail"
                label="Last Name"
                value={userDetails.lastName}
                disabled={true}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <TextField
                className="profileDetail"
                label="User Name"
                value={userDetails.username}
                disabled={true}
              />
              <TextField
                className="profileDetail"
                label="Phone Number"
                value={userDetails.phoneNumber}
                disabled={true}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <TextField
                sx={{
                  width: "100%",
                }}
                label="Email"
                className="profileDetail"
                value={userDetails.email}
                disabled={true}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                sx={{
                  minWidth: "120px",
                  padding: "10px 25px",
                  "@media (max-width:350px)": {
                    width: "100%",
                  },
                }}
              >
                Log Out
              </Button>
              <Button
                variant="contained"
                disabled={true}
                color="error"
                onClick={handleLogout}
                sx={{
                  minWidth: "120px",
                  padding: "10px 25px",
                  "@media (max-width:350px)": {
                    width: "100%",
                  },
                }}
              >
                Edit
              </Button>
            </Box>
          </Box>

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

          <Box>
            {active === 0 && (
              <>
                {orders.map((order) => (
                  <Box
                    key={order._id}
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      padding: "10px",
                      marginBottom: "10px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        marginBottom: "10px",
                        color: "#2a9d8f",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                    >
                      Order Tracking Number:
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {order.trackingNumber}
                        <IconButton
                          sx={{
                            marginLeft: "7px",
                            cursor: "pointer",
                            color: "#2a9d8f",
                            // fontSize: "13px",
                            fontFamily: "var(--font-paragraph2)",
                            textDecoration: "underline",
                            transition: "color 0.3s ease",
                            "&:hover": {
                              color: "#212121",
                            },
                          }}
                          color="#2a9d8f"
                          aria-label="copy to clipboard"
                          onClick={() => {
                            navigator.clipboard.writeText(order.trackingNumber);
                          }}
                        >
                          <FontAwesomeIcon icon={faClipboard} />
                        </IconButton>
                      </Typography>
                    </Typography>
                    <hr />
                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",

                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        color: "#2a9d8f",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      Order Status:
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {order.status}
                      </Typography>
                    </Typography>
                    <hr />

                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",

                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        color: "#2a9d8f",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      Shipping To:
                      {adressData[order.deliveryAddressID] ? (
                        <Typography
                          sx={{
                            color: "black",
                            fontWeight: "500",
                            fontSize: "13px",
                            fontFamily: "var(--font-paragraph2)",
                          }}
                        >{` ${
                          adressData[order.deliveryAddressID].fullName
                        }`}</Typography>
                      ) : (
                        "Loading..."
                      )}
                    </Typography>
                    <hr />

                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",

                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        color: "#2a9d8f",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      Order Date:
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {new Date(order.createdAt).toLocaleString()}
                      </Typography>
                    </Typography>
                    <hr />

                    {order.instapay.paymentStatus !== "NoInstaPay" ? (
                      <>
                        <Typography
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",

                            gap: "10px",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginBottom: "10px",
                            color: "#2a9d8f",
                            fontWeight: "600",
                            fontSize: "20px",
                            fontFamily: "var(--font-headding2)",
                          }}
                          variant="body1"
                        >
                          Payment Status:
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "500",
                              fontSize: "13px",
                              fontFamily: "var(--font-paragraph2)",
                            }}
                          >
                            {order.instapay.paymentStatus}
                          </Typography>
                        </Typography>
                        <hr />
                      </>
                    ) : null}

                    {order.products.map((product, i) => (
                      <Box
                        key={i}
                        sx={{
                          marginBottom: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          padding: "10px",
                          backgroundColor: "#f9f9f9",
                          // display: "flex",
                          // justifyContent: "space-between",
                          // alignItems: "center",
                          // gap: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",

                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginBottom: "10px",
                            color: "#2a9d8f",
                            fontWeight: "600",
                            fontSize: "20px",
                            fontFamily: "var(--font-headding2)",
                          }}
                          variant="body1"
                        >
                          Product:
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "500",
                              fontSize: "13px",
                              fontFamily: "var(--font-paragraph2)",
                            }}
                          >
                            {product.Name}
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",

                            gap: "10px",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginBottom: "10px",
                            color: "#2a9d8f",
                            fontWeight: "600",
                            fontSize: "20px",
                            fontFamily: "var(--font-headding2)",
                          }}
                          variant="body1"
                        >
                          Quantity:
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "500",
                              fontSize: "13px",
                              fontFamily: "var(--font-paragraph2)",
                            }}
                          >
                            {product.quantity}
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginBottom: "10px",
                            color: "#2a9d8f",
                            fontWeight: "600",
                            fontSize: "20px",
                            fontFamily: "var(--font-headding2)",
                          }}
                          variant="body1"
                        >
                          Price:
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "500",
                              fontSize: "13px",
                              fontFamily: "var(--font-paragraph2)",
                            }}
                          >
                            ${product.price}{" "}
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginBottom: "10px",
                            color: "#2a9d8f",
                            fontWeight: "600",
                            fontSize: "20px",
                            fontFamily: "var(--font-headding2)",
                          }}
                          variant="body1"
                        >
                          Total For Broduct:
                          <Typography
                            sx={{
                              color: "black",
                              fontWeight: "500",
                              fontSize: "13px",
                              fontFamily: "var(--font-paragraph2)",
                            }}
                          >
                            ${product.totalForProduct}
                          </Typography>
                        </Typography>
                        <Button variant="outlined" color="primary">
                          <Link
                            href={`/product/${product.productId}`}
                            underline="none"
                            sx={{
                              fontSize: "14px",
                              fontFamily: "var(--font-headding2)",
                              textDecoration: "underline",
                            }}
                          >
                            View Product
                          </Link>
                        </Button>
                      </Box>
                    ))}
                    <hr />

                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        color: "#2a9d8f",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      Total Price:
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        ${order.totalPrice}
                      </Typography>
                    </Typography>
                    <hr />

                    <Button
                      variant="contained"
                      sx={{
                        marginBottom: "10px",
                        fontSize: "18px",
                        fontWeight: "700",
                        backgroundColor: "#2a9d8f",
                        color: "black",
                        fontFamily: "var(--font-headding2)",
                      }}
                      color="primary"
                    >
                      <Link
                        href={`/order/${order._id}`}
                        underline="none"
                        color="inherit"
                      >
                        View Order Details
                      </Link>
                    </Button>
                  </Box>
                ))}
              </>
            )}
            {active === 1 && (
              <>
                {Object.values(addresses).map((address) => (
                  <Box
                    key={address._id}
                    sx={{
                      border: "1px solid #2a9d8f",
                      borderRadius: "5px",
                      padding: "10px",
                      marginBottom: "10px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        color: "#2a9d8f",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      fullName:{" "}
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {address.fullName}
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        color: "#2a9d8f",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      Street:{" "}
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {address.streetName}
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        color: "#2a9d8f",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      state:{" "}
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {address.state}
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        color: "#2a9d8f",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      City:{" "}
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {" "}
                        {address.city}
                      </Typography>
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        color: "#2a9d8f",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      fullAddress:{" "}
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {address.fullAddress}{" "}
                      </Typography>{" "}
                    </Typography>
                    <Typography
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        color: "#2a9d8f",
                        gap: "10px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="body1"
                    >
                      phoneNumber:{" "}
                      <Typography
                        sx={{
                          color: "black",
                          fontWeight: "500",
                          fontSize: "13px",
                          fontFamily: "var(--font-paragraph2)",
                        }}
                      >
                        {address.phoneNumber}
                      </Typography>{" "}
                    </Typography>

                    <Button
                      sx={{
                        marginRight: "10px",
                        fontWeight: "700",
                        color: "black",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="contained"
                      color="error"
                    >
                      Delete Address
                    </Button>

                    <Button
                      sx={{
                        marginRight: "10px",
                        fontWeight: "700",
                        color: "black",
                        fontFamily: "var(--font-headding2)",
                      }}
                      variant="contained"
                      disabled={true}
                    >
                      Edit Address
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="contained"
                  sx={{
                    marginBottom: "10px",
                    fontSize: "18px",
                    fontWeight: "700",
                    backgroundColor: "#2a9d8f",
                    color: "black",
                    fontFamily: "var(--font-headding2)",
                  }}
                  color="primary"
                >
                  <Link underline="none" color="inherit">
                    Create New Address
                  </Link>
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

export default Profile;
