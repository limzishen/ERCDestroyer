import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField, Box, Typography } from "@mui/material";
import Papa from "papaparse"; // for parsing CSV
import csvData from "./data";

interface TransactionRow {
  id: number;
  TransactionID: string;
  CreatorID: string;
  CreatorName: string;
  TransactionType: string;
  DonorID: string;
  CountryOfOrigin: string;
  SuspiciousFlag: string;
}

export default function TransactionTable() {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [search, setSearch] = useState("");

  const columns: GridColDef[] = [
    { field: "TransactionID", headerName: "Transaction ID", flex: 1 },
    { field: "CreatorID", headerName: "Creator ID", flex: 1 },
    { field: "CreatorName", headerName: "Creator Name", flex: 1.5 },
    { field: "TransactionType", headerName: "Type", flex: 1 },
    { field: "DonorID", headerName: "Donor ID", flex: 1 },
    { field: "CountryOfOrigin", headerName: "Country", flex: 1.2 },
    { field: "SuspiciousFlag", headerName: "Suspicious?", flex: 1 },
  ];



// Define a type for the transaction data
interface TransactionRow {
  id: number;
  TransactionID: string;
  CreatorID: string;
  CreatorName: string;
  TransactionType: string;
  DonorID: string;
  CountryOfOrigin: string;
  SuspiciousFlag: string;
}

    useEffect(() => {
    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
        const formatted: TransactionRow[] = result.data.map((row: any, index: number) => ({
            id: index,
            TransactionID: row.TransactionID,
            CreatorID: row.CreatorID,
            CreatorName: row.CreatorName,
            TransactionType: row.TransactionType,
            DonorID: row.DonorID,
            CountryOfOrigin: row.CountryOfOrigin,
            SuspiciousFlag: row.SuspiciousFlag,
        }));
        setRows(formatted);
        },
    });
    }, []); 

  // Effect to log the rows after the state has been updated
  useEffect(() => {
    if (rows.length > 0) {
      console.log(rows);
    }
  }, [rows]);

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box sx={{ height: 600, width: "100%", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Transaction Table
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        sx={{
          color: "black",
          "& .MuiDataGrid-columnHeaders": {
            color: "black",
          },
        }}
      />
    </Box>
  );
}