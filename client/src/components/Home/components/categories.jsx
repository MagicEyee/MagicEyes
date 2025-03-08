import React, { useState } from "react";
import { Box, Typography, Link, Container } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetch() {
      await axios
        .get("http://localhost:3001/category/getAll")
        .then((response) => {
          console.log(response.data);
          setCategories(response.data);
        });
    }
    fetch();
  }, []);
  return (
    <Container>
      <Typography
        style={{
          fontFamily: "var(--font-headding)",
          fontWeight: 600,
          marginTop: 20,
          marginBottom: 20,
          textAlign: "center",
          color: "#278873",
        }}
        variant="h2"
        component="h1"
      >
        Categories
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: 340,
              height: 400,
              backgroundImage:
                category.image && `url(${category.image.secure_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              margin: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textAlign: "center",
              borderRadius: "5px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                borderRadius: "4px",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                justifyContent: "end",
                padding: 2,
              }}
            >
              <Box
                className="textContainer"
                sx={{
                  marginBottom: "30px",
                  marginLeft: "10px",
                }}
              >
                <Typography
                  sx={{
                    // fontSize: "20px",
                    textAlign: "left",
                    marginLeft: "2px",
                    color: "white",
                    marginBottom: "10px",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-headding2)",
                    fontSize: "23px",
                    fontWeight: "700",
                  }}
                  variant="h5"
                >
                  {category.name}
                </Typography>
                <Typography
                  sx={{
                    // fontSize: "16px",
                    textAlign: "left",
                    marginLeft: "2px",
                    color: "white",
                    textTransform: "capitalize",
                    fontFamily: "var(--font-paragraph)",
                    fontSize: "16px",
                    marginBottom: "16px",
                  }}
                  variant="body1"
                >
                  {category.description}
                </Typography>
                <Link
                  sx={{
                    display: "block",
                    width: "fit-content",
                    textDecoration: "none",
                    textAlign: "left",
                    color: "white",
                    fontWeight: 600,
                    fontFamily: "var(--font-headding2)",
                    fontSize: "22px",
                    backgroundColor: "#278873",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    padding: "10px 20px",
                    transition: "0.3s ease-in-out",
                    "&:hover": {
                      fontSize: "23px",
                      backgroundColor: "rgb(0, 0, 0)",
                      color: "#278873",
                    },
                  }}
                  href={`/Products/category/${category._id}`}
                >
                  Go To {category.name}
                </Link>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>{" "}
    </Container>
  );
};

export default Categories;
