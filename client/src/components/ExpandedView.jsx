import React from "react";

//Needs fix for onClose so that it doesn't close both ExpandedAirlines and ExpandedView.

const ExpandedView = ({ fleetName, data, onClose }) => {



    return (
        <div className="p-5 rounded-lg border-solid border-black border-2 bg-white top-1/2 left-1/2" style={{ width: "90%", height: "91%", position: "fixed",   transform: "translate(-50%, -50%)"}}>
            <p>{fleetName}</p>
            <button className="absolute top-0 right-0 p-5" onClick={onClose}>Back </button>
        </div>
    )
}

export default ExpandedView;