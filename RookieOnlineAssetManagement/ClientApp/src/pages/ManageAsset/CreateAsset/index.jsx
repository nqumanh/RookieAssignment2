import React, { useEffect, useState } from "react";
import "./CreateAsset.css";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GetDate, MapObject } from "utils";
import { Form } from 'react-bootstrap';
import SelectInsertAsset from '../../../Form/SelectInsertAsset';

export default function CreateUser() {
    const [categoryId, setCategoryId] = useState();
    const callCategoryId = (id) => {
        setCategoryId(id)
    }

    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors, isValid },
        control,
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        document.title = "Create Asset";
    }, [])

    const navigate = useNavigate();

    const onSubmit = (data) => {
        const properties = ["assetName", "specification"];
        const assetData = MapObject(data, properties);
        assetData.state = parseInt(data.state);
        assetData.installedDate = GetDate(data.installedDate);
        assetData.categoryId = categoryId;
        axios
            .post(`/api/Assets/CreateAsset`, assetData)
            .then((response) => {
                const properties = [
                    "assetCode",
                    "assetName",
                    "state",
                    "installedDate",
                    "categoryId",
                    "location",
                    "categoryName",
                    "specification"
                ];
                const assetData = MapObject(response.data, properties);
                navigate("/manage-asset", { state: { asset: assetData } });
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
            <div className="page-title">Create New Asset</div>
            <div className="row">
                <div className="col-sm-12 col-xl-9">
                    <form onSubmit={handleSubmit(onSubmit)} className='create-user-form mx-3 mt-4'>
                        <div className="row" style={{ marginBottom: '18px' }}>
                            <label htmlFor="assetName" className="col-sm-3 pe-0 ps-1 col-form-label">Name</label>
                            <div className="col-sm-9 ps-0">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="assetName"
                                    autoComplete="off"
                                    {...register("assetName", {
                                        validate: (value) => {
                                            if (!!value.trim()) {
                                                return true;
                                            } else {
                                                return "AssetName is required"
                                            }
                                        },
                                        onBlur: (e) => trigger("assetName"),
                                    })}
                                ></input>
                            </div>
                        </div>
                        <ShowErrorMessage name="assetName" />

                        <div className="row" style={{ marginBottom: '18px' }}>
                            <label htmlFor="category" className="col-sm-3 pe-0 ps-1 col-form-label">Category</label>
                            <div className="col-sm-9 ps-0">
                                <div style={{ height: "100%" }}
                                >
                                    <SelectInsertAsset callCategoryId={callCategoryId} />

                                </div>
                            </div>
                        </div>
                        <ShowErrorMessage name="category" />


                        <div className="row" style={{ marginBottom: '18px' }}>
                            <label htmlFor="specification" className="col-sm-3 pe-0 ps-1 col-form-label">Specification</label>
                            <div className="col-sm-9 ps-0">
                                <Form.Control
                                    as="textarea"
                                    className="form-control-text-area"
                                    id="specification"
                                    autoComplete="off"
                                    {...register("specification", {
                                        validate: (value) => {
                                            if (!!value.trim()) {
                                                return true;
                                            } else {
                                                return "Specification is required"
                                            }
                                        },
                                        onBlur: (e) => trigger("specification"),
                                    })}
                                ></Form.Control>

                            </div>
                        </div>
                        <ShowErrorMessage name="specification" />

                        <div className="row" style={{ marginBottom: '18px' }}>
                            <label htmlFor="installedDate" className="col-sm-3 pe-0 ps-1 col-form-label">Installed Date</label>
                            <div className="col-sm-9 ps-0">
                                <Controller
                                    control={control}
                                    name="installedDate"
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
                                                id="installedDate"
                                                dateFormat="dd/MM/yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                onChange={(e) => {
                                                    onChange(e);
                                                    if (getValues("installedDate"))
                                                        trigger("installedDate");
                                                }}
                                                className={`form-control ${errors?.installedDate?.message
                                                        ? "date-picker__error-message"
                                                        : "date-picker"
                                                    }`}
                                            />
                                            <label htmlFor="installedDate" className="position-absolute" style={{ right: '3%', top: '0' }}>
                                                <i className="bi bi-calendar-date-fill" style={{ fontSize: "23px", color: '#707070' }}></i>
                                            </label>
                                        </div>
                                    )}
                                    rules={{
                                        required: "Installed Date is required!",
                                        validate: () => {
                                            return getValues("installedDate") ? true : false;
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <ShowErrorMessage name="installedDate" />

                        <div className="row" style={{ marginBottom: '18px' }}>
                            <label htmlFor="state" className="col-sm-3 pe-0 ps-1 col-form-label">State</label>
                            <div className="col-sm-9 ps-0 d-flex" style={{ fontSize: '20px' }}>
                                <div className="align-self-center ms-1 radio-state-group">
                                    <label className="state__container col-sm-4 me-5 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={2}
                                            name="radio"
                                            defaultChecked
                                            {...register("state")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Available</span>
                                    </label>
                                    <label className="state__container col-sm-4 my-0 ps-4">
                                        <input
                                            type="radio"
                                            value={3}
                                            name="radio"
                                            {...register("state")}
                                        />
                                        <span className="checkmark"></span>
                                        <span>Not avalaible</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-sm-3 pe-0 ps-1"></div>
                            <div className="col-sm-9 ps-0 d-flex justify-content-end">
                                <button
                                    disabled={!isValid || !categoryId}
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
                    </form>
                </div>
                <div className="col-sm-0 col-xl-3"></div>
            </div>
        </div>
    );
}
