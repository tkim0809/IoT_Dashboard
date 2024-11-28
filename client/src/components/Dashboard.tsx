import { Box, FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from "@mui/material";
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { ContentTransfer, ContentTransferState, TailTransfer, TailTransferState, toLogo, ProgressDisplay } from "./Util.tsx";
import Pagination from '@mui/material/Pagination';
import { useEffect, useMemo, useState } from "react";
import React from "react";

const Logo = ({ content }: { content: string }) => {
    const logoContainerStyle: React.CSSProperties = {
        width: '10em',
        textAlign: 'center',
        height: '5em',
        verticalAlign: 'middle',
        margin: 'auto',
    };

    const logoImageStyle: React.CSSProperties = {
        padding: '.2em',
        display: 'inline',
        objectFit: 'contain',
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        lineHeight: 1,
    };
    
    return (
        <div style={logoContainerStyle}>
            {React.cloneElement(toLogo(content), { style: logoImageStyle })}
        </div>
    );
}

const getStatusColor = (status) => {
    if (status === 'inprogress') return 'orange';
    if (status === 'In progress') return 'orange';
    if (status === 'finished') return '#008f34';
    if (status === 'queued') return 'white';
    if (status === 'failed') return '#ff0000';
    return 'white';
};

export const Dashboard = ({ tailID, airlineName, fleetName, subfleetName, transfer, itemsPerPage, level, isDarkMode }: { transfer: ContentTransfer[] | TailTransfer[], tailID: string, airlineName: string, fleetName: string, subfleetName: string, itemsPerPage: number, level: string, isDarkMode: boolean }) => {
    const [progressUnit, setProgressUnit] = useState('MB');
    const [bitUnit, setBitUnit] = useState('Mbps');
    const [pageCount, setPageCount] = useState(0);  
    const [transfers, setTransfers] = useState([]);
    console.log(tailID);


    type TailProgressItem = {
    tailID: string;
    totalProgress: string;
    status: string;
    contentInProgress: number;
    totalContent: number;
    };

const [tailProgress, setTailProgress] = useState<TailProgressItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (level === "subfleets") {
                    const tailResponse = await fetch(`http://localhost:4000/api/tailids?airline=${airlineName}&fleet=${fleetName}&subfleet=${subfleetName}`);
                    const tailData = await tailResponse.json();

                    if (tailData && tailData.tailIDs) {
                        const tailProgress: TailProgressItem[] = []; 

                        for (const tailID of tailData.tailIDs) {
                            const progressResponse = await fetch(`http://localhost:4000/api/progress/?airline=${airlineName}&fleet=${fleetName}&subfleet=${subfleetName}&tailID=${tailID}`);
                            const progressData = await progressResponse.json();

                            if (progressData && progressData.progressData) {
                                const tailUploads = progressData.progressData;

                                const totalDownloaded = tailUploads.reduce((acc, upload) => acc + upload.downloadedBytes, 0);
                                const totalSize = tailUploads.reduce((acc, upload) => acc + upload.totalSize, 0);
                                const contentInProgress = tailUploads.filter(upload => upload.status.toLowerCase() === "in progress").length;
                                const status = contentInProgress > 0 ? "In progress" : "Finished";
                                const progressPercentage = totalSize > 0 ? ((totalDownloaded / totalSize) * 100).toFixed(2) : "0";

                                tailProgress.push({
                                    tailID,
                                    totalProgress: `${progressPercentage}%`,
                                    status,
                                    contentInProgress,
                                    totalContent: tailUploads.length,
                                });
                            }
                        }

                        setTailProgress(tailProgress); 
                        console.log(tailProgress);
                    }
                } else if (level === "aircraft") {
                    const response = await fetch(`http://localhost:4000/api/progress/?airline=${airlineName}&fleet=${fleetName}&subfleet=${subfleetName}&tailID=${tailID}`);
                    const data = await response.json();

                    if (data && data.progressData && data.progressData.length > 0) {
                        const transformedTransfers = data.progressData.map(transfer => ({
                            contentName: transfer.contentName,
                            status: transfer.status.toLowerCase().replace(' ', ''),
                            transferred: transfer.downloadedBytes,
                            to: transfer.totalSize,
                            transfer_ms: transfer.transfer_ms || 0,
                        }));
                        setTransfers(transformedTransfers);
                    } else {
                        setTransfers([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setTransfers([]); 
            }
        };

        fetchData();
    }, [airlineName, fleetName, subfleetName, tailID, level]);

    
    
    

    const totalPages = transfers.length;

const StyledTableRow = useMemo(() => styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
    minHeight: '110px',             // Ensure a consistent row height for body rows
})), []);

const StyledTableCell = useMemo(() => styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#646cff',
        color: theme.palette.common.white,
        fontWeight: 'bold',
        display: 'table-cell',      // Keep header cells as regular table cells
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        height: '100%',            // Stretch body cells to fill row height
    },
})), []);

// New: Flex container inside the body cells for centering content
const CellContent = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
});


    

    const DropdownSelect = ({ selectors, id, value, updateVal }) => {
        return (
          <>
            {id}
            <FormControl
              style={{ marginLeft: "0.5em", verticalAlign: "middle" }}
            >
              <Select
                sx={{
                  color: "white",
                  height: "1.5em",
                  fontSize: "inherit",
                }}
                labelId={`${id}-select`}
                id={id}
                value={value}
                onChange={(event) => updateVal(event.target.value)}
              >
                <MenuItem value="bps">{selectors[0]}</MenuItem>
                <MenuItem value="Kbps">{selectors[1]}</MenuItem>
                <MenuItem value="Mbps">{selectors[2]}</MenuItem>
              </Select>
            </FormControl>
        </>
        );  
    }

    const TailHead = () => {
        return (
          <TableHead>
            <TableRow>
              <StyledTableCell>Content</StyledTableCell>
              <StyledTableCell
                sx={{ "text-align": "center" }}
              ></StyledTableCell>

              <StyledTableCell sx={{ textAlign: "center" }}>
                <DropdownSelect
                  id={"Progress"}
                  value={progressUnit}
                  updateVal={setProgressUnit}
                  selectors={["B", "KB", "MB"]}
                />
              </StyledTableCell>

              <StyledTableCell sx={{ textAlign: "center" }}>
                <DropdownSelect
                  id={"Bitrate"}
                  value={bitUnit}
                  updateVal={setBitUnit}
                  selectors={["bps", "kbps", "Mbps"]}
                />
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Status
              </StyledTableCell>
            </TableRow>
          </TableHead>
        );
    }

    const FleetHead = () => {
      return (
        <TableHead>
          <TableRow>
            <StyledTableCell>Tail</StyledTableCell>
            <StyledTableCell sx={{ textAlign: "center" }}>
              <DropdownSelect
                id={"Progress"}
                value={progressUnit}
                updateVal={setProgressUnit}
                selectors={["B", "KB", "MB"]}
              />
            </StyledTableCell>
            <StyledTableCell/>
            <StyledTableCell sx={{ textAlign: "center" }}>
              Status
            </StyledTableCell>
          </TableRow>
        </TableHead>
      );
    };

    const sanitize = (transfer_state: ContentTransferState & { contentName?: string }): ContentTransferState & { contentName: string } => {
        return {
            ...transfer_state,
            contentName: transfer_state.contentName ?? "Unknown Content", // Add default if missing
            transferred: transfer_state.transferred ?? 0,
            to: transfer_state.to ?? 0,
            from: transfer_state.from ?? 0,
            transfer_ms: transfer_state.transfer_ms ?? 0
        };
    };
    

    const calculateBitrate = (transferred: number, transfer_ms: number): string => {
        if (!transferred || !transfer_ms) return 'N/A';
        let bitrate = (8 * transferred / (transfer_ms / 1000)); // base bitrate in bps
        switch (bitUnit) {
            case 'Kbps':
                return `${(bitrate / 1000).toFixed(2)} ${bitUnit}`;
            case 'Mbps':
                return `${(bitrate / 1000000).toFixed(2)} ${bitUnit}`;
            case 'bps':
            default:
                return `${bitrate.toFixed(2)} ${bitUnit}`;
        }
    };

    const calculateProgress = (downloaded: number, total: number): string => {
        let convDownloaded;
        let convTotal;
        switch (progressUnit) {
            case 'B':
                convDownloaded = downloaded;
                convTotal = total;
                break;
            case 'KB':
                convDownloaded = Math.round(downloaded / 1000);
                convTotal = Math.round(total / 1000);
                break;
            case 'MB':
                convDownloaded = Math.round(downloaded / (1000 * 1000));
                convTotal = Math.round(total / (1000 * 1000));
                break;
            default:
                return 'N/A'
        }
        return `${convDownloaded} / ${convTotal} ${progressUnit}`
    };

    const handlePageChange = (event, value) => {
        const newPageCount = (value - 1) * itemsPerPage;
        setPageCount(newPageCount);
    };

    function getBackgroundStatusColor(status) {
        switch (status.toLowerCase()) {
            case 'inprogress':
                return 'rgba(255, 165, 0, 0.25)'; 
            case 'in progress':
                return 'rgba(255, 165, 0, 0.25)'; 
            case 'finished':
                return 'rgba(0, 128, 0, 0.25)';  
            case 'failed':
                return 'rgba(255, 0, 0, 0.25)';  
            default:
                return 'rgba(125, 125, 125, 0.25)';     
        }
    }

    return (
        <div id='dashboard-container' style={{border: '1px solid #646CFF', borderRadius: '3px'}}>
            <ThemeProvider theme={createTheme( {palette: {mode: isDarkMode ? 'dark' : 'light'}} )}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        { level == 'aircraft' ? <TailHead/> : <FleetHead/> }
                        <TableBody>
                        {(level === 'aircraft' ? transfers : tailProgress)
                            .slice(pageCount, pageCount + itemsPerPage)
                            .map((item, index) => {
                                const isAircraftLevel = level === 'aircraft';
                                const sanitized = isAircraftLevel ? sanitize(item as ContentTransferState & { contentName?: string }) : item;  
                                const contentName = isAircraftLevel ? sanitized.contentName : (item as TailProgressItem).tailID;                                
                                const progress = isAircraftLevel 
                                ? ((sanitized as ContentTransferState).to ?? 0) > 0 
                                    ? Math.round(((sanitized as ContentTransferState).transferred ?? 0) / ((sanitized as ContentTransferState).to ?? 0) * 100) 
                                    : 0 
                                : parseFloat((item as TailProgressItem).totalProgress);                            
                                const status = isAircraftLevel ? (sanitized as ContentTransferState).status : (item as TailProgressItem).status;

                                return (
                                    <StyledTableRow key={`${contentName}-${index}`} sx={{ height: '110px' }}>
                                        <StyledTableCell sx={{
                                            width: '10%',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            height: '105px'
                                        }}>
                                            {contentName}
                                        </StyledTableCell>

                                        {isAircraftLevel && (
                                            <StyledTableCell height='105px'>
                                                <Logo content={contentName}></Logo>
                                            </StyledTableCell>
                                        )}

                                        <StyledTableCell 
                                            sx={{
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                textAlign: 'left', 
                                                flexWrap: 'nowrap',
                                                flexShrink: '1',
                                                gap: '4em',
                                                height: '105px',
                                            }}
                                        >
                                            <Box sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: status === 'queued' ? 'center' : 'flex-end',
                                                gap: 2,
                                                flexGrow: 1,
                                                height: '105px'
                                            }}>
                                                {status !== 'queued' ? (
                                                    <>
                                                        <ProgressDisplay circleMode={false} progress={progress}></ProgressDisplay> 
                                                        <Box sx={{ minWidth: '23ch', textAlign: 'right', whiteSpace: 'nowrap'}}>
                                                            {isAircraftLevel 
                                                                ? calculateProgress((sanitized as ContentTransferState).transferred ?? 0, (sanitized as ContentTransferState).to ?? 0)
                                                                : `${progress}%`}
                                                        </Box>
                                                    </>
                                                ) : 'N/A'}
                                            </Box>
                                        </StyledTableCell>
                                        
                                        {isAircraftLevel ? 
                                            <StyledTableCell sx={{ textAlign: 'center' }}>
                                                {calculateBitrate((sanitized as ContentTransferState).transferred ?? 0, (sanitized as ContentTransferState).transfer_ms ?? 0)}
                                            </StyledTableCell>
                                        : <StyledTableCell /> }
                                        
                                        <StyledTableCell sx={{ padding: '0', height: '100%' }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                width: '100%', 
                                                height: '100%' // Match full cell height
                                            }}>
                                                <span style={{ 
                                                    color: getStatusColor(status),
                                                    backgroundColor: getBackgroundStatusColor(status),
                                                    borderRadius: '40px',
                                                    padding: '4px 8px',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                    lineHeight: '1.5',  
                                                    width: '80%',      
                                                    height: '100%',      
                                                    display: 'flex',     
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {status === 'inprogress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                                                </span>                                
                                            </Box>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>

                    </Table>
                    <div style={{ padding: "10px", display: "flex", gap: "10px", justifyContent: "center",  
                        alignItems: "center", width: "100%" }}>
                    <Pagination
                            count={Math.ceil(totalPages / itemsPerPage)}  
                            page={(pageCount / itemsPerPage) + 1}
                            onChange={handlePageChange}         
                            showFirstButton
                            showLastButton
                            siblingCount={1}
                            boundaryCount={1}
                    />                
                    </div>
                    </TableContainer>

            </ThemeProvider>
        </div>
    );
}