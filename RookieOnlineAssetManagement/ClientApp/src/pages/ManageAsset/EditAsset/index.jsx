import React, { useState, useEffect } from "react";
import "./EditAsset.css";
import { getAssetAPI } from "../../../api/axiosAsset";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import DatePicker from "react-datepicker";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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

export default function EditAsset() {
    const location = useLocation();
    const navigate = useNavigate();
    let assetcode = location.state.assetCode;
    const [asset, setAsset] = useState({
        assetCode: "",
        assetName: "",
        specification: "",
        installedDate: "",
        state: null,
        categoryName: "",
        location: "",
    });

    useEffect(() => {
        document.title = "Edit Asset";
    }, [])

    useEffect(() => {
        getAssetAPI(assetcode).then((response) => {
            reset({
                assetName: response.assetName,
                installedDate: new Date(response.installedDate.split("T")[0]),
                specification: response.specification,
                state: response.state.toString(),
                categoryName: response.category
            });
            setAsset(response);
        });
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        control,
    } = useForm({ mode: "all" });

    const onSubmit = (data) => {
        let assetData = {
            assetCode: assetcode,
            assetName: data.assetName,
            specification: data.specification,
            installedDate: GetDate(data.installedDate),
            state: parseInt(data.state),
        };
        axios
            .put("/api/Assets/EditAsset", assetData)
            .then(() => {
                navigate("/manage-asset", {
                    state: {
                        asset: {
                            ...assetData,
                            location: asset.location,
                            categoryName: asset.category
                        }
                    }
                });
            })
            .catch((error) => console.log(error));
    };
    const ShowErrorMessage = ({ name }) => {
        return (
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 col-xl-9 ps-3 ">
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
            <h1 className="page-title">Edit Asset</h1>
            <div className="row">
                <div className="col-sm-12 col-xl-9">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mx-3 mt-4"
                    >
                        <div className="row mb-3">
                            <label
                                htmlFor="assetName"
                                className="col-sm-3 col-form-label"
                            >
                                Name
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    name="assetName"
                                    className="form-control"
                                    id="assetName"
                                    {...register("assetName", {
                                        required: "Name is required",
                                    })}
                                    style={{ border: "3px solid #aaaaaa" }}
                                ></input>
                            </div>
                        </div>
                        <ShowErrorMessage name="assetName" />
                        <div className="row mb-3">
                            <label
                                htmlFor="category"
                                className="col-sm-3 col-form-label"
                            >
                                Category
                            </label>
                            <div className="col-sm-9">
                                <div className="position-relative">
                                    <select
                                        className="form-control"
                                        id="category"
                                        disabled
                                        style={{
                                            border: "3px solid #aaaaaa",
                                            appearance: "none",
                                        }}
                                    >
                                        <option>{asset.category}</option>
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
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label
                                htmlFor="specification"
                                className="col-sm-3 col-form-label"
                            >
                                Specification
                            </label>
                            <div className="col-sm-9">
                                <textarea
                                    rows="3"
                                    cols="25"
                                    name="specification"
                                    className="form-control"
                                    id="specification"
                                    {...register("specification", {
                                        required: "Specification is required",
                                    })}
                                    style={{
                                        border: "3px solid #aaaaaa",
                                        height: "120px",
                                        resize: "none",
                                    }}
                                ></textarea>
                            </div>
                        </div>
                        <ShowErrorMessage name="specification" />
                        <div className="row mb-3">
                            <label
                                htmlFor="installedDate"
                                className="col-sm-3 col-form-label"
                            >
                                Installed date
                            </label>
                            <div className="col-sm-9">
                                <Controller
                                    control={control}
                                    name="installedDate"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <div className="position-relative">
                                            <DatePicker
                                                selected={value}
                                                autoComplete="off"
                                                id="installedDate"
                                                dateFormat="dd/MM/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                onChange={onChange}
                                                className={`form-control ${errors?.installedDate
                                                    ?.message
                                                    ? "date-picker__error-message"
                                                    : "date-picker"
                                                    }`}
                                            />
                                            <label
                                                htmlFor="installedDate"
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
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label
                                htmlFor="state"
                                className="col-sm-3 col-form-label"
                            >
                                State
                            </label>
                            <div className="col-sm-9 d-flex">
                                <div className="align-self-center ms-1 radio-state-group">
                                    <label className="state__container col-sm-12 me-5 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={2}
                                            name="radio"
                                            {...register("state")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Available</span>
                                    </label>
                                    <label className="state__container col-sm-12 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={3}
                                            name="radio"
                                            {...register("state")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Not available</span>
                                    </label>
                                    <label className="state__container col-sm-12 me-5 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={5}
                                            name="radio"
                                            {...register("state")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Waiting for recycling</span>
                                    </label>
                                    <label className="state__container col-sm-12 me-5 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={4}
                                            name="radio"
                                            {...register("state")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Recycled</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-sm-3"></div>
                            <div className="col-sm-9 d-flex justify-content-end">
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
                                    onClick={() => navigate("/manage-asset")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        <br />
                    </form>
                </div>
            </div>
        </div>
    );
}
