import React, { useState } from "react";

export default function Pagination(props) {
    const [currentPage, setCurrentPage] = useState(1);
    const { rowsPerPage, rowCount } = props;

    const toPreviousPage = (e) => {
        e.preventDefault();
        var newPage = props.pageCurrent - 1;
        props.paginate(newPage);
        setCurrentPage(newPage);
    };

    const toNextPage = (e) => {
        e.preventDefault();
        var newPage = props.pageCurrent + 1;
        props.paginate(newPage);
        setCurrentPage(newPage);
    };

    const paginate = (number, rowsPerPage) => {
        setCurrentPage(number);
        props.paginate(number, rowsPerPage);
    };


    const pageNumbers = [];

    const length = Math.ceil(rowCount / rowsPerPage);

    for (let i = 1; i <= length; i++) {
        pageNumbers.push(i);
    }
    var paginationNumber = pageNumbers.map((number) => (
        <li
            key={number}
            className={
                number === props.pageCurrent ? "page-item active" : "page-item"
            }
        >
            <a
                href="/#"
                className="page-link"
                onClick={(e) => {
                    e.preventDefault();
                    paginate(number, rowsPerPage);

                }}
            >
                {number}
            </a>
        </li>
    ));

    return (
        <div className="d-flex justify-content-end">
            <nav className="d-flex m-0">
                <ul className="pagination justify-content-end m-0">
                    <li className="page-item">
                        <a
                            className={
                                (props.pageCurrent === 1 || pageNumbers.length === 0)
                                    ? "page-link disabled"
                                    : "page-link"
                            }
                            href="/#"
                            onClick={(e) => toPreviousPage(e)}
                        >
                            Previous
                        </a>
                    </li>
                    {paginationNumber}
                    <li className="page-item">
                        <a
                            className={
                                (props.pageCurrent === length || pageNumbers.length===0)
                                    ? "page-link disabled"
                                    : "page-link"
                            }
                            href="/#"
                            onClick={(e) => toNextPage(e)}
                        >
                            Next
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
