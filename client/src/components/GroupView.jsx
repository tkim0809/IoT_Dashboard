import React, { useState } from "react";
import ExpandedView from "./ExpandedView";

const GroupView = () => {
    let names = ["Fleet 1", "Fleet 2", "Fleet 3"]
    const [isExanded, setIsExpanded] = useState(false);
    const [fleetName, setFleetName] = useState("");

    const handleExpand = (name) => {
        setIsExpanded(true);
        setFleetName(name);
    }

    const handleClose = () => {
        setIsExpanded(false);
    }

    return (
        <div id="groupview_container" className="bg-white w-screen h-screen flex flex-wrap p-10" style={{justifyContent: "center"}}>
            <div style={{width: "100%", display: "flex", flexDirection: "row"}}>
            <img className="border-solid border-2 border-black" style={{width: "100px", height: "100px"}} src="" />
            <h1 style={{width: "100%", textAlign: "center"}}>Group name</h1>
            </div>
            <div id="table_container" className="border-solid border-2 border-black" style={{width: "100%"}}>
                <table className="min-w-full min-h-20 border border-collapse">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2" style={{textAlign: "left"}}>Fleet Name</th>
                            <th>Expand</th>
                        </tr>
                    </thead>
                    <tbody>
                            {names.map(name => (
                                <tr>
                                <td key={name} className="border border-gray-300 px-4 py-2" style={{width: "75%"}}>{name}</td>
                                <td className="border border-gray-300 px-4 py-2 text-center"><button onClick={() => handleExpand(name)}>Expand</button></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {isExanded && <ExpandedView fleetName={fleetName} onClose={handleClose}/>}
        </div>
    )
}

export default GroupView;