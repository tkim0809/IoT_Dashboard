import React, { useState } from "react";
import ExpandedView from "./ExpandedView";
import ExpandedAirlines from "./ExpandedAirlines";

const GroupView = () => {
    let data = [{ fleetName: "Fleet 1", fleetCategory: "fleet" }, { fleetName: "Fleet 2", fleetCategory: "subfleet" }, { fleetName: "Fleet 3", fleetCategory: "aircraft" },
    { fleetName: "Fleet 4", fleetCategory: "fleet" }, { fleetName: "Fleet 5", fleetCategory: "aircraft" }, { fleetName: "Fleet 6", fleetCategory: "aircraft" }
    ]
    let airlines = [{name: "Delta", aircrafts: ["123", "124", "125"]}, {name: "United Airlines", aircrafts: ["224", "225"]}]
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAirlinesExpanded, setAirlinesExpand] = useState(false);
    const [fleetName, setFleetName] = useState("");
    const [sortCategory, setSortCategory] = useState("all");
    const [itemIndex, setItemIndex] = useState(0);
    const [passedData, setPassedData] = useState(null);

    const handleExpand = (type, name, data) => {
        if (type == "airlines") {
            setAirlinesExpand(true);
        }
        else {
            setIsExpanded(true);
        }
        setPassedData(data);
        setFleetName(name)
    }

    const handleClose = () => {
        setIsExpanded(false);
    }

    const handleAirlineClose = () => {
        setAirlinesExpand(false);
    }

    const handleNextPage = () => {
        setItemIndex(itemIndex + 5);
    }

    return (
        <div id="groupview_container" className="bg-white w-screen h-screen flex flex-wrap p-10" style={{ justifyContent: "center" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <img className="border-solid border-2 border-black" style={{ width: "100px", height: "100px" }} src="" />
                <h1 style={{ width: "100%", textAlign: "center" }}>Group name</h1>
            </div>
            <div id="table_container" className="border-solid border-2 border-black" style={{ width: "100%", height: "60%", marginTop: "100px" }}>
                {/* Div of buttons that will change what is currently being sorted */}
                <div className="flex-initial flex-row border-black border-1 border-solid h-15 border-b-0" style={{ width: "100%" }}>
                    <button className="w-20" onClick={() => setSortCategory("all")} style={{ color: sortCategory === "all" ? "blue" : "black" }}>All</button>
                    <button className="w-20" onClick={() => setSortCategory("airlines")} style={{ color: sortCategory === "airlines" ? "blue" : "black" }}>Airlines</button>
                    <button className="w-20" onClick={() => setSortCategory("fleet")} style={{ color: sortCategory === "fleet" ? "blue" : "black" }}>Fleet</button>
                    <button className="w-20" onClick={() => setSortCategory("subfleet")} style={{ color: sortCategory === "subfleet" ? "blue" : "black" }}>Sub Fleet</button>
                    <button className="w-20" onClick={() => setSortCategory("aircraft")} style={{ color: sortCategory === "aircraft" ? "blue" : "black" }}>Aircraft</button>
                </div>
                {/* table of list of fleets, subfleets, aircrafts, and airlines */}
                <table className="min-w-full min-h-20 border border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-600 px-4 py-2" style={{ textAlign: "left" }}>Fleet Name</th>
                            <th>Expand</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sortCategory === "airlines" ? (
                    //Will map over airlines array to display list of airlines if sorted category is currently "airlines".
                    airlines
                    .slice(itemIndex, itemIndex + 5)
                    .map(data => (
                        <tr key={data.name}>
                        <td className="border border-gray-600 px-4 py-2" style={{ width: "75%" }}>{data.name}</td>
                        <td className="border border-gray-600 px-4 py-2 text-center">
                            <button onClick={() => handleExpand("airlines", data.name, data.aircrafts)}>Expand</button>
                        </td>
                        </tr>
                    ))
                ) : (
                    data
                    //If sorted category is not airlines it will map over data for either all, fleets, subfleets, or aircrafts
                    .filter(item => sortCategory === "all" || item.fleetCategory === sortCategory)
                    .slice(itemIndex, itemIndex + 5)
                    .map(item => (
                        <tr key={item.fleetName}> 
                        <td className="border border-gray-600 px-4 py-2" style={{ width: "75%" }}>
                            {item.fleetName}
                        </td>
                        <td className="border border-gray-600 px-4 py-2 text-center">
                            <button onClick={() => handleExpand("all", item.fleetName, "Too be implemented")}>Expand</button>
                        </td>
                        </tr>
                    ))
                    )}
                    </tbody>
                </table>
            </div>
            {/* Button for pagination */}
            <button onClick={handleNextPage}>Next Page</button>
            {/* Opens display for expansion to view data */}
            {isAirlinesExpanded 
                ? <ExpandedAirlines fleetName={fleetName} data={passedData} onClose={handleAirlineClose} />
                : isExpanded && (
                    <ExpandedView fleetName={fleetName} data={passedData} onClose={handleClose} />
                )}
        </div>
    )
}

export default GroupView;