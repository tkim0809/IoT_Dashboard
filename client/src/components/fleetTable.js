import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useStyledTableComponents } from './Util.tsx'; 


export default function FleetTable({ fleets, pageCount, itemsPerPage, handleLevelChange }) {
  const { StyledTableCell, StyledTableRow } = useStyledTableComponents();
  const paginatedData = fleets.slice(pageCount, pageCount + itemsPerPage);

  const handleRowClick = (fleet) => {
    handleLevelChange("fleet", fleet); 
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="airlines table">
        <TableHead>
          <TableRow  sx={{backgroundColor: "#646cff"}}>
            <TableCell sx={{color: "white"}}>Fleet Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => (
            <StyledTableRow
            key={index}
            sx={{ height: 67 }}
            onClick={() => handleRowClick(row)} 
          >
              <TableCell component="th" scope="row">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{row}</span>
                    <ChevronRightIcon />
                </div>  
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}