import { CodeOff } from "@mui/icons-material";
import React from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ModalDelete.css";

const ModalCannotDelete = ({ assetCode, isShow, HandleCloseModalDelete }) => {
    const navigate = useNavigate();
    const handleEditAsset = (assetCode) => {
        console.log(assetCode);
        navigate("/manage-asset/edit-asset", {
            state: {
                assetCode: assetCode,
            },
        });
    };

    return (
        <React.Fragment>
            <Modal
                show={isShow}
                onHide={HandleCloseModalDelete}
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
                        <b>Cannot Delete Asset?</b>
                    </h5>
                    <i
                        className="bi bi-x-square btn-close-modal fw-bold fs-5 cursor-pointer topright"
                        onClick={HandleCloseModalDelete}
                    ></i>
                </Modal.Header>
                <Modal.Body className="modal__body">
                    <div>
                        <p>
                            Cannot delete the asset because it belongs to one or
                            more historical assignments.
                            <br></br> If the asset is not able to be used
                            anymore, please update its state in&nbsp;
                            <a
                                style={{ color: "blue", cursor:"pointer" }}
                                onClick={() => handleEditAsset(assetCode)}
                            >
                                <u>Edit Asset page</u>
                            </a>
                        </p>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export { ModalCannotDelete };

const ModalDelete = ({ isShow, HandleCloseModalDelete, HandleModalDelete }) => {
    return (
        <React.Fragment>
            <Modal
                show={isShow}
                onHide={HandleCloseModalDelete}
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
                    <div>
                        <p>Do you want to delete this asset?</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={HandleModalDelete}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn__cancel"
                            onClick={HandleCloseModalDelete}
                        >
                            Cancel
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export { ModalDelete };
