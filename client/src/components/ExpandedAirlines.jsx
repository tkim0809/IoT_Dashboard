import React, { useState } from "react";
import ExpandedView from "./ExpandedView";

const ExpandedAirlines = ({ fleetName, data, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleOpenAircraft = () => {
        console.log("open");
        setIsExpanded(true);
    }

    const handleClose = () => {
    setIsExpanded(false);
    }

    return (
        <div className="p-5 rounded-lg border-solid border-black border-2 bg-white" style={{ width: "90%", height: "90%", position: "fixed" }}>
        <div className="h-1/5">
        <p>{fleetName}</p>
        </div>

        {/* If array is not empty it will display a table list of the aircrafts*/}
        {Array.isArray(data) ? (
        <div id="table_container" className="border-solid border-2 border-black border-opacity-25" style={{overflow: "hidden", borderWidth: "1px", width: "100%", height: "500px", marginTop: "100px", borderRadius: "10px" }}>
        <table className="min-w-full">
            <thead>
            <tr>
                <th className="border border-gray-600 px-4 py-2">
                    Aircrafts
                </th>
            </tr>
            </thead>
            {/* maps over the array of aircrafts to display them*/}
            {data.map((item, index) => (
            <tbody key={index}>
                <tr>
                    <td className="border border-gray-600 px-4 py-2 w-3/4" >{item}</td>
                    <td className="border border-gray-600 px-4 py-2 w-1/4 text-center" ><button onClick={handleOpenAircraft}>Expand</button></td>
                </tr>
            </tbody>
            ))}
        </table>
        </div>
        ) 
        : (
        <div>No Data</div>
        )}
        {/* Will close the current display of ExpandedAirlines, need to fix where it will close both ExpandedAirlines and ExpandedView */}
        <button className="absolute top-0 right-0 p-5" onClick={onClose}>X</button>
        {/* Display for when you expand on an aircraft */}
        {isExpanded && <ExpandedView style={{position: "absolute"}} fleetName={fleetName} data={data} onClose={handleClose} />}
    </div>
    )
}

export default ExpandedAirlines;