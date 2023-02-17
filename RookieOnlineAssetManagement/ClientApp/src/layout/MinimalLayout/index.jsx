import { Outlet } from "react-router-dom";

function MinimalLayout(props) {
    return <div>{props.children ? props.children : <Outlet />}</div>;
}

export default MinimalLayout;
