import React from "react";
import { NavLink } from "react-router-dom";

import "./sidebar.css";
import { useSelector } from "react-redux";

const Sidebar = () => {

    let userRole = useSelector((state) => state.userLogin.role);

    const activeStyle = {
        color: "#fff",
        backgroundColor: "#cf2338",
    };

    const inactiveStyle = {
        color: "#000",
        backgroundColor: "#eff1f5",
    };

    const navList = [
        { name: "Manage User", to: "manage-user" },
        { name: "Manage Asset", to: "manage-asset" },
        { name: "Manage Assignment", to: "manage-assignment" },
        { name: "Request for Returning", to: "request-for-returning" },
        { name: "Report", to: "report" },
    ]

    return (
        <div className="text-start">
            <div className="row">
                <img
                    className="col-4"
                    src="/images/logo-nashtech.png"
                    alt="nashtech logo"
                />
            </div>
            <h5 className="text-nash-red mt-2 mb-5">
                <b className="sidebar-title">Online Asset Management</b>
            </h5>
            <nav>
                <ul className="p-0">
                    <li className="mb-1">
                        <NavLink className="sidebar-nav__link" to=""
                            style={({ isActive }) =>
                                isActive ? activeStyle : inactiveStyle
                            }
                        >Home
                        </NavLink>
                    </li>

                    {userRole === "admin" && (
                        navList.map((item, index) =>
                        (<li key={index} className="mb-1">
                            <NavLink className="sidebar-nav__link text-bold" to={item.to}
                                style={({ isActive }) =>
                                    isActive ? activeStyle : inactiveStyle
                                }
                            >{item.name}
                            </NavLink>
                        </li>)
                        )
                    )}
                </ul >
            </nav >
        </div >
    );
};

export default Sidebar;
