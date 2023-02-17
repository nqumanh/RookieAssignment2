import React from 'react';
import { Modal } from 'react-bootstrap';

const ModalConfirm = (props) => {
    const { isShow, OnclickCloseModalDetail, OnclickHandleAccept, OnclickHandleDecline, OnclickHandleReturn, IsAccept, IsReturn } = props;


    return (
        <React.Fragment>
            <Modal
                show={isShow}
                onHide={OnclickCloseModalDetail}
                backdrop="static"
                keyboard={false}
                centered
                className="modal modal-custom"
                style={{
                    backgroundColor: "transparent",
                }}
            >
                <Modal.Header className="modal__header">
                    <h5 className="m-0 bold text-nash-red">Are you sure?</h5>
                </Modal.Header>
                <Modal.Body className="modal__body" style={{ paddingLeft: "50px" }}>
                    {IsReturn ? "Do you want to create a returning request for this asset" :
                        `Do you want to ${IsAccept ? "accept" : 'decline'} this assignment?`
                    }
                    <div className="mt-3">
                        <button className="btn btn-primary me-4" onClick={IsAccept ? OnclickHandleAccept : (IsReturn ? OnclickHandleReturn : OnclickHandleDecline)}>{IsAccept ? "Accept" : (IsReturn ? "Yes" : 'Decline')}</button>
                        <button className="btn btn-outline-secondary" onClick={OnclickCloseModalDetail}>{IsReturn ? "No" : "Cancle"}</button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ModalConfirm;