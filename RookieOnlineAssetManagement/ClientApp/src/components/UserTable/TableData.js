import React, { useEffect, useRef, useState } from "react";
import ClassItem from "./ClassItem";
import api, { endpoint } from "api/api";
import Pagination from "./Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Dropdown, Table, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import "./TableData.css";
import { useDispatch } from "react-redux";
import { closeModal, openModal } from "components/ModalConfirm/ModalConfirmSlice";

export default function TableData() {
    const dispatch = useDispatch();
    const [userList, setUserList] = useState([]);
    const location = useLocation();
    let userClick = useRef();
    const [searchString, setSearchString] = useState("");
    const [sortBy, setSortBy] = useState("Descending");
    const [all, setAll] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [staff, setStaff] = useState(false);
    const [currentUser, setCurrentUser] = useState("");
    const [pageCurrent, setPageCurrent] = useState(1);
    const [sortArrowStaffCode, setSortArrowStaffCode] = useState("bi bi-caret-down-fill ms-2")
    const [sortArrowFullName, setSortArrowFullName] = useState("bi bi-caret-down-fill ms-2")
    const [sortArrowJoinedDate, setSortArrowJoinedDate] = useState("bi bi-caret-down-fill ms-2")
    const [sortArrowType, setSortArrowType] = useState("bi bi-caret-down-fill ms-2")

    const dataModalCanNotDeleteUser = {
        isShowModal: true,
        title: "Can not disable user?",
        content:
            "There are valid assignments belonging to this user. Please close all assignment before disable user",
        isShowButtonCloseIcon: true,
        isShowButtonClose: false,
        isShowButtonFunction: false,
        contentButtonFunction: "Delete",
        contentButtonClose: "Cancel",
    };
    const dataModalCanDeleteUser = {
        isShowModal: true,
        title: "Are you sure?",
        content: "Do you want to disable this user?",
        isShowButtonCloseIcon: false,
        isShowButtonClose: true,
        isShowButtonFunction: true,
        contentButtonFunction: "Disable",
        contentButtonClose: "Cancel",
        handleFunction: HandleRemoveUser,
    };
    const dataModalCanDeleteCurrentUser = {
        isShowModal: true,
        title: "Warning disable!",
        content: "You cannot delete yourself.",
        isShowButtonCloseIcon: true,
        isShowButtonClose: false,
        isShowButtonFunction: false,
    };
    const handleDisableUser = (staffCode) => {
        if (currentUser === staffCode) {
            dispatch(openModal(dataModalCanDeleteCurrentUser))
        } else {
            axios
                .get(`/api/Users/checkuser/${staffCode}`)
                .then(() => {
                    userClick = staffCode;
                    dispatch(openModal(dataModalCanDeleteUser))
                })
                .catch(function (error) {
                    dispatch(openModal(dataModalCanNotDeleteUser))
                });
        }
    };
    function HandleRemoveUser() {
        var staffCode = userClick;
        if (staffCode !== "") {
            axios
                .put(`/api/Users/delete/${staffCode}`)
                .then(
                    setUserList(userList.filter((item) => item.staffCode !== staffCode)),
                );
            //Close modal
            const newData = {
                isShowModal: false,
            };
            dispatch(closeModal(newData))
        }
    }

    const navigate = useNavigate();

    const createNewUser = () => {
        navigate("create-new-user");
    };
    useEffect(() => {
        axios
            .get("api/Users/GetAll")
            .then((response) => {
                response.data.sort((a, b) =>
                    a.staffCode > b.staffCode ? 1 : -1,
                );
                let userList = response.data.map((user) => ({
                    id: user.id,
                    staffCode: user.staffCode,
                    fullName: user.firstName + " " + user.lastName,
                    userName: user.userName,
                    joinedDate: user.joinedDate,
                    dateofBirth: user.dateofBirth,
                    location: user.location,
                    gender: user.gender,
                    type: user.type,
                }));
                if (location.state !== null) {
                    userList = userList.filter(
                        (x) => x.staffCode !== location.state.user.staffCode,
                    );
                    setUserList([location.state.user, ...userList]);
                    window.history.replaceState({}, document.title);
                } else {
                    setUserList(userList);
                }
            })
            .catch((err) => console.log(err));

        axios.get("/api/users").then((response) => {
            setCurrentUser(response.data.staffCode);
        });
    }, [location.state]);

    const initialPagination = {
        rowsPerPage: 5,
        currentPage: 1,
    };
    const [pagination, setPagination] = useState(initialPagination);

    const paginate = (pageNumber, rowsPerPage) => {
        setPageCurrent(pageNumber);
        setPagination({
            rowsPerPage:
                rowsPerPage === "All" ? userList.length : parseInt(rowsPerPage),
            currentPage: pageNumber,
        });
    };

    const indexOfLastCourse = pagination.currentPage * pagination.rowsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - pagination.rowsPerPage;

    const handleSearchUser = () => {
        const str = searchString.replace(/ /g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')
        const loadUser = async () => {
            if (
                str !== "" &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", str, "null", "null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            } else if (str === "") {
                if (searchString === "") {
                    let res = await api.get(
                        endpoint["Users"](
                            0,
                            "All",
                            "null",
                            "null",
                            "null",
                        ),
                    );
                    try {
                        setUserList(res.data);
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    let res = await api.get(
                        endpoint["Users"](
                            0,
                            "All",
                            "Not Found The User You Are Searching",
                            "null",
                            "null",
                        ),
                    );
                    try {
                        setUserList(res.data);
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else if (all === true && str !== "") {
                let res = await api.get(
                    endpoint["Users"](0, "All", str, "null","null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            } else if (staff === true && str !== "") {
                let res = await api.get(
                    endpoint["Users"](0, "Staff", str, "null","null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            } else if (admin === true && str !== "") {
                let res = await api.get(
                    endpoint["Users"](0, "Admin", str, "null","null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            } else if (
                ((staff === true && admin === true) ||
                    (staff === true && all === true) ||
                    (admin === true && all === true) ||
                    (admin === true && staff === true && all === true)) &&
                str !== ""
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", str, "null","null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
            paginate(1, 5);
        };
        loadUser();
    };
    const handleSortByStaffCode = (event) => {
        const loadUser = async () => {
            if (
                admin === true &&
                staff === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "Admin", "null", "Staff Code", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                staff === true &&
                admin === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "Staff", "null", "Staff Code", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                (searchString === null || searchString === "") &&
                (all === true ||
                    (admin === true && staff === true) ||
                    (admin === true && all === true) ||
                    (all === true && staff === true))
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Staff Code", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString === "" &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Staff Code", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString != null &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "null",
                        searchString,
                        "Staff Code",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && admin === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Admin",
                        searchString,
                        "Staff Code",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && all === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "All",
                        searchString,
                        "Staff Code",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && staff === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Staff",
                        searchString,
                        "Staff Code",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Staff Code", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowStaffCode("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowStaffCode("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        loadUser();
    };
    const handleSortByName = (event) => {
        const icon = event.currentTarget.querySelector('.sort-title i')
        const loadUser = async () => {
            if (
                admin === true &&
                staff === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "Admin", "null", "Full Name", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                staff === true &&
                admin === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "Staff", "null", "Full Name", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                (searchString === null || searchString === "") &&
                (all === true ||
                    (admin === true && staff === true) ||
                    (admin === true && all === true) ||
                    (all === true && staff === true))
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Full Name", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString === "" &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Full Name", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString != null &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "null",
                        searchString,
                        "Full Name",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && admin === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Admin",
                        searchString,
                        "Full Name",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && all === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "All",
                        searchString,
                        "Full Name",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && staff === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Staff",
                        searchString,
                        "Full Name",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Full Name", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowFullName("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowFullName("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        loadUser();
    };
    const handleSortByJoinedDate = (event) => {
        const loadUser = async () => {
            if (
                admin === true &&
                staff === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Admin",
                        "null",
                        "Joined Date",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                staff === true &&
                admin === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Staff",
                        "null",
                        "Joined Date",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                (searchString === null || searchString === "") &&
                (all === true ||
                    (admin === true && staff === true) ||
                    (admin === true && all === true) ||
                    (all === true && staff === true))
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Joined Date", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString === "" &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Joined Date", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString != null &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "null",
                        searchString,
                        "Joined Date",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && admin === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Admin",
                        searchString,
                        "Joined Date",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && all === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "All",
                        searchString,
                        "Joined Date",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && staff === true) {
                let res = await api.get(
                    endpoint["Users"](
                        0,
                        "Staff",
                        searchString,
                        "Joined Date",
                        sortBy,
                    ),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Joined Date", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowJoinedDate("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowJoinedDate("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        loadUser();
    };
    const handleSortByType = (event) => {
        const icon = event.currentTarget.querySelector('.sort-title i')
        const loadUser = async () => {
            if (
                admin === true &&
                staff === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "Admin", "null", "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                staff === true &&
                admin === false &&
                all === false &&
                (searchString === null || searchString === "")
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "Staff", "null", "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                (searchString === null || searchString === "") &&
                (all === true ||
                    (admin === true && staff === true) ||
                    (admin === true && all === true) ||
                    (all === true && staff === true))
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString === "" &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (
                searchString != null &&
                all === false &&
                admin === false &&
                staff === false
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "null", searchString, "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && admin === true) {
                let res = await api.get(
                    endpoint["Users"](0, "Admin", searchString, "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && all === true) {
                let res = await api.get(
                    endpoint["Users"](0, "All", searchString, "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (searchString != null && staff === true) {
                let res = await api.get(
                    endpoint["Users"](0, "Staff", searchString, "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "Type", sortBy),
                );
                try {
                    setUserList(res.data);
                    if (sortBy === "Descending") {
                        setSortBy("Ascending");
                        setSortArrowType("bi bi-caret-up-fill ms-2")
                    } else {
                        setSortBy("Descending");
                        setSortArrowType("bi bi-caret-down-fill ms-2")
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        loadUser();
    };
    const handleCheckbox = (event) => {
        if (event.target.value === "All") {
            setAll(event.target.checked);
        }
        if (event.target.value === "Admin") {
            setAdmin(event.target.checked);
        }
        if (event.target.value === "Staff") {
            setStaff(event.target.checked);
        }
    };
    const handleFilter = () => {
        const loadUser = async () => {
            if (
                all === true ||
                (admin === true && staff === true) ||
                (admin === true && all === true) ||
                (all === true && staff === true)
            ) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "null", "null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            } else if (all === false && admin === false && staff === false) {
                let res = await api.get(
                    endpoint["Users"](0, "All", "null", "null", "null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
            else if (admin === true) {
                let res = await api.get(
                    endpoint["Users"](0, "Admin", "null", "null", "null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            } else if (staff === true) {
                let res = await api.get(
                    endpoint["Users"](0, "Staff", "null", "null", "null"),
                );
                try {
                    setUserList(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        loadUser();
    };

    return (
        <div>
            <div className="row">
                <h4 className="page-title">User list</h4>
                <div className="col-sm-4 text-start">
                    <Dropdown as={ButtonGroup} align="end" size="sm">
                        <Dropdown.Toggle
                            variant="outline-dark"
                            style={{
                                width: "100px",
                                textAlign: "left",
                                paddingLeft: "10px",
                            }}
                        >
                            Type
                        </Dropdown.Toggle>

                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={handleFilter}
                        >
                            <i className="bi bi-funnel-fill"></i>
                        </button>
                        <Dropdown.Menu
                            style={{
                                minWidth: "100px",
                                padding: "10px",
                            }}
                        >
                            <Form.Check
                                type="checkbox"
                                id="All"
                                label="All"
                                value="All"
                                checked={all}
                                onChange={handleCheckbox}
                            />
                            <Form.Check
                                type="checkbox"
                                id="Admin"
                                label="Admin"
                                value="Admin"
                                checked={admin}
                                onChange={handleCheckbox}
                            />
                            <Form.Check
                                type="checkbox"
                                id="Staff"
                                label="Staff"
                                value="Staff"
                                checked={staff}
                                onChange={handleCheckbox}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="col-sm-5 d-flex">
                    <div
                        className="input-group mb-3 input-group-sm"
                        style={{ height: "30px" }}
                    >
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            name="search"
                            value={searchString}
                            onChange={(event) =>
                                setSearchString(event.target.value)
                            }
                        ></input>
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={handleSearchUser}
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <div className="col-sm-3 text-end">
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={createNewUser}
                    >
                        Create new user
                    </button>
                </div>
            </div>
            {
                <Table className="table-spacing">
                    <thead>
                        <tr>
                            <th
                                className="cursor-pointer"
                                value="Staff Code"
                            >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByStaffCode(event)}>
                                    Staff Code
                                    <i className={sortArrowStaffCode}></i>
                                </div>
                            </th>
                            <th
                                className="cursor-pointer"
                                value="Full Name"
                            >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByName(event)}>
                                    Full Name
                                    <i className={sortArrowFullName}></i>
                                </div>
                            </th>
                            <th>Username</th>
                            <th
                                className="cursor-pointer"
                                value="Joined Date"
                            >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByJoinedDate(event)}>
                                    Joined Date
                                    <i className={sortArrowJoinedDate}></i>
                                </div>
                            </th>
                            <th
                                className="cursor-pointer"
                                value="Type"
                            >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByType(event)}>
                                    Type
                                    <i className={sortArrowType}></i>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {userList.length === 0 ? (
                            <tr className="unabled-hover position-relative" style={{ height: '50px' }}>
                                <td className="empty-loading">
                                    There is no user to display
                                </td>
                            </tr>
                        ) : (
                            userList
                                .slice(indexOfFirstCourse, indexOfLastCourse)
                                .map((user, index) => {
                                    return (
                                        <ClassItem
                                            key={index}
                                            presentation={user}
                                            HandleClick={handleDisableUser}
                                        />
                                    );
                                }))}
                    </tbody>
                </Table>
            }
            <Pagination
                rowsPerPage={pagination.rowsPerPage}
                totalUsers={userList.length}
                paginate={paginate}
                pageCurrent={pageCurrent}
            />
        </div>
    );
}
