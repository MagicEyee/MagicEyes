import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle"; //change
import { Box, Button } from "@mui/material";
function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [choosen, setChoosen] = useState(null);
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
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "isAdmin", type: "boolean", headerName: "Admin", width: 60 },
    { field: "isActive", type: "boolean", headerName: "Active", width: 60 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (pr) => {
        return [
          <GridActionsCellItem
            icon={<ChangeCircleIcon />}
            onClick={async () => {
              setChoosen({
                id: pr.row.id,
                cur: pr.row.isAdmin,
                name: pr.row.username,
              });
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
      {choosen && (
        <Box
          sx={{
            maxWidth: "600px",
            margin: "50px auto 0",
            padding: "20px",
            textAlign: "center",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Change Status Box
          </h2>
          <p>
            <p>Are you sure you want to change the status of this user with </p>
            <p>
              {" "}
              <span
                style={{
                  fontWeight: 600,
                }}
              >
                {" "}
                ID:
              </span>{" "}
              {choosen.id}
            </p>
            <p>
              <span
                style={{
                  fontWeight: 600,
                }}
              >
                UserName:
              </span>{" "}
              {choosen.name}
            </p>
            <span
              style={{
                fontWeight: 600,
              }}
            >
              To be:
            </span>{" "}
            {!choosen.cur ? "Admin" : "User"}
          </p>
          <Button
            variant="contained"
            size="small"
            onClick={async () => {
              if (choosen.cur) {
                await axios.patch(
                  `/user/admin/changeAdminToUser/${choosen.id}`
                );
                setChoosen(null);
              } else {
                await axios.patch(
                  `/user/admin/changeUserToAdmin/${choosen.id}`
                );
                setChoosen(null);
              }
            }}
            style={{ marginLeft: "10px", fontWeight: 700 }}
            color="primary"
          >
            Change {choosen.cur ? "Admin" : "User"} Status
          </Button>
        </Box>
      )}
    </div>
  );
}

export default AllCustomers;
