import React from 'react';
import { Modal } from 'react-bootstrap';

const ModalDetail = (props) => {
    const { IsShow, OnclickCloseModalDetail, UserInfor } = props;

    var birthdate = new Date(UserInfor?.dateofBirth);
    let birthdateString =
        ("0" + birthdate.getDate()).slice(-2) +
        "/" +
        ("0" + (birthdate.getMonth() + 1)).slice(-2) +
        "/" +
        birthdate.getFullYear();

    var joindate = new Date(UserInfor?.joinedDate);
    let joindateString =
        ("0" + joindate.getDate()).slice(-2) +
        "/" +
        ("0" + (joindate.getMonth() + 1)).slice(-2) +
        "/" +
        joindate.getFullYear();
    

    return (
        <React.Fragment>
            <Modal
                show={IsShow}
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
                    <h5 className="m-0 bold text-nash-red">Detailed User Information</h5>
                    <i className="bi bi-x-square btn-close-modal fw-bold fs-5 cursor-pointer" onClick={OnclickCloseModalDetail}></i>
                </Modal.Header>
                <Modal.Body className="modal__body">
                    <div className="row mb-2">
                        <div className="col-4">Staff Code</div>
                        <div className="col-8">
                            {UserInfor?.staffCode}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Full Name</div>
                        <div className="col-8">
                            {UserInfor?.fullName}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Username</div>
                        <div className="col-8">
                            {UserInfor?.userName}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Date of Birth</div>
                        <div className="col-8">
                            {birthdateString}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Gender</div>
                        <div className="col-8">
                            {UserInfor?.gender === 1 ? "Female" : "Male"}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Joined Date</div>
                        <div className="col-8">
                            {joindateString}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Type</div>
                        <div className="col-8">
                            {UserInfor?.type === 1 ? "Admin" : "Staff"}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-4">Location</div>
                        <div className="col-8">
                            {UserInfor?.location}
                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ModalDetail;