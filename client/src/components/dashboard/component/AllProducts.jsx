/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import axios from "axios";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GridToolbarExport } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box } from "@mui/material";
function AllProducts({ setSelectedState, setChoosenProduct }) {
  const navigate = useNavigate();
  function EditToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
        }}
      >
        <Box
          style={{
            flexGrow: 1,
            display: "flex",
            gap: "10px",
          }}
        >
          <GridToolbarExport />
          <Button
            color="success"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedState("createProduct");
            }}
          >
            Add Product
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setSelectedState("EditProduct");
            }}
          >
            Edit Product
          </Button>
        </Box>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  const [rows, setRows] = React.useState([]);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
    },
    {
      field: "image",
      headerName: "Image",
      width: 70,
      renderCell: (params) => (
        <img
          src={params.row.image}
          alt="Product Image"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      field: "Name",
      headerName: "Name",
      width: 150,
    },

    {
      field: "Brand",
      headerName: "Brand",
      width: 150,
    },
    {
      field: "MainCategory",
      headerName: "MainCategory",
      width: 150,
    },
    {
      field: "categories",
      headerName: "categories",
      width: 150,
    },

    {
      field: "price",
      headerName: "Price",
      width: 150,
    },
    {
      field: "stock",
      headerName: "Stock",
    },
    {
      field: "orderedManyTimes",
      headerName: "ordered",
    },
    {
      field: "returnedManyTimes",
      headerName: "Returned",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (pr) => {
        return [
          <GridActionsCellItem
            icon={<SettingsSuggestIcon />}
            onClick={() => {
              setSelectedState("EditProduct");
              setChoosenProduct(pr.id);
            }}
            key={pr.id}
            label="Details"
            className="textPrimary"
            color="inherit"
          />,
        ];
      },
    },
  ];
  useEffect(() => {
    setRows([]);
    axios
      .get("/product/getAll")
      .then((response) => {
        console.log(response.data.data);
        response.data.data.map((product) =>
          setRows((prev) => [
            ...prev,
            {
              id: product._id,
              Name: product.Name,
              Brand: product.Brand,
              MainCategory: product.mainCategory,
              categories: product.categories.join(", "),
              image: product.images[0].secure_url,
              price: product.price,
              stock: product.invertoryStock,
              orderedManyTimes: product.orderedManyTimes,
              returnedManyTimes: product.returnedManyTimes,
            },
          ])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <Box maxHeight={"calc(100%)"}>
      <Typography
        fontWeight={600}
        variant={"h4"}
        textAlign={"center"}
        color={"primary"}
      >
        All Products
      </Typography>

      <DataGrid
        slots={{ toolbar: EditToolbar }}
        rows={rows}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        columns={columns}
        pageSizeOptions={[1, 5, 10, 20]}
      ></DataGrid>
    </Box>
  );
}

export default AllProducts;
