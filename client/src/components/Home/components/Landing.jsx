import React from "react";
import "./Landing.css";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <img src="/Landing.jpg" alt="Background" className="landing-image" />
      <Container className="cont">
        <div className="landing-content">
          <Typography className="landing-heading1">Magic Eyes</Typography>
          <Typography className="landing-heading2">
            Modern and Timeless Glasses
          </Typography>
          <Typography className="landing-description">
            Discover our collection of stylish and timeless glasses that suit
            every face shape and style. Our glasses are crafted with precision
            and care to ensure the best quality and comfort.
          </Typography>
          <Button
            onClick={() => {
              navigate("/products");
            }}
            variant="contained"
            className="landing-button"
          >
            See More
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Landing;
