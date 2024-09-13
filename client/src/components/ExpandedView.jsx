import React from "react";

const ExpandedView = ({fleetName, onClose}) => {
    return (
        <div className="p-5" style={{width: "90%", height: "90%", backgroundColor: "lightblue", position: "fixed"}}>
            <p>
                {fleetName}
            </p>
            <button className="absolute top-0 right-0 p-5" onClick={onClose}>X</button>
        </div>
    )
}

export default ExpandedView;