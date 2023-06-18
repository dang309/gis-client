import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { styled } from "@mui/material/styles";

import stateData from "../utils/stateData";
import { Paper } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const TABLE_HEADERS = [
  {
    title: "State",
  },
  {
    title: "Cases",
  },
  {
    title: "Deaths",
  },
  {
    title: "Recovered",
  },
  {
    title: "Tests",
  },
  {
    title: "Population",
  },
];

export default function DataTable() {
  return (
    <TableContainer component={Paper} elevation={4} sx={{ maxHeight: "256px" }}>
      <Table sx={{ width: "100%" }} stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            {TABLE_HEADERS &&
              TABLE_HEADERS.map((item) => {
                return (
                  <TableCell key={item.title} sx={{ fontWeight: 700 }}>
                    {item.title}
                  </TableCell>
                );
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {stateData &&
            stateData.map((row) => (
              <TableRow
                hover
                key={row.State}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ fontWeight: 700 }}>{row.State}</TableCell>
                <TableCell>{row["Total Cases"].toLocaleString()}</TableCell>
                <TableCell>{row["Total Deaths"].toLocaleString()}</TableCell>
                <TableCell>{row["Total Recovered"].toLocaleString()}</TableCell>
                <TableCell>{row["Total Tests"].toLocaleString()}</TableCell>
                <TableCell>{row.Population.toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
