import React, { useState, useEffect, Fragment } from "react";
import { Button, Modal, NavDropdown, Navbar } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./HeaderComponent.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import ChangePassword from "pages/ChangePassword";
import ModalLogout from "components/ModalLogout";

const Header = () => {
    const [username, setUsername] = useState("User");
    const [firstLogin, setFirstLogin] = useState(false);
    const [show, setShow] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const handleClose = () => setShow(false);

    const [showModalChangePassword, setShowModalChangePassword] = useState(false);
    const [toggleModalCustom, setToggleModalCustom] = useState(false);

    const passwordSchema = yup.object().shape({
        newPassword: yup
            .string()
            .matches(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^\\._-])(?!.*\s).{8,}$/,
                "Must Contain 8 Characters, include atleast one uppercase, one lowercase, one number and one special case character"
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
    } = useForm({ resolver: yupResolver(passwordSchema) });

    const onSubmit = (data) => {
        axios
            .post("api/users/FirstChangePassword", data)
            .then((response) => {
                reset({
                    newPassword: "",
                    confirmPassword: "",
                });
                handleClose();
                setErrorMsg("");
            })
            .catch((error) => {
                setErrorMsg(error.response.data);
            });
    };

    useEffect(() => {
        axios.get("/api/users").then((response) => {
            setUsername(response.data.userName);
            setFirstLogin(response.data.firstLogin);
        });
    }, []);

    function HandleShowPassword(event) {
        const inputPassword = event.target.previousElementSibling;
        const type =
            inputPassword.getAttribute("type") === "password"
                ? "text"
                : "password";
        inputPassword.setAttribute("type", type);
        event.target.classList.toggle("bi-eye-slash-fill");
    }

    function OpenModalChangePassword(event) {
        setShowModalChangePassword(!showModalChangePassword);
    }

    function ToggleModalCustom(event) {
        setToggleModalCustom(!toggleModalCustom);
    }

    const HandleDisableErrorMessage = (event) => {
        const input = document.querySelector("input");

        input &&
            input.addEventListener("input", function () {
                setErrorMsg("");
            });
    };

    const path = window.location.pathname;
    let title = "";
    let breadcrumb;
    let rootLink = "";
    let rootDisplay = "";
    if (path !== "/") {
        let routes = path.split("/");
        routes.shift();
        breadcrumb = routes.map((element) => {
            let words = element.split("-");
            words = words
                .map((word) => {
                    return word[0].toUpperCase() + word.substring(1);
                })
                .join(" ");
            return words;
        });
        rootLink = routes[0];
        rootDisplay = breadcrumb[0];
        breadcrumb.shift();
        title = breadcrumb.join(" > ");
    }

    return (
        <Fragment>
            <Navbar
                className="header d-flex justify-content-between p-4"
                variant="dark"
            >
                <div>
                    <Link
                        to={rootLink.toLowerCase()}
                        className="header__breadcrumb"
                    >
                        {rootLink === "" ? "Home" : rootDisplay}
                    </Link>
                    <span className="header__breadcrumb">
                        {title.length > 0 ? " > " + title : ""}
                    </span>
                </div>
                <NavDropdown
                    align="end"
                    title={username}
                    className="username-user"
                    id="dropdown-menu-align-end"
                >
                    <NavDropdown.Item onClick={OpenModalChangePassword}>
                        Change password
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={ToggleModalCustom}>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </Navbar>
            {
                firstLogin && (
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        centered
                        className="modal"
                        style={{
                            backgroundColor: "transparent",
                        }}
                    >
                        <Modal.Header className="modal__header">
                            <h5 className="m-0 bold text-nash-red">
                                Change password
                            </h5>
                        </Modal.Header>
                        <Modal.Body className="modal__body">
                            <div className="row">
                                This is the first time you logged in.<br></br>
                                You have to change your password to continue.
                            </div>
                            <p className="text-center">
                                <small className="text-danger">
                                    {errorMsg !== "" && (
                                        <small className="text-danger">
                                            {errorMsg}
                                        </small>
                                    )}
                                </small>
                            </p>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                onInput={HandleDisableErrorMessage}
                            >
                                <div className="row mb-3">
                                    <div className="col-5 p-0 ">
                                        <label
                                            className="input-group__label align-middle"
                                            style={{ width: "138px" }}
                                        >
                                            New password{" "}
                                        </label>
                                    </div>
                                    <div className="col-7 p-0 position-relative">
                                        <input
                                            {...register("newPassword")}
                                            className="form-control rounded"
                                            type="password"
                                        />
                                        <i
                                            className="bi bi-eye-fill input-password_icon--lower"
                                            onClick={HandleShowPassword}
                                            style={{
                                                zIndex: "999",
                                            }}
                                        ></i>
                                        <small className="text-danger">
                                            {errors.newPassword?.message}
                                        </small>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-5 p-0">
                                        <label className="input-group__label align-middle">
                                            Confirm password
                                        </label>
                                    </div>
                                    <div className="col-7 p-0 position-relative">
                                        <input
                                            {...register("confirmPassword")}
                                            className="form-control rounded"
                                            type="password"
                                        />
                                        <i
                                            className="bi bi-eye-fill input-password_icon--lower"
                                            onClick={HandleShowPassword}
                                            style={{
                                                zIndex: "999",
                                            }}
                                        ></i>
                                        <small className="text-danger">
                                            {errors.confirmPassword?.message}
                                        </small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="d-flex justify-content-end p-0">
                                        <Button
                                            variant="secondary"
                                            className="modal__btn "
                                            type="submit"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                )
            }
            <ChangePassword
                isShow={showModalChangePassword}
                OnCLickCloseModal={OpenModalChangePassword}
            />
            <ModalLogout
                isShow={toggleModalCustom}
                OnCLickToggleModal={ToggleModalCustom}
            />
        </Fragment >
    );
};

export default Header;
