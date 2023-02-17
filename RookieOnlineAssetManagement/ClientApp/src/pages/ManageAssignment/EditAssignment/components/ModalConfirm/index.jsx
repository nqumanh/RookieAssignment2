
import React from "react";
import { Modal } from "react-bootstrap";

const ModalConfirm = (props) => {
    const { isShow, onClickCloseModal, onClickConfirm, title, content, contentConfirm, contentCancel } = props;

    return (
        <React.Fragment>
            <Modal
                show={isShow}
                onHide={onClickCloseModal}
                backdrop="static"
                keyboard={false}
                centered
                className="modal modal-custom"
                style={{
                    backgroundColor: "transparent",
                }}
            >
                <Modal.Header className="modal__header">
                    <h5 className="m-0 bold text-nash-red">{title}</h5>
                </Modal.Header>
                <Modal.Body className="modal__body">
                    <span dangerouslySetInnerHTML={{ __html: content }}></span>
                    <div className="mt-3">
                        <button
                            className="btn btn-primary me-4"
                            onClick={onClickConfirm}
                        >
                            {contentConfirm}
                        </button>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={onClickCloseModal}
                        >

                            {contentCancel}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ModalConfirm;
