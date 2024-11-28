import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Dashboard } from './Dashboard.tsx';

import { useTheme } from '@mui/material/styles';
import { useStyledTableComponents, ProgressDisplay } from './Util.tsx'; 

const tails = [
  ["TD0101", { status: 'inprogress', started: '8', finished: '3', queued: '5' }],
  ["TD0102", { status: 'finished', started: '7', finished: '7', queued: '0' }],
  ["TD0103", { status: 'queued', started: '4', finished: '1', queued: '15' }],
  ["TD0104", { status: 'failed', started: '6', finished: '0', queued: '3' }],
  ["TD0105", { status: 'inprogress', started: '2', finished: '2', queued: '6' }],
  ["TD0106", { status: 'finished', started: '10', finished: '10', queued: '0' }],
  ["TD0107", { status: 'queued', started: '3', finished: '0', queued: '20' }],
  ["TD0108", { status: 'failed', started: '1', finished: '0', queued: '5' }],
  ["TD0109", { status: 'inprogress', started: '5', finished: '3', queued: '4' }],
  ["TD0110", { status: 'finished', started: '9', finished: '9', queued: '1' }]
];

const CustomHeader = ({ level }) => {
  return (
    <TableHead>
      <TableRow style={{ backgroundColor: "#646cff" }}>
        <TableCell width='3%'/>
        {level == "subfleets" ? (
        <TableCell align="left" style={{color: "white"}}>Sub fleets</TableCell>
        ): 
        <TableCell align="left" style={{color: "white"}}>Tail IDs</TableCell>
        }
        {level == "subfleets" ? (
          <React.Fragment>
            <TableCell style={{color: "white"}}>Tails</TableCell>
            <TableCell style={{color: "white"}}>Started</TableCell>
            <TableCell style={{color: "white"}}>Finished</TableCell>
            <TableCell style={{color: "white"}}>Percentage</TableCell>
          </React.Fragment>
        ) : null}

        {/* <TableCell style={{}} align="right">
          Airline
        </TableCell> */}
      </TableRow>
    </TableHead>
  );
  
}

function Row(props) {
    const { airlineName, fleetName, subfleetName, row, index, transfers, level, handleClick, itemsPerPage, isDarkMode } = props;
    console.log(level);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
  
    return (
      <React.Fragment>
        <TableRow 
            sx={{ '& > *': { borderBottom: 'unset' }, 
                  backgroundColor: index % 2 !== 0
                      ? (!isDarkMode ? theme.palette.action.hover : '#1E1E1E') 
                      : (isDarkMode ? '#2E2E2E' : theme.palette.action.default),
                  borderTop: "1px solid rgba(255, 255, 255, 0.2)", height: "auto" }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          { level === 'subfleets' ? ( //This is the issue
          <TableCell onClick={handleClick} component="th" scope="row">
            {row.subfleet.replace(/_/g, ' ')}
          </TableCell>
          ) : (
            <TableCell onClick={handleClick} component="th" scope="row">
            {row}
          </TableCell>
          )}

          { level == 'subfleets' ? (
                <React.Fragment>
                  <TableCell>{row.tailIDCount}</TableCell>
                  <TableCell>{row.tailIDInProgress}</TableCell>
                  <TableCell>{row.tailIDFinished}</TableCell>
                  <TableCell style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "95%" }}>
                  <ProgressDisplay style={{width: "100%"}} progress = {row.tailIDCount === 0 ? 0 : row.tailIDFinished / row.tailIDCount}></ProgressDisplay>
                  </TableCell>
                </React.Fragment>
              ) : null}
          {/* <TableCell align="right">{row.airline}</TableCell> */}
        </TableRow>
        <TableRow>
          <TableCell style={{ padding: "0px", border: open ? "1px solid rgba(0, 0, 0, 0.25)" : "none", width: "100%" }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ width: "100%" }}>
                {/* This is where all the meta data of an aircraft is displayed*/}
                <Dashboard airlineName={airlineName} fleetName={fleetName} subfleetName={level === "subfleets" ? row.subfleet : subfleetName} tailID={row} transfers={transfers} level={level} itemsPerPage={itemsPerPage} isDarkMode={isDarkMode}/> 
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  

  

  export default function CollapsibleTable({ airlineName, fleetName, subfleetName, data, handleLevelChange, sortCategory, transfers, level, itemsPerPage, isDarkMode }) {
    const [pageCount, setPageCount] = useState(0);  

    const handlePageChange = (event, value) => {
      const newPageCount = (value - 1) * itemsPerPage;
      setPageCount(newPageCount);
    };

    const handleRowClick = (subfleet) => {
      if (!handleLevelChange) return;
      handleLevelChange("subfleets", subfleet); 
    };
  
    const rowsToDisplay = data.slice(pageCount, pageCount + itemsPerPage);

    return (
      <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <CustomHeader level={level}></CustomHeader>
          <TableBody>
            {rowsToDisplay.map((row, index) => ( 
              <Row handleClick={level == 'subfleets' ? () => handleRowClick(row.subfleet) : null} airlineName={airlineName} fleetName={fleetName} subfleetName={subfleetName} key={row} index={index} row={row} transfers={level == 'aircraft' ? transfers : tails} level={level} itemsPerPage={itemsPerPage} isDarkMode={isDarkMode}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
              <Pagination
              count={Math.ceil(data.length / itemsPerPage)}
              page={(pageCount / itemsPerPage) + 1}        
                      onChange={handlePageChange}                   
                      showFirstButton
                      showLastButton
                      siblingCount={1}
                      boundaryCount={1}
                      sx={{marginTop: "10px"}}
      /> 
      </>
    );
  }
  