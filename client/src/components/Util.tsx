import styled from "@emotion/styled";
import { Box, CircularProgress, CircularProgressProps, LinearProgress, TableCell, tableCellClasses, TableRow, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import React from "react";
import { Theme } from '@mui/material/styles';

type Status = "queued" | "inprogress" |  "finished"  | "failed";

export interface ContentTransferState {
    status: Status;
    from?: number;
    to?: number;
    transferred?: number,
    transfer_ms?: number,
}

export interface TailTransferState {
    status: Status;
    started?: number,
    finished?: number,
    queued?: number
}
  
export type ContentTransfer = [string, ContentTransferState];
export type TailTransfer = [string, TailTransferState];

export const failed = 'data:image/svg+xml,<svg height="30" width="30" xmlns="http://www.w3.org/2000/svg"><text x="10" y="25" fill="dd2c00">❌</text></svg>';

export const FailOverImage = ({ srcs, style }: { srcs: string[], style?: React.CSSProperties }) => {
    const [sourceIndex, setSourceIndex] = useState(0);
    return (
        <img 
            src={srcs[sourceIndex]} 
            style={style} 
            onError={() => sourceIndex + 1 < srcs.length ? setSourceIndex(i => i + 1) : undefined} 
            alt="Logo"
        />
    );
};

export const toLogo = (slug: string): JSX.Element => {
    console.log("slug:", slug); // Check what slug is
    return (<FailOverImage srcs={["svg", "jpg", "png"].map(format => `/logos/${slug}.${format}`).concat(failed)}/>)
};

export const useStyledTableComponents = () => {
    const StyledTableCell = React.useMemo(() => 
        styled(TableCell)(({ theme }) => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: '#646cff',
                color: theme.palette.common.white,
                fontWeight: 'bold',
            },
            [`&.${tableCellClasses.body}`]: {
                fontSize: 14,
            },
        })), []
    );

    const StyledTableRow = React.useMemo(() => 
        styled(TableRow)(({ theme }) => ({
            "&:nth-of-type(odd)": {
                backgroundColor: theme.palette.action.hover,
            },
            "&:last-child td, &:last-child th": {
                border: 0,
            },
        })), []
    );

    return { StyledTableCell, StyledTableRow };
};

export const ProgressDisplay = ({circleMode, progress}: { circleMode: boolean, progress: number}) => {
    return circleMode ? (
        <CircularProgressWithLabel value={progress} />
    ) : (      
        <Box
            sx={{display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: '100%', minWidth: '5vw' }}
            />
            <Typography marginLeft='1em' width='4ch' sx={{whiteSpace: 'nowrap'}}>
                {progress}%
            </Typography>
        </Box>
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