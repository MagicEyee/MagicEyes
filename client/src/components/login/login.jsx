import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../../services/store/reducers/AuthSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Header from "../Home/components/Header";
import SubLanding from "../SubLanding";
import Footer from "../Home/components/Footer";
const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
  });

  useEffect(() => {
    const token = Cookies.get("jwt2");
    console.log(Cookies.get());
    if (token) {
      navigate(-1);
    }
  }, []);

  const onSubmit = (values, { setSubmitting }) => {
    axios
      .post("/user/login", values)
      .then((response) => {
        console.log("Login successful", response.data);
        Cookies.set("jwt2", response.data.token);
        Dispatch(setUser(response.data));
        navigate(-1);
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.msg);
        } else {
          setError(error.message);
        }
        console.log(error);
      })
      .finally(() => {
        // setSubmitting(false);
      });
  };

  return (
    <div>
      <Header />
      <SubLanding image={"/Login.jpg"} Name={"Login"} />
      <Container>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setSubmitting }) => {
            return (
              <Form
                style={{
                  margin: "10px 0px",
                  borderRadius: "10px",
                  border: "1px solid #2a9d8f",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // height: "320px ",
                  flexWrap: "wrap",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {error ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginBottom: "10px",
                      padding: "10px",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography
                      sx={{
                        marginBottom: "10px",
                        marginTop: "10px",
                        color: "#dc3545",
                        fontWeight: "600",
                        fontSize: "20px",
                        fontFamily: "var(--font-headding2)",
                      }}
                    >
                      {error}
                    </Typography>
                    <Button
                      sx={{
                        backgroundColor: "#2a9d8f",
                        color: "#000000",
                        fontWeight: "600",
                        fontSize: "18px",
                        fontFamily: "var(--font-headding2)",
                        borderRadius: "5px",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#238e7f",
                        },
                      }}
                      onClick={() => {
                        setError(null);
                        setSubmitting(false);
                      }}
                    >
                      Try again
                    </Button>
                  </Box>
                ) : null}
                <Box
                  sx={{
                    marginBottom: "15px",
                    marginTop: "10px",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    // marginBottom: "20px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "10px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="email"
                  >
                    Enter Your Email
                  </label>
                  <Field
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    as={TextField}
                    label={"Email"}
                    type="email"
                    id="email"
                    name="email"
                  />
                  <ErrorMessage
                    style={{
                      marginBottom: "10px",
                      color: "red",
                      fontSize: "16px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    name="email"
                    component="div"
                  />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    marginTop: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "10px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="password"
                  >
                    Enter Your Password
                  </label>
                  <Field
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label="password"
                    as={TextField}
                    type="password"
                    id="password"
                    name="password"
                  />
                  <ErrorMessage
                    style={{
                      marginBottom: "10px",
                      color: "red",
                      fontSize: "16px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    name="password"
                    component="div"
                  />
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#2a9d8f",
                    color: "Black",
                    fontFamily: "var(--font-headding2)",
                    fontSize: "20px",
                    fontWeight: "700",
                    width: "270px",
                    maxWidth: "100%",
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Login
                </Button>
                <Box
                  sx={{
                    width: "100%",
                    marginTop: "20px",
                    marginBottom: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  {/* <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "var(--font-headding2)",
                      fontWeight: "700",
                      color: "#2a9d8f",
                    }}
                  >
                    Forgot your password? Click here to
                    <Button
                      style={{ marginLeft: "10px" }}
                      variant="outlined"
                      sx={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#2a9d8f",
                        marginLeft: "10px",
                        fontFamily: "var(--font-paragraph2)",
                        border: "1px solid #2a9d8f",
                      }}
                      onClick={() => navigate("/forgotpassword")}
                    >
                      Reset Password
                    </Button>
                  </Typography> */}
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    fontFamily: "var(--font-headding2)",
                    color: "#2a9d8f",
                    fontWeight: "700",
                    fontSize: "16px",
                    textDecoration: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontFamily: "var(--font-headding2)",
                      fontWeight: "700",
                      color: "#2a9d8f",
                      marginBottom: "5px",
                    }}
                  >
                    Don't have an account? Click here to
                  </Typography>
                  <Button
                    style={{ marginLeft: "10px" }}
                    variant="outlined"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#2a9d8f",
                      marginLeft: "10px",
                      fontFamily: "var(--font-headding2)",
                      border: "1px solid #2a9d8f",
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Container>

      <Footer />
    </div>
  );
};

export default Login;
