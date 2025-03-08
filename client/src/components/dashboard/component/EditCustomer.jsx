import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Checkbox,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/material";
const EditCustomer = () => {
  const [Adresses, setAdresses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Fetch customers from API
    axios
      .get("http://localhost:3001/user/admin/getAllUser")
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the customers!", error);
      });
  }, []);

  const handleCustomerChange = async (event, value, setFieldValue) => {
    let done = false;
    setSelectedCustomer(value);
    if (value) {
      await axios
        .get(`http://localhost:3001/user/admin/getUserById/${value._id}`)
        .then((response) => {
          done = true;
          const customerData = response.data.data;
          setFieldValue("firstName", customerData.firstName);
          setFieldValue("lastName", customerData.lastName);
          setFieldValue("username", customerData.username);
          setFieldValue("email", customerData.email);
          setFieldValue("phoneNumber", customerData.phoneNumber);
          setFieldValue("address", customerData.address);
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the customer details!",
            error
          );
        });
    } else {
      setFieldValue("firstName", "");
      setFieldValue("lastName", "");
      setFieldValue("username", "");
      setFieldValue("email", "");
      setFieldValue("phoneNumber", "");
      setFieldValue("address", "");
    }

    if (done) {
      await axios
        .get(
          `http://localhost:3001/user/admin/getAllAdressForUser/${value._id}`
        )
        .then((responce) => {
          setAdresses(responce.data.data);
          console.log(responce.data.data);
        });
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    phoneNumber: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
  });

  const handleSave = (values) => {
    axios
      .put(
        `http://localhost:3001/user/admin/updateUser/${selectedCustomer._id}`,
        values
      )
      .then((response) => {
        alert("Customer details updated successfully!");
      })
      .catch((error) => {
        console.error(
          "There was an error updating the customer details!",
          error
        );
      });
  };

  return (
    <div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          phoneNumber: "",
          address: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ setFieldValue }) => (
          <Form>
            <Autocomplete
              options={customers}
              getOptionLabel={(option) => option.firstName}
              onChange={(event, value) =>
                handleCustomerChange(event, value, setFieldValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Customer"
                  variant="outlined"
                />
              )}
            />
            {selectedCustomer && (
              <div>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="firstName"
                    label="First Name"
                    fullWidth
                    helperText={<ErrorMessage name="firstName" />}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    helperText={<ErrorMessage name="lastName" />}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="username"
                    label="UserName"
                    fullWidth
                    helperText={<ErrorMessage name="username" />}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    helperText={<ErrorMessage name="email" />}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="phoneNumber"
                    label="PhoneNumber"
                    fullWidth
                    helperText={<ErrorMessage name="phoneNumber" />}
                  />
                </Box>
                {/* <Box mb={2}>
                  <Field
                    as={TextField}
                    name="address"
                    label="Address"
                    fullWidth
                    helperText={<ErrorMessage name="address" />}
                  />
                </Box> */}

                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </div>
            )}
          </Form>
        )}
      </Formik>

      {/* {selectedCustomer && (
        <Box
          mb={2}
          sx={{
            padding: "10px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "20px",
              marginBottom: "10px",
              color: "black",
              textAlign: "center",
              textTransform: "capitalize",
            }}
          >
            Cart Details for {selectedCustomer.firstName}
          </Typography>
          <Box sx={{}}>
            <Typography sx={{}}>
              Total Items in Cart: {selectedCustomer.Cart.products.length}
            </Typography>

            {selectedCustomer.Cart.products.map((product) => {
              return (
                <Box
                  key={product._id}
                  sx={{
                    border: "1px solid black",
                    padding: "15px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "black",
                        textAlign: "center",
                        textTransform: "capitalize",
                      }}
                    ></Typography>
                    <TextField
                      label={" Name:"}
                      disabled
                      value={product.Name}
                    ></TextField>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      sx={{
                        width: "150px",
                      }}
                      label={" quantity:"}
                      onChange={(val) => {
                        console.log(val.target.value);
                        // handleUpdateQuantity(
                        //   product._id,
                        //   parseInt(val.target.value)
                        // );
                      }}
                      value={product.quantity}
                    ></TextField>
                  </Box>
                  <Box
                    // width={"33.33%"}
                    sx={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      sx={{
                        width: "150px",
                      }}
                      label={"Total:"}
                      disabled
                      value={product.totalForProduct}
                    ></TextField>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditProduct(product._id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )} */}
      {selectedCustomer && (
        <Box
          mb={2}
          sx={{
            padding: "10px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "20px",
              marginBottom: "10px",
              color: "black",
              textAlign: "center",
              textTransform: "capitalize",
            }}
          >
            Adress Details for {selectedCustomer.firstName}
          </Typography>

          {Adresses ? (
            <>
              <Typography>Number of Adresses: {Adresses.length}</Typography>
              {Adresses.map((d, i) => {
                return (
                  <Formik
                    initialValues={{
                      city: d.city,
                      fullAddress: d.fullAddress,
                      state: d.state,
                      street: d.streetName,
                    }}
                    validationSchema={Yup.object({
                      street: Yup.string().required("Street is required"),
                      city: Yup.string().required("City is required"),
                      state: Yup.string().required("State is required"),
                      fullAddress: Yup.string().required(
                        "fullAddress is required"
                      ),
                    })}
                    key={d._id}
                  >
                    {() => {
                      return (
                        <Form>
                          <Field
                            as={TextField}
                            name="street"
                            label="Street"
                            fullWidth
                            helperText={<ErrorMessage name="street" />}
                          />
                          <Field
                            as={TextField}
                            name="city"
                            label="City"
                            fullWidth
                            helperText={<ErrorMessage name="city" />}
                          />
                          <Field
                            as={TextField}
                            name="state"
                            label="State"
                            fullWidth
                            helperText={<ErrorMessage name="state" />}
                          />
                          <Field
                            as={TextField}
                            name="fullAddress"
                            label="Full Address"
                            fullWidth
                            helperText={<ErrorMessage name="zipCode" />}
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            // onClick={() => handleEditAdress(d._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            // onClick={() => handleRemoveAdress(d._id)}
                          >
                            Remove
                          </Button>
                        </Form>
                      );
                    }}
                  </Formik>
                );
              })}
            </>
          ) : (
            <>
              <Alert severity="error">there is no adresses for this user</Alert>
            </>
          )}

          {/* <Box sx={{}}>
            <Typography sx={{}}>
              number of Adresses : {selectedCustomer.adresses}
            </Typography>

            {selectedCustomer.Cart.products.map((product) => {
              return (
                <Box
                  key={product._id}
                  sx={{
                    border: "1px solid black",
                    padding: "15px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: "18px",
                        color: "black",
                        textAlign: "center",
                        textTransform: "capitalize",
                      }}
                    ></Typography>
                    <TextField
                      label={" Name:"}
                      disabled
                      value={product.Name}
                    ></TextField>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      sx={{
                        width: "150px",
                      }}
                      label={" quantity:"}
                      onChange={(val) => {
                        console.log(val.target.value);
                        // handleUpdateQuantity(
                        //   product._id,
                        //   parseInt(val.target.value)
                        // );
                      }}
                      value={product.quantity}
                    ></TextField>
                  </Box>
                  <Box
                    // width={"33.33%"}
                    sx={{
                      display: "flex",
                    }}
                  >
                    <TextField
                      sx={{
                        width: "150px",
                      }}
                      label={"Total:"}
                      disabled
                      value={product.totalForProduct}
                    ></TextField>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditProduct(product._id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveProduct(product._id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box> */}
        </Box>
      )}
    </div>
  );
};

export default EditCustomer;
