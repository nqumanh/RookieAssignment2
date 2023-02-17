import React, { useState, useEffect } from "react";
import "./EditUser.css";
import { getUserAPI } from "api/edituser";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { ErrorMessage } from "@hookform/error-message";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function GetAge(birthDate) {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function GetDate(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1; //January is 0!
    var year = date.getFullYear();

    if (day < 10) {
        day = `0${day}`;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    return `${year}-${month}-${day}`;
}

export default function EditUser() {
    useEffect(() => {
        document.title = "Edit User";
    }, [])

    const location = useLocation();

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        joinedDate: "",
        dateofBirth: "",
        gender: null,
        type: null,
        location: "",
    });

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
        control,
    } = useForm({ mode: "all" });
    const navigate = useNavigate();

    useEffect(() => {
        if (!!location.state) {
            getUserAPI(location.state.staffCode).then((response) => {
                reset({
                    dateOfBirth: new Date(response.dateofBirth?.split("T")[0]),
                    joinedDate: new Date(response.joinedDate?.split("T")[0]),
                    gender: response.gender.toString(),
                    type: response.type.toString(),
                });

                setUser(response);
                const genderInput = document.querySelectorAll("input[name=gender]");
                genderInput.forEach((item) => {
                    if (response.gender === item.value) {
                        item.checked = true;
                    }
                });
            });
        }
    }, [reset, location.state]);

    const onSubmit = (data) => {
        let userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            fullName: user.firstName + " " + user.lastName,
            staffCode: location.state.staffCode,
            gender: parseInt(data.gender),
            type: parseInt(data.type),
            dateOfBirth: GetDate(data.dateOfBirth),
            joinedDate: GetDate(data.joinedDate),
            location: user.location,
        };

        axios
            .put("/api/Users/EditUser", userData)
            .then((response) => {
                console.log(".then ~ response", response);
                navigate("/manage-user", { state: { user: response.data } });
            })
            .catch((error) => console.log(error));
    };
    return (
        <div>
            <h1 className="page-title">Edit User</h1>
            <div className="row">
                <div className="col-sm-12 col-xl-9 edit-user-form">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mx-3 mt-4"
                    >
                        <div className="row mb-3">
                            <label
                                htmlFor="firstName"
                                className="col-sm-3 col-form-label"
                            >
                                First Name
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    name="firstName"
                                    className="form-control"
                                    value={user.firstName}
                                    id="firstName"
                                    disabled
                                    style={{ border: "3px solid #aaaaaa" }}
                                ></input>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label
                                htmlFor="lastName"
                                className="col-sm-3 col-form-label"
                            >
                                Last Name
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    name="lastName"
                                    className="form-control"
                                    value={user.lastName}
                                    id="lastName"
                                    disabled
                                    style={{ border: "3px solid #aaaaaa" }}
                                ></input>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label
                                htmlFor="dateOfBirth"
                                className="col-sm-3 col-form-label"
                            >
                                Date of Birth
                            </label>
                            <div className="col-sm-9">
                                <Controller
                                    control={control}
                                    name="dateOfBirth"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <div className="position-relative">
                                            <DatePicker
                                                selected={value}
                                                autoComplete="off"
                                                id="dateOfBirth"
                                                dateFormat="dd/MM/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                onChange={onChange}
                                                className={`form-control ${
                                                    errors?.dateOfBirth?.message
                                                        ? "date-picker__error-message"
                                                        : "date-picker"
                                                }`}
                                            />
                                            <label
                                                htmlFor="dateOfBirth"
                                                className="position-absolute"
                                                style={{
                                                    right: "3%",
                                                    top: "0",
                                                }}
                                            >
                                                <i
                                                    className="bi bi-calendar-date-fill"
                                                    style={{
                                                        fontSize: "23px",
                                                        color: "#707070",
                                                    }}
                                                ></i>
                                            </label>
                                        </div>
                                    )}
                                    rules={{
                                        required: "Date of birth is required!",
                                        validate: () => {
                                            return GetAge(
                                                getValues("dateOfBirth"),
                                            ) >= 18
                                                ? true
                                                : "User is under 18. Please select a different date";
                                        },
                                    }}
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name="dateOfBirth"
                                    render={({ message }) => (
                                        <p className="error-message">
                                            {message}
                                        </p>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label
                                htmlFor="gender"
                                className="col-sm-3 col-form-label"
                            >
                                Gender
                            </label>
                            <div className="col-sm-9 d-flex">
                                <div className="row align-self-center ms-1 radio-gender-group">
                                    <label className="gender__container col-sm-4 me-5 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={1}
                                            name="radio"
                                            {...register("gender")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Female</span>
                                    </label>
                                    <label className="gender__container col-sm-4 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={2}
                                            name="radio"
                                            {...register("gender")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Male</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label
                                htmlFor="joinedDate"
                                className="col-sm-3 col-form-label"
                            >
                                Joined Date
                            </label>
                            <div className="col-sm-9">
                                <Controller
                                    control={control}
                                    name="joinedDate"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <div className="position-relative">
                                            <DatePicker
                                                selected={value}
                                                autoComplete="off"
                                                id="joinedDate"
                                                dateFormat="dd/MM/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                onChange={onChange}
                                                className={`form-control ${
                                                    errors?.joinedDate?.message
                                                        ? "date-picker__error-message"
                                                        : "date-picker"
                                                }`}
                                            />
                                            <label
                                                htmlFor="joinedDate"
                                                className="position-absolute"
                                                style={{
                                                    right: "3%",
                                                    top: "0",
                                                }}
                                            >
                                                <i
                                                    className="bi bi-calendar-date-fill"
                                                    style={{
                                                        fontSize: "23px",
                                                        color: "#707070",
                                                    }}
                                                ></i>
                                            </label>
                                        </div>
                                    )}
                                    rules={{
                                        required: "Joined date is required",
                                        validate: () => {
                                            if (
                                                getValues("dateOfBirth") >
                                                getValues("joinedDate")
                                            )
                                                return "Joined date is not later than Date of Birth. Please select a different date";
                                            if (
                                                getValues(
                                                    "joinedDate",
                                                ).getDay() === 0 ||
                                                getValues(
                                                    "joinedDate",
                                                ).getDay() === 6
                                            )
                                                return "Joined date is Saturday or Sunday. Please select a different date";
                                            return true;
                                        },
                                    }}
                                />
                                <ErrorMessage
                                    errors={errors}
                                    name="joinedDate"
                                    render={({ message }) => (
                                        <p className="error-message">
                                            {message}
                                        </p>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label
                                htmlFor="type"
                                className="col-sm-3 col-form-label"
                            >
                                Type
                            </label>
                            <div className="col-sm-9">
                                <div className="position-relative">
                                    <select
                                        className="form-control"
                                        id="type"
                                        {...register("type", {
                                            required: "User type is required",
                                        })}
                                        style={{
                                            border: "3px solid #aaaaaa",
                                            appearance: "none",
                                        }}
                                    >
                                        <option value={1}>Admin</option>
                                        <option value={2}>Staff</option>
                                    </select>
                                    <label
                                        htmlFor="type"
                                        className="position-absolute"
                                        style={{ right: "3%", top: "12%" }}
                                    >
                                        <i
                                            className="bi bi-caret-down-fill"
                                            style={{ fontSize: "17px" }}
                                        ></i>
                                    </label>
                                </div>
                                <ErrorMessage
                                    errors={errors}
                                    name="Type"
                                    render={({ message }) => (
                                        <p className="error-message">
                                            {message}
                                        </p>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col-sm-3"></div>
                            <div className="col-sm-9 d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn form-btn form-btn__save"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn form-btn form-btn__cancel ms-5"
                                    onClick={() => navigate("/manage-user")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
