import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await axios.get(
          "http://localhost:3001/message/getAll"
        );
        const feedbackData = response.data.data.map((p) => ({
          id: p._id,
          name: p.Name,
          email: p.Email,
          phone: p.Phone,
          message: p.Message,
          isResponsed: p.response ? true : false,
          response: p.response ? p.response : "there is no response",
        }));
        setFeedbacks(feedbackData);
      } catch (error) {
        console.error("There was an error fetching the feedbacks!", error);
      }
    }

    fetchFeedbacks();
  }, []);

  const columns = [
    { field: "id", headerName: "USER ID", width: 90 },
    { field: "name", headerName: "Name", width: 100 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "message", headerName: "Message", width: 250 },
    {
      field: "isResponsed",
      type: "boolean",
      headerName: "Is Responsed",
      width: 150,
    },
    { field: "response", headerName: "Response", width: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: (params) => {
        if (params.row.isResponsed === false) {
          return [
            <GridActionsCellItem
              icon={<FontAwesomeIcon icon={faReply} />}
              onClick={() => {
                // navigate("/productDetails/" + params.id);
              }}
              key={params.id}
              label="Details"
              className="textPrimary"
              color="inherit"
            />,
          ];
        } else {
          return [
            <GridActionsCellItem
              disabled={true}
              icon={<FontAwesomeIcon icon={faReply} />}
              onClick={() => {
                // navigate("/productDetails/" + params.id);
              }}
              key={params.id}
              label="Response"
              className="textPrimary"
              color="inherit"
            />,
          ];
        }
      },
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
        Customer Feedbacks
      </Typography>
      <DataGrid
        rows={feedbacks}
        columns={columns}
        pageSize={10}
        pageSizeOptions={[1, 5, 10, 20]}
        initialState={{
          filter: {
            filterModel: {
              items: [
                {
                  field: "isResponsed",
                  operator: "is",
                  value: false,
                },
              ],
            },
          },
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
      />
    </Box>
  );
}

export default Feedbacks;
