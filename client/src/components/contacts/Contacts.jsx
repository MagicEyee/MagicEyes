import React, { useEffect, useState } from "react";
import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import Header from "../Home/components/Header";
import SubLanding from "../SubLanding";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../Home/components/Footer";
import axios from "axios";

const Contacts = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const LoggedIn = useSelector((state) => state.auth.loggedIn);

  const [name, setName] = useState(user ? user.firstName : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState(user ? user.phoneNumber : "");
  useEffect(() => {
    setName(user ? user.firstName : "");
    setEmail(user ? user.email : "");
  }, [user]);

  const initialValues = {
    name: name,
    email: email,
    message: message,
    phone: phone,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    message: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await axios
      .post("/message/createMessage", {
        Name: values.name,
        Email: values.email,
        message: values.message,
      })
      .then(() => {
        alert("Message sent successfully!");
        resetForm();
        setMessage("");
      });

    console.log("Form submitted with values:", values);
    setSubmitting(false);
    resetForm();
  };

  return (
    <>
      <Header admin={isAdmin} user={LoggedIn} Udetails={user} />
      <SubLanding image={"/ContactUs.jpg"} Name={"Contact Us"} />
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 0",
          }}
        >
          <Box padding={"0px 20px 0px 0px"} sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                marginBottom: "20px",
                fontSize: "30px",
                fontWeight: "bold",
                color: "#2a9d8f",
                fontFamily: "var(--font-headding2)",
              }}
            >
              Contact Details
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: "16px",
                marginBottom: "10px",
                fontFamily: "var(--font-paragraph)",
              }}
            >
              We would love to hear from you! Please reach out to us with any
              questions or concerns.
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#2a9d8f",
                gap: "10px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "20px",
                fontFamily: "var(--font-headding2)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "20px",
                  fontFamily: "var(--font-headding2)",
                }}
              >
                <FontAwesomeIcon icon={faLocationDot} /> Address:
              </Box>
              <Typography
                variant="h4"
                sx={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: "13px",
                  fontFamily: "var(--font-paragraph2)",
                }}
              >
                1234 Street Name, City, State, ZIP
              </Typography>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#2a9d8f",
                gap: "10px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "20px",
                fontFamily: "var(--font-headding2)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "20px",
                  fontFamily: "var(--font-headding2)",
                }}
              >
                <FontAwesomeIcon icon={faPhone} /> Phone:
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: "13px",
                  fontFamily: "var(--font-paragraph2)",
                }}
              >
                (123) 456-7890
              </Typography>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#2a9d8f",
                gap: "10px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "20px",
                fontFamily: "var(--font-headding2)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "20px",
                  fontFamily: "var(--font-headding2)",
                }}
              >
                <FontAwesomeIcon icon={faEnvelope} /> Email:
              </Box>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: "13px",
                  fontFamily: "var(--font-paragraph2)",
                }}
              >
                contact@example.com
              </Typography>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#2a9d8f",
                gap: "10px",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "20px",
                fontFamily: "var(--font-headding2)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  fontWeight: "600",
                  fontSize: "20px",
                  fontFamily: "var(--font-headding2)",
                }}
              >
                <FontAwesomeIcon icon={faClock} /> Open Hours:
              </Box>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: "13px",
                  fontFamily: "var(--font-paragraph2)",
                }}
              >
                Monday - Friday, 9:00 AM - 5:00 PM
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              marginRight: { md: "20px" },
              marginBottom: { xs: "20px", md: "0" },
            }}
          >
            <img
              src="/map.jpg"
              alt="Contact Us"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </Box>
        </Box>
        <hr />
        <Box>
          <Typography
            sx={{
              marginBottom: "20px",
              fontSize: "30px",
              fontWeight: "bold",
              color: "#2a9d8f",
              fontFamily: "var(--font-headding)",
              textAlign: "center",
            }}
          >
            {" "}
            Send us a message
          </Typography>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, setFieldValue }) => {
              useEffect(() => {
                setFieldValue("name", name);
                setFieldValue("email", email);
                setFieldValue("phone", phone);
              }, [name, email, phone]);

              return (
                <Form>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Name"
                      fullWidth
                      variant="outlined"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFieldValue("name", e.target.value);
                      }}
                      error={touched.name && Boolean(errors.name)}
                      helperText={<ErrorMessage name="name" />}
                    />
                  </Box>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      variant="outlined"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFieldValue("email", e.target.value);
                      }}
                      error={touched.email && Boolean(errors.email)}
                      helperText={<ErrorMessage name="email" />}
                    />
                  </Box>
                  <Box sx={{ marginBottom: "10px" }}>
                    <Field
                      as={TextField}
                      name="phone"
                      label="Phone"
                      fullWidth
                      variant="outlined"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setFieldValue("phone", e.target.value);
                      }}
                      error={touched.email && Boolean(errors.email)}
                      helperText={<ErrorMessage name="email" />}
                    />
                  </Box>
                  <Box sx={{ marginBottom: "20px" }}>
                    <Field
                      as={TextField}
                      name="message"
                      label="Message"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={4}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setFieldValue("message", e.target.value);
                      }}
                      error={touched.message && Boolean(errors.message)}
                      helperText={<ErrorMessage name="message" />}
                    />
                  </Box>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{
                      marginBottom: "10px",
                      fontSize: "18px",
                      fontWeight: "700",
                      backgroundColor: "#2a9d8f",
                      color: "black",
                      fontFamily: "var(--font-headding2)",
                    }}
                  >
                    Send Message
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Contacts;
