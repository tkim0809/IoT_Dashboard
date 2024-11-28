import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Paper from '@mui/material/Paper';
import { useStyledTableComponents } from './Util.tsx'; 

export default function AirlineTable({ data, pageCount, itemsPerPage, handleLevelChange }) {
  const { StyledTableCell, StyledTableRow } = useStyledTableComponents();
  // Slice the data to show only items for the current page
  const paginatedData = data.slice(pageCount, pageCount + itemsPerPage);

  const handleRowClick = (airline) => {
    handleLevelChange("airlines", airline); 
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="airlines table">
        <TableHead>
          <TableRow  sx={{backgroundColor: "#646cff"}}>
            <TableCell sx={{color: "white"}}>Airline Name</TableCell>
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
              <div style={{display: 'flex', gap: "20px", justifyContent: "center", alignItems: "center"}}> 
            <img src={require('../assets/img/logoPlaceholder.png')} alt="" style={{border: "1px solid", width: "60px", height: "60px"}}></img>
            <span>{row}</span>
            </div>
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
