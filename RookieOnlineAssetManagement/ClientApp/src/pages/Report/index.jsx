import axios from 'axios';
import TableLoading from 'components/TableLoading';
import React, { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { utils, writeFile } from 'xlsx';
import { fetchReportList, fetchReportListPagingSorting } from './ReportSlice';

const Report = () => {
    const dispatch = useDispatch();

    let firstLoading = useSelector((state) => state.report.firstLoading);
    let loading = useSelector((state) => state.report.loading);
    let reportList = useSelector((state) => state.report.reports);
    let page = useSelector((state) => state.report.page);
    let lastPage = useSelector((state) => state.report.lastPage);

    const btnExport = useRef();

    let pageSize = useRef(10);
    let [fieldNameSorting, setFieldNameSorting] = useState();
    let [typeSorting, setTypeSorting] = useState();

    const headers = [
        {
            label: "Category",
            value: "category"
        },
        {
            label: "Total",
            value: "total"
        },
        {
            label: "Assigned",
            value: "assigned"
        },
        {
            label: "Available",
            value: "available"
        },
        {
            label: "Not Available",
            value: "notAvailable"
        },
        {
            label: "Waiting for recycling",
            value: "waitingForRecycling"
        },
        {
            label: "Recycled",
            value: "recycled"
        }
    ];

    useEffect(() => {
        document.title = "Report";
        // Initialized data on table
        try {
            const params = {
                fieldName: "category",
                sortType: "asc",
                page: 1,
                limit: pageSize.current,
            };
            dispatch(fetchReportList(params));
        } catch (error) {
            console.log('Failed to fetch report list: ', error);
        }
    }, [dispatch])

    const HandleFetchReportList = async (fieldName, sortType, currentPage, limit) => {
        try {
            const params = {
                fieldName,
                sortType,
                page: currentPage,
                limit
            };
            dispatch(fetchReportListPagingSorting(params));
        } catch (error) {
            console.log('Failed to fetch report list: ', error);
        }
    }


    const HandleSortingClick = (event, fieldName) => {
        setFieldNameSorting(fieldName)
        if (typeSorting != null && fieldNameSorting == fieldName) {
            if (typeSorting == 'asc') {
                setTypeSorting('desc');
            }
            else if (typeSorting == 'desc') {
                setTypeSorting('asc');
            }
        }
        else {
            setTypeSorting('asc');
        }
    }
    useEffect(() => {
        HandleFetchReportList(fieldNameSorting, typeSorting, page, pageSize.current);
    }, [fieldNameSorting, typeSorting])

    const HandlePageClick = (data) => {
        let currentPage = data.selected + 1;
        HandleFetchReportList(fieldNameSorting, typeSorting, currentPage, pageSize.current);
    }

    const HandleOnExport = () => {
        // Add loading
        btnExport.current.classList.add('is-loading');
        axios.get('/api/Assets/GetAllReport')
            .then(res => {
                // Remove loading
                btnExport.current.classList.remove('is-loading');

                let Heading = [['Category', 'Total', 'Assigned', 'Available', 'Not Available', 'Waiting For Recycling', 'Recycled']];
                //Had to create a new workbook and then add the header
                const wb = utils.book_new();
                const ws = utils.json_to_sheet([]);
                // const boldStyle = wb.add_format({'bold': true});
                utils.sheet_add_aoa(ws, Heading, {'bold': true});
                //Starting in the second row to avoid overriding and skipping headers
                utils.sheet_add_json(ws, res.data, { origin: 'A2', skipHeader: true });
                utils.book_append_sheet(wb, ws, 'Sheet1');
                writeFile(wb, 'Report.xlsx');
            })

    }


    return (
        <React.Fragment>
            <div className="page-title">Report</div>
            <div className='text-end'>
                <button
                    className="btn btn-primary me-4 btn-custom-loading"
                    ref={btnExport}
                    onClick={HandleOnExport}
                >
                    <div className="loader"></div>
                    <span>Export</span>
                </button>
            </div>
            <div className="table-responsive">
                <table className={`table table-spacing ${loading ? "table-loading" : ""}`}>
                    <thead>
                        <tr>
                            {
                                headers.map(item => {
                                    return (
                                        <th className="cursor-pointer" key={item.value}>
                                            <div className="sort-title my-2 desc" onClick={(event) => HandleSortingClick(event, item.value)}>
                                                {item.label}
                                                {
                                                    fieldNameSorting === item.value
                                                    ? (
                                                        <i className={`uil ms-1 ${typeSorting == "desc" ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`}></i>
                                                    )
                                                    : (
                                                        <i className='bi bi-caret-down-fill ms-2'></i>
                                                    )
                                                }
                                            </div>
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    {
                        !firstLoading ?
                            <tbody className="wrap-loading">
                                {
                                    reportList?.length === 0
                                        ? (
                                            <tr className="unabled-hover position-relative" style={{ height: '50px' }}>
                                                <td className="empty-loading">
                                                    There are no report to display
                                                </td>
                                            </tr>
                                        )
                                        : reportList?.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="p-0">
                                                        <div className="my-1">
                                                            {item.category}
                                                        </div>
                                                    </td>
                                                    <td className="p-0">
                                                        <div className="my-1">
                                                            {item.total}
                                                        </div>
                                                    </td>
                                                    <td className="p-0">
                                                        <div className="my-1">
                                                            {item.assigned}
                                                        </div>
                                                    </td>
                                                    <td className="p-0">
                                                        <div className="my-1">
                                                            {item.available}
                                                        </div>
                                                    </td>
                                                    <td className="p-0">
                                                        <div className="my-1">
                                                            {item.notAvailable}
                                                        </div>
                                                    </td>
                                                    <td className="p-0">
                                                        <div className="my-1">
                                                            {item.waitingForRecycling}
                                                        </div>
                                                    </td>
                                                    <td className="p-0">
                                                        <div className="my-1">
                                                            {item.recycled}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
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
            </div>
            <ReactPaginate
                previousLabel={'Previous'}
                breakLabel={'...'}
                nextLabelLabel={'Next'}
                pageCount={lastPage}
                marginPagesDisplayed={3}
                pageRangeDisplayed={6}
                onPageChange={HandlePageClick}
                containerClassName={`pagination justify-content-end ${loading ? "table-loading mt-4" : ""}`}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={`page-item ${lastPage === 0 ? 'disabled' : ''}`}
                nextLinkClassName={'page-link'}
                breakClassName={'page-link'}
                activeClassName={'active'}
            />
        </React.Fragment>
    );
};

export default Report;
