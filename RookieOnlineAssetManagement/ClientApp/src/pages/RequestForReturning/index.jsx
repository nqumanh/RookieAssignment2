import React, { useState } from "react";
import { CompactString, GetDateDMY, UTCWithoutHour } from "utils";
import Pagination from "./Pagination";
import { MdDone } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { useEffect } from "react";
import { ButtonGroup, Dropdown, Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsFillCalendarDateFill } from "react-icons/bs";
import TableLoading from "components/TableLoading";
import { getReturningRequests, cancelReturningRequest } from "api/ReturningRequestService";
import { ModalCancelReturningRequest, ModalComplete } from './ModalRequest'
import axios from "axios";
const headers = ["Asset Code", "Asset Name", "Requested by", "Accepted by", "Returned Date", "State"]
const fields = ["assetCode", "assetName", "requestedBy", "acceptedBy", "returnedDate", "state"]

const RequestForReturning = () => {
    document.title = "Request For Returning";

    const [loading, setLoading] = useState(false);

    const [returningRequests, setReturningRequests] = useState([]);

    const [filterState, setFilterState] = useState(0);
    const [stateAll, setStateAll] = useState(true);
    const [stateCompleted, setStateCompleted] = useState(false);
    const [stateWaitingForReturning, setStateWaitingForReturning] = useState(false);

    const [returnedDate, setReturnedDate] = useState(null);
    const [filterDate, setFilterDate] = useState(null);

    const [searchString, setSearchString] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const [sortType, setSortType] = useState(true);
    const [sortBy, setSortBy] = useState("Asset Code");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [isShowCompleteModal, setIsShowCompleteModal] = useState(false);
    const [idRequest, setIdRequest] = useState(0);
    const [triggerReloadPage, setTriggerReloadPage] = useState(0);

    const [isShowCancelModel, setIsShowCancelModel] = useState(false)

    const handleCloseCancelModal = () => {
        setIsShowCancelModel(false)
    }

    const handleOpenCancelModal = (returningRequestId) => {
        setIsShowCancelModel(true)
        setIdRequest(returningRequestId)
    }

    const handleCancelReturningRequest = () => {
        cancelReturningRequest(idRequest)
            .then(() => {
                setTriggerReloadPage(triggerReloadPage + 1)
            })
            .catch((error) => console.log(error));
        setIsShowCancelModel(false);
    };

    const handleChangeStateFilters = (e) => {
        const { name, checked } = e.target;
        console.log(name, checked);
        switch (name) {
            case "all":
                if (checked) {
                    setStateCompleted(true)
                    setStateWaitingForReturning(true)
                }
                setStateAll((x) => !x);
                break;
            case "completed":
                setStateCompleted((x) => !x);
                break;
            default:
                setStateWaitingForReturning((x) => !x);
                break;
        }
    };

    const onFilterState = () => {
        if (stateAll || (stateCompleted && stateWaitingForReturning) || (!stateAll && !stateCompleted && !stateWaitingForReturning)) {
            setFilterState(0);
        } else {
            if (stateCompleted) {
                setFilterState(1);
            } else setFilterState(2);
        }
        setCurrentPage(1);
    };

    const onFilterReturnDate = () => {
        if (returnedDate == null) setFilterDate(null);
        else setFilterDate(UTCWithoutHour(returnedDate));
        setCurrentPage(1);
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
        setCurrentPage(1);
    };

    const ROWPERPAGES = 10;

    const onSortCol = (header) => {
        if (header === sortBy) {
            setSortType((x) => !x);
        } else {
            setSortBy(header);
            setSortType(true);
        }
    };

    useEffect(() => {
        setLoading(true);
        getReturningRequests(
            filterState,
            filterDate,
            searchString,
            sortBy,
            sortType,
            ROWPERPAGES,
            currentPage,
        )
            .then((response) => {
                let returningRequests = response.data.returningRequests.map(
                    (request) => ({
                        id: request.id,
                        assetCode: request.assetCode,
                        assetName: request.assetName,
                        requestedBy: request.requestedBy,
                        acceptedBy: request.acceptedBy,
                        returnedDate:
                            request.returnedDate === "0001-01-01T00:00:00"
                                ? null
                                : GetDateDMY(request.returnedDate),
                        state:
                            request.state === 1
                                ? "Completed"
                                : "Waiting for returning",
                    }),
                );
                setLoading(false);
                setReturningRequests(returningRequests);
                setTotalRows(response.data.totalItem);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }, [
        filterState,
        filterDate,
        searchString,
        sortBy,
        sortType,
        currentPage,
        triggerReloadPage,
    ]);

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

    const handleCloseModalComplete = () => {
        setIsShowCompleteModal(false);
    };

    const handleCompleteRequest = (request) => {
        setIdRequest(request.id);
        setIsShowCompleteModal(true);
    };

    const handleModalComplete = () => {
        axios
            .put(`/api/ReturningRequests/CompleteReturningRequest/${idRequest}`)
            .then((response) => {
                setTriggerReloadPage(triggerReloadPage + 1);
            });
        setIsShowCompleteModal(false);
    };
    return (
        <div>
            <div className="page-title">Request List</div>
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <div className="me-3" id="filter-request-state">
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
                                onClick={() => onFilterState()}
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
                                    name="all"
                                    onChange={handleChangeStateFilters}
                                    checked={stateAll}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Completed"
                                    name="completed"
                                    id="Completed"
                                    onChange={handleChangeStateFilters}
                                    checked={stateCompleted}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Waiting for returning"
                                    name="waitingForReturning"
                                    id="WaitingForReturning"
                                    onChange={handleChangeStateFilters}
                                    checked={stateWaitingForReturning}
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div id="filter-request-returned-date">
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
                                autoComplete="off"
                                dateFormat="dd/MM/yyyy"
                                maxDate={new Date()}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                placeholderText="Returned Date"
                                className="form-control"
                                selected={returnedDate}
                                onChange={(date) => setReturnedDate(date)}
                            ></DatePicker>
                            <button
                                className="input-group-text btn btn-outline-secondary"
                                style={{
                                    position: "absolute",
                                    right: "0px",
                                    height: "100%",
                                    border: "#c7c5c5 1px solid",
                                }}
                                onClick={() => onFilterReturnDate()}
                            >
                                <BsFillCalendarDateFill />
                            </button>
                        </InputGroup>
                    </div>
                </div>
                <div id="search-request">
                    <div
                        className="input-group mb-3 input-group-sm"
                        style={{ height: "30px", maxWidth: "250px" }}
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
                            style={{ border: "#c7c5c5 1px solid" }}
                            onClick={() => onSearch()}
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th className="my-2"
                                style={{ cursor: "pointer" }}
                                scope="col">
                                    No.
                        </th>
                        {headers.map((header, index) => (
                            <th
                                className="my-2"
                                style={{ cursor: "pointer" }}
                                scope="col"
                                key={index}
                                onClick={() => onSortCol(header)}
                            >
                                {header}
                                {(sortBy === header && !sortType) ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>}
                            </th>
                        ))}
                        <th key="action" style={{ border: "0" }}></th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr className="unabled-hover">
                            <td className="border-0">
                                <TableLoading />
                            </td>
                        </tr>
                    ) : returningRequests?.length === 0 ? (
                        <tr
                            key="No Request"
                            className="unabled-hover position-relative"
                            style={{ height: "50px" }}
                        >
                            <td className="empty-loading">
                                There is no returning request to display
                            </td>
                        </tr>
                    ) : (
                        returningRequests.map((request, index) => (
                            <tr key={index}>
                                <td>
                                    {index + 1 + (currentPage - 1) * ROWPERPAGES}
                                </td>
                                {fields.map((field, idx) => (
                                    <td key={idx} className="ps-0">
                                        <LongContentCol>
                                            {request[field]}
                                        </LongContentCol>
                                    </td>
                                ))}
                                <td className="ps-0" style={{ border: "0" }}>
                                    {request.state === "Completed" ? (
                                        <>
                                            <button
                                                className="btn p-0 border-0"
                                                disabled
                                            >
                                                <MdDone
                                                    className="text-danger fw-bold"
                                                    style={{ opacity: "0.3" }}
                                                />
                                            </button>
                                            <button className="btn p-0 border-0">
                                                <IoCloseSharp
                                                    className="fw-bold"
                                                    style={{ opacity: "0.3" }}
                                                />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn p-0 border-0"
                                                onClick={() =>
                                                    handleCompleteRequest(
                                                        request,
                                                    )
                                                }
                                            >
                                                <MdDone className="text-danger fw-bold" />
                                            </button>
                                            <button className="btn p-0 border-0">
                                                <IoCloseSharp
                                                    className="fw-bold"
                                                    onClick={() =>
                                                        handleOpenCancelModal(
                                                            request.id,
                                                        )
                                                    }
                                                />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination
                initialPage={currentPage}
                rowsPerPage={ROWPERPAGES}
                rowCount={totalRows}
                paginate={setCurrentPage}
            />
            <ModalComplete
                isShow={isShowCompleteModal}
                HandleCloseModalComplete={handleCloseModalComplete}
                HandleModalComplete={handleModalComplete}
            />
            <ModalCancelReturningRequest
                isShow={isShowCancelModel}
                handleCloseModal={handleCloseCancelModal}
                handleConfirm={handleCancelReturningRequest}
            ></ModalCancelReturningRequest>
        </div>
    );
};

export default RequestForReturning;
