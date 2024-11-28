import React, { useEffect } from "react";
import Pagination from '@mui/material/Pagination';
import { useState } from "react";
import SubfleetTable from "./subfleetTable";

interface ExpandedSubfleetProps {
    data: any[]; // Adjust type as necessary for `data`
    handleLevelChange: (level: string, name: string) => void;
}

const ExpandedSubfleet: React.FC<ExpandedSubfleetProps> = ({ data, handleLevelChange }) => {
    const [pageCount, setPageCount] = useState<number>(0);
    const itemsPerPage = 5;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        const newPageCount = (value - 1) * itemsPerPage;
        setPageCount(newPageCount);
    };

    return (
        <>
            <SubfleetTable
                pageCount={pageCount}
                subfleets={data}
                itemsPerPage={itemsPerPage}
                handleLevelChange={handleLevelChange}
            />
            <Pagination
                count={Math.ceil(data.length / itemsPerPage)}
                page={(pageCount / itemsPerPage) + 1}
                onChange={handlePageChange}
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
                sx={{ marginTop: "10px" }}
            />
        </>
    );
};

export default ExpandedSubfleet;
