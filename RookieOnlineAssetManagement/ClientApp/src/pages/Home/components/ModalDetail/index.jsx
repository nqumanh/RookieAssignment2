import React from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './ModalDetail.css'

const ModalDetail = (props) => {
    let assignmentDetail = useSelector((state) => state.home.assignment);

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
    function FormatDateTime(datetime) {
        if (datetime != null) {
            let date = `${datetime.split("T")[0].split("-")[2]}/${datetime.split("T")[0].split("-")[1]}/${datetime.split("T")[0].split("-")[0]}`;
            return date;
        }
        return "";
    }
    
    return (
        <React.Fragment>
            <Modal
                show={props.isShow}
                onHide={props.OnclickCloseModalDetail}
                backdrop="static"
                keyboard={false}
                centered
                className="modal modal-custom"
                style={{
                    backgroundColor: "transparent",
                }}
            >
                <Modal.Header className="modal__header">
                    <h5 className="m-0 bold text-nash-red">Detailed Assignment Information</h5>
                    <i className="bi bi-x-square btn-close-modal fw-bold fs-5 cursor-pointer" onClick={props.OnclickCloseModalDetail}></i>
                </Modal.Header>
                <Modal.Body className="modal__body">
                    <div className="row mb-2">
                        <div className="col-4">Asset Code</div>
                        <div className="col-8">
                            {assignmentDetail.assetCode}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Asset Name</div>
                        <div className="col-8">
                            {assignmentDetail.assetName}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Specification</div>
                        <div className="col-8">
                            {assignmentDetail.specification}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Assigned To</div>
                        <div className="col-8">
                            {assignmentDetail.assignedTo}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Assigned By</div>
                        <div className="col-8">
                            {assignmentDetail.assignedBy}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Assigned Date</div>
                        <div className="col-8">
                            {FormatDateTime(assignmentDetail.assignedDate)}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">State</div>
                        <div className="col-8">
                            {HandleDisplayAssignmentState(assignmentDetail.state)}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Note</div>
                        <div className="col-8">
                            {assignmentDetail.note}
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ModalDetail;
