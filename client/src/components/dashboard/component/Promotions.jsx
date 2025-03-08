import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, TextField, Button, Checkbox } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function AllPromotions() {
  const token = useSelector((state) => state.auth.token);
  const [promotions, setPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [fetch, setFetch] = useState(false);
  useEffect(() => {
    console.log("fetching promotion");
    setPromotions([]);
    async function fetchPromotions() {
      await axios
        .get("/ads/getAll", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((response) => {
          const pr = [];
          response.data.data.map((item) => {
            pr.push({
              id: item._id,
              name: item.name,
              picture: item.picture.secure_url,
              productId: item.productId,
              expireDate: item.expireDate
                ? new Date(item.expireDate)
                : "there is no expiration date",
              isActive: item.isActive,
            });
          });
          setPromotions(pr);
          console.log(response.data.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the promotions!", error);
        });
      // setPromotions(response.data.data);
    }

    fetchPromotions();
  }, [fetch]);

  const initialValues = {
    name: "",
    picture: null,
    productId: "",
    expireDate: "",
    isActive: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    picture: Yup.mixed().required("Required"),
    productId: Yup.string().required("Required"),
    expireDate: Yup.date().required("Required"),
    isActive: Yup.boolean().required("Required"),
  });

  const validationForUpdate = Yup.object({
    name: Yup.string(),
    expireDate: Yup.date(),
    isActive: Yup.boolean(),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("picture", values.picture);
    formData.append("productId", values.productId);
    formData.append("expireDate", values.expireDate);
    formData.append("isActive", values.isActive);

    try {
      await axios.post("/promotions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      resetForm();
      setFetch(!fetch);
    } catch (error) {
      console.error("There was an error creating the promotion!", error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "picture",
      headerName: "Picture",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.name}
          style={{ width: "100%" }}
        />
      ),
    },
    { field: "productId", headerName: "Product ID", width: 150 },
    {
      field: "expireDate",
      headerName: "Expire Date",
      width: 150,
    },
    { field: "isActive", headerName: "Is Active", width: 150, type: "boolean" },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.row.id}
          icon={<EditIcon />}
          label="Edit"
          onClick={() => setSelectedPromotion(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ maxWidth: "100vw", mx: "auto", mt: 4 }}>
      <Typography
        fontWeight={600}
        variant={"h4"}
        textAlign={"center"}
        color={"primary"}
        mb={4}
      >
        Promotions
      </Typography>

      <Box mb={4}>
        <Typography
          fontWeight={600}
          variant={"h5"}
          textAlign={"center"}
          color={"primary"}
          mb={2}
        >
          Create Promotion
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="name"
                  label="Name"
                  fullWidth
                  helperText={<ErrorMessage name="name" />}
                />
              </Box>
              <Box mb={2}>
                <input
                  id="picture"
                  name="picture"
                  type="file"
                  onChange={(event) => {
                    setFieldValue("picture", event.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage
                  name="picture"
                  component="div"
                  style={{ color: "red" }}
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="productId"
                  label="Product ID"
                  fullWidth
                  helperText={<ErrorMessage name="productId" />}
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="expireDate"
                  label="Expire Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  helperText={<ErrorMessage name="expireDate" />}
                />
              </Box>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="isActive"
                  label="Is Active"
                  type="checkbox"
                  fullWidth
                  helperText={<ErrorMessage name="isActive" />}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Create Promotion
              </Button>
            </Form>
          )}
        </Formik>
      </Box>

      <Box mb={4}>
        <Typography
          fontWeight={600}
          variant={"h5"}
          textAlign={"center"}
          color={"primary"}
          mb={2}
        >
          All Promotions
        </Typography>
        <DataGrid
          rows={promotions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          autoHeight
        />
      </Box>

      {selectedPromotion && (
        <Box mb={4}>
          <Typography
            fontWeight={600}
            variant={"h5"}
            textAlign={"center"}
            color={"primary"}
            mb={2}
          >
            Edit Promotion
          </Typography>
          <Formik
            initialValues={{
              name: selectedPromotion.name,
              expireDate: selectedPromotion.expireDate,
              isActive: selectedPromotion.isActive,
            }}
            validationSchema={validationForUpdate}
            onSubmit={async (values, { setSubmitting }) => {
              console.log(values);
              await axios
                .patch(
                  `/ads/editAd/${selectedPromotion.id}`,
                  {
                    name: `${values.name}`,
                    expireDate: values.expireDate,
                    isActive: values.isActive,
                  },
                  {
                    headers: {
                      Authorization: "Bearer " + token,
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then(() => {
                  console.log("object");
                  setFetch(!fetch);
                })
                .catch((err) => console.log(err));
            }}
          >
            {({ handleSubmit, setFieldValue, values }) => {
              console.log(values);
              return (
                <Form onSubmit={handleSubmit}>
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Name"
                      fullWidth
                      helperText={<ErrorMessage name="name" />}
                    />
                  </Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      name="expireDate"
                      label="Expire Date"
                      onChange={(date) =>
                        setFieldValue("expireDate", new Date(date.toString()))
                      }
                      renderInput={(props) => <TextField {...props} />}
                      inputFormat="yyyy-MM-dd"
                      InputLabelProps={{ shrink: true }}
                      helperText={<ErrorMessage name="expireDate" />}
                    />
                  </LocalizationProvider>

                  <Box mb={2}>
                    {/* <Field
                    as={TextField}
                    name="expireDate"
                    label="Expire Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    helperText={<ErrorMessage name="expireDate" />}
                  /> */}
                  </Box>
                  <Box
                    mb={2}
                    sx={{
                      display: "flex",
                      gap: "px",
                      alignItems: "center",
                    }}
                  >
                    <Field
                      as={Checkbox}
                      name="isActive"
                      label="IsActive"
                      type="checkbox"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      helperText={<ErrorMessage name="isActive" />}
                    />
                    <Typography>isActive</Typography>
                  </Box>
                  <Button type="submit" variant="contained" color="primary">
                    Update Promotion
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>
      )}
    </Box>
  );
}

export default AllPromotions;
