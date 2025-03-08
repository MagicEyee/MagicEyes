/* eslint-disable react/prop-types */
import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import axios from "axios";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { GridToolbarFilterButton } from "@mui/x-data-grid";
function Inventory({ setSelectedState, setChoosenProduct }) {
  const [rows, setRows] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({
    items: [],
  });
  const navigate = useNavigate();

  function EditToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <Button
          color={"success"}
          variant={"contained"}
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedState("createProduct");
          }}
        >
          Add Product
        </Button>
        <Button
          color={"warning"}
          variant={"contained"}
          onClick={() => {
            console.log(filterModel);
            if (filterModel.items[0]) {
              setFilterModel({
                items: [],
              });
            } else {
              setFilterModel({
                items: [{ field: "stock", operator: "<", value: 10 }],
              });
            }
          }}
        >
          {filterModel.items[0] ? "All" : "  Almost Out"}
        </Button>
        <Button
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => {
            setSelectedState("EditProduct");
          }}
          variant="contained"
        >
          Edit Product
        </Button>
      </GridToolbarContainer>
    );
  }
  useEffect(() => {
    setRows([]);
    axios
      .get("/product/getAll")
      .then((response) => {
        response.data.data.map((product) =>
          setRows((prev) => [
            ...prev,
            {
              id: product._id,
              Name: product.Name,
              Brand: product.Brand,
              MainCategory: product.mainCategory,
              image: product.images[0].secure_url,
              price: product.price,
              stock: product.invertoryStock,
              available: true,
            },
          ])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
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
      field: "MainCategory",
      headerName: "MainCategory",
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
      type: "number",
    },
    {
      field: "available",
      headerName: "available",
      type: "boolean",
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
              setChoosenProduct(pr.row.id);
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
  return (
    <>
      {" "}
      <Typography
        fontWeight={600}
        variant={"h4"}
        textAlign={"center"}
        color={"primary"}
      >
        Warehouse
      </Typography>
      <DataGrid
        slots={{ toolbar: EditToolbar }}
        rows={rows}
        initialState={{
          filter: {
            filterModel: {
              items: [{ field: "stock", operator: ">", value: null }],
            },
          },
        }}
        filterModel={filterModel}
        pageSizeOptions={[1, 5, 10, 20]}
        sx={{
          height: "calc(100vh - 150px)",
          maxWidth: "calc(100%)",
        }}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        columns={columns}
      ></DataGrid>
    </>
  );
}

export default Inventory;
