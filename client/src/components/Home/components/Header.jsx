/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./header.css"; // Make sure to import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Icon,
  TextField,
  Typography,
} from "@mui/material";
import Testt from "./Testt";
import * as motion from "motion/react-client";
import { useRef, useState } from "react";
import axios from "axios";

const Header = ({ user, admin, Udetails }) => {
  const [mopile, setMopile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [SearshOpen, setSearshOpen] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/product/getAll`
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 950) {
        setMopile(true);
        document.querySelectorAll(".desk").forEach((el) => {
          el.style.display = "none";
        });
        document.querySelectorAll(".mopile").forEach((el) => {
          el.style.display = "flex";
        });
      } else {
        setMopile(false);
        document.querySelectorAll(".desk").forEach((el) => {
          el.style.display = "flex";
        });
        document.querySelectorAll(".mopile").forEach((el) => {
          el.style.display = "none";
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        backgroundColor: scrolled && "#041110fb",
      }}
      className="header"
    >
      {mopile && <Testt admin={admin} />}
      <Container>
        <div className="leftIcons desk">
          <Box
            sx={{
              position: SearshOpen ? "absolute" : "absolute",
              width: SearshOpen ? "320px !important" : "45px",
              backgroundColor: SearshOpen ? "white !important" : null,
              zIndex: SearshOpen ? 100 : null,
              transition: "all 0.5s ease-in-out",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: SearshOpen ? "10px" : null,
              borderRadius: "5px",
              boxShadow: SearshOpen ? "0 0 10px rgba(0, 0, 0, 0.3)" : null,
            }}
          >
            <Button
              onClick={() => {
                setSearshOpen(!SearshOpen);
              }}
              className={`icon ${SearshOpen ? "active" : ""}`}
            >
              <SearchIcon />
            </Button>
            {SearshOpen && (
              <Autocomplete
                filterOptions={(options, state) =>
                  options
                    .filter((option) =>
                      option.Name.toLowerCase().includes(
                        state.inputValue.toLowerCase()
                      )
                    )
                    .slice(0, 4)
                }
                disablePortal
                sx={{
                  position: "relative",
                  zIndex: 102,
                  flex: 1,
                }}
                options={products}
                getOptionLabel={(option) => option.Name}
                renderInput={(params) => (
                  <TextField
                    sx={{
                      "& label.Mui-focused": { color: "#2a9d8f" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#2a9d8f" },
                      },
                    }}
                    {...params}
                    label="Search In Products"
                  />
                )}
                renderOption={(props, option) => (
                  <li
                    key={option._id}
                    {...props}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      margin: "5px",
                      borderRadius: " 5px",
                      border: "1px solid #2a9d8f",
                    }}
                  >
                    <img
                      src={option.images[0].secure_url}
                      alt={option.label}
                      width="50px"
                      height="50px"
                      style={{
                        borderRadius: "5px",
                        objectFit: "cover",
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "21px",
                        fontWeight: "600",
                        cursor: "pointer",
                        color: "#2a9d8f",
                        fontFamily: "var(--font-headding2)",
                      }}
                    >
                      {option.Name}
                    </Typography>
                  </li>
                )}
              />
            )}
          </Box>

          <Link to="/wishlist" className="icon icon-wishlist">
            <FavoriteIcon />
          </Link>
        </div>
        <div className="leftIcons mopile"></div>
        <nav className="nav desk">
          <Link to="/" className="link">
            Home
          </Link>
          <Link to="/products" className="link">
            Products
          </Link>
        </nav>

        <div className="logo">
          <img src="/ment.png" alt="Logo" className="logoImage" />
        </div>
        <nav className="nav desk">
          <Link to="/about" className="link">
            About Us
          </Link>
          <Link to="/contact" className="link">
            Contact
          </Link>
        </nav>
        <div className="rightIcons desk">
          <Link to="/profile" className="Linkwrapper">
            {user && (
              <Typography className="NameUser">{Udetails.firstName}</Typography>
            )}
            <Box className="iconn">
              <PersonIcon />
            </Box>
          </Link>
          <Link to="/cart" className="icon desk">
            <ShoppingCartIcon />
          </Link>

          {admin && (
            <Link to="/dashboard" className="icon">
              <FontAwesomeIcon icon={faUserShield} />
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
