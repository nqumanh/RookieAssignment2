import React, { useEffect, useRef, useState } from "react";
import {
    Form,
    Dropdown,
    Table,
    ButtonGroup,
    InputGroup,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { GetDate } from "utils";
import ModalConfirm from "./EditAssignment/components/ModalConfirm";
import PaginationComponent from "./AssignmentPagination";
import assignmentApi from "api/assignmentApi";
import AssignmentRow from "./AssignmentRow";
import DatePicker from "react-datepicker";
import "./ManageAssignment.css";
import axios from "axios";

export default function ManageAssignment() {
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const location = useLocation();
    const [filterDate, setFilterDate] = useState(null);
    const [assignmentList, setAssignmentList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsNumber, setItemsNumber] = useState(itemsPerPage);
    const [topAssignment, setTopAssignment] = useState(null);
    let pageAssignHaveRecordDelete = location.state?.currentPage;
    const [showModalDisableConfirm, setShowModalDisableConfirm] =
        useState(false);
    const [filters, setFilters] = useState({
        State: [],
        AssignedDate: null,
        KeyWord: "",
        SortBy: "AssetCode",
        SortType: true,
    });
    useEffect(() => {
        document.title = "Manage Assignment";
    }, []);

    
    let assignmentId = useRef();
    let additionIndex = 0;

    if (pageAssignHaveRecordDelete >= currentPage && currentPage !== 1) {
        additionIndex = 1;
    } else {
        additionIndex = 0;
    }

    const handleCloseModal = () => {
        setShowModalDisableConfirm(false);
    };

    const handleDisableAssign = () => {
        const validFilter = validateFilters(filters);
        axios
            .put(`api/Assignments/deleteassignment/${assignmentId.current}`)
            .then(() => {
                if (
                    assignmentId.current === topAssignment?.id &&
                    (itemsNumber - 1) % itemsPerPage === 0 &&
                    currentPage > 1
                ) {
                    setTopAssignment(null);
                    setCurrentPage(currentPage - 1);
                    setItemsNumber(itemsNumber - 1);
                } else if (
                    assignmentId.current === topAssignment?.id &&
                    !((itemsNumber - 1) % itemsPerPage === 0 && currentPage > 1)
                ) {
                    setTopAssignment(null);
                } else if (
                    (itemsNumber - 1) % itemsPerPage === 0 &&
                    currentPage > 1
                ) {
                    setCurrentPage(currentPage - 1);
                    setItemsNumber(itemsNumber - 1);
                } else {
                    assignmentApi
                        .GetAssignmentsByFilters(
                            validFilter,
                            currentPage,
                            itemsPerPage,
                        )
                        .then((response) => {
                            setItemsNumber(itemsNumber - 1);
                            setAssignmentList(response);
                        })
                        .catch((error) => console.log(error));
                }
            });
        setShowModalDisableConfirm(false);
    };
    const handleOpenModalDisable = (id) => {
        assignmentId.current = id;
        setShowModalDisableConfirm(true);
    };


    useEffect(() => {
        const validFilter = validateFilters(filters);
        assignmentApi
            .GetAssignmentNumberAfterFilter(validFilter)
            .then((response) => {
                setItemsNumber(response);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        const validFilter = validateFilters(filters);
        assignmentApi
            .GetAssignmentsByFilters(validFilter, currentPage, itemsPerPage)
            .then((response) => {
                // load assign when delete page 1
                if (location.state !== null && currentPage === 1) {
                    setAssignmentList([
                        location.state.assignmentChange,
                        ...response.filter(
                            (x) => x.id !== location.state.assignmentChange.id,
                        ),
                    ]);
                    window.history.replaceState({}, document.title);
                }
                // load assign when delete another page
                else if (location.state !== null) {
                    setAssignmentList([
                        ...response.filter(
                            (x) => x.id !== location.state.assignmentChange.id,
                        ),
                    ]);
                    window.history.replaceState({}, document.title);
                } else {
                    setAssignmentList(response);
                }
            })
            .catch((error) => console.log(error));
    }, [currentPage]);

    useEffect(() => {
        setFilters({
            State: filters.State,
            AssignedDate: filterDate,
            KeyWord: filters.KeyWord,
            SortBy: filters.SortBy,
            SortType: filters.SortType,
        });
    }, [filterDate]);

    const handleChangeSortPrams = (event, fieldName) => {
        var validFilter = validateFilters({
            State: filters.State,
            AssignedDate: filters.AssignedDate,
            KeyWord: filters.KeyWord,
            SortBy: fieldName,
            SortType: !filters.SortType,
        });
        setFilters({
            State: filters.State,
            AssignedDate: filters.AssignedDate,
            KeyWord: filters.KeyWord,
            SortBy: fieldName,
            SortType: !filters.SortType,
        });
        assignmentApi
            .GetAssignmentNumberAfterFilter(validFilter)
            .then((response) => {
                setItemsNumber(response);
            })
            .catch((error) => console.log(error));
        assignmentApi
            .GetAssignmentsByFilters(validFilter, 1, itemsPerPage)
            .then((response) => {
                setAssignmentList(response);
                setCurrentPage(1);
            })
            .catch((error) => console.log(error));
    };

    const handleChangeStateFilters = (e) => {
        const { value, checked } = e.target;
        setFilters({
            State: checked
                ? [...filters.State, value]
                : filters.State.filter((element) => element !== value),
            AssignedDate: filterDate,
            KeyWord: filters.KeyWord,
            SortBy: filters.SortBy,
            SortType: filters.SortType,
        });
    };

    const handleChangeSearchWord = (e) => {
        const value = e.target.value;
        setFilters({
            State: filters.State,
            AssignedDate: filters.AssignedDate,
            KeyWord: value,
            SortBy: filters.SortBy,
            SortType: filters.SortType,
        });
    };

    const handleSubmitFilters = () => {
        const validFilter = validateFilters(filters);
        assignmentApi
            .GetAssignmentNumberAfterFilter(validFilter)
            .then((response) => {
                setItemsNumber(response);
            })
            .catch((error) => console.log(error));
        assignmentApi
            .GetAssignmentsByFilters(validFilter, 1, itemsPerPage)
            .then((response) => {
                setAssignmentList(response);
                setCurrentPage(1);
            })
            .catch((error) => console.log(error));
    };
    return (
        <div>
            <div>
                <div className="row">
                    <h4 className="page-title">Assignment List</h4>
                    <div className="col-sm-12 col-md-12 col-lg-3 text-start">
                        <Dropdown as={ButtonGroup} align="start" size="sm">
                            <Dropdown.Toggle
                                variant="outline-dark"
                                style={{
                                    minWidth: "150px",
                                    maxWidth: "200px",
                                    width: "100%",
                                    textAlign: "left",
                                    paddingLeft: "10px",
                                    border: "#c7c5c5 1px solid",
                                }}
                            >
                                State
                            </Dropdown.Toggle>
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                id="button-filter-state"
                                style={{
                                    maxWidth: "40px",
                                    border: "#d7d7d7 1px solid",
                                }}
                                onClick={() => handleSubmitFilters()}
                            >
                                <i className="bi bi-funnel-fill"></i>
                            </button>
                            <Dropdown.Menu
                                style={{
                                    minWidth: "130px",
                                    maxWidth: "250px",
                                    padding: "10px",
                                }}
                            >
                                <Form.Check
                                    type="checkbox"
                                    id="All"
                                    label="All"
                                    value="All"
                                    onChange={handleChangeStateFilters}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="Admin"
                                    label="Accepted"
                                    value="Accepted"
                                    onChange={handleChangeStateFilters}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="Staff"
                                    label="Waiting for acceptance"
                                    value="WaitingForAcceptance"
                                    onChange={handleChangeStateFilters}
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-3 text-start">
                        <InputGroup
                            size="sm"
                            className="mb-3"
                            style={{
                                height: "35px",
                                maxWidth: "250px",
                                minWidth: "150px",
                            }}
                        >
                            <DatePicker
                                selected={filterDate}
                                autoComplete="on"
                                dateFormat="dd/MM/yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                placeholderText="Assigned Date"
                                onChange={(date) => setFilterDate(date)}
                                className="form-control"
                            ></DatePicker>
                            <span
                                className="input-group-text btn btn-outline-secondary"
                                style={{
                                    position: "absolute",
                                    right: "0px",
                                    height: "100%",
                                    border: "#c7c5c5 1px solid",
                                }}
                                onClick={handleSubmitFilters}
                            >
                                <BsFillCalendarDateFill />
                            </span>
                        </InputGroup>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-3 text-end d-flex justify-content-end">
                        <div
                            className="input-group mb-3 input-group-sm"
                            style={{ height: "30px", maxWidth: "250px" }}
                        >
                            <input
                                type="text"
                                className="form-control"
                                name="search"
                                value={filters.KeyWord}
                                onChange={(e) => handleChangeSearchWord(e)}
                            ></input>
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={handleSubmitFilters}
                                style={{ border: "#c7c5c5 1px solid" }}
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-3 text-end">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                                navigate(
                                    "/manage-assignment/create-new-assignment",
                                )
                            }
                        >
                            Create new assignment
                        </button>
                    </div>
                </div>
                <div className="row">
                    <Table className="table table-spacing">
                        <thead>
                            <tr>
                                <th className="cursor-pointer" value="No">
                                    <div
                                        className="sort-title my-2 desc"
                                    >
                                        No.
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer"
                                    value="Asset Code"
                                >
                                    <div
                                        className="sort-title my-2 desc"
                                        onClick={(e) =>
                                            handleChangeSortPrams(
                                                e,
                                                "AssetCode",
                                            )
                                        }
                                    >
                                        Asset Code
                                        {!filters.SortType &&
                                            filters.SortBy === "AssetCode" ? (
                                            <i className="bi bi-caret-up-fill ms-1"></i>
                                        ) : (
                                            <i className="bi bi-caret-down-fill ms-1"></i>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer"
                                    value="Asset Name"
                                    style={{ minWidth: "160px" }}
                                >
                                    <div
                                        className="sort-title my-2 desc"
                                        onClick={(e) =>
                                            handleChangeSortPrams(
                                                e,
                                                "AssetName",
                                            )
                                        }
                                    >
                                        Asset Name
                                        {!filters.SortType &&
                                            filters.SortBy === "AssetName" ? (
                                            <i className="bi bi-caret-up-fill ms-1"></i>
                                        ) : (
                                            <i className="bi bi-caret-down-fill ms-1"></i>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer"
                                    value="Assigned to"
                                >
                                    <div
                                        className="sort-title my-2 desc"
                                        onClick={(e) =>
                                            handleChangeSortPrams(
                                                e,
                                                "AssignedTo",
                                            )
                                        }
                                    >
                                        Assigned to
                                        {!filters.SortType &&
                                            filters.SortBy === "AssignedTo" ? (
                                            <i className="bi bi-caret-up-fill ms-1"></i>
                                        ) : (
                                            <i className="bi bi-caret-down-fill ms-1"></i>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer"
                                    value="Assigned by"
                                >
                                    <div
                                        className="sort-title my-2 desc"
                                        onClick={(e) =>
                                            handleChangeSortPrams(
                                                e,
                                                "AssignedBy",
                                            )
                                        }
                                    >
                                        Assigned by
                                        {!filters.SortType &&
                                            filters.SortBy === "AssignedBy" ? (
                                            <i className="bi bi-caret-up-fill ms-1"></i>
                                        ) : (
                                            <i className="bi bi-caret-down-fill ms-1"></i>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer"
                                    value="Assigned Date"
                                >
                                    <div
                                        className="sort-title my-2 desc"
                                        onClick={(e) =>
                                            handleChangeSortPrams(
                                                e,
                                                "AssignedDate",
                                            )
                                        }
                                    >
                                        Assigned Date
                                        {!filters.SortType &&
                                            filters.SortBy === "AssignedDate" ? (
                                            <i className="bi bi-caret-up-fill ms-1"></i>
                                        ) : (
                                            <i className="bi bi-caret-down-fill ms-1"></i>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer"
                                    value="State"
                                    style={{ minWidth: "115px" }}
                                >
                                    <div
                                        className="sort-title my-2 desc"
                                        onClick={(e) =>
                                            handleChangeSortPrams(e, "State")
                                        }
                                    >
                                        State
                                        {!filters.SortType &&
                                            filters.SortBy === "State" ? (
                                            <i className="bi bi-caret-up-fill ms-1"></i>
                                        ) : (
                                            <i className="bi bi-caret-down-fill ms-1"></i>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="cursor-pointer border-0"
                                    value="Action"
                                ></th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignmentList?.length === 0 ||
                                assignmentList?.map === undefined ? (
                                <tr className="unabled-hover position-relative" style={{ height: '50px' }}>
                                    <td className="empty-loading">
                                        There is no assignment to display
                                    </td>
                                </tr>
                            ) : (
                                assignmentList.map((row, index) => {
                                    return (
                                        <AssignmentRow
                                            key={index}
                                            assignment={row}
                                            index={
                                                index + 1 +
                                                    itemsPerPage * (currentPage - 1) + additionIndex
                                            }
                                            currentPage={currentPage}
                                            pageSize={itemsPerPage}
                                            handleClickDisable={
                                                handleOpenModalDisable
                                            }
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </div>
                <div className="row">
                    <PaginationComponent
                        itemsCount={pageAssignHaveRecordDelete ? itemsNumber - 1 : itemsNumber}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        alwaysShown={true}
                    />
                </div>
            </div>
            <ModalConfirm
                isShow={showModalDisableConfirm}
                onClickCloseModal={handleCloseModal}
                onClickConfirm={handleDisableAssign}
                title="Are you sure?"
                content="Do you want to delete this assignment?"
                contentConfirm="Delete"
                contentCancel="Cancel"
            />
        </div>
    );
}

function validateFilters(filter) {
    const validFilter = {
        State:
            filter.State.includes("All") ||
                filter.State.length >= 2 ||
                filter.State.length === 0
                ? "All"
                : filter.State[0],
        AssignedDate:
            filter.AssignedDate == null ? null : GetDate(filter.AssignedDate),
        SearchWords: filter.KeyWord,
        SortBy: filter.SortBy,
        SortType: filter.SortType ? "asc" : "desc",
    };
    return validFilter;
}