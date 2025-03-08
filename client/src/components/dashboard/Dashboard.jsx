import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Button } from "@mui/material";
import UserAdmin from "./component/UserAdmin";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory"; //products
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; //createProduct
import CreateIcon from "@mui/icons-material/Create"; //editOrder
import BarChartIcon from "@mui/icons-material/BarChart";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle"; //change
import DashboardIcon from "@mui/icons-material/Dashboard";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { faRectangleAd } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";

const Dashboard1 = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    selected: "dashboard",
  },
];

const Products = [
  {
    text: "All Products",
    icon: <InventoryIcon />,
    selected: "allProducts",
  },
  {
    text: "Create Product",
    icon: <AddCircleOutlineIcon />,
    selected: "createProduct",
  },
  {
    text: "Edit Product",
    icon: <CreateIcon />,
    selected: "EditProduct",
  },
  {
    text: "Categories",
    icon: <CategoryIcon />,
    selected: "categories",
  },
];

const Order = [
  {
    text: "All Orders",
    icon: <ShoppingCartIcon />,
    selected: "allOrders",
  },
  {
    text: "Edit Order",
    icon: <CreateIcon />,
    selected: "EditOrder",
  },
];

const Customer = [
  {
    text: "All Customers",
    icon: <PeopleIcon />,
    selected: "allCustomers",
  },
  {
    text: "Edit custmomer",
    icon: <PersonIcon />,
    selected: "EditCustomer",
  },
  {
    text: "User - Admin",
    icon: <ChangeCircleIcon />,
    selected: "UserAdmin",
  },
];

const analytics_Reports = [
  {
    text: "inventory",
    icon: <FontAwesomeIcon icon={faWarehouse} />,
    selected: "warehouse",
  },
  {
    text: "Analytics",
    icon: <BarChartIcon />,
    selected: "analytics",
  },
  // {
  //   text: "Reports",
  //   icon: <BarChartIcon />,
  //   selected: "reports",
  // },
];

const Feedbacks = [
  {
    text: "Feedbacks",
    icon: <FeedbackIcon />,
    selected: "feedback",
  },
];
const Promotions = [
  {
    text: "Promotions",
    icon: <FontAwesomeIcon icon={faRectangleAd} />,
    selected: "promotions",
  },
];

const settings = [
  {
    text: "Settings",
    icon: <FontAwesomeIcon icon={faGear} />,
    selected: "settings",
  },
];
const drawerWidth = 220;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  logoutUser,
  setUser,
  BeUser,
} from "../../services/store/reducers/AuthSlice";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import MainDash from "./component/MainDash";
import AllProducts from "./component/AllProducts";
import Inventory from "./component/Inventory";
import AllOrders from "./component/AllOrders";
import AllCategories from "./component/AllCategories";
import CreateProduct from "./component/CreateProduct";
import Analytics from "./component/Analytics";
import EditProduct from "./component/EditProduct";
import EditOrder from "./component/EditOrder";
import AllCustomers from "./component/AllCustomers";
import Settings from "./component/Settings";
import AllPromotions from "./component/Promotions";
import AllReports from "./component/AllReports";
import AllFeedBacks from "./component/Feedbacks";
import EditCustomer from "./component/EditCustomer";
const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [Error, setError] = React.useState(false);
  const [selectedState, setSelectedState] = React.useState("option1");
  const [component, setComponent] = React.useState(null);
  const [ChoosenProduct, setChoosenProduct] = React.useState(null);
  const [ChoosenOrder, setChoosenOrder] = React.useState(null);

  const Dispatch = useDispatch();

  React.useEffect(() => {
    switch (selectedState) {
      case "dashboard":
        setComponent(<MainDash />);
        break;
      case "allProducts":
        setComponent(
          <AllProducts
            setChoosenProduct={setChoosenProduct}
            setSelectedState={setSelectedState}
          />
        );
        break;
      case "categories":
        setComponent(<AllCategories setSelectedState={setSelectedState} />);
        break;
      case "allOrders":
        setComponent(
          <AllOrders
            setChoosenOrder={setChoosenOrder}
            setSelectedState={setSelectedState}
          />
        );
        break;
      case "allCustomers":
        setComponent(<AllCustomers />);
        break;

      case "EditCustomer":
        setComponent(<EditCustomer />);
        break;
      case "customer":
        setComponent(<AllCustomers />);
        break;
      case "createProduct":
        setComponent(<CreateProduct />);
        break;
      case "EditOrder":
        setComponent(<EditOrder ChoosenOrder={ChoosenOrder} />);
        break;
      case "EditProduct":
        setComponent(<EditProduct selectedIDD={ChoosenProduct} />);
        break;
      case "reports":
        setComponent(<AllReports />);
        break;
      case "analytics":
        setComponent(<Analytics />);
        break;
      case "UserAdmin":
        setComponent(<UserAdmin />);
        break;
      case "warehouse":
        setComponent(
          <Inventory
            setSelectedState={setSelectedState}
            setChoosenProduct={setChoosenProduct}
          />
        );
        break;
      case "settings":
        setComponent(<Settings setSelectedState={setSelectedState} />);
        break;
      case "promotions":
        setComponent(<AllPromotions setSelectedState={setSelectedState} />);
        break;
      case "feedback":
        setComponent(<AllFeedBacks setSelectedState={setSelectedState} />);
        break;
      default:
        setComponent(<MainDash />);
    }
  }, [selectedState]);

  React.useEffect(() => {
    // check if user is authenticated
    const token = Cookies.get("jwt2");
    if (token) {
      axios
        .get("/user/getMe", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const allData = { ...res.data, token: Cookies.get("jwt2") };
          Dispatch(setUser(allData));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const user = useSelector((state) => state.auth.user);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  React.useEffect(() => {
    const token = Cookies.get("jwt2");
    if (token && isAdmin && user) {
      setError(false);
    }
  }, [user, isAdmin]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!Error ? (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={[
                    {
                      marginRight: 5,
                    },
                    open && { display: "none" },
                  ]}
                >
                  <MenuIcon />
                </IconButton>
                {user && (
                  <Typography variant="h6" noWrap component="div">
                    hello mr {user.firstName}
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                sx={{
                  marginLeft: 2,
                }}
                onClick={() => {
                  console.log("be a user");
                  navigate("/");
                  Dispatch(BeUser());
                }}
              >
                Be a user
              </Button>
              <Button
                sx={{
                  marginLeft: 2,
                }}
                variant="contained"
                onClick={() => {
                  console.log("logout");
                  Cookies.remove("jwt2");
                  navigate("/");
                  Dispatch(logoutUser());
                }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {Dashboard1.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {Products.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {Order.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {Customer.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {analytics_Reports.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {Feedbacks.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {Promotions.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {settings.map((e) => (
                <ListItem
                  onClick={() => setSelectedState(e.selected)}
                  key={e.text}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    sx={[
                      {
                        minHeight: 48,
                        px: 2.5,
                      },
                      open
                        ? {
                            justifyContent: "initial",
                          }
                        : {
                            justifyContent: "center",
                          },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        {
                          minWidth: 0,
                          justifyContent: "center",
                        },
                        open
                          ? {
                              mr: 3,
                            }
                          : {
                              mr: "auto",
                            },
                      ]}
                    >
                      {e.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={e.text}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>

          <Box
            onClick={handleDrawerClose}
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              height: "calc(100vh - 48px)",
            }}
          >
            <DrawerHeader />
            {component}
          </Box>
        </Box>
      ) : (
        <>
          there is an Error in dashboard login again to fix this issue
          <Button
            onClick={() => Cookies.remove("jwt2")}
            component={Link}
            to={"/Login"}
          >
            Login
          </Button>
        </>
      )}
    </>
  );
};

export default Dashboard;
