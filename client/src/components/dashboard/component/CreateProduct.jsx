import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import { useSelector } from "react-redux";
import AllProducts from "./AllProducts";
import Dropzone from "react-dropzone";
import { useEffect, useState } from "react";

const CreateProduct = () => {
  const [category, setCategory] = useState([]);
  const [Brands, setBrands] = useState([]);
  useEffect(() => {
    async function fetch() {
      await axios
        .get("/category/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          const cat = [];
          response.data.map((item) => {
            cat.push({
              id: item._id,
              name: item.name,
            });
            setCategory(cat);
          });
        });

      axios.get("/Brands/").then((response) => {
        console.log(response.data);
        const cat = [];
        response.data.data.map((item) => {
          cat.push({
            name: item.name,
          });
          setBrands(cat);
        });
      });
    }
    fetch();
  }, []);

  const token = useSelector((state) => state.auth.token);
  const initialValues = {
    name: "",
    brand: "",
    price: "",
    stock: "",
    mainCategory: "",
    images: null,
    description: "",
    thereIsSale: false,
  };
  console.log(token);
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    brand: Yup.string().required("Required"),
    // category: Yup.string().required("Required"),
    price: Yup.number().required("Required").positive("Must be positive"),
    stock: Yup.number().required("Required").min(0, "Must be at least 0"),
    mainCategory: Yup.string().required("Required"),
    images: Yup.mixed().required("Required"),
    description: Yup.string(),
    thereIsSale: Yup.boolean().required("field is required"),
    salePrice: Yup.number("Must be at least 0"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    console.log("values", values);
    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("Brand", values.brand);
    formData.append("price", values.price);
    formData.append("invertoryStock", values.stock);
    formData.append("mainCategoryID", values.mainCategory);
    formData.append("description", values.description);
    formData.append("thereIsSale", values.thereIsSale);
    if (values.thereIsSale) {
      formData.append("salePrice", values.salePrice);
    }

    values.images.forEach((file) => {
      formData.append("picture", file);
    });
    const picture = [];
    values.images.forEach((file) => {
      picture.push(file);
      console.log("file", file);
    });
    await axios
      .post("/product/admin/createProduct", formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "form-data",
        },
      })
      .then((response) => {
        console.log("Product created successfully", response.data);
        // navigate("/dashboard");
      })
      .catch((error) => {
        console.error("There was an error creating the product!", error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Box sx={{ maxWidth: "100vw", mx: "auto", mt: 4 }}>
        <Typography
          fontWeight={600}
          variant={"h4"}
          textAlign={"center"}
          color={"primary"}
        >
          Create Product
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, isSubmitting, touched, errors, setFieldValue }) => {
            // console.log(values);
            return (
              <Form
                style={{
                  margin: "auto",
                  maxWidth: "500px",
                }}
              >
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="name"
                    label="Product Name"
                    fullWidth
                    helperText={<ErrorMessage name="name" />}
                    error={touched.name && Boolean(errors.name)}
                  />
                </Box>
                <Box mb={2}>
                  {/* <Field
                    as={TextField}
                    name="brand"
                    label="Brand"
                    fullWidth
                    helperText={<ErrorMessage name="brand" />}
                    error={touched.brand && Boolean(errors.brand)}
                  /> */}

                  <FormControl
                    fullWidth
                    error={touched.brand && Boolean(errors.brand)}
                  >
                    <InputLabel>Brands</InputLabel>
                    <Field as={Select} name="brand" label="Brands">
                      {Brands.map((item, i) => {
                        return (
                          <MenuItem key={i} value={item.name}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="brand"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormControl>
                </Box>

                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    helperText={<ErrorMessage name="price" />}
                    error={touched.price && Boolean(errors.price)}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="stock"
                    label="Stock"
                    type="number"
                    fullWidth
                    helperText={<ErrorMessage name="stock" />}
                    error={touched.stock && Boolean(errors.stock)}
                  />
                </Box>

                <Box mb={2}>
                  <FormControl
                    fullWidth
                    error={touched.mainCategory && Boolean(errors.mainCategory)}
                  >
                    <InputLabel>Main Category</InputLabel>
                    <Field
                      as={Select}
                      name="mainCategory"
                      label="Main Category"
                    >
                      {category.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        );
                      })}
                      {/* <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Clothing">Clothing</MenuItem>
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Books">Books</MenuItem> */}
                    </Field>
                    <ErrorMessage
                      name="mainCategory"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormControl>
                </Box>
                <Box mb={2}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description"
                    fullWidth
                    helperText={<ErrorMessage name="stock" />}
                    error={touched.stock && Boolean(errors.stock)}
                  />
                </Box>
                <Box
                  mb={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Field
                    as={Checkbox}
                    name="thereIsSale"
                    label="thereIsSale"
                    fullWidth
                    helperText={<ErrorMessage name="stock" />}
                    error={touched.stock && Boolean(errors.stock)}
                  />
                  <ErrorMessage
                    name="thereIsSale"
                    component="div"
                    style={{ color: "red" }}
                  />
                  <Typography>There is Sale</Typography>
                </Box>
                {values.thereIsSale && (
                  <Box mb={2}>
                    <Field
                      as={TextField}
                      name="salePrice"
                      label="Sale Price"
                      fullWidth
                      helperText={<ErrorMessage name="category" />}
                      error={touched.category && Boolean(errors.category)}
                    />
                  </Box>
                )}
                <Box mb={2}>
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      setFieldValue("images", acceptedFiles);
                      console.log("Image:", acceptedFiles);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        style={{
                          border: "1px dashed gray",
                          padding: "20px",
                          textAlign: "center",
                        }}
                      >
                        <input {...getInputProps()} />

                        {values.images ? (
                          <>
                            <Typography
                              variant={"h6"}
                              color={"primary"}
                              textAlign={"center"}
                              mb={2}
                            >
                              Images uploaded: {values.images.length}
                            </Typography>
                            {values.images.map((file, index) => (
                              <div key={index}>
                                {index + 1}. {file.name}
                              </div>
                            ))}
                            <Button onClick={() => (values.images = null)}>
                              Reset
                            </Button>
                          </>
                        ) : (
                          <>
                            <p>
                              Drag 'n' drop some files here, or click to select
                              files
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </Dropzone>
                  <ErrorMessage
                    name="images"
                    component="div"
                    style={{ color: "red" }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Create Product
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Box>
      <Box sx={{ maxWidth: "calc(100vw - 140px)", mx: "auto", mt: 4 }}>
        <AllProducts />
      </Box>
    </>
  );
};

export default CreateProduct;
