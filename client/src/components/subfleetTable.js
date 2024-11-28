import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useStyledTableComponents, ProgressDisplay } from './Util.tsx'; 
import { Tab } from '@mui/material';


export default function SubfleetTable({ subfleets, pageCount, itemsPerPage, handleLevelChange }) {
  const { StyledTableCell, StyledTableRow } = useStyledTableComponents();
  const paginatedData = subfleets.slice(pageCount, pageCount + itemsPerPage);

  const handleRowClick = (subfleet) => {
    handleLevelChange("subfleets", subfleet); 
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="airlines table">
        <TableHead>
          <TableRow  sx={{backgroundColor: "#646cff"}}>
            <TableCell>Fleet Name</TableCell>
            <TableCell># Tails</TableCell>
            <TableCell>Started</TableCell>
            <TableCell>Finished</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) => (
            <StyledTableRow
            key={index}
            sx={{height: 67 }}
            onClick={() => handleRowClick(row)} 
          >
              <TableCell component="th" scope="row">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{row}</span>
                </div>  
              </TableCell>
              <TableCell>55</TableCell>
              <TableCell>25</TableCell>
              <TableCell>20</TableCell>
              <TableCell style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <ProgressDisplay progress={50}></ProgressDisplay>
                <ChevronRightIcon />
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}