import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Footer.css"; // Make sure to create and style this CSS file
import { Box, Button, Container, IconButton, TextField } from "@mui/material";
import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import SendIcon from "@mui/icons-material/Send";
import { color } from "framer-motion";
import axios from "axios";
const Footer = () => {
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await axios
      .post("/newsletter/signup", {
        email: values.email,
      })
      .then(() => {
        alert("Newsletter subscription successful!");
        setSubmitting(false);
        resetForm();
      });
  };
  return (
    <footer className="footerall">
      <Container>
        <Box className="footer">
          <div className="footer-section">
            <ul>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
              <li>
                <a href="/terms-of-services">Terms of Services</a>
              </li>
              <li>
                <a href="/products">Products</a>
              </li>
              <li>
                <a href="/terms-and-conditions">Terms and Conditions</a>
              </li>
              <li>
                <a href="/profile">Your Account</a>
              </li>
              <li>
                <a href="/profile">Order Tracking</a>
              </li>
            </ul>
          </div>
          <div className="footer-section logowrapper">
            <div className="logo">
              <img src="/ment.png" alt="Logo" className="logoImage" />
            </div>

            <div className="social-links">
              <a
                href="https://www.facebook.com/profile.php?id=61572792303052&rdid=h3GmQduBpQWOCKEm#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://www.instagram.com/magic.eyes.02/?igsh=OHk2NjFqbngydmVq#"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="https://www.tiktok.com/@magic_eyes.02?_t=ZS-8t4HGG36jBq&_r=1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4 className="newsletter">Newsletter Signup</h4>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form
                  style={{
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      //   marginBottom: 20,
                    }}
                  >
                    <Field
                      as={TextField}
                      type="email"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#ffffff",
                          },
                          "&:hover fieldset": {
                            borderColor: "#37bd9f",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#37bd9f",
                          },
                        },
                        "& .MuiInputBase-input": {
                          color: "#ffffff",
                        },
                        "& .MuiInputLabel-root": {
                          color: "#37bd9f",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#37bd9f",
                        },
                        flexGrow: "1",
                      }}
                      name="email"
                      placeholder="Enter your email"
                      required
                    />
                    <IconButton
                      sx={{
                        fontSize: 20,
                        backgroundColor: "#ffffff",
                        color: "#2a9d8f",
                        borderRadius: "50%",
                        padding: "10px 10px",
                        transition: "0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "#2a9d8f",
                          color: "white",
                        },
                        "&:active": {
                          backgroundColor: "#FF5533",
                        },
                      }}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </Form>
              )}
            </Formik>
          </div>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
