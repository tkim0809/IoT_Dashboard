import React, { useState, useEffect } from "react";
import ExpandedAirlines from "./ExpandedAirlines.tsx";
import BasicTable from "./groupTable.js";
import ExpandedSubfleet from "./ExpandedSubfleet.tsx";
import { useLocation } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import ExpandedFleet from "./ExpandedFleet.tsx";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Header from './Header.jsx'

const GroupView = () => {
    const location = useLocation();
    const { groupName, placeholderImg } = location.state || {}; 
    const [transfers, setTransfers] = useState([]);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem('isDarkMode');
        return savedDarkMode ? JSON.parse(savedDarkMode) : false;
    });

    const [airlineName, setAirlineName] = useState("");
    const [fleetName, setFleetName] = useState("");    
    const [subfleetName, setSubfleetName] = useState("");
    const [tailID, setTailID] = useState("20240926");
    const [currentLevel, setCurrentLevel] = useState("airlines");
    const [pageCount, setPageCount] = useState(0);  


    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light', // Toggle between light and dark
            primary: {
                main: isDarkMode ? '#90caf9' : '#1976d2',
            },
            background: {
                default: isDarkMode ? '#121212' : '#ffffff', // Adjust background colors
                paper: isDarkMode ? '#1d1d1d' : '#ffffff',
            },
            text: {
                primary: isDarkMode ? '#ffffff' : '#000000', // Text colors
            },
        },
    });

    const [tails, setTails] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [fleets, setFleets] = useState([]);
    const [subFleets, setSubFleets] = useState([]);

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);    const [error, setError] = useState(null);

    useEffect(() => { // Move all of this stuff when dashboard component is done!
        const fetchData = async () => {
            try {
                let response;
                if (currentLevel === "airlines") {
                    response = await fetch(`http://localhost:4000/api/airlines`);
                    const data = await response.json();
                    setAirlines(data.airlines);
                }
                else if (currentLevel === "fleet") {
                    response = await fetch(`http://localhost:4000/api/fleets?airline=${airlineName}`);
                    const data = await response.json();
                    setFleets(data.fleets);
                }
                else if (currentLevel === "subfleets") {
                    response = await fetch(`http://localhost:4000/api/subfleets?airline=${airlineName}&fleet=${fleetName}`);
                    const data = await response.json();
                    setSubFleets(data.subfleets);
                }
                if (currentLevel === "aircraft") { //Needs to be changed later when I change navigation on aircrafts
                    response = await fetch(`http://localhost:4000/api/tailids?airline=${airlineName}&fleet=${fleetName}&subfleet=${subfleetName}`);
                    const data = await response.json();
                    console.log(data);
                    // const transformedTransfers = data.map(transfer => {
                    //     return [
                    //         transfer.contentName, 
                    //         {
                    //             status: transfer.status.toLowerCase().replace(' ', ''),  
                    //             transferred: transfer.downloadedBytes,  
                    //             to: transfer.totalSize,  
                    //             transfer_ms: transfer.transfer_ms || 0  
                    //         }
                    //     ];
                    // });

                    // console.log(transformedTransfers);
                    // setTransfers(transformedTransfers);
                    setTails(data.tailIDs);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, [currentLevel, airlineName, fleetName, subfleetName]); 


    // useEffect(() => {
    //     fetch("sample-sync.json")
    //         .then((resp) => resp.text())
    //         .then((text) => setTransfers(JSON.parse(text)))
    //         .catch((error) => console.error("Error fetching JSON:", error));
    // }, []);
    
    
    const itemsPerPage = 10; 


    const handlePageChange = (event, value) => {
        const newPageCount = (value - 1) * itemsPerPage;
        setPageCount(newPageCount);
    };

    const sortCategory = "all";



    const handleLevelChange = (level, name) => {
        setFleets([]);
        setSubFleets([]);
        setAirlines([]);
        setTails([]);
        console.log('level, name: ', level, name)
        switch (level) {
            case "airlines":
                setCurrentLevel("fleet");
                setAirlineName(name);
                break;
            case "fleet":
                setCurrentLevel("subfleets");
                setFleetName(name);
                break;
            case "subfleets":
                setCurrentLevel("aircraft");
                setSubfleetName(name);
                break;
            default:
                setCurrentLevel(level);
        }
    }

    const renderTable = () => { // add case if data is empty it will return empty table.
        switch (currentLevel) {
            
            case "airlines":
                return <ExpandedAirlines data={airlines} handleLevelChange={handleLevelChange} itemsPerPage={itemsPerPage}/>;
            case "fleet":
                return <ExpandedFleet data={fleets} handleLevelChange={handleLevelChange} itemsPerPage={itemsPerPage}/>;
            case "subfleets":
                return <BasicTable airlineName={airlineName} fleetName={fleetName} subfleetName={subfleetName} data={subFleets} handleLevelChange={handleLevelChange} level={currentLevel} itemsPerPage={itemsPerPage} isDarkMode={isDarkMode}/>;
            case "aircraft":
                return <BasicTable airlineName={airlineName} fleetName={fleetName} subfleetName={subfleetName} transfers={transfers} data={tails} sortCategory={sortCategory} pageCount={pageCount} level={currentLevel} itemsPerPage={itemsPerPage} isDarkMode={isDarkMode}/>;
            default:
                return null;
        }
    };

    const navigationStyle = {
        paddingLeft: '1em',
        color: isDarkMode ? "white" : "black",
        whiteSpace: "nowrap", 
    }

    return (
        <div id="groupview_container" className="bg-white h-screen flex" 
            style={{
                 transition: "background-color 0.5s ease",
                backgroundColor: isDarkMode ? "#0F1214" : "white",
                color: "#ffffff", 
                justifyContent: "flex-start",
                overflowX: "hidden",
                flexDirection: "column",
                gap: "2vh",
                width: "100%"
            }}>
                <div className='w-full h-auto flex flex-col items-center justify-center bg-primary'>
                    <Header />
                </div>
                <div style={{ backgroundColor: isDarkMode ? "#0F1214" : "white", display: "flex", 
                    justifyContent: "flex-end", padding: "10px",  transition: "background-color 0.5s ease" }}>
                    <div style={{width: "100px", border: "1px solid", borderColor: isDarkMode ? "white" : "black", borderRadius: "50px", display: "flex", padding: "5px", transition: "background-color 0.5s ease"}}>
                    <button style={{ color: "black", marginRight: "5px", background: isDarkMode ? "#0F1214" : "#ffe49c", borderRadius: "50px", padding: "5px", transition: "background-color 0.5s ease" }} onClick={() => setIsDarkMode(false)}><img style={{width: "50%"}} alt="" src={require('../assets/img/lightmodeicon.png')}></img></button>
                    <button style={{ color: "black", background: isDarkMode ? "lightgray" : "white", borderRadius: "50px", padding: "5px", transition: "background-color 0.5s ease" }} onClick={() => setIsDarkMode(true)}><img style={{width: "50%"}} alt="" src={require('../assets/img/darkmodeicon.png')}></img></button>
                    </div>
                </div>
            {/* <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <img className="border-solid border-2 border-black" style={{ borderWidth: "1px", maxWidth: "1200px" }} src={'/logos/IdeaNovaLogoWhiteWithTransparentWithoutPowerby.png'} alt="" />
            </div> */}
            <div id="table_container" className="p-10" style={{width: "100%"}}>
            <div className="flex-initial flex-row h-15 py-2" style={{ width: "100%", minHeight: "40px", display: "flex", alignItems: "center" }}>
                    {/* Navigation downwards component */}
                    {(
                        <button
                            onClick={() => {setCurrentLevel("airlines"); setError(null)}}
                            style={navigationStyle}
                        >
                            {"Airlines"}
                        </button>
                    )}

                    {(currentLevel === "fleet" || currentLevel === "subfleets" || currentLevel === "aircraft") && (
                        <>
                        <ChevronRightIcon style={{color: isDarkMode ? "white" : "black"}}/>
                        <button
                            onClick={() => setCurrentLevel("fleet")}
                            style={navigationStyle}
                        >
                            {airlineName}
                        </button>
                        </>
                    )}

                    {/* Fleet Button */}
                    {(currentLevel === "subfleets" || currentLevel === "aircraft") && (
                        <>
                        <ChevronRightIcon style={{color: isDarkMode ? "white" : "black"}}/>
                        <button
                            onClick={() => setCurrentLevel("subfleets")}
                            style={navigationStyle}
                        >
                            {fleetName}
                        </button>
                        </>
                    )}

                    {/* Subfleet Button */}
                    {currentLevel === "aircraft" && (
                        <>
                        <ChevronRightIcon style={{color: isDarkMode ? "white" : "black"}}/>
                        <button
                            style={navigationStyle}
                        >
                            {subfleetName}
                        </button>
                        </>
                    )}
                </div>
            <div style={{display: "flex", flexWrap: "wrap", width: "100%", justifyContent: "center", alignContent: "center"}}>
            <ThemeProvider theme={createTheme({ palette: { mode: isDarkMode ? 'dark' : 'light' } })}>
                    {/* {error ? (
                        <div>No data</div>
                    ) : ( */}
                        <>
                            {renderTable()}
                        </>
                    {/*}  )} */}
            </ThemeProvider>
            {/* <BasicTable data={data} sortCategory={sortCategory} transfers={transfers} pageCount={pageCount}/> */}
            </div>
            </div>
        </div>
    )
}

export default GroupView;