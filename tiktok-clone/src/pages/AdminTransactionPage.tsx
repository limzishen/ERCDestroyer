import React from "react";
import { Box, Typography, AppBar, Toolbar } from "@mui/material";
import TransactionTable from "../components/filtertable";

export default function AdminTransactionPage() {
  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Dashboard - Transactions
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <TransactionTable />
      </Box>
    </Box>
  );
}