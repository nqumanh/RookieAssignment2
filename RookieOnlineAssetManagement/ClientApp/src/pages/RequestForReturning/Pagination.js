import React, { useEffect, useState } from "react";

export default function Pagination(props) {
    const { rowsPerPage, rowCount, initialPage } = props;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(initialPage)
    }, [initialPage])

    const toPreviousPage = (e) => {
        e.preventDefault();
        var newPage = currentPage - 1;
        props.paginate(newPage);
        setCurrentPage(newPage);
    };

    const toNextPage = (e) => {
        e.preventDefault();
        var newPage = currentPage + 1;
        props.paginate(newPage);
        setCurrentPage(newPage);
    };

    const paginate = (number, rowsPerPage) => {
        setCurrentPage(number);
        props.paginate(number, rowsPerPage);
    };


    const length = Math.ceil(rowCount / rowsPerPage);

    const PaginationNumbers = () => {
        let pageNumbers = []
        if (length < 6) {
            pageNumbers = Array.from({ length: length }, (_, i) => i + 1)
        } else {
            if (currentPage < 3) {
                pageNumbers = Array.from({ length: 3 }, (_, i) => i + 1)
                pageNumbers.push('...')
                pageNumbers.push(length)
            } else if (currentPage === 3) {
                pageNumbers = [1, 2, 3, 4, '...', length]
            } else if (currentPage === length - 2) {
                pageNumbers = [1, '...', length - 3, length - 2, length - 1, length]
            } else if (currentPage < length - 2) {
                pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', length]
            } else {
                pageNumbers = [1, '...', length - 2, length - 1, length]
            }
        }

        return pageNumbers.map((number, index) => (
            <li
                key={index}
                className={
                    (number === '...' && 'disabled ') +
                    (number === currentPage ? "page-item active" : "page-item")
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
        ))
    }

    return (
        <div className="d-flex justify-content-end">
            <nav className="d-flex m-0">
                <ul className="pagination justify-content-end m-0">
                    <li className="page-item">
                        <a
                            className={
                                currentPage === 1
                                    ? "page-link disabled"
                                    : "page-link"
                            }
                            href="/#"
                            onClick={(e) => toPreviousPage(e)}
                        >
                            Previous
                        </a>
                    </li>
                    <PaginationNumbers />
                    <li className="page-item">
                        <a
                            className={
                                currentPage === length || length < 2
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
