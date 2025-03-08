/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { Autocomplete } from "@mui/material";

const validationSchema = Yup.object({
  userId: Yup.string().required("Please select a user"),
  orderId: Yup.string().required("Please select an order"),
});

function EditOrder({ ChoosenOrder }) {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [Error, setError] = useState(null);
  useEffect(() => {
    setError(null);
    if (ChoosenOrder) {
      console.log(ChoosenOrder);
      setSelectedOrderId(ChoosenOrder);
    }
    async function fetchData() {
      await axios
        .get("http://localhost:3001/user/admin/getAllUser")
        .then((response) => {
          setUsers(response.data.data);
        })
        .catch((error) => {
          setError("There was an error fetching the users!");
          console.error("There was an error fetching the users!", error);
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;
    setError(null);
    async function fetchData() {
      await axios
        .get(
          `http://localhost:3001/order/admin/getCustomerOrders/${selectedUserId}`
        )
        .then((response) => {
          setOrders(response.data.data);
        })
        .catch(() => {
          setError("There was an error fetching the orders!");
        });
    }
    fetchData();
  }, [selectedUserId]);

  useEffect(() => {
    if (!selectedOrderId) return;
    setError(null);
    axios
      .get(`http://localhost:3001/order/admin/getOrder/${selectedOrderId}`)
      .then((response) => {
        console.log(response.data.data);
        setOrderDetails(response.data.data);
      })
      .catch((error) => {
        setError("There was an error fetching the orders!");
        console.error("There was an error fetching the order details!", error);
      });
  }, [selectedOrderId]);

  return (
    <div>
      <Typography
        fontWeight={600}
        variant={"h4"}
        textAlign={"center"}
        color={"primary"}
      >
        Edit Orders
      </Typography>
      <Formik
        initialValues={{ userId: "", orderId: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setSelectedUserId(values.userId);
          setSelectedOrderId(values.orderId);
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div
              style={{
                display: "flex",
              }}
            >
              <div>
                <Autocomplete
                  id="user-autocomplete"
                  options={users}
                  getOptionLabel={(option) => option.firstName}
                  key={(option) => `${option.firstName} ${option.email}`}
                  renderOption={(p, option) => {
                    console.log(p);
                    return (
                      <div
                        {...p}
                        key={option._id}
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          padding: "10px",
                        }}
                      >
                        <div
                          style={{
                            color: "black",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {option.firstName}
                        </div>
                        <div
                          style={{
                            color: "gray",
                            fontSize: "14px",
                          }}
                        >
                          {option.email}
                        </div>
                      </div>
                    );
                  }}
                  onChange={(event, newValue) => {
                    setFieldValue("userId", newValue?._id);
                    setSelectedUserId(newValue?._id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Users"
                      name="userId"
                      error={touched.userId && Boolean(errors.userId)}
                      helperText={touched.userId && errors.userId}
                    />
                  )}
                  sx={{ width: 300 }}
                />

                {errors.userId && touched.userId ? (
                  <div>{errors.userId}</div>
                ) : null}
              </div>
              {selectedUserId && (
                <div>
                  <Autocomplete
                    id="order-autocomplete"
                    options={orders}
                    getOptionLabel={(option) =>
                      `Tracking Number: ${option.trackingNumber}; Order ID: ${option._id}, Total: ${option.totalPrice}`
                    }
                    onChange={(event, newValue) => {
                      setFieldValue("orderId", newValue?._id);
                      setSelectedOrderId(newValue?._id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Orders"
                        name="orderId"
                        error={touched.orderId && Boolean(errors.orderId)}
                        helperText={touched.orderId && errors.orderId}
                      />
                    )}
                    sx={{ width: 300 }}
                  />
                  {errors.orderId && touched.orderId ? (
                    <div>{errors.orderId}</div>
                  ) : null}
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
      {selectedOrderId && orderDetails && !Error && (
        <div>
          <h2>Order Details for Order ID: {selectedOrderId}</h2>
          <p>Tracking Number: {orderDetails.trackingNumber}</p>
          <p>Total: ${orderDetails.totalPrice}</p>
          <p>
            Items:{" "}
            {orderDetails.products.map((p, i) => (
              <div key={i}>
                {p.Name} - ${p.price} x {p.quantity}
              </div>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

export default EditOrder;
