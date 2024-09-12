import React from "react";

const GroupView = () => {
    let names = ["Fleet 1", "Fleet 2", "Fleet 3"]

    return (
        <div id="groupview_container" className="bg-white w-screen h-screen flex flex-wrap p-10">
            <img className="border-solid border-2 border-black" style={{width: "100px", height: "100px"}} src="" />
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
                                <td className="border border-gray-300 px-4 py-2 text-center">Expand</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GroupView;