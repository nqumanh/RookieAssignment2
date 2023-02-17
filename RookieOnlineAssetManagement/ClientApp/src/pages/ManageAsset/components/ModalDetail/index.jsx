import React from 'react';
import { Modal } from 'react-bootstrap';
import './ModalDetail.css'

const ModalDetail = (props) => {
    function HandleDisplayAssetState(state) {
        if (state === 1) {
            return "Assigned"
        }
        if (state === 2) {
            return "Available"
        }
        if (state === 3) {
            return "Not Available"
        }
        if (state === 5) {
            return "Waiting for recycling"
        }
        if (state === 4) {
            return "Recycled"
        }
    }
    function FormatDateTime(datetime) {
        if (datetime != null) {
            let date = `${datetime.split("T")[0].split("-")[2]}/${datetime.split("T")[0].split("-")[1]}/${datetime.split("T")[0].split("-")[0]}`;
            return date;
        }
        else return "";
    }

    return (
        <React.Fragment>
            <Modal
                show={props.isShow}
                onHide={props.OnclickCloseModalDetail}
                backdrop="static"
                keyboard={false}
                centered
                className="modal-lg modal-custom"
                style={{
                    backgroundColor: "transparent",
                }}
            >
                <Modal.Header className="modal__header">
                    <h5 className="m-0 bold text-nash-red">Detailed Asset Information</h5>
                    <i className="bi bi-x-square btn-close-modal fw-bold fs-5 cursor-pointer" onClick={props.OnclickCloseModalDetail}></i>
                </Modal.Header>
                <Modal.Body className="modal__body">
                    <div className="row mb-2">
                        <div className="col-3">Asset Code</div>
                        <div className="col-9">
                            {props.asset.assetCode}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3">Asset Name</div>
                        <div className="col-9">
                            {props.asset.assetName}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3">Category</div>
                        <div className="col-9">
                            {props.asset.categoryName}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3">Installed Date</div>
                        <div className="col-9">
                            {FormatDateTime(props.asset.installedDate)}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3">State</div>
                        <div className="col-9">
                            {HandleDisplayAssetState(props.asset.state)}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3">Location</div>
                        <div className="col-9">
                            {props.asset.location}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3">Specification</div>
                        <div className="col-9">
                            {props.asset.specification}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-3">History</div>
                        <div className="col-9">
                            {(props.listHistory.length === 0) ? <h5></h5> :
                                <table className="table table-spacing">
                                    <thead>
                                        <tr>
                                            <th className="cursor-pointer" value="Date" >
                                                Date
                                            </th>
                                            <th className="cursor-pointer" value="Assigned To" >
                                                Assigned To
                                            </th>
                                            <th className="cursor-pointer" value="Assigned By" >
                                                Assigned By
                                            </th>
                                            <th className="cursor-pointer" value="Returned Date" >
                                                Returned Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.listHistory.map((history, index) => {
                                            return (
                                                <tr key={index}>
                                                    {history.assignmentHistory.length !== 0 ?
                                                        <td className="p-0" >
                                                            {history.assignmentHistory.map((assignmentHistory, index) => {
                                                                return (
                                                                    <div key={index} className="my-2">
                                                                        {FormatDateTime(assignmentHistory.assignedDate)}
                                                                    </div>
                                                                )
                                                            })}
                                                        </td> :
                                                        <td className="p-0" >
                                                            <div className="my-2">
                                                            </div>
                                                        </td>
                                                    }
                                                    {history.assignmentHistory.length !== 0 ?
                                                        <td className="p-0" >
                                                            {history.assignmentHistory.map((assignmentHistory, index) => {
                                                                return (
                                                                    <div key={index} className="my-2">
                                                                        {assignmentHistory.assignedTo}
                                                                    </div>
                                                                )
                                                            })}
                                                        </td> :
                                                        <td className="p-0" >
                                                            <div className="my-2">
                                                            </div>
                                                        </td>
                                                    }
                                                    {history.assignmentHistory.length !== 0 ?
                                                        <td className="p-0" >
                                                            {history.assignmentHistory.map((assignmentHistory, index) => {
                                                                return (
                                                                    <div key={index} className="my-2">
                                                                        {assignmentHistory.assignedBy}
                                                                    </div>
                                                                )
                                                            })}
                                                        </td> : <td className="p-0" >
                                                            <div className="my-2">
                                                            </div>
                                                        </td>
                                                    }
                                                    {history.returningRequestHistory.length !== 0 ?
                                                        <td className="p-0" >
                                                            {history.returningRequestHistory.map((requestHistory, index) => {
                                                                return (
                                                                    <div key={index} className="my-2">
                                                                        {FormatDateTime(requestHistory.returnedDate)}
                                                                    </div>
                                                                )
                                                            })}
                                                        </td> : <td className="p-0" >
                                                            <div className="my-2">
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                 </table>
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ModalDetail;
