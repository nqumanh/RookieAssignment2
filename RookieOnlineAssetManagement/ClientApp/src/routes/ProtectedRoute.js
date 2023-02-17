import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
    isAllowed,
    redirectPath = '/not-found',
    children,
}) => {
    if (!isAllowed) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;