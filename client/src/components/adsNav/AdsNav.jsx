import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import { useHistory } from "react-router-dom";
import axios from "axios";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import { Box, Container } from "@mui/material";
import "./adsNav.css";
// Install Swiper modules
// SwiperCore.use([Navigation, Pagination, Autoplay]);

const AdsNav = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const noAds = [
    {
      picture: {
        secure_url: "/SaleSoon.jpg",
        bytes: 42873,
        format: "png",
        originalName: "Screenshot 2024-11-13 231904.png",
      },
      _id: "67b3fc89dab510a1fe1a3f16",
      isActive: true,
      productId: "679991c5ebb7147d427ea880",
      name: "اعلان 11",
      expireDate: "2025-02-19T22:00:00.000Z",
    },
  ];
  //   const history = useHistory();

  useEffect(() => {
    // Fetch ads from backend
    axios
      .get("/ads/getAll")
      .then((response) => {
        // Filter active ads
        // const activeAds = response.data.data.filter((ad) => {
        //   console.log(ad.isActive && new Date() <= new Date(ad.expireDate));
        //   return ad.isActive && new Date() <= new Date(ad.expireDate);
        // });
        // setAds(activeAds);
        setAds(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching ads:", error);
      });
  }, []);

  const handleAdClick = (productId) => {
    navigate(`product/${productId}`);
  };

  return (
    <Container>
      <div className="ads-nav">
        {ads.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            slidesPerView={1}
            spaceBetween={30}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
          >
            {ads.map((ad) => (
              <SwiperSlide
                key={ad._id}
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "5px",
                  position: "relative",
                  cursor: "pointer",
                  "&::before": {
                    content: `"No Sale Right Now"`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "30px",
                    position: "absolute",
                    opacity: "0.7",
                    backgroundColor: "black",
                    fontWeight: "bold",
                    fontFamily: "var(--font-headding2)",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transition: " 0.3s ease-in-out",
                  },
                }}
                onClick={() => handleAdClick(ad.productId)}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  src={ad.picture.secure_url}
                  alt={`No Ads Right Now`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Box>
            {noAds.map((ad, i) => (
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "5px",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  "&::before": {
                    content: `"No Sale Right Now"`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "30px",
                    position: "absolute",
                    opacity: "0.7",
                    backgroundColor: "black",
                    fontWeight: "bold",
                    fontFamily: "var(--font-headding2)",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transition: " 0.3s ease-in-out",
                  },
                }}
                key={i}
                onClick={() => {
                  navigate("/");
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  src={ad.picture.secure_url}
                  alt={`No Ads Right Now`}
                />
              </Box>
            ))}
          </Box>
        )}
      </div>
    </Container>
  );
};

export default AdsNav;
