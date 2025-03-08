import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { useNavigate } from "react-router-dom";
import { boolean } from "yup";
function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCustomers([]);
    async function fetch() {
      await axios
        .get("/user/admin/getAllUser")
        .then((response) => {
          console.log(response.data.data);
          response.data.data.map((p) => {
            setCustomers((prev) => [
              ...prev,
              {
                id: p._id,
                firstName: p.firstName,
                username: p.username,
                email: p.email,
                birthDate: p.birthDate,
                phoneNumber: p.phoneNumber,
                isActive: p.isActive,
                isAdmin: p.isAdmin,
                totalOrders: p.orders.length,
              },
            ]);
          });
        })
        .catch((error) => {
          console.error("There was an error fetching the customers!", error);
        });
    }
    fetch();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "birthDate", headerName: "Birth Date", width: 100 },
    { field: "phoneNumber", headerName: "Phone", width: 110 },
    { field: "isAdmin", type: "boolean", headerName: "Admin", width: 60 },
    { field: "isActive", type: "boolean", headerName: "Active", width: 60 },
    { field: "totalOrders", headerName: "Orders", width: 60 },
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
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      {customers && (
        <DataGrid rows={customers} columns={columns} pageSize={5} />
      )}
    </div>
  );
}

export default AllCustomers;
