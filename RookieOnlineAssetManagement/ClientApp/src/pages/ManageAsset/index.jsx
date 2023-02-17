import React, { useEffect, useState } from "react";
import { Form, Dropdown, ButtonGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssets } from "./AssetSlice";
import api, { endpoint } from "../../api/api";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ModalDetail from "./components/ModalDetail";
import { ModalCannotDelete, ModalDelete } from "./components/ModalDelete";
import Pagination from "./Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import TableLoading from "components/TableLoading";
export default function ManageAssignment() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
    const [isShowCantDeleteModal, setIsShowCantDeleteModal] = useState(false);
    const [allState, setAllState] = useState(false);
    const [allCategory, setAllCategory] = useState(true);
    const [assigned, setAssigned] = useState(true);
    const [available, setAvailable] = useState(true);
    const [notAvailable, setNotAvailable] = useState(true);
    const [waitingForRecycling, setWaitingForRecycling] = useState(false);
    const [recycled, setRecycled] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [asset, setAsset] = useState();
    const [assetCode, setAssetCode] = useState();
    const list = useSelector((state) => state.asset.assets);
    const loading = useSelector((state) => state.asset.loading);
    const [assetList, setAssetList] = useState(list);
    const [categoryList, setCategoryList] = useState([]);
    const [checkList, setCheckList] = useState([]);
    const [listHistory, setListHistory] = useState([]);
    const [sortBy, setSortBy] = useState("Ascending");
    const [pageCurrent, setPageCurrent] = useState(1);
    let strState = "";
    let strCategory = "";
    let state = "";
    let arr = [];
    const [strFilterByState, setStrFilterByState] = useState(
        "Assigned Available NotAvailable",
    );
    const [strFilterByCategory, setStrFilterByCategory] = useState("All");
    const [param, setParam] = useState({
        currentPage: 1,
        strFilterByState: "Assigned Available NotAvailable",
        strFilterByCategory: "All",
        searchString: "null",
        sort: "null",
        sortBy: sortBy,
    });
    const initialPagination = {
        rowsPerPage: 10,
        currentPage: 1,
    };
    const [pagination, setPagination] = useState(initialPagination);

    const paginate = (pageNumber) => {
        setPageCurrent(pageNumber);
        setPagination({
            rowsPerPage: 10,
            currentPage: pageNumber,
        });
        param.currentPage = pageNumber;
        setParam(param);
        dispatch(fetchAssets(param));
        setAssetList(list);
    };
    const total = useSelector((state) => state.asset.total);
    const [rowCount, setRowCount] = useState();

    useEffect(() => {
        document.title = "Manage Asset";
    }, [])

    useEffect(() => {
        // Initialized data on table
        try {
            dispatch(fetchAssets(param))
        } catch (error) {
            console.log('Failed to fetch asset list: ', error);
        }
    }, [dispatch])

    useEffect(() => {
        if (location.state !== null) {
            if (pageCurrent === 1) {
                setAssetList([location.state.asset, ...list.filter(x => x.assetCode !== location.state.asset.assetCode)]);
                window.history.replaceState({}, document.title);
            } else {
                setAssetList(list);
                window.history.replaceState({}, document.title);
            }
        }
        else {
            setAssetList(list);
        }
        setRowCount(total);
    }, [list]);



    useEffect(() => {
        const loadCategories = async () => {
            let res = await api.get(endpoint["Categories"]);
            try {
                setCategoryList(res.data);
            } catch (err) {
                console.error(err);
            }
            for (let i = 0; i < categoryList.length; i++) {
                arr.push(false);
            }
            setCheckList(arr);
        };
        loadCategories();
    }, []);
    function CompactText(text) {
        var result = "";
        if (text.split("").length <= 30) return text;
        else {
            for (var i = 0; i < 30; i++) {
                result = result.concat(text.split("")[i]);
            }
            return result + "...";
        }
    }

    const createNewAsset = () => {
        navigate("create-new-asset");
    };

    const HandleCloseModalDetail = (event) => {
        setShowModalDetail(false);
    };
    const HandleWatchDetailAsset = (asset) => {
        const load = async () => {
            let res = await api.get(endpoint["History"](asset.assetCode));
            try {
                setListHistory(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
        setAsset(asset);
        setShowModalDetail(true);
    };
    const handleCheckbox = (event) => {
        if (event.target.value === "AllState") {
            setAllState(event.target.checked);
        }
        if (event.target.value === "Assigned") {
            setAssigned(event.target.checked);
        }
        if (event.target.value === "Available") {
            setAvailable(event.target.checked);
        }
        if (event.target.value === "Not available") {
            setNotAvailable(event.target.checked);
        }
        if (event.target.value === "Waiting for recycling") {
            setWaitingForRecycling(event.target.checked);
        }
        if (event.target.value === "Recycled") {
            setRecycled(event.target.checked);
        }
        if (event.target.value === "AllCategory") {
            setAllCategory(event.target.checked);
        }

        for (let i = 0; i < categoryList.length; i++) {
            if (event.target.value === categoryList[i].categoryName) {
                checkList[i] = event.target.checked;
            }
        }
    };
    const handleFilter = () => {
        if (allState === true) strState += "All ";
        if (assigned === true) strState += "Assigned ";
        if (available === true) strState += "Available ";
        if (notAvailable === true) strState += "NotAvailable ";
        if (waitingForRecycling === true) strState += "WaitingForRecycling ";
        if (recycled === true) strState += "Recycled ";
        if (allCategory === true) strCategory += "All ";
        for (let i = 0; i < categoryList.length; i++) {
            if (checkList[i] === true) {
                strCategory =
                    strCategory +
                    categoryList[i].categoryName.replace(" ", "") +
                    " ";
            }
        }
        if (strState !== "" && strCategory !== "") {
            setStrFilterByCategory(strCategory);
            setStrFilterByState(strState);
            param.strFilterByState = strState;
            param.strFilterByCategory = strCategory;
            if (searchString === "") {
                param.searchString = "null";
            }
            setParam(param);
            paginate(1);
        }
        else {
            if (strCategory === "" && strState !== "") {
                setStrFilterByState(strState);
                param.strFilterByState = strState;
                param.strFilterByCategory = "null";
                if (searchString === "") {
                    param.searchString = "null";
                }
                setParam(param);
                paginate(1);
            }
            else if (strState === "" && strCategory !== "") {
                setStrFilterByCategory(strCategory);
                param.strFilterByState = "null";
                param.strFilterByCategory = strCategory;
                if (searchString === "") {
                    param.searchString = "null";
                }
                setParam(param);
                paginate(1);
            }
            else {
                param.strFilterByState = "null";
                param.strFilterByCategory = "null";
                if (searchString === "") {
                    param.searchString = "null";
                }
                setParam(param);
                paginate(1);
            }

        }
    };
    const handleSearchAsset = () => {
        const search = searchString.replace(/ /g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, '')
        if (search !== "") {
            param.searchString = search;
        } else {
            if (searchString === "") {
                param.searchString = "null";
            } else {
                param.searchString = "Not Found The Asset You Are Searching"
            }
        }
        setParam(param)
        paginate(1);
    };
    const handleSortByAssetCode = (event) => {
        const icon = event.currentTarget.querySelector('.sort-title i')
        param.sort = "Asset Code";
        if (sortBy === "Ascending") {
            setSortBy("Descending");
            param.sortBy = "Descending";
            icon.classList.add("bi-caret-up-fill")
        } else {
            setSortBy("Ascending");
            param.sortBy = "Ascending";
            icon.classList.remove("bi-caret-up-fill")
        }
        setParam(param);
        dispatch(fetchAssets(param));
        setAssetList(assetList);
    };
    const handleSortByAssetName = (event) => {
        const icon = event.currentTarget.querySelector('.sort-title i')
        param.sort = "Asset Name";
        if (sortBy === "Ascending") {
            setSortBy("Descending");
            param.sortBy = "Descending";
            icon.classList.add("bi-caret-up-fill")
        } else {
            setSortBy("Ascending");
            param.sortBy = "Ascending";
            icon.classList.remove("bi-caret-up-fill")
        }
        setParam(param);
        dispatch(fetchAssets(param));
        setAssetList(assetList);
    };
    const handleSortByCategory = (event) => {
        const icon = event.currentTarget.querySelector('.sort-title i')
        param.sort = "Category";
        if (sortBy === "Ascending") {
            setSortBy("Descending");
            param.sortBy = "Descending";
            icon.classList.add("bi-caret-up-fill")
        } else {
            setSortBy("Ascending");
            param.sortBy = "Ascending";
            icon.classList.remove("bi-caret-up-fill")
        }
        setParam(param);
        dispatch(fetchAssets(param));
        setAssetList(assetList);
    };
    const handleSortByState = (event) => {
        const icon = event.currentTarget.querySelector('.sort-title i')
        param.sort = "State";
        setAssetList(list);
        if (sortBy === "Ascending") {
            setSortBy("Descending");
            param.sortBy = "Descending";
            icon.classList.add("bi-caret-up-fill")
        } else {
            setSortBy("Ascending");
            param.sortBy = "Ascending";
            icon.classList.remove("bi-caret-up-fill")
        }
        setParam(param);
        dispatch(fetchAssets(param));
        setAssetList(assetList);
    };
    const handleEditAsset = (asset) => {
        navigate(`edit-asset`, {
            state: {
                assetCode: asset.asset.assetCode,
            },
        });
    };

    const handleCloseModal = () => {
        setIsShowCantDeleteModal(false);
    };
    const handleCloseModalDelete = () => {
        setIsShowDeleteModal(false);
    };
    const handleDelAsset = (asset) => {
        setAssetCode(asset.asset.assetCode);
        axios
            .get(`/api/Assets/checkasset/${asset.asset.assetCode}`)
            .then((response) => {
                if (response.data == 0) {
                    setIsShowDeleteModal(true);
                } else {
                    setIsShowCantDeleteModal(true);
                }
            });
        setAssetList(assetList)
    };
    const handleModalDelete = () => {
        axios
            .put(`/api/Assets/delete/${assetCode}`)
            .then(
                setAssetList(
                    assetList.filter((x) => x.assetCode !== assetCode),
                ),
            );
        setIsShowDeleteModal(false);
    };
    return (
        <div>
            <div>
                <div className="row">
                    <h4 className="page-title">Asset list</h4>
                    <div className="col-sm-3 text-start">
                        <Dropdown as={ButtonGroup} align="end" size="sm">
                            <Dropdown.Toggle
                                variant="outline-dark"
                                style={{
                                    width: "160px",
                                    textAlign: "left",
                                    paddingLeft: "10px",
                                }}
                            >
                                State
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
                                    padding: "10px",
                                    marginRight: "-40px",
                                }}
                            >
                                <Form.Check
                                    type="checkbox"
                                    id="All"
                                    label="All"
                                    value="AllState"
                                    checked={allState}
                                    onChange={handleCheckbox}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="Assigned"
                                    label="Assigned"
                                    value="Assigned"
                                    checked={assigned}
                                    onChange={handleCheckbox}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="Available"
                                    label="Available"
                                    value="Available"
                                    checked={available}
                                    onChange={handleCheckbox}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="Not available"
                                    label="Not available"
                                    value="Not available"
                                    checked={notAvailable}
                                    onChange={handleCheckbox}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="Waiting for recycling"
                                    label="Waiting for recycling"
                                    value="Waiting for recycling"
                                    checked={waitingForRecycling}
                                    onChange={handleCheckbox}
                                />
                                <Form.Check
                                    type="checkbox"
                                    id="Recycled"
                                    label="Recycled"
                                    value="Recycled"
                                    checked={recycled}
                                    onChange={handleCheckbox}
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="col-sm-3 text-start">
                        <Dropdown as={ButtonGroup} align="end" size="sm">
                            <Dropdown.Toggle
                                variant="outline-dark"
                                style={{
                                    width: "160px",
                                    textAlign: "left",
                                    paddingLeft: "10px",
                                }}
                            >
                                Category
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
                                    padding: "10px",
                                    marginRight: "-40px",
                                }}
                            >
                                <Form.Check
                                    type="checkbox"
                                    id="All"
                                    label="All"
                                    value="AllCategory"
                                    checked={allCategory}
                                    onChange={handleCheckbox}
                                />
                                {categoryList.map((category, index) => {
                                    return (
                                        <Form.Check
                                            key={index}
                                            type="checkbox"
                                            id={category.categoryName}
                                            label={category.categoryName}
                                            value={category.categoryName}
                                            checked={arr[index]}
                                            onChange={handleCheckbox}
                                        />
                                    );
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="col-sm-3 d-flex">
                        <div
                            className="input-group mb-3 input-group-sm"
                            style={{ height: "30px" }}
                        >
                            <input
                                type="text"
                                className="form-control"
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
                                onClick={handleSearchAsset}
                            >
                                <i className="bi bi-search page-link"></i>
                            </button>
                        </div>
                    </div>

                    <div className="col-sm-3 text-end">
                        <button className="btn btn-danger btn-sm" onClick={createNewAsset}>
                            Create new asset
                        </button>
                    </div>
                </div>

                <table className="table table-spacing">
                    <thead>
                        <tr>
                            <th className="cursor-pointer" value="Asset Code" >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByAssetCode(event)}>
                                    Asset Code
                                    <i className="bi bi-caret-down-fill ms-2"></i>
                                </div>
                            </th>
                            <th className="cursor-pointer" value="Asset Name" >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByAssetName(event)}>
                                    Asset Name
                                    <i className="bi bi-caret-down-fill ms-2"></i>
                                </div>
                            </th>
                            <th className="cursor-pointer" value="Category" >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByCategory(event)}>
                                    Category
                                    <i className="bi bi-caret-down-fill ms-2"></i>
                                </div>
                            </th>
                            <th className="cursor-pointer" value="State" >
                                <div className="sort-title my-2 desc" onClick={(event) => handleSortByState(event)}>
                                    State
                                    <i className="bi bi-caret-down-fill ms-2"></i>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {
                        !loading ?
                            <tbody className="wrap-loading">
                                {
                                    assetList?.length === 0
                                        ? (
                                            <tr className="unabled-hover position-relative" style={{ height: '50px' }}>
                                                <td className="empty-loading">
                                                    There is no asset to display
                                                </td>
                                            </tr>
                                        )
                                        : assetList.map((asset, index) => {
                                            if (asset.state === 1) {
                                                state = "Assigned";
                                            }
                                            if (asset.state === 2) {
                                                state = "Available";
                                            }
                                            if (asset.state === 3) {
                                                state = "Not Available";
                                            }
                                            if (asset.state === 5) {
                                                state = "Waiting for recycling";
                                            }
                                            if (asset.state === 4) {
                                                state = "Recycled";
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td
                                                        className="p-0"
                                                        onClick={() =>
                                                            HandleWatchDetailAsset(asset)
                                                        }
                                                    >
                                                        <div className="my-2 ms-2">
                                                            {asset.assetCode}
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="p-0"
                                                        onClick={() =>
                                                            HandleWatchDetailAsset(asset)
                                                        }
                                                    >
                                                        <div className="my-2 ms-2">
                                                            <OverlayTrigger
                                                                key={"bottom"}
                                                                placement={"bottom"}
                                                                overlay={
                                                                    <Tooltip>
                                                                        {asset.assetName}
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <p className="m-0">
                                                                    {CompactText(
                                                                        asset.assetName,
                                                                    )}
                                                                </p>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="p-0"
                                                        onClick={() =>
                                                            HandleWatchDetailAsset(asset)
                                                        }
                                                    >
                                                        <div className="my-2 ms-2">
                                                            {asset.categoryName}
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="p-0"
                                                        onClick={() =>
                                                            HandleWatchDetailAsset(asset)
                                                        }
                                                    >
                                                        <div className="my-2 ms-2">
                                                            {state}
                                                        </div>
                                                    </td>
                                                    {asset.state === 1 ? (
                                                        <td className="border-0 text-end">
                                                            <i
                                                                className="bi bi-pencil-fill pe-3"
                                                                style={{
                                                                    color: "grey",
                                                                    opacity: "0.4",
                                                                }}
                                                            ></i>
                                                            <i
                                                                className="bi bi-x-circle"
                                                                style={{
                                                                    color: "red",
                                                                    opacity: "0.4",
                                                                }}
                                                            ></i>
                                                        </td>
                                                    ) : (
                                                        <td className="border-0 text-end">
                                                            <i
                                                                className="bi bi-pencil-fill pe-3"
                                                                style={{ color: "grey" }}
                                                                onClick={() =>
                                                                    handleEditAsset({
                                                                        asset,
                                                                    })
                                                                }
                                                            ></i>
                                                            <i
                                                                className="bi bi-x-circle"
                                                                style={{ color: "red" }}
                                                                onClick={() =>
                                                                    handleDelAsset({
                                                                        asset,
                                                                    })
                                                                }
                                                            ></i>
                                                            <ModalCannotDelete
                                                                isShow={
                                                                    isShowCantDeleteModal
                                                                }
                                                                assetCode={assetCode}
                                                                HandleCloseModalDelete={
                                                                    handleCloseModal
                                                                }
                                                            />
                                                            <ModalDelete
                                                                isShow={isShowDeleteModal}
                                                                HandleCloseModalDelete={
                                                                    handleCloseModalDelete
                                                                }
                                                                HandleModalDelete={
                                                                    handleModalDelete
                                                                }
                                                            />
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })
                                }
                            </tbody>
                            :
                            <React.Fragment>
                                <tbody>
                                    <tr className="unabled-hover">
                                        <td className="border-0">
                                            <TableLoading />
                                        </td>
                                    </tr>
                                </tbody>
                            </React.Fragment>
                    }

                </table>

                <Pagination
                    rowsPerPage={pagination.rowsPerPage}
                    rowCount={rowCount}
                    paginate={paginate}
                    pageCurrent={pageCurrent}
                />
            </div>
            {asset === undefined ? (
                <h5></h5>
            ) : (
                <ModalDetail
                    isShow={showModalDetail}
                    OnclickCloseModalDetail={HandleCloseModalDetail}
                    asset={asset}
                    listHistory={listHistory}
                />
            )}
        </div>
    );
}
