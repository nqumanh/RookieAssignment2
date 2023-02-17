import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './ModalConfirm.css'
import { closeModal } from './ModalConfirmSlice';

const ModalConfirm = (props) => {
    const dispatch = useDispatch();

    let isShowModal = useSelector((state) => state.modal.isShowModal);
    let title = useSelector((state) => state.modal.title);
    let content = useSelector((state) => state.modal.content);
    let isShowButtonCloseIcon = useSelector((state) => state.modal.isShowButtonCloseIcon);
    let isShowButtonFunction = useSelector((state) => state.modal.isShowButtonFunction);
    let isShowButtonClose = useSelector((state) => state.modal.isShowButtonClose);
    let contentButtonFunction = useSelector((state) => state.modal.contentButtonFunction);
    let contentButtonClose = useSelector((state) => state.modal.contentButtonClose);
    let HandleFunction = useSelector((state) => state.modal.handleFunction);

    const HandleCloseModal = () => {
        dispatch(closeModal())
    }

    return (
        <React.Fragment>
            <div className={`overlay ${isShowModal ? "show" : ""}`}></div>
            <div className={`custom-modal ${isShowModal ? "show" : ""}`}>
                <div className="modal-header">
                    <span className="modal-header__title" dangerouslySetInnerHTML={{ __html: title }}></span>
                    {isShowButtonCloseIcon ? <i className="bi bi-x-square btn-close-modal" onClick={HandleCloseModal}></i> : ""}
                </div>
                <div className="modal-content">
                    <div className="modal-content-wrap" dangerouslySetInnerHTML={{ __html: content }} >

                    </div>
                    <div className="d-flex justify-content-between mt-3">
                        {isShowButtonFunction ? <button className="btn btn-primary" onClick={HandleFunction}>{contentButtonFunction}</button> : <div></div>}
                        {isShowButtonClose ? <button className="btn btn-outline-secondary" onClick={HandleCloseModal}>{contentButtonClose}</button> : ""}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};



export default ModalConfirm;
