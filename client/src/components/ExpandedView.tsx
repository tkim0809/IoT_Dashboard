import React from "react";
import "./ExpandedView.css";

interface DataItem {
    device: string;
    uploadDate: string;
    lastCampaign: string;
    status: string;
    failedContent: string;
    content: string;
}

interface ExpandedViewProps {
    fleetName: string;
    data: DataItem[];
    onClose: () => void;
}

const ExpandedView: React.FC<ExpandedViewProps> = ({ fleetName, data, onClose }) => {
    const tableHeader = "border-t border-b border-l border-gray-600 px-4 py-4 border-opacity-25";
    const tableD = "h-20 border-opacity-25 border-t";

    const mockData: DataItem[] = [
        { device: "1", uploadDate: "09/04/2024 6:24 pm", lastCampaign: "09/04/2024 6:24 pm", status: "Success", failedContent: "N/A", content: "Movies/TV shows" },
        { device: "2", uploadDate: "09/05/2024 5:00 pm", lastCampaign: "09/05/2024 7:00 pm", status: "Failed", failedContent: "Movie name", content: "None" }
    ];

    return (
        <div
            className="p-5 rounded-lg border-solid border-black border-2 bg-white top-1/2 left-1/2"
            style={{
                width: "90%",
                height: "91%",
                position: "fixed",
                overflowY: "auto",
                transform: "translate(-50%, -50%)"
            }}
        >
            <p className="h-1/5">{fleetName}</p>
            <button className="absolute top-0 right-0 p-5" onClick={onClose}>Back</button>
            <div
                id="table_container"
                className="border-solid border-2 border-black border-opacity-25"
                style={{
                    overflow: "hidden",
                    borderWidth: "1px",
                    width: "100%",
                    height: "500px",
                    marginTop: "100px",
                    borderRadius: "10px"
                }}
            >
                <table className="min-w-full">
                    <thead style={{ backgroundColor: "#86a7b5" }}>
                        <tr>
                            <th className={`${tableHeader} table_header`}>Device</th>
                            <th className={`${tableHeader} table_header`}>Upload Date</th>
                            <th className={`${tableHeader} table_header`}>Last Campaign</th>
                            <th className={`${tableHeader} table_header`}>Status</th>
                            <th className={`${tableHeader} table_header`}>Failed Content</th>
                            <th className={`${tableHeader} table_header`}>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.map((item, index) => (
                            <tr key={index}>
                                <td className={`${tableD} table_d`} style={{ backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>{item.device}</td>
                                <td className={`${tableD} table_d`} style={{ backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>{item.uploadDate}</td>
                                <td className={`${tableD} table_d`} style={{ backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>{item.lastCampaign}</td>
                                <td className={`${tableD} table_d`} style={{ backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>{item.status}</td>
                                <td className={`${tableD} table_d`} style={{ backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>{item.failedContent}</td>
                                <td className={`${tableD} table_d`} style={{ backgroundColor: index % 2 === 0 ? "white" : "#ecf2f3" }}>{item.content}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExpandedView;
