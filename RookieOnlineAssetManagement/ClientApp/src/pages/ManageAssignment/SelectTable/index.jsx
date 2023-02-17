import { getAvailableAssets, getUsers } from "api/AssignmentService";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { CompactString } from "utils";
import Pagination from "./Pagination";
import "./SelectTable.css";

const SelectTable = (props) => {
    const { title, headers, fields, selectedRow, setSelectedRow, closeTable } =
        props;

    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);

    const defaultSortBy =
        fields[0].charAt(0).toUpperCase() + fields[0].slice(1);

    const [sortBy, setSortBy] = useState(defaultSortBy);
    const [sortType, setSortType] = useState(true);
    const [searchString, setSearchString] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const initialPagination = {
        rowsPerPage: 10,
        currentPage: 1,
    };
    const [pagination, setPagination] = useState(initialPagination);

    const paginate = (pageNumber) => {
        setPagination({
            rowsPerPage: 10,
            currentPage: pageNumber,
        });
    };

    useEffect(() => {
        if (title === "User") {
            getUsers(
                pagination.currentPage,
                pagination.rowsPerPage,
                sortBy,
                searchString,
                sortType,
            )
                .then((response) => {
                    setRowCount(response.data.total);
                    let userList = response.data.users;
                    userList = userList.map((user) => ({
                        staffCode: user.staffCode,
                        fullName: user.firstName + " " + user.lastName,
                        type: user.type === 1 ? "Admin" : "Staff",
                    }));
                    setData(userList);
                })
                .catch((err) => console.log(err));
        } else if (title === "Asset") {
            getAvailableAssets(
                pagination.currentPage,
                pagination.rowsPerPage,
                sortBy,
                searchString,
                sortType,
            )
                .then((response) => {
                    setRowCount(response.data.total);
                    let assetList = response.data.assets;
                    assetList = assetList.map((asset) => ({
                        assetCode: asset.assetCode,
                        assetName: asset.assetName,
                        category: asset.category,
                    }));
                    setData(assetList);
                })
                .catch((err) => console.log(err));
        }
    }, [title, pagination, sortBy, searchString, sortType]);

    const onSave = () => {
        props.onSave(selectedRow);
    };

    const handleOnClick = (code) => {
        let result = data.find((x) => x[fields[0]] === code);
        setSelectedRow(result);
    };

    const onChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    const onSearch = () => {
        setSearchString(searchInput);
        paginate(1);
    };

    const onSort = (field = "") => {
        setSortBy(field.charAt(0).toUpperCase() + field.slice(1));
        if (field.toLowerCase() === sortBy.toLowerCase()) {
            setSortType((x) => !x);
        } else {
            setSortType(true);
        }
    };

    const LongContentCol = ({ children }) => {
        return (
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="button-tooltip-2">{children}</Tooltip>}
            >
                {({ ref, ...triggerHandler }) => (
                    <span {...triggerHandler} ref={ref}>
                        {CompactString(children)}
                    </span>
                )}
            </OverlayTrigger>
        );
    };

    return (
        <div
            className="card position-absolute select-user-dropdown py-3 px-4"
            style={{ width: "750px" }}
        >
            <div className="row">
                <div className="col-sm-7">
                    <div className="page-title">Select {title}</div>
                </div>

                <div className="col-sm-5 text-end">
                    <div
                        className="input-group mb-3 input-group-sm"
                        style={{ height: "30px" }}
                    >
                        <input
                            type="text"
                            className="form-control"
                            name="search"
                            value={searchInput}
                            onChange={onChange}
                            onKeyDown={handleKeyDown}
                        ></input>
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => onSearch()}
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th className="pe-3"></th>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="p-0 cursor-pointer"
                                onClick={() => onSort(fields[index])}
                            >
                                <div
                                    style={{
                                        margin: "7px 0px",
                                        fontWeight: "500",
                                    }}
                                >
                                    {header}
                                    <span className="ms-2">
                                        {!sortType &&
                                            sortBy.toLowerCase() ===
                                            (
                                                fields[index]
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                fields[index].slice(1)
                                            ).toLowerCase() ? (
                                            <i className="bi bi-caret-up-fill ms-1"></i>
                                        ) : (
                                            <i className="bi bi-caret-down-fill ms-1"></i>
                                        )}
                                    </span>
                                </div>
                                <hr
                                    className="m-0 me-3 d-block"
                                    style={{ borderTop: "2px solid #000" }}
                                />
                            </th>
                        ))}
                        <th style={{ border: "0px" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row) => (
                            <tr
                                key={row[fields[0]]}
                                className="radio-gender-group"
                                onClick={() => handleOnClick(row[fields[0]])}
                            >
                                <td className="border-0 gender__container">
                                    <input
                                        type="radio"
                                        value={row[fields[0]]}
                                        name="radio"
                                        checked={
                                            row[fields[0]] ===
                                            selectedRow[fields[0]]
                                        }
                                        onChange={(e) => { }}
                                    />
                                    <span className="checkmark"></span>
                                </td>
                                {fields.map((field, index) => (
                                    <td key={index} className="p-0 ps-1">
                                        <div style={{ margin: "7px 0px" }}>
                                            <LongContentCol>
                                                {row[field]}
                                            </LongContentCol>
                                        </div>
                                        <hr className="m-0 me-3" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr
                            className="unabled-hover position-relative"
                            style={{ height: "50px" }}
                        >
                            <td className="empty-loading">
                                There are no {title.toLowerCase()} to display
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <Pagination
                initialPage={pagination.currentPage}
                rowsPerPage={pagination.rowsPerPage}
                rowCount={rowCount}
                paginate={paginate}
            />
            <div className="d-flex justify-content-end mt-5 mb-3">
                <button
                    type="button"
                    className="btn form-btn form-btn__save"
                    onClick={onSave}
                >
                    Save
                </button>
                <button
                    type="button"
                    className="btn form-btn form-btn__cancel ms-5"
                    onClick={() => closeTable()}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default SelectTable;
