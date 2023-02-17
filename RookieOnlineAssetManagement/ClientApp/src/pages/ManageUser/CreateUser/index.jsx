import React, { useEffect } from "react";
import "./CreateUser.css";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GetDate, GetAge, MapObject } from "utils";

export default function CreateUser() {

    useEffect(() => {
        document.title = "Create User";
    }, [])

    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors, isValid },
        control,
    } = useForm({ mode: "onChange" });
    const navigate = useNavigate();

    const onSubmit = (data) => {
        let properties = ["firstName", "lastName"];
        let userData = MapObject(data, properties);
        userData.gender = parseInt(data.gender);
        userData.type = parseInt(data.userType);
        userData.dateOfBirth = GetDate(data.dateOfBirth);
        userData.joinedDate = GetDate(data.joinedDate);

        axios
            .post(`/api/Users/CreateUser`, userData)
            .then((response) => {
                let properties = [
                    "staffCode",
                    "userName",
                    "gender",
                    "joinedDate",
                    "type",
                    "dateofBirth",
                    "location",
                ];
                let userData = MapObject(response.data, properties);
                userData.fullName =
                    response.data.firstName + " " + response.data.lastName;
                navigate("/manage-user", { state: { user: userData } });
            })
            .catch((err) => console.log(err));
    };

    const ShowErrorMessage = ({ name }) => {
        return (
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 ps-0">
                    <ErrorMessage
                        errors={errors}
                        name={name}
                        render={({ message }) => (
                            <p className="error-message">{message}</p>
                        )}
                    />
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="page-title">Create New User</div>
            <div className="row">
                <div className="col-sm-12 col-xl-9">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="create-user-form mx-3 mt-4"
                    >
                        <div className="row" style={{ marginBottom: "18px" }}>
                            <label
                                htmlFor="firstName"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                First Name
                            </label>
                            <div className="col-sm-9 ps-0">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    autoComplete="off"
                                    {...register("firstName", {
                                        required: "First name is required",
                                    })}
                                ></input>
                            </div>
                        </div>
                        <ShowErrorMessage name="firstName" />

                        <div className="row" style={{ marginBottom: "18px" }}>
                            <label
                                htmlFor="lastName"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Last Name
                            </label>
                            <div className="col-sm-9 ps-0">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    autoComplete="off"
                                    {...register("lastName", {
                                        required: "Last name is required",
                                    })}
                                ></input>
                            </div>
                        </div>
                        <ShowErrorMessage name="lastName" />

                        <div className="row" style={{ marginBottom: "18px" }}>
                            <label
                                htmlFor="dateOfBirth"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Date of Birth
                            </label>
                            <div className="col-sm-9 ps-0">
                                <Controller
                                    control={control}
                                    name="dateOfBirth"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <div
                                            className="position-relative"
                                            style={{ height: "100%" }}
                                        >
                                            <DatePicker
                                                selected={value}
                                                autoComplete="off"
                                                id="dateOfBirth"
                                                dateFormat="dd/MM/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                onChange={(e) => {
                                                    onChange(e);
                                                    if (getValues("joinedDate"))
                                                        trigger("joinedDate");
                                                }}
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
                            </div>
                        </div>
                        <ShowErrorMessage name="dateOfBirth" />

                        <div className="row" style={{ marginBottom: "18px" }}>
                            <label
                                htmlFor="gender"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Gender
                            </label>
                            <div
                                className="col-sm-9 ps-0 d-flex"
                                style={{ fontSize: "20px" }}
                            >
                                <div className="row align-self-center ms-1 radio-gender-group">
                                    <label className="gender__container col-sm-4 me-5 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={1}
                                            defaultChecked
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

                        <div className="row" style={{ marginBottom: "18px" }}>
                            <label
                                htmlFor="joinedDate"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Joined Date
                            </label>
                            <div className="col-sm-9 ps-0">
                                <Controller
                                    control={control}
                                    name="joinedDate"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <div
                                            className="position-relative"
                                            style={{ height: "100%" }}
                                        >
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
                                                style={{ height: "100%" }}
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
                            </div>
                        </div>
                        <ShowErrorMessage name="joinedDate" />

                        <div className="row" style={{ marginBottom: "18px" }}>
                            <label
                                htmlFor="userType"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Type
                            </label>
                            <div className="col-sm-9 ps-0">
                                <div style={{ height: "100%" }}>
                                    <select
                                        className="form-select"
                                        id="userType"
                                        {...register("userType", {
                                            required: "User type is required",
                                        })}
                                    >
                                        <option hidden defaultValue=""></option>
                                        <option value={1}>Admin</option>
                                        <option value={2}>Staff</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <ShowErrorMessage name="userType" />

                        <div className="row mt-4">
                            <div className="col-sm-3 pe-0 ps-1"></div>
                            <div className="col-sm-9 ps-0 d-flex justify-content-end">
                                <button
                                    disabled={!isValid}
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
                <div className="col-sm-0 col-xl-3"></div>
            </div>
        </div>
    );
}
