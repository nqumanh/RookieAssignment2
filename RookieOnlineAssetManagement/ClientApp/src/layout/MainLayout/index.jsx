import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar/index";
import './MainLayout.css'
import ModalConfirm from "components/ModalConfirm";

function MainLayout(props) {
    return (
        <Fragment>
            <Header></Header>
            <div className="mx-4" style={{ marginTop: "80px" }}>
                <Row>
                    <Col xs={3}>
                        <Sidebar></Sidebar>
                    </Col>
                    <Col xs={9} className="position-relative ps-5">
                        <ModalConfirm />
                        <div style={{ marginTop: "70px" }}>
                            {props.children ? props.children : <Outlet />}
                        </div>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
}

export default MainLayout;
