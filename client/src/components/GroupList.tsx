import React from "react";
import FolderList from "./GroupList";
import { MdMargin } from "react-icons/md";

const GroupList: React.FC = () => {
    return (
        <div style={{ width: "100%", backgroundColor: 'white', textAlign: "center" }}>
            <h1 style={{ marginBottom: "10px", marginTop: "10px", fontSize: "20px" }}>Groups</h1>
            <FolderList />
        </div>
    );
}

export default GroupList;
