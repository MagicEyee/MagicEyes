import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  categoryName: Yup.string().required("Category name is required"),
});

function AllCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch all categories from the server

    async function fetchData() {
      await axios
        .get("/category/getAll")
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the categories!", error);
        });
    }
    fetchData();
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    axios
      .post("/api/categories", { name: values.categoryName })
      .then((response) => {
        setCategories([...categories, response.data]);
        resetForm();
      })
      .catch((error) => {
        console.error("There was an error creating the category!", error);
      });
  };

  return (
    <div>
      <h1>All Categories</h1>
      <Formik
        initialValues={{ categoryName: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div>
              <label htmlFor="categoryName">Category Name</label>
              <Field name="categoryName" />
              {errors.categoryName && touched.categoryName ? (
                <div>{errors.categoryName}</div>
              ) : null}
            </div>
            <button type="submit">Create Category</button>
          </Form>
        )}
      </Formik>

      <h2>Categories List</h2>
      <div>
        {categories ? (
          <div>
            {categories.map((category) => (
              <div key={category.id}>{category.name}</div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AllCategory;
