import React from "react";

const ExpandedView = ({ fleetName, data, onClose }) => {
    return (
        <div className="p-5 rounded-lg border-solid border-black border-2 bg-white" style={{ width: "90%", height: "90%", position: "fixed" }}>
            <p>{fleetName}</p>
            {Array.isArray(data) ? (
            <>
                {data.map((item, index) => (
                <div key={index}>Aircraft: {item}</div>
                ))}
            </>
            ) : (
            <div>No Data</div>
            )}
            <button className="absolute top-0 right-0 p-5" onClick={onClose}>X</button>
        </div>
    )
}

export default ExpandedView;