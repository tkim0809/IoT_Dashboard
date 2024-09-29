import React, { useState } from "react";
import ExpandedView from "./ExpandedView";
import ExpandedAirlines from "./ExpandedAirlines";
import BasicTable from "./groupTable";

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
        if (type === "airlines") {
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

    return (
        <div id="groupview_container" className="bg-white w-screen h-screen flex flex-wrap p-10" style={{ justifyContent: "center", overflowX: "hidden" }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                <img className="border-solid border-2 border-black" style={{ width: "100px", height: "100px" }} src="" alt="" />
                <h1 style={{ width: "100%", textAlign: "center" }}>Group name</h1>
            </div>
            <BasicTable data={data} sortCategory={sortCategory}/>
            <div id="table_container" className="border-solid border-2 border-black border-opacity-25" style={{overflow: "hidden", borderWidth: "1px", width: "100%", height: "500px", marginTop: "100px", borderRadius: "10px" }}>
                {/* Div of buttons that will change what is currently being sorted */}
                <div className="flex-initial flex-row h-15 py-2" style={{ width: "100%" }}>
                    <button className="w-20" onClick={() => setSortCategory("all")} style={{ color: sortCategory === "all" ? "blue" : "black", borderBottom: sortCategory === "all" ? "solid 2px blue" : "none" }}>All</button>
                    <button className="w-20" onClick={() => setSortCategory("airlines")} style={{ color: sortCategory === "airlines" ? "blue" : "black", borderBottom: sortCategory === "airlines" ? "solid 2px blue" : "none" }}>Airlines</button>
                    <button className="w-20" onClick={() => setSortCategory("fleet")} style={{ color: sortCategory === "fleet" ? "blue" : "black", borderBottom: sortCategory === "fleet" ? "solid 2px blue" : "none" }}>Fleet</button>
                    <button className="w-20" onClick={() => setSortCategory("subfleet")} style={{ color: sortCategory === "subfleet" ? "blue" : "black", borderBottom: sortCategory === "subfleet" ? "solid 2px blue" : "none" }}>Sub Fleet</button>
                    <button className="w-20" onClick={() => setSortCategory("aircraft")} style={{ color: sortCategory === "aircraft" ? "blue" : "black",borderBottom: sortCategory === "aircraft" ? "solid 2px blue" : "none" }}>Aircraft</button>
                </div>

                {/* table of list of fleets, subfleets, aircrafts, and airlines */}
                <table className="min-w-full">
                    <thead style={{backgroundColor: "#86a7b5"}}>
                        <tr>
                        {sortCategory != "airlines" ? (
                            <>
                            <th className="border-t border-b border-l border-gray-600 px-4 py-4 border-opacity-25" style={{borderWidth: "1px", textAlign: "left", color: "white"}}>Fleet Name</th>
                            <th className="border-t border-b border-r border-gray-600 px-4 py-4 border-opacity-25" style={{color: "white"}}>Airline</th>
                            </>
                          )  : (
                            <th className="border-t border-b border-l border-gray-600 px-4 py-4 border-opacity-25" style={{borderWidth: "1px", textAlign: "left", color: "white"}}>Airline</th>
                    )}
                        </tr>
                    </thead>
                    <tbody>
                    {sortCategory === "airlines" ? (
                    //Will map over airlines array to display list of airlines if sorted category is currently "airlines".
                    airlines
                    .slice(itemIndex, itemIndex + 5)
                    .map((data, index) => (
                        <tr className="px-4 py-2 cursor-pointer" 
                        key={data.name} 
                        onClick={() => handleExpand("airlines", data.name, data.aircrafts)}>
                        <td className="h-20 border-opacity-25 border-t" style={{ borderRight: "none", width: "80%", padding: "10px", borderWidth: "1px", backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>
                            {data.name}
                        </td>
                        </tr>
                    ))
                ) : (
                    data
                    //If sorted category is not airlines it will map over data for either all, fleets, subfleets, or aircrafts
                    .filter(item => sortCategory === "all" || item.fleetCategory === sortCategory)
                    .slice(itemIndex, itemIndex + 5)
                    .map((item, index) => (
                    <tr className=" px-4 py-2 cursor-pointer" style={{height: "20%"}}
                        key={item.fleetName} 
                        onClick={() => handleExpand("all", item.fleetName, "To be implemented")}>
                        <td className="h-20 border-opacity-25 border-t" style={{ borderRight: "none", width: "80%", padding: "10px", borderWidth: "1px", backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>
                            {item.fleetName}
                        </td>
                        <td className="h-20 border-opacity-25 border-t" style={{textAlign: "center", borderLeft: "none", padding: "10px", borderWidth: "1px", backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3"}}>Delta</td>
                    </tr>
                    ))
                    )}
                    </tbody>
                </table>
            </div>
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