import React, { useState } from "react";
import ExpandedView from "./ExpandedView";

const GroupView = () => {
    let data = [{fleetName: "Fleet 1", fleetCategory: "fleet"}, {fleetName: "Fleet 2", fleetCategory: "subfleet"}, {fleetName: "Fleet 3", fleetCategory: "aircraft"},
        {fleetName: "Fleet 4", fleetCategory: "fleet"}, {fleetName: "Fleet 5", fleetCategory: "aircraft"}, {fleetName: "Fleet 6", fleetCategory: "aircraft"}
        ]
    const [isExanded, setIsExpanded] = useState(false);
    const [fleetName, setFleetName] = useState("");
    const [sortCategory, setSortCategory] = useState("all");
    const [itemIndex, setItemIndex] = useState(0);

    const handleExpand = (name) => {
        setIsExpanded(true);
        setFleetName(name);
    }

    const handleClose = () => {
        setIsExpanded(false);
    }

    const handleNextPage = () => {
        setItemIndex(itemIndex + 5);
    }

    return (
        <div id="groupview_container" className="bg-white w-screen h-screen flex flex-wrap p-10" style={{justifyContent: "center"}}>
            <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
            <img className="border-solid border-2 border-black" style={{width: "100px", height: "100px"}} src="" />
            <h1 style={{width: "100%", textAlign: "center"}}>Group name</h1>
        </div>
            <div id="table_container" className="border-solid border-2 border-black" style={{width: "100%", height: "60%", marginTop: "100px"}}>
            <div className="flex-initial flex-row border-black border-1 border-solid h-15 border-b-0" style={{width: "100%"}}>
                <button onClick={() => setSortCategory("all")} style={{color: sortCategory === "all" ? "blue" : "black"}}>All</button>
                <button onClick={() => setSortCategory("fleet")} style={{color: sortCategory === "fleet" ? "blue" : "black"}}>Fleet</button>
                <button onClick={() => setSortCategory("subfleet")} style={{color: sortCategory === "subfleet" ? "blue" : "black"}}>Sub Fleet</button>
                <button onClick={() => setSortCategory("aircraft")} style={{color: sortCategory === "aircraft" ? "blue" : "black"}}>Aircraft</button>
            </div>
                <table className="min-w-full min-h-20 border border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2" style={{textAlign: "left"}}>Fleet Name</th>
                            <th>Expand</th>
                        </tr>
                    </thead>
                    <tbody>
                            {data.filter(item => sortCategory === "all" || item.fleetCategory === sortCategory)
                            .slice(itemIndex, itemIndex + 5)
                            .map(data => (
                                <tr>
                                <td key={data} className="border border-gray-300 px-4 py-2" style={{width: "75%"}}>{data.fleetName}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center"><button onClick={() => handleExpand(data.fleetName)}>Expand</button></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleNextPage}>Next Page</button>
            {isExanded && <ExpandedView fleetName={fleetName} onClose={handleClose}/>}
        </div>
    )
}

export default GroupView;