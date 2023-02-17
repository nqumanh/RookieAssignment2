import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { acceptAssignment, declineAssignment, existsAssignment, fetchAssignmentDetail, fetchAssignments, fetchAssignmentsSortingPaging, returnAssignment } from "pages/Home/HomeSlice";
import { MdDone } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { BsArrowCounterclockwise } from "react-icons/bs";
import ModalDetail from "./components/ModalDetail";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ModalConfirm from "./components/ModalConfirm";
import TableLoading from "components/TableLoading";
import './Home.css'
import api, { endpoint } from "api/api";


export default function Home() {
    const dispatch = useDispatch();
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const [assignmentId, setAssignmentId] = useState();
    let loading = useSelector((state) => state.home.loading);
    let loadingSortingPaging = useSelector((state) => state.home.loadingSortingPaging);
    let assignmentList = useSelector((state) => state.home.assignments);
    let page = useSelector((state) => state.home.page);
    let lastPage = useSelector((state) => state.home.lastPage);

    let [fieldNameSorting, setFieldNameSorting] = useState();
    let [typeSorting, setTypeSorting] = useState();
    let pageSize = useRef(10);
    let isAccept = useRef();
    let isReturn = useRef();

    const headers = [
        {
            label: "Asset Code",
            value: "assetCode"
        },
        {
            label: "Asset Name",
            value: "assetName"
        },
        {
            label: "Category",
            value: "category"
        },
        {
            label: "Assigned Date",
            value: "assignedDate"
        },
        {
            label: "State",
            value: "state"
        },
    ];


    useEffect(() => {
        document.title = "Home";
        // Initialized data on table
        try {
            const params = {
                fieldName: "assetCode",
                sortType: "asc",
                page: 1,
                limit: pageSize.current,
            };
            dispatch(fetchAssignments(params));
        } catch (error) {
            console.log('Failed to fetch assignment list: ', error);
        }
    }, [dispatch])

    const fetchAssignmentList = async (fieldName, sortType, currentPage, limit) => {
        try {
            const params = {
                fieldName,
                sortType,
                page: currentPage,
                limit
            };
            dispatch(fetchAssignmentsSortingPaging(params));
        } catch (error) {
            console.log('Failed to fetch assignment list: ', error);
        }
    }

    const HandlePageClick = (data) => {
        let currentPage = data.selected + 1;
        fetchAssignmentList(fieldNameSorting, typeSorting, currentPage, pageSize.current);
    }

    // Handle sorting
    const HandleSortingClick = (event, fieldName) => {
        setFieldNameSorting(fieldName)
        if (typeSorting != null && fieldNameSorting == fieldName) {
            if (typeSorting == 'asc') {
                setTypeSorting('desc');
            }
            else if (typeSorting == 'desc') {
                setTypeSorting('asc');
            }
        }
        else {
            setTypeSorting('asc');
        }
    }
    useEffect(() => {
        fetchAssignmentList(fieldNameSorting, typeSorting, page, pageSize.current);
    }, [fieldNameSorting, typeSorting])


    const HandleCloseModalDetail = (event) => {
        setShowModalDetail(false);
    }

    const HandleOpenModalConfirm = (assignmentId, accepted, returned) => {
        isReturn.current = returned;
        isAccept.current = accepted;
        setAssignmentId(assignmentId)
        setShowModalConfirm(true);
    }

    const HandleCloseModalConfirm = (event) => {
        setShowModalConfirm(false);
    }

    const HandleWatchDetailAssignment = (assignmentId) => {
        dispatch(fetchAssignmentDetail(assignmentId));
        setShowModalDetail(true);
    }

    const HandleAcceptAssignment = () => {
        const data = {
            id: assignmentId,
            currentPage: page,
            pageSize: pageSize.current,
            fieldName: fieldNameSorting,
            softType: typeSorting
        }
        dispatch(acceptAssignment(data));
        setShowModalConfirm(false); // Close modal
    }
    const HandleDeclineAssignment = () => {
        const data = {
            id: assignmentId,
            pageSize: pageSize.current
        }
        dispatch(declineAssignment(data));
        setShowModalConfirm(false); // Close modal

        // Reset paging
        let paglink = document.querySelectorAll('.page-item');
        paglink[1].firstChild.click();
    }

    const HandleReturnAssignment = async () => {
        const data = {
            id: assignmentId,
            currentPage: page,
            pageSize: pageSize.current,
            fieldName: fieldNameSorting,
            softType: typeSorting
        }
        await dispatch(returnAssignment(data));
        setShowModalConfirm(false); // Close modal
    }
    function FormatDateTime(datetime) {
        if (datetime != null) {
            let date = `${datetime.split("T")[0].split("-")[2]}/${datetime.split("T")[0].split("-")[1]}/${datetime.split("T")[0].split("-")[0]}`;
            return date;
        }
        return "";
    }
    function CompactText(text) {
        var result = "";
        if (text != null) {
            if (text.length <= 20)
                return text;

            else {
                for (var i = 0; i < 20; i++) {
                    result = result.concat(text.split('')[i])
                }
                return result + "...";
            }
        }
        else
            return result;
    }
    function HandleDisplayAssignmentState(assignmentState) {
        if (assignmentState != null) {
            if (assignmentState === 1)
                return "Accepted";
            else if (assignmentState === 2)
                return "Waiting For Acceptance";
        }
        else
            return "";
    }
    return (
        <div>
            <div className="page-title">My Assignment</div>
            <div className="table-responsive">
                <table className={`table table-spacing ${loadingSortingPaging ? "table-loading" : ""}`}>
                    <thead>
                        <tr>
                            {
                                headers.map(item => {
                                    return (
                                        <th className="cursor-pointer" key={item.value}>
                                            <div className="sort-title my-2 desc" onClick={(event) => HandleSortingClick(event, item.value)}>
                                                {item.label}
                                                {
                                                    fieldNameSorting === item.value
                                                    ? (
                                                        <i className={`uil ms-1 ${typeSorting == "desc" ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></i>
                                                    )
                                                    : (
                                                        <i className='bi bi-caret-down-fill ms-2'></i>
                                                    )
                                                }
                                            </div>
                                        </th>
                                    )
                                })
                            }
                            <th style={{ border: "0px" }}></th>
                        </tr>


                    </thead>
                    {
                        !loading ?
                            <tbody className="wrap-loading">
                                {
                                    assignmentList?.length === 0
                                        ? (
                                            <tr className="unabled-hover position-relative" style={{ height: '50px' }}>
                                                <td className="empty-loading">
                                                    There is no assignment to display
                                                </td>
                                            </tr>
                                        )
                                        : assignmentList?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="p-0" onClick={() => HandleWatchDetailAssignment(item.assignmentId)}>
                                                        <div className="my-2">
                                                            {item.assetCode}
                                                        </div>
                                                    </td>
                                                    <td className="p-0" onClick={() => HandleWatchDetailAssignment(item.assignmentId)}>
                                                        <div className="my-2">
                                                            <OverlayTrigger
                                                                key={'bottom'}
                                                                placement={'bottom'}
                                                                overlay={
                                                                    <Tooltip>
                                                                        {item.assetName}
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <p className="m-0">{CompactText(item.assetName)}</p>
                                                            </OverlayTrigger>

                                                        </div>
                                                    </td>
                                                    <td className="p-0" onClick={() => HandleWatchDetailAssignment(item.assignmentId)}>
                                                        <div className="my-2">
                                                            {item.category}
                                                        </div>
                                                    </td>
                                                    <td className="p-0" onClick={() => HandleWatchDetailAssignment(item.assignmentId)}>
                                                        <div className="my-2">
                                                            {FormatDateTime(item.assignedDate)}
                                                        </div>
                                                    </td>
                                                    <td className="p-0" onClick={() => HandleWatchDetailAssignment(item.assignmentId)}>
                                                        <div className="my-2">
                                                            {HandleDisplayAssignmentState(item.state)}
                                                        </div>
                                                    </td>
                                                    <td className="p-0 px-3 mx-5 border-0">
                                                        <button className="btn p-0 border-0">
                                                            <MdDone
                                                                className={`fs-5 text-danger fw-bold ${item.state === 1 ? 'icon-disabled' : ''}`}
                                                                onClick={() => HandleOpenModalConfirm(item.assignmentId, true, false)}
                                                            />
                                                        </button>
                                                        <button className="btn p-0 border-0">
                                                            <IoCloseSharp
                                                                className={`fs-5 fw-bold mx-1 ${item.state === 1 ? 'icon-disabled' : ''}`}
                                                                onClick={() => HandleOpenModalConfirm(item.assignmentId, false, false)}
                                                            />
                                                        </button>
                                                        <button className="btn p-0 border-0 align-items-end">
                                                            <BsArrowCounterclockwise
                                                                className={`fs-5 text-primary fw-bold ${(item.isWaitingForReturningRequest === true || item.state === 2) ? 'icon-disabled' : ''}`}
                                                                onClick={() => HandleOpenModalConfirm(item.assignmentId, false, true)}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                            :
                            <React.Fragment>
                                <tbody>
                                    <tr className="unabled-hover">
                                        <td className="border-0">
                                            <TableLoading />
                                        </td>
                                    </tr>
                                </tbody>
                            </React.Fragment>
                    }
                </table>
            </div>


            {
                !loading ?
                    <ReactPaginate
                        previousLabel={'Previous'}
                        breakLabel={'...'}
                        nextLabelLabel={'Next'}
                        pageCount={lastPage}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={6}
                        onPageChange={HandlePageClick}
                        containerClassName={
                            `pagination justify-content-end ${loadingSortingPaging ? "table-loading mt-4" : ""}`
                        }
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={`page-item ${lastPage === 0 ? 'disabled' : ''}`}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-link'}
                        activeClassName={'active'}
                    />
                    : ""
            }


            <ModalDetail
                isShow={showModalDetail}
                OnclickCloseModalDetail={HandleCloseModalDetail}
                assignmentId={assignmentId}
            />

            <ModalConfirm
                isShow={showModalConfirm}
                OnclickCloseModalDetail={HandleCloseModalConfirm}
                OnclickHandleAccept={HandleAcceptAssignment}
                OnclickHandleDecline={HandleDeclineAssignment}
                OnclickHandleReturn={HandleReturnAssignment}
                IsAccept={isAccept.current}
                IsReturn={isReturn.current}
            />
        </div>
    );
}