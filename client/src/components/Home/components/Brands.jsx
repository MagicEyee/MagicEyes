import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";
import "./Brands.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:3001/brands");
        setBrands(response.data.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <Container>
      <div style={{ padding: "0px 0px 50px" }}>
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
        >
          Our Brands
        </Typography>

        <Swiper
          slidesPerView={5}
          modules={[Pagination]}
          //   pagination={true}
          className="brands-container"
          pagination={{ clickable: true }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.name}>
              <Box
                onClick={() => {
                  navigate(`/products/Brand/${brand.name}`);
                }}
                sx={{
                  border: "1px solid #2a9d8f",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "200px",
                  height: "200px",
                  margin: "20px",
                  borderRadius: "5px",
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                  },
                  cursor: "pointer",
                }}
                className="brand"
              >
                <img src={brand.logo.secure_url} alt={brand.name} />
                <Typography
                  component={"h5"}
                  sx={{
                    textAlign: "center",
                    fontFamily: "var(--font-headding2)",
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#278873",
                  }}
                >
                  {brand.name}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
};

export default Brands;
