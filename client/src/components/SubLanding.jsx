/* eslint-disable react/prop-types */
import { Box, Container } from "@mui/material";
import "./SubLanding.css";
import { Link } from "react-router-dom";
function SubLanding({ image, Name }) {
  return (
    <Box className="subBox" style={{ height: "400px", position: "relative" }}>
      <img
        className="image-sublanding"
        src={image}
        alt="Profile"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Container
        sx={{
          position: "absolute",
          margin: "auto",
          zIndex: 4,
          width: "100%",
          height: "100%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          sx={{
            color: "#37bd9f",
            fontFamily: "var(--font-headding)",
            fontWeight: 600,
            position: "absolute",
            width: "100%",
            fontSize: "60px",
            lineHeight: "1.2",
            textAlign: "center",
            top: "52%",
            left: "50%",
            "@media(max-width: 600px)": {
              fontSize: "50px",
            },
            "@media(max-width: 450px)": {
              fontSize: "45px",
            },
            // marginBottom: "30px",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box
            sx={{
              "@media(max-width: 450px)": {
                marginBottom: "20px",
              },
            }}
          >
            {" "}
            {Name}
          </Box>
          <Box
            sx={{
              color: "#37bd9f",
              fontFamily: "var(--font-headding2)",
              fontWeight: 600,
              marginTop: "10px",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            <Link
              style={{
                color: "#37bd9f",
                textDecoration: "none",
                fontFamily: "var(--font-headding2)",
                fontWeight: 600,
                fontSize: "20px",
                textAlign: "center",
              }}
              to="/"
            >
              Home
            </Link>
            <span
              style={{
                color: "#888888",
                fontFamily: "var(--font-headding2)",
                fontWeight: 600,
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              {">"} {Name}
            </span>
          </Box>
        </Box>

        {/* <Box
          sx={{
            color: "#37bd9f",
            fontFamily: "var(--font-headding)",
            fontWeight: 600,
            position: "absolute",
            fontSize: "60px",
            lineHeight: "1.2",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Home > {Name}
        </Box> */}
      </Container>
    </Box>
  );
}

export default SubLanding;
