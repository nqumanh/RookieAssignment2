import { Modal } from "react-bootstrap";
import React from "react";
import "./ModalRequest.css";

const ModalComplete = ({
    isShow,
    HandleCloseModalComplete,
    HandleModalComplete,
}) => {
    return (
        <React.Fragment>
            <Modal
                show={isShow}
                onHide={HandleCloseModalComplete}
                backdrop="static"
                keyboard={false}
                centered
                className="modal modal-custom"
                style={{
                    backgroundColor: "transparent",
                }}
            >
                <Modal.Header className="modal__header">
                    <h5 className="m-0 bold text-nash-red">
                        <b>Are you sure</b>?
                    </h5>
                </Modal.Header>
                <Modal.Body className="modal__body px-4">
                    <div className="px-2">
                        <p>
                            <small>
                                Do you want to mark this returning request as
                                'Completed'?
                            </small>
                        </p>
                    </div>
                    <div className="px-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={HandleModalComplete}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn__cancel"
                            onClick={HandleCloseModalComplete}
                        >
                            No
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};


const ModalCancelReturningRequest = ({isShow, handleCloseModal, handleConfirm}) => {
    return <React.Fragment>
            <Modal
                show={isShow}
                onHide={handleCloseModal}
                backdrop="static"
                keyboard={false}
                centered
                className="modal modal-custom"
                style={{
                    backgroundColor: "transparent",
                }}
            >
                <Modal.Header className="modal__header">
                    <h5 className="m-0 bold text-nash-red">
                        <b>Are you sure</b>?
                    </h5>
                </Modal.Header>
                <Modal.Body className="modal__body px-4">
                    <div className="px-2">
                        <p>
                            <small>
                                Do you want to cancel this returning request?
                            </small>
                        </p>
                    </div>
                    <div className="px-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleConfirm}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn__cancel"
                            onClick={handleCloseModal}
                        >
                            No
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
}


export { ModalComplete, ModalCancelReturningRequest };