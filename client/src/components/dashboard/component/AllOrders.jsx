/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useEffect } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Typography, Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";

function AllOrders({ setSelectedState, setChoosenOrder }) {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);

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
            color="primary"
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setSelectedState("EditOrder");
            }}
          >
            Edit Order
          </Button>
        </Box>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    console.log("object");
    setRows([]);
    async function fetchData() {
      await axios.get("/order/admin/getAllOredrsForAdmin").then((response) => {
        console.log(response.data);
        response.data.data.map((p) => {
          console.log();

          setRows((prevRows) => [
            ...prevRows,
            {
              id: p.trackingNumber,
              idd: p._id,
              customerName: p.customerName,
              phoneNumber: p.phoneNumber,
              TotalPrice: p.totalPrice,
              status: p.status,
              paymentMethod: p.paymentMethod,
              createdAt: new Date(p.createdAt),
            },
          ]);
        });
      });
    }
    fetchData();
  }, []);

  const columns = [
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
      valueFormatter: (params) => {
        return dayjs(params).format("DD/MM/YYYY");
      },
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
              setSelectedState("EditOrder");
              console.log(pr.row.idd);
              setChoosenOrder(pr.row.idd);
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
    <div>
      <Typography
        fontWeight={600}
        variant={"h4"}
        textAlign={"center"}
        color={"primary"}
      >
        All Orders
      </Typography>

      <DataGrid
        sx={{
          height: "calc(100vh - 160px)",
          maxWidth: "calc(100%)",
        }}
        rows={rows}
        columns={columns}
        // initialState={{
        //   columns: {
        //     columnVisibilityModel: {
        //       idd: false,
        //     },
        //   },
        //   sorting: {
        //     sortModel: [
        //       {
        //         field: "createdAt",
        //         sort: "desc",
        //       },
        //     ],
        //   },
        //   pagination: {
        //     paginationModel: {
        //       pageSize: 5,
        //     },
        //   },
        // }}
        pageSizeOptions={[1, 5, 10, 20]}
        checkboxSelection
        slots={{ toolbar: EditToolbar }}
        disableColumnSelector
        disableDensitySelector
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </div>
  );
}

export default AllOrders;
