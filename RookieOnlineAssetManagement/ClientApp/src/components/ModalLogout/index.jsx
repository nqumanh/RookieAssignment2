import React from 'react';
import './ModalLogout.css'
import { Modal } from "react-bootstrap";
import axios from 'axios';

const ModalLogout = (props) => {

    const HandleLogout = () => {
        axios.get("/api/Users/Logout").then(() => {
            window.location.href =
                "/Identity/Account/Login?returnUrl=" + window.location.pathname;
        });
    }

    return (
        <React.Fragment>
            <Modal
                size="sm"
                show={props.isShow}
                onHide={props.OnCLickToggleModal}
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
                <Modal.Body className="modal__body">
                    <div className='row'>
                        Do you want to log out?
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        <button className="btn btn-primary" onClick={HandleLogout}>Log out</button>
                        <button className="btn btn-outline-secondary" onClick={props.OnCLickToggleModal}>Cancel</button>
                    </div>

                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ModalLogout;
