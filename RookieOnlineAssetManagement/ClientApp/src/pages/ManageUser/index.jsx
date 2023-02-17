import React, { useEffect } from "react";
import TableData from "components/UserTable/TableData"
export default function ManageUser() {

    useEffect(() => {
        document.title = "Manage User";
    }, [])

    return (
        <div>
            <TableData />
        </div>
    )
}