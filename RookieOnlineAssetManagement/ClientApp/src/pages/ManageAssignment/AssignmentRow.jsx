import { BsArrowCounterclockwise, BsFillPencilFill } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Fragment, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAssignmentDetail } from "pages/Home/HomeSlice";
import ModalDetail from "pages/Home/components/ModalDetail";
import ModalConfirm from "./EditAssignment/components/ModalConfirm";
import axios from "axios";
import assignmentApi from "api/assignmentApi";

function GetDate(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1; //January is 0!
    var year = date.getFullYear();

    if (day < 10) {
        day = `0${day}`;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    return `${day}/${month}/${year}`;
}

const AssignmentRow = ({
    assignment,
    index,
    currentPage,
    pageSize,
    handleClickDisable,
}) => {
    const [isActiveIcon, setIsActiveIcon] = useState(false);
    const navigate = useNavigate();
    const [showModalRequestConfirm, setShowModalRequestConfirm] =
        useState(false);
    const editAssigment = (id) => {
        navigate(`edit-assignment`, {
            state: {
                idAssignment: id,
                assignedTo: assignment.assignedTo,
                currentPage: currentPage,
            },
        });
    };

    const [showModalDetail, setShowModalDetail] = useState(false);
    const dispatch = useDispatch();

    function CompactText(text) {
        var result = "";
        if (text != null) {
            if (text.length <= 20) return text;
            else {
                for (var i = 0; i < 20; i++) {
                    result = result.concat(text.split("")[i]);
                }
                return result + "...";
            }
        } else return result;
    }

    const handleOpenModalRequestReturning = () => {
        setShowModalRequestConfirm(true);
    };

    const showAssignmentDetail = (assignmentId) => {
        dispatch(fetchAssignmentDetail(assignmentId));
        setShowModalDetail(true);
    };

    const HandleCloseModalDetail = () => {
        setShowModalDetail(false);
    };
    const handleCloseModal = () => {
        setShowModalRequestConfirm(false);
    };
    const handleCreateRequest = async () => {
        await assignmentApi.ReturnAssignment(assignment.id);
        setIsActiveIcon(true);
        setShowModalRequestConfirm(false);
    };

    return (
        <Fragment>
            <tr key={index}>
                <td className="p-0">
                    <div className="td__cell" onClick={() => showAssignmentDetail(assignment.id)}>
                        {index}
                    </div>
                </td>
                <td className="p-0">
                    <div
                        className="td__cell"
                        onClick={() => showAssignmentDetail(assignment.id)}
                    >
                        {assignment.assetCode}
                    </div>
                </td>
                <td className="p-0">
                    <div
                        className="td__cell"
                        onClick={() => showAssignmentDetail(assignment.id)}
                    >
                        <OverlayTrigger
                            key={"bottom"}
                            placement={"bottom"}
                            overlay={<Tooltip>{assignment.assetName}</Tooltip>}
                        >
                            <p className="m-0">
                                {CompactText(assignment.assetName)}
                            </p>
                        </OverlayTrigger>
                    </div>
                </td>
                <td className="p-0">
                    <div
                        className="td__cell"
                        onClick={() => showAssignmentDetail(assignment.id)}
                    >
                        <OverlayTrigger
                            key={"bottom"}
                            placement={"bottom"}
                            overlay={<Tooltip>{assignment.assignedTo}</Tooltip>}
                        >
                            <p className="m-0">
                                {CompactText(assignment.assignedTo, 12)}
                            </p>
                        </OverlayTrigger>
                    </div>
                </td>
                <td className="p-0">
                    <div className="td__cell" onClick={() => showAssignmentDetail(assignment.id)}>
                        <OverlayTrigger
                            key={"bottom"}
                            placement={"bottom"}
                            overlay={<Tooltip>{assignment.assignedBy}</Tooltip>}
                        >
                            <p className="m-0">
                                {CompactText(assignment.assignedBy, 12)}
                            </p>
                        </OverlayTrigger>
                    </div>
                </td>
                <td className="p-0">
                    <div
                        className="td__cell"
                        onClick={() => showAssignmentDetail(assignment.id)}
                    >
                        {GetDate(assignment.assignedDate)}
                    </div>
                </td>
                <td className="p-0" width="14%">
                    <div
                        className="td__cell"
                        onClick={() => showAssignmentDetail(assignment.id)}
                    >
                        <p className="m-0">
                            {assignment.state === 1
                                ? "Accepted"
                                : "Waiting for acceptance"}
                        </p>
                    </div>
                </td>
                <td className="p-0 mx-5" style={{ cursor: "default", minWidth: "70px" }}>
                    {assignment.state === 1 ? (
                        <>
                            <BsFillPencilFill
                                style={{
                                    color: "black",
                                    fontSize: "16px",
                                    padding: "0",
                                    opacity: "0.3",
                                    cursor: "default",
                                }}
                            />
                            <AiOutlineCloseCircle
                                className="mx-2"
                                style={{
                                    color: "red",
                                    fontSize: "16px",
                                    padding: "0",
                                    opacity: "0.3",
                                    cursor: "default",
                                }}
                            />
                            {assignment.isWaitingForReturningRequest ===
                                false ? (
                                <button className="btn p-0 border-0 align-items-end">
                                    <BsArrowCounterclockwise
                                        className={`fs-5 text-primary fw-bold ${isActiveIcon
                                                ? "icon-disabled-black"
                                                : ""
                                            }`}
                                        onClick={
                                            handleOpenModalRequestReturning
                                        }
                                    />
                                </button>
                            ) : (
                                <button className="btn p-0 border-0 align-items-end">
                                    <BsArrowCounterclockwise
                                        style={{
                                            color: "darkgrey",
                                            fontSize: "18px",
                                            padding: "0",
                                            cursor: "default",
                                        }}
                                    />
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                className="btn p-0 border-0"
                                onClick={() => editAssigment(assignment.id)}
                            >
                                <BsFillPencilFill
                                    style={{
                                        color: "black",
                                        fontSize: "16px",
                                        padding: "0",
                                    }}
                                />
                            </button>
                            <button className="btn p-0 border-0">
                                <AiOutlineCloseCircle
                                    className="mx-2"
                                    style={{
                                        color: "red",
                                        fontSize: "16px",
                                        padding: "0",
                                    }}
                                    onClick={() => handleClickDisable(assignment.id)}
                                />
                            </button>
                            <button className="btn p-0 border-0 align-items-end">
                                <BsArrowCounterclockwise
                                    style={{
                                        color: "darkgrey",
                                        fontSize: "18px",
                                        padding: "0",
                                        cursor: "default",
                                    }}
                                />
                            </button>
                        </>
                    )}
                </td>
            </tr>
            <ModalDetail
                isShow={showModalDetail}
                OnclickCloseModalDetail={HandleCloseModalDetail}
            />
            <ModalConfirm
                isShow={showModalRequestConfirm}
                onClickCloseModal={handleCloseModal}
                onClickConfirm={handleCreateRequest}
                title="Are you sure?"
                content={`Do you want to create a returning request for this<br/>asset?`}
                contentConfirm="Yes"
                contentCancel="No"
            />
        </Fragment>
    );
};

export default AssignmentRow;
