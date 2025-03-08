/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Button } from "@mui/material";
const validationSchema = Yup.object({
  productId: Yup.string().required("Please select a product"),
});
import { useSelector } from "react-redux";
function EditProduct({ selectedIDD }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedID, setSelectedID] = useState(null);
  const [category, setCategory] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [Error, setError] = useState(null);
  useEffect(() => {
    if (selectedIDD) {
      setSelectedID(selectedIDD);
      console.log(selectedIDD);
    }
    async function fetchData() {
      await axios.get("/product/getAll").then((response) => {
        setProducts(response.data.data);
      });
    }
    fetchData();
    async function fetch() {
      await axios
        .get("/category/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const cat = [];
          response.data.map((item) => {
            cat.push({
              id: item._id,
              name: item.name,
            });
            setCategory(cat);
          });
        });
    }
    fetch();
  }, []);

  useEffect(() => {
    setError(null);
    if (!selectedID) return;
    async function fetchData() {
      await axios
        .get(`/product/get/${selectedID}`)
        .then((response) => {
          setSelectedProduct(response.data.data);
          console.log(response.data.data);
        })
        .catch((error) => {
          setError("There was an error fetching the product details!");
        });
    }
    fetchData();
  }, [selectedID]);

  return (
    <Box>
      <Typography
        fontWeight={600}
        variant={"h4"}
        textAlign={"center"}
        color={"primary"}
        mb={4}
      >
        Edit Product
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f3f3f3",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
          margin: "0 auto",
          border: "1px solid black",
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: "25px",
            marginBottom: "10px",
            color: "black",
            textTransform: "capitalize",
          }}
        >
          change the choosen Product
        </Typography>
        <Formik
          initialValues={{ productId: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setSelectedID(values.productId);
          }}
        >
          {({ errors, touched, setFieldValue }) => {
            return (
              <Form>
                <div>
                  <Autocomplete
                    id="product-autocomplete"
                    options={products}
                    getOptionLabel={(option) => option.Name}
                    onChange={(event, newValue) => {
                      setFieldValue("productId", newValue?._id);
                      setSelectedProduct(newValue);
                      setSelectedID(newValue?._id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Products"
                        name="productId"
                        error={touched.productId && Boolean(errors.productId)}
                        helperText={touched.productId && errors.productId}
                      />
                    )}
                    sx={{ width: 300 }}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Box>

      {selectedID && selectedProduct && !Error && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#f3f3f3",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            margin: "60px auto",
            border: "1px solid black",
          }}
        >
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "25px",
              marginBottom: "10px",
              color: "black",
              textTransform: "capitalize",
            }}
          >
            details of the choosen One
          </Typography>

          <Formik
            initialValues={{
              Name: selectedProduct.Name,
              Brand: selectedProduct.Brand,
              inStock: selectedProduct.inStock,
              available: selectedProduct.avaliable,
              SalePrice: selectedProduct.SalePrice,
              thereIsSale: selectedProduct.thereIsSale,
              Description: selectedProduct.Description,
              Price: selectedProduct.price,
              invertoryStock: selectedProduct.invertoryStock,
              mainCategory: selectedProduct.mainCategoryID,
            }}
            validationSchema={Yup.object({
              Name: Yup.string(),
              Brand: Yup.string(),
              inStock: Yup.boolean(),
              available: Yup.boolean(),
              SalePrice: Yup.number("the sale price must be number").positive(
                "the sale price must be >=0"
              ),
              thereIsSale: Yup.boolean(),
              Description: Yup.string(),
              Price: Yup.number("the price must be a number"),
              invertoryStock: Yup.number(),
              mainCategory: Yup.string(),
            })}
            onSubmit={async (values) => {
              await axios.patch(
                `/product/admin/Edit/${selectedProduct._id}`,
                values,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              // setSelectedID(values.productId);
            }}
          >
            {({ errors, touched, values, setFieldValue }) => {
              return (
                <Form>
                  <Field
                    error={touched.Brand && Boolean(errors.Brand)}
                    helperText={<ErrorMessage name="Brand" />}
                    id="Brand"
                    name="Brand"
                    label="Brand"
                    as={TextField}
                  />
                  <Field
                    error={touched.Name && Boolean(errors.Name)}
                    helperText={<ErrorMessage name="Name" />}
                    id="Name"
                    name="Name"
                    label="Name"
                    as={TextField}
                  />

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
                    </Field>
                    <ErrorMessage
                      name="mainCategory"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </FormControl>
                  <Field
                    error={touched.Price && Boolean(errors.Price)}
                    id="Price"
                    name="Price"
                    label="Price"
                    as={TextField}
                    helperText={<ErrorMessage name="Price" />}
                  />
                  <Field
                    error={
                      touched.invertoryStock && Boolean(errors.invertoryStock)
                    }
                    helperText={<ErrorMessage name="invertoryStock" />}
                    id="invertoryStock"
                    name="invertoryStock"
                    label="invertoryStock"
                    as={TextField}
                  />
                  <Box
                    mb={2}
                    sx={{
                      display: "flex",
                      gap: "px",
                      alignItems: "center",
                    }}
                  >
                    <Field
                      error={touched.inStock && Boolean(errors.inStock)}
                      helperText={<ErrorMessage name="inStock" />}
                      as={Checkbox}
                      name="inStock"
                      label="inStock"
                      type="checkbox"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      helpertext={<ErrorMessage name="inStock" />}
                    />
                    <Typography>inStock</Typography>
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
                      error={touched.thereIsSale && Boolean(errors.thereIsSale)}
                      helperText={<ErrorMessage name="thereIsSale" />}
                      as={Checkbox}
                      name="thereIsSale"
                      label="thereIsSale"
                      type="checkbox"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      helpertext={<ErrorMessage name="thereIsSale" />}
                    />
                    <Typography>thereIsSale</Typography>
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
                      name="available"
                      error={touched.available && Boolean(errors.available)}
                      helperText={<ErrorMessage name="available" />}
                      label="available"
                      type="checkbox"
                      sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      helpertext={<ErrorMessage name="available" />}
                    />
                    <Typography>available</Typography>
                  </Box>

                  <Field
                    id="SalePrice"
                    error={touched.SalePrice && Boolean(errors.SalePrice)}
                    helperText={<ErrorMessage name="SalePrice" />}
                    name="SalePrice"
                    label="SalePrice"
                    as={TextField}
                  />
                  <Field
                    error={touched.Description && Boolean(errors.Description)}
                    helperText={<ErrorMessage name="Description" />}
                    id="Description"
                    name="Description"
                    label="Description"
                    as={TextField}
                  />

                  <Button variant="contained" color="primary" type="submit">
                    Update Product
                  </Button>
                </Form>
              );
            }}
          </Formik>

          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              await axios.delete(
                `/product/admin/Delete/${selectedProduct._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setSelectedID(null);
            }}
          >
            Delete Product
          </Button>

          <Button
            variant="contained"
            color="default"
            onClick={() => {
              setSelectedID(null);
            }}
          >
            Cancel
          </Button>
        </Box>
      )}
      {Error && <Alert severity="error">{Error}</Alert>}
    </Box>
  );
}

export default EditProduct;
