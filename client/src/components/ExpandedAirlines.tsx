import React, { useEffect, useState } from "react";
import AirlineTable from "./airlinesTable";
import Pagination from '@mui/material/Pagination';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';

type ExpandedAirlinesProps = {
  data: string[];
  handleLevelChange: (level: string, name: string) => void;
  itemsPerPage: number;
};

const ExpandedAirlines: React.FC<ExpandedAirlinesProps> = ({ data, handleLevelChange, itemsPerPage }) => {
  const [pageCount, setPageCount] = useState<number>(0);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const newPageCount = (value - 1) * itemsPerPage;
    setPageCount(newPageCount);
  };

  console.log('airlines: ', data);

  return (
    <>
      <AirlineTable pageCount={pageCount} data={data} itemsPerPage={itemsPerPage} handleLevelChange={handleLevelChange} />
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

export default ExpandedAirlines;