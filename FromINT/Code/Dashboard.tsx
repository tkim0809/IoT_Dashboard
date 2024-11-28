import { Box, CircularProgress, CircularProgressProps, FormControl, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, tableCellClasses } from "@mui/material";
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { Transfer, TransferState } from "./ContentSync";
import { useEffect, useState } from "react";

const ProgressDisplay = ({circleMode, progress}: { circleMode: boolean, progress: number}) => {
    return circleMode ? (
        <CircularProgressWithLabel value={progress} />
    ) : (      
        <>
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: '100%', minWidth: '10vw' }}
            />
            <Typography marginLeft='1em' width='4ch'>
                {progress}%
            </Typography>
        </>
    );
}

export const Dashboard = ({ transfers }: { transfers: Transfer[] }) => {
    const [circleMode, setCircleMode] = useState<boolean>(false);
    const [progressUnit, setProgressUnit] = useState('KB');
    const [bitUnit, setBitUnit] = useState('kbps');
    const [progressWidth, setProgressWidth] = useState();

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#646cff',
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    StyledTableCell.defaultProps = {
        className: 'dashboard-cell'
    };

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    const sanitize = (transfer_state: TransferState): TransferState => {
        return {
            ...transfer_state,
            transferred: transfer_state.transferred ?? 0,
            to: transfer_state.to ?? 0,
            from: transfer_state.from ?? 0,
            transfer_ms: transfer_state.transfer_ms ?? 0
        };
    };

    const calculateBitrate = (transferred: number, transfer_ms: number): string => {
        if (!transferred || !transfer_ms) return 'N/A';
        let bitrate = (8 * transferred / transfer_ms); // base bitrate in bps
        switch (bitUnit) {
            case 'kbps':
                return `${(bitrate / 1000).toFixed(2)} kbps`;
            case 'mbps':
                return `${(bitrate / 1000000).toFixed(2)} mbps`;
            case 'bps':
            default:
                return `${bitrate.toFixed(2)} bps`;
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

    return (
        <ThemeProvider theme={createTheme( {palette: {mode: 'dark'}} )}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>Content</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell sx={{'text-align': 'center'}}>Progress
                            <FormControl style={{marginLeft: '0.5em', verticalAlign: 'middle'}}>
                                <Select
                                    sx={{ height: '1.5em', }}
                                    value={progressUnit}
                                    onChange={(event) => setProgressUnit(event.target.value)}
                                >
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="KB">KB</MenuItem>
                                    <MenuItem value="MB">MB</MenuItem>
                                </Select>
                            </FormControl>
                        </StyledTableCell>
                        {/* <StyledTableCell onClick={() => setCircleMode(!circleMode)} style={{ cursor: 'pointer' }}></StyledTableCell> */}
                        <StyledTableCell sx={{'text-align': 'center'}}>Bitrate
                        <FormControl style={{marginLeft: '0.5em', verticalAlign: 'middle'}}>
                            <Select
                                sx={{
                                    height: '1.5em',
                                    fontSize: 'inherit',
                                  }}
                                labelId="bitrate-select-label"
                                id="bitrate-select"
                                value={bitUnit}
                                onChange={(event) => setBitUnit(event.target.value)}
                            >
                                <MenuItem value="bps">bps</MenuItem>
                                <MenuItem value="kbps">kbps</MenuItem>
                                <MenuItem value="mbps">mbps</MenuItem>
                            </Select>
                        </FormControl>
                    </StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {transfers.map(([content, transfer_state]) => {
                        const sanitized = sanitize(transfer_state);
                        const downloaded = sanitized.status == 'finished' && sanitized.transferred == 0 ? sanitized.from! : sanitized.transferred!;
                        const progress = sanitized.to != 0 ? Math.round((downloaded / sanitized.to!) * 100) : 0;
                        
                        return (
                            <StyledTableRow key={content}>
                                <StyledTableCell sx={{'text-align': 'left'}}>
                                    {content}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {sanitized.status == 'inprogress' ? 'In Progress' : sanitized.status.charAt(0).toUpperCase() + sanitized.status.slice(1)}
                                </StyledTableCell>
                                <StyledTableCell 
                                    sx={{
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        textAlign: 'left', 
                                        gap: '2em'  // optional: adds space between the elements
                                    }}
                                >
                                    <Box sx={{
                                        display:"flex",
                                        alignItems:"center",
                                        justifyContent:"center",
                                        flexGrow: 1
                                    }}>
                                        <ProgressDisplay circleMode={circleMode} progress={progress}></ProgressDisplay>
                                    </Box>
                                    <Box sx={{ minWidth: '25ch', textAlign: 'left' }}>
                                        {sanitized.status == 'queued' ? 'N/A' : calculateProgress(downloaded, sanitized.to!)}
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell sx={{'text-align': 'center'}}>
                                    {calculateBitrate(sanitized.transferred!, sanitized.transfer_ms!)} 
                                </StyledTableCell>
                            </StyledTableRow>
                    )})}
                    </TableBody>
                </Table>
            </TableContainer>
        </ThemeProvider>
    );
}


function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
  ) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary' }}
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }