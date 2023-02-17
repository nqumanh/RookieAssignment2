import React, { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import './ChangePassword.css'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";
import { openModal } from "components/ModalConfirm/ModalConfirmSlice";

const ChangePassword = (props) => {
    const dispatch = useDispatch();
    const [errorMsg, setErrorMsg] = useState("");
    const formSubmit = useRef();
    const btnSubmit = useRef();

    const passwordSchema = yup.object().shape({
        oldPassword: yup
            .string(),
        newPassword: yup
            .string()
            .max(255, "New password must be at most 255 characters")
            .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^\\._-])(?!.*\s).{8,}$/,
                "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
            )
            .required("Please enter your new password."),
        confirmPassword: yup
            .string()
            .required("Please enter confirm password.")
            .oneOf(
                [yup.ref("newPassword"), null],
                "Confirm password must match"
            ),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    const HandleTypingFormInput = (event) => {
        errors.oldPassword?.message('test')
        setErrorMsg("");
        if (
            formSubmit.current.oldPassword.value.length > 0 &&
            formSubmit.current.newPassword.value.length > 0 &&
            formSubmit.current.confirmPassword.value.length > 0
        ) {
            btnSubmit.current.removeAttribute("disabled");
        }
        else {
            btnSubmit.current.setAttribute("disabled", "disabled");
        }
    };

    const onSubmit = (data) => {
        btnSubmit.current.classList.add('is-loading');

        const payload = {
            OldPassword: data.oldPassword,
            NewPassword: data.newPassword,
        };
        axios
            .post("/api/Users/ChangePassword", payload)
            .then((res) => {
                reset({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                // Remove loading button
                btnSubmit.current.classList.remove('is-loading');

                // Close modal change password
                props.OnCLickCloseModal();

                // Show alert modal
                const newDataModal = {
                    isShowModal: true,
                    title: "Change password",
                    content: "Your password has been changed successfully!",
                    isShowButtonCloseIcon: false,
                    isShowButtonClose: true,
                    isShowButtonFunction: false,
                    contentButtonFunction: "",
                    contentButtonClose: "Close",
                    handleFunction: null,
                };
                dispatch(openModal(newDataModal))

            })
            .catch((res) => {
                reset({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                // Remove loading button
                btnSubmit.current.classList.remove('is-loading');

                setErrorMsg(res.response.data);
            });
    };

    function HandleShowPassword(event) {
        const inputPassword = event.target.previousSibling;
        const type = inputPassword.getAttribute("type") === "password" ? "text" : "password";
        inputPassword.setAttribute("type", type);

        event.target.classList.toggle("bi-eye-slash-fill");
    }

    function HandleCloseModal(event) {
        // If form have any errors then unabled close modal
        if (Object.keys(errors).length > 0) return;

        setErrorMsg("");
        reset({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        // Close modal change password
        props.OnCLickCloseModal();
    }
    
    return (
        <React.Fragment>
            <Modal
                show={props.isShow}
                onHide={props.OnCLickCloseModal}
                backdrop="static"
                keyboard={false}
                centered
                className="modal modal-custom"
                style={{
                    backgroundColor: "transparent",
                }}
            >
                <Modal.Header className="modal__header">
                    <h5 className="m-0 bold text-nash-red">Change password</h5>
                </Modal.Header>
                <Modal.Body className="modal__body">
                    <form
                        id="form-changePassword"
                        onSubmit={handleSubmit(onSubmit)}
                        onInput={HandleTypingFormInput}
                        ref={formSubmit}
                    >
                        <div className="row mb-3 align-items-center">
                            <div className="col-5 p-0">
                                <label
                                    htmlFor="old-password"
                                    className="form-label_custom"
                                >
                                    Old password
                                </label>
                            </div>
                            <div className="col-7 pe-0 position-relative">
                                <input
                                    type="password"
                                    id="old-password"
                                    className={`form-control form-control_custom  ${errors.oldPassword ? "form-control_error"  : ""}`}
                                    {...register("oldPassword")}
                                />
                                <i
                                    className="bi bi-eye-fill input-password_icon"
                                    onClick={HandleShowPassword}
                                ></i>
                            </div>
                            <div className="col-5"></div>{" "}
                            <div className="col-7">
                                <small className="text-danger">
                                    {errors.oldPassword?.message} {errorMsg}
                                </small>
                            </div>
                        </div>
                        <div className="row mb-3 align-items-center">
                            <div className="col-5 p-0">
                                <label
                                    htmlFor="cur-password"
                                    className="form-label_custom"
                                >
                                    New password
                                </label>
                            </div>
                            <div className="col-7 pe-0 position-relative">
                                <input
                                    type="password"
                                    id="cur-password"
                                    className={`form-control form-control_custom ${errors.newPassword
                                        ? "form-control_error"
                                        : ""
                                        }`}
                                    {...register("newPassword")}
                                />
                                <i
                                    className="bi bi-eye-fill input-password_icon"
                                    onClick={HandleShowPassword}
                                ></i>
                            </div>
                            <div className="col-5"></div>{" "}
                            <div className="col-7">
                                <small className="text-danger">
                                    {errors.newPassword?.message}
                                </small>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-5 p-0">
                                <label
                                    htmlFor="new-password"
                                    className="form-label_custom"
                                >
                                    Confirm password
                                </label>
                            </div>
                            <div className="col-7 pe-0 position-relative">
                                <input
                                    type="password"
                                    id="new-password"
                                    className={`form-control form-control_custom ${errors.confirmPassword
                                        ? "form-control_error"
                                        : ""
                                        }`}
                                    {...register("confirmPassword")}
                                />
                                <i
                                    className="bi bi-eye-fill input-password_icon"
                                    onClick={HandleShowPassword}
                                ></i>
                            </div>
                            <div className="col-5"></div>{" "}
                            <div className="col-7">
                                <small className="text-danger">
                                    {errors.confirmPassword?.message}
                                </small>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="p-0 text-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary me-4 btn-custom-loading"
                                    ref={btnSubmit}
                                    disabled
                                >
                                    <div className="loader"></div>
                                    <span>Save</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={HandleCloseModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ChangePassword;
