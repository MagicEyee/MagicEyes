import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../../services/store/reducers/AuthSlice";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Header from "../Home/components/Header";
import SubLanding from "../SubLanding";
import Footer from "../Home/components/Footer";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Register = () => {
  const navigate = useNavigate();
  const Dispatch = useDispatch();
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    birthDate: Yup.date().required("Birth date is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
  });

  const handleSubmit = async (values) => {
    try {
      await axios.post("/user/register", values).then((response) => {
        Cookies.set("jwt2", response.data.token);
        Dispatch(setUser(response.data));
        navigate(-1);
      });
    } catch (error) {
      console.error("There was an error registering!", error);
    }
  };

  return (
    <Box>
      <Header />
      <SubLanding Name={"Register"} image={"/register.jpg"} />
      <Container>
        <Formik
          initialValues={{
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            birthDate: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
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
                }}
              >
                <Box
                  sx={{
                    width: "100%",

                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    style={{
                      minWidth: "180px",
                      marginBottom: "10px",
                      color: "#2a9d8f",

                      fontWeight: "600",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="username"
                  >
                    Enter Username
                  </label>
                  <Field
                    required={true}
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label={"User Name"}
                    as={TextField}
                    type="text"
                    name="username"
                  />
                </Box>
                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="username"
                  component="Box"
                />
              </Box>

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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",

                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    style={{
                      minWidth: "180px",

                      marginBottom: "10px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="firstName"
                  >
                    Enter First Name
                  </label>
                  <Field
                    required={true}
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label={"First Name"}
                    as={TextField}
                    type="text"
                    name="firstName"
                  />
                </Box>

                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="firstName"
                  component="Box"
                />
              </Box>

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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",

                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    style={{
                      minWidth: "180px",
                      marginBottom: "10px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="lastName"
                  >
                    Enter Last Name
                  </label>
                  <Field
                    required={true}
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label={"Last Name"}
                    as={TextField}
                    type="text"
                    name="lastName"
                  />
                </Box>

                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="lastName"
                  component="Box"
                />
              </Box>
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",

                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "10px",
                      minWidth: "180px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="email"
                  >
                    Enter Email
                  </label>
                  <Field
                    required={true}
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label={"Email"}
                    as={TextField}
                    type="text"
                    name="email"
                  />
                </Box>

                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="email"
                  component="Box"
                />
              </Box>
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",

                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "10px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      fontSize: "20px",
                      minWidth: "180px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="email"
                  >
                    Enter BirthDate
                  </label>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{
                        width: "270px",
                        maxWidth: "100%",
                      }}
                      name="birthDate"
                      label="Birth Date"
                      onChange={(date) =>
                        setFieldValue("birthDate", new Date(date.toString()))
                      }
                      renderInput={(props) => <TextField {...props} />}
                      inputFormat="yyyy-MM-dd"
                      InputLabelProps={{ shrink: true }}
                      helperText={<ErrorMessage name="birthDate" />}
                    />
                  </LocalizationProvider>
                </Box>

                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="birthDate"
                  component="Box"
                />
              </Box>
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",

                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "10px",
                      color: "#2a9d8f",
                      minWidth: "180px",
                      fontWeight: "600",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="email"
                  >
                    Enter Password
                  </label>
                  <Field
                    required={true}
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label={"Password"}
                    as={TextField}
                    type="text"
                    name="password"
                  />
                </Box>

                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="password"
                  component="Box"
                />
              </Box>
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
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "10px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      minWidth: "180px",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="email"
                  >
                    Enter Confirm Password
                  </label>
                  <Field
                    required={true}
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label={"Confirm Password"}
                    as={TextField}
                    type="text"
                    name="confirmPassword"
                  />
                </Box>

                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="confirmPassword"
                  component="Box"
                />
              </Box>
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
                }}
              >
                <Box
                  sx={{
                    width: "100%",

                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <label
                    style={{
                      marginBottom: "10px",
                      color: "#2a9d8f",
                      fontWeight: "600",
                      minWidth: "180px",
                      fontSize: "20px",
                      fontFamily: "var(--font-headding2)",
                    }}
                    htmlFor="email"
                  >
                    Enter PhoneNumber
                  </label>
                  <Field
                    required={true}
                    sx={{
                      width: "270px",
                      maxWidth: "100%",
                    }}
                    label={"Phone Number"}
                    as={TextField}
                    type="text"
                    name="phoneNumber"
                  />
                </Box>

                <ErrorMessage
                  style={{
                    marginBottom: "10px",
                    color: "red",
                    fontSize: "16px",
                    fontFamily: "var(--font-headding2)",
                  }}
                  name="phoneNumber"
                  component="Box"
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
                Register
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
                  You have an account? Click here to
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
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Container>

      <Footer />
    </Box>
  );
};

export default Register;
