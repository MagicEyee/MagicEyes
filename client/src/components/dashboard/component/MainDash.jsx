import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { useNavigate } from "react-router-dom";
function MainDash() {
  const [Prows, setPRows] = useState([]);
  const [Orows, setORows] = useState([]);
  const navigate = useNavigate();
  const columnsForProduct = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "image",
      headerName: "image",
      width: 70,
      renderCell: (params) => (
        <img
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
          src={params.value}
        />
      ),
    },
    {
      field: "Name",
      headerName: "Name",
      width: 150,
      editable: true,
      sortable: true,
    },
    {
      field: "Brand",
      headerName: "Brand",
      width: 150,
      sortable: true,
    },
    {
      field: "MainCategory",
      headerName: "Main Category",
      width: 150,
      sortable: true,
    },

    {
      field: "price",
      headerName: "price",
      width: 70,
      sortable: true,
    },
    {
      field: "invertoryStock",
      headerName: "Stock",
      width: 70,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: "created At",
      type: "date",
      width: 150,
      sortable: true,
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
              navigate("/productDetails/" + pr.id);
            }}
            key={pr.id}
            label="Details"
            className="textPrimary"
            // onClick={Navigate()}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const columnsForOrder = [
    { field: "id", headerName: "Tracking Number", width: 90 },
    { field: "idd", headerName: "id", width: 90 },

    {
      field: "customerName",
      headerName: "customer Name",
      width: 150,
    },
    {
      field: "phoneNumber",
      headerName: "phone Number",
      width: 150,
    },
    {
      field: "TotalPrice",
      headerName: "Total Price",
      width: 150,
    },
    {
      field: "status",
      headerName: "status",
      type: "String",
      width: 150,
    },
    {
      field: "paymentMethod",
      headerName: "payment Method",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "created At",
      type: "date",
      width: 150,
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
              navigate("/productDetails/" + pr.row.idd);
            }}
            key={pr.id}
            label="Details"
            className="textPrimary"
            // onClick={Navigate()}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    setORows([]);
    setPRows([]);
    async function fetchData() {
      await axios.get("/product/getAll").then((response) => {
        response.data.data.map((p) => {
          setPRows((prev) => [
            ...prev,
            {
              id: p._id,

              image: p.images[0].secure_url,
              Name: p.Name,
              Brand: p.Brand,
              MainCategory: p.mainCategory,
              price: p.price,
              invertoryStock: p.invertoryStock,
              createdAt: new Date(p.createdAt),
            },
          ]);
        });
      });
      await axios.get("/order/admin/getAllOredrsForAdmin").then((response) => {
        response.data.data.map((o) => {
          setORows((prev) => [
            ...prev,
            {
              id: o.trackingNumber,
              idd: o._id,
              customerName: o.customerName,
              phoneNumber: o.phoneNumber,
              TotalPrice: o.totalPrice,
              status: o.status,
              paymentMethod: o.paymentMethod,
              createdAt: new Date(o.createdAt),
            },
          ]);
        });
      });
    }
    fetchData();
  }, []);

  return (
    <Box
      component={"section"}
      sx={{
        display: "flex",
        gap: "20px",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: "50%",
        }}
        width={"100%"}
      >
        <Typography
          fontWeight={"600"}
          color={"primary"}
          textAlign={"center"}
          variant="h5"
          paddingBottom={"5px"}
        >
          New Orders
        </Typography>

        <>
          {Orows === 0 ? null : (
            <DataGrid
              style={{
                maxWidth: "calc(100%)",
              }}
              rows={Orows}
              columns={columnsForOrder}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    idd: false,
                  },
                },
                sorting: {
                  sortModel: [
                    {
                      field: "createdAt",
                      sort: "desc",
                    },
                  ],
                },
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[1, 5, 10, 20]}
              checkboxSelection
            />
          )}
        </>
      </Box>
      <Box>
        <Typography
          fontWeight={"600"}
          color={"primary"}
          textAlign={"center"}
          variant="h5"
          paddingBottom={"5px"}
        >
          New Products
        </Typography>
        {Prows.length === 0 ? null : (
          <DataGrid
            style={{
              maxWidth: "calc(100%)",
            }}
            width={"100%"}
            rows={Prows}
            columns={columnsForProduct}
            initialState={{
              sorting: {
                sortModel: [
                  {
                    field: "createdAt",
                    sort: "desc",
                  },
                ],
              },
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[1, 5, 10, 20]}
            checkboxSelection
          />
        )}
      </Box>
    </Box>
  );
}

export default MainDash;
