import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "layout/MainLayout";
import Home from "pages/Home";
import ManageUser from "pages/ManageUser/index";
import CreateUser from "pages/ManageUser/CreateUser";
import EditUser from "pages/ManageUser/EditUser";
import ManageAsset from "pages/ManageAsset";
import EditAsset from "pages/ManageAsset/EditAsset";
import ManageAssignment from "pages/ManageAssignment";
import CreateAssignment from "pages/ManageAssignment/CreateAssignment";
import RequestForReturning from "pages/RequestForReturning";
import Report from "pages/Report";
import NotFound from "pages/NotFound";
import CreateAsset from "pages/ManageAsset/CreateAsset";
import EditAssignment from "pages/ManageAssignment/EditAssignment";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "pages/UserSlice";

const Router = () => {
    const dispatch = useDispatch();

    let userRole = useSelector((state) => state.userLogin.role);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);


    return useRoutes([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                {
                    path: "",
                    element: <Home />,
                },
                {
                    path: "*",
                    element: <NotFound />,
                },
                {
                    path: "manage-user",
                    element:
                        userRole === "admin" ? <ManageUser /> : <NotFound />,
                },
                {
                    path: "manage-user/edit-user",
                    element: userRole === "admin" ? <EditUser /> : <NotFound />,
                },
                {
                    path: "manage-user/create-new-user",
                    element:
                        userRole === "admin" ? <CreateUser /> : <NotFound />,
                },
                {
                    path: "manage-asset",
                    element:
                        userRole === "admin" ? <ManageAsset /> : <NotFound />,
                },
                {
                    path: "manage-asset/edit-asset",
                    element:
                        userRole === "admin" ? <EditAsset /> : <NotFound />,
                },
                {
                    path: "manage-asset/create-new-asset",
                    element: userRole === "admin" ? <CreateAsset /> : <NotFound />,
                },
                {
                    path: "manage-assignment",
                    element:
                        userRole === "admin" ? (
                            <ManageAssignment />
                        ) : (
                            <NotFound />
                        ),
                },
                {
                    path: "manage-assignment/create-new-assignment",
                    element:
                        userRole === "admin" ? (
                            <CreateAssignment />
                        ) : (
                            <NotFound />
                        ),
                },
                {
                    path: "manage-assignment/edit-assignment",
                    element:
                        userRole === "admin" ? (
                            <EditAssignment />
                        ) : (
                            <NotFound />
                        ),
                },
                {
                    path: "request-for-returning",
                    element:
                        userRole === "admin" ? (
                            <RequestForReturning />
                        ) : (
                            <NotFound />
                        ),
                },
                {
                    path: "report",
                    element: userRole === "admin" ? <Report /> : <NotFound />,
                },
            ],
        },
    ]);
};

export default Router;
