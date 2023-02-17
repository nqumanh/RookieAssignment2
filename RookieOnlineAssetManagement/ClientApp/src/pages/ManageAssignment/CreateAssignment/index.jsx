import React, { useEffect, useState } from "react";
import "./CreateAssignment.css";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import SelectTable from "../SelectTable";
import { GetDate } from "utils";
import { createAssignment } from "api/AssignmentService";

const CreateAssignment = () => {
    const navigate = useNavigate();

    const initialUser = {
        staffCode: null,
        fullName: null,
    };

    const [selectedUser, setSelectedUser] = useState(initialUser);

    const initialAsset = {
        assetCode: null,
        assetName: null,
    };

    const [selectedAsset, setSelectedAsset] = useState(initialAsset);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: { errors, isValid },
        control,
    } = useForm({ mode: "onChange" });

    const onSubmit = (data) => {
        const MAXUSERCOUNT = 10000
        createAssignment({
            staffCode: assignedUser,
            assetCode: assignedAssetCode,
            assignedDate: GetDate(data.assignedDate),
            note: data.note,
        })
            .then((response) => {
                console.log("🚀 ~ file: index.jsx:47 ~ .then ~ response", response)
                navigate("/manage-assignment", {
                    state: {
                        assignmentChange: response.data,
                        currentPage: MAXUSERCOUNT,
                    },
                });
            })
            .catch((err) => console.log(err));
    };

    const [assignedUser, setAssignedUser] = useState(null);

    const [assignedAssetCode, setAssignedAssetCode] = useState(null);

    const userHeaders = ["Staff Code", "Full Name", "Type"];

    const userFields = ["staffCode", "fullName", "type"];

    const assetHeaders = ["Asset Code", "Asset Name", "Category"];

    const assetFields = ["assetCode", "assetName", "category"];

    const [isSelectingUser, setIsSelectingUser] = useState(false);

    useEffect(() => {
        document.title = "Create Assignment";
    }, [])

    const openSelectUser = () => {
        closeSelectUser();
        setIsSelectingUser(true);
    };

    const closeSelectUser = () => {
        setIsSelectingAsset(false);
        setIsSelectingUser(false);
        trigger("user");
    };

    const selectUser = (user) => {
        setAssignedUser(user.staffCode);
        setValue("user", user.fullName);
        trigger("user");
        closeSelectUser();
    };

    const [isSelectingAsset, setIsSelectingAsset] = useState(false);

    const openSelectAsset = () => {
        setIsSelectingAsset(true);
        setIsSelectingUser(false);
    };

    const closeSelectAsset = () => {
        setIsSelectingAsset(false);
        trigger("asset");
    };

    const selectAsset = (asset) => {
        setAssignedAssetCode(asset.assetCode);
        setValue("asset", asset.assetName);
        trigger("asset");
        closeSelectAsset();
    };

    useEffect(() => {
        reset({ assignedDate: new Date() });
    }, [reset]);

    const ShowErrorMessage = ({ name }) => {
        return (
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-9 ps-0">
                    <ErrorMessage
                        errors={errors}
                        name={name}
                        render={({ message }) => (
                            <p className="error-message mb-0">{message}</p>
                        )}
                    />
                </div>
            </div>
        );
    };

    const onKeySave = (e) => {
        if (e.code === 'Enter') e.preventDefault();
    };

    return (
        <div>
            <div className="page-title">Create New Assignment</div>

            <div className="row">
                <div className="col-sm-12 col-xl-9">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="create-assigment-form mx-3 mt-4"
                        onKeyDown={onKeySave}
                    >
                        <div className="row" style={{ marginTop: "18px" }}>
                            <label
                                htmlFor="user"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                User
                            </label>
                            <div className="col-sm-9 ps-0 position-relative">
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    id="user"
                                    autoComplete="off"
                                    {...register("user", {
                                        required: "User is required",
                                        onBlur: (e) => trigger("user"),
                                    })}
                                    disabled={isSelectingUser}
                                    onClick={() => openSelectUser()}
                                ></input>

                                <label
                                    htmlFor="user"
                                    className="position-absolute"
                                    style={{ right: "4%", top: "0" }}
                                >
                                    <i
                                        className="bi bi-search"
                                        style={{
                                            fontSize: "20px",
                                            color: "#000",
                                        }}
                                    ></i>
                                </label>
                                {isSelectingUser && (
                                    <SelectTable
                                        title="User"
                                        closeTable={closeSelectUser}
                                        onSave={selectUser}
                                        headers={userHeaders}
                                        fields={userFields}
                                        selectedRow={selectedUser}
                                        setSelectedRow={setSelectedUser}
                                    />
                                )}
                            </div>
                        </div>
                        <ShowErrorMessage name="user" />

                        <div className="row" style={{ marginTop: "18px" }}>
                            <label
                                htmlFor="asset"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Asset
                            </label>
                            <div className="col-sm-9 ps-0 position-relative">
                                <input
                                    type="text"
                                    className="form-control pe-5"
                                    id="asset"
                                    autoComplete="off"
                                    {...register("asset", {
                                        required: "Asset is required",
                                        onBlur: (e) => trigger("asset"),
                                    })}
                                    disabled={isSelectingAsset}
                                    onClick={() => openSelectAsset()}
                                ></input>
                                <label
                                    htmlFor="asset"
                                    className="position-absolute"
                                    style={{ right: "4%", top: "0" }}
                                >
                                    <i
                                        className="bi bi-search"
                                        style={{
                                            fontSize: "20px",
                                            color: "#000",
                                        }}
                                    ></i>
                                </label>

                                {isSelectingAsset && (
                                    <SelectTable
                                        title="Asset"
                                        closeTable={closeSelectAsset}
                                        onSave={selectAsset}
                                        headers={assetHeaders}
                                        fields={assetFields}
                                        selectedRow={selectedAsset}
                                        setSelectedRow={setSelectedAsset}
                                    />
                                )}
                            </div>
                        </div>
                        <ShowErrorMessage name="asset" />

                        <div className="row" style={{ marginTop: "18px" }}>
                            <label
                                htmlFor="assignedDate"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Assigned Date
                            </label>
                            <div className="col-sm-9 ps-0">
                                <Controller
                                    control={control}
                                    name="assignedDate"
                                    render={({ field }) => (
                                        <div
                                            className="position-relative"
                                            style={{ height: "100%" }}
                                        >
                                            <DatePicker
                                                id="assignedDate"
                                                className="form-control date-picker"
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete="off"
                                                onChange={(e) =>
                                                    field.onChange(e)
                                                }
                                                selected={field.value}
                                            />
                                            <label
                                                htmlFor="assignedDate"
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
                                        required: "Assigned date is required!",
                                    }}
                                />
                            </div>
                        </div>
                        <ShowErrorMessage name="assignedDate" />

                        <div className="row" style={{ marginTop: "18px" }}>
                            <label
                                htmlFor="note"
                                className="col-sm-3 pe-0 ps-1 col-form-label"
                            >
                                Note
                            </label>
                            <div className="col-sm-9 ps-0">
                                <textarea
                                    className="form-control"
                                    id="note"
                                    rows="2"
                                    {...register("note")}
                                ></textarea>
                            </div>
                        </div>

                        <div className="row mt-5">
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
                                    onClick={() =>
                                        navigate("/manage-assignment")
                                    }
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
};

export default CreateAssignment;