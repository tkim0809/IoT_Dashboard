import React from "react";

//Needs fix for onClose so that it doesn't close both ExpandedAirlines and ExpandedView.

const ExpandedView = ({ fleetName, data, onClose }) => {

    const mockData = [{device: "1", uploadDate: "09/04/2024 6:24 pm", lastCampaign: "09/04/2024 6:24 pm", status: "Success", failedContent: "N/A", content: "Movies/TV shows"},
                {device: "2", uploadDate: "09/05/2024 5:00 pm", lastCampaign: "09/05/2024 7:00 pm", status: "Failed", failedContent: "Movie name", content: "None"}]

    // const header = ["Device", "Upload Date", "Last Campgain", "Status", "Failed Content", "Content"]

    return (
        <div className="p-5 rounded-lg border-solid border-black border-2 bg-white top-1/2 left-1/2" style={{ width: "90%", height: "91%", position: "fixed",   transform: "translate(-50%, -50%)"}}>
            <p className="h-1/5">{fleetName}</p>
            <button className="absolute top-0 right-0 p-5" onClick={onClose}>Back </button>
            <table className="min-w-full min-h-20 border border-collapse h-3/5">
            <thead> 
                    <tr>
                        <th className="border border-gray-600 px-4 py-2 w-1/6">Device</th>
                        <th className="border border-gray-600 px-4 py-2 w-1/6">Upload Date</th>
                        <th className="border border-gray-600 px-4 py-2 w-1/6">Last Campaign</th>
                        <th className="border border-gray-600 px-4 py-2 w-1/6">Status</th>
                        <th className="border border-gray-600 px-4 py-2 w-1/6">Failed Content</th>
                        <th className="border border-gray-600 px-4 py-2 w-1/6">Content</th>
                    </tr>
                </thead>
                <tbody>
                        {mockData.map(data => (
                            <tr>
                            <td className="border border-gray-600 px-4 py-2 w-1/6" >{data.device}</td>
                            <td className="border border-gray-600 px-4 py-2 w-1/6" >{data.uploadDate}</td>
                            <td className="border border-gray-600 px-4 py-2 w-1/6" >{data.lastCampaign}</td>
                            <td className="border border-gray-600 px-4 py-2 w-1/6" >{data.status}</td>
                            <td className="border border-gray-600 px-4 py-2 w-1/6" >{data.failedContent}</td>
                            <td className="border border-gray-600 px-4 py-2 w-1/6" >{data.content}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

export default ExpandedView;