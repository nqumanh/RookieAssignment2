import React, { useState } from "react";
import "./ClassItem.css";
import { useNavigate } from "react-router-dom";
import ModalDetail from "pages/ManageUser/ModalDetail";

export default function ClassItem(props) {
    const { presentation } = props;
    const navigate = useNavigate();

    const [showModalDetail, setShowModalDetail] = useState(false);

    var joindate = new Date(presentation.joinedDate);

    function CompactString(keyword) {
        var result = "";
        if (keyword.split("").length <= 20) return keyword;
        else {
            for (var i = 0; i < 20; i++) {
                result = result.concat(keyword.split("")[i]);
            }
            return result + "...";
        }
    }

    let joindateString =
        ("0" + joindate.getDate()).slice(-2) +
        "/" +
        ("0" + (joindate.getMonth() + 1)).slice(-2) +
        "/" +
        joindate.getFullYear();

    const items = [
        presentation.staffCode,
        CompactString(presentation.fullName),
        CompactString(presentation.userName),
        joindateString,
        presentation.type === 1 ? "Admin" : "Staff",
    ];

    const editUser = () => {
        navigate(`edit-user`, {
            state: {
                staffCode: presentation.staffCode,
            },
        });
    };

    const showUserInfo = () => {
        setShowModalDetail(true);
    };


    const HandleCloseModalDetail = () => {
        setShowModalDetail(false);
    }

    return (
        <React.Fragment>
            <tr>
                {[...items].map((item, index) => (
                    <td className="align-middle p-0" key={index} onClick={showUserInfo}>
                        {item}
                    </td>
                ))}
                <td className="border-0 text-end">
                    <i
                        className="bi bi-pencil-fill pe-3"
                        style={{ color: "grey" }}
                        onClick={editUser}
                    ></i>
                    <i
                        className="bi bi-x-circle"
                        style={{ color: "red" }}
                        onClick={() => props.HandleClick(presentation.staffCode)}
                    ></i>
                </td>
            </tr>
            <ModalDetail
                IsShow={showModalDetail}
                OnclickCloseModalDetail={HandleCloseModalDetail}
                UserInfor={presentation}
            />
        </React.Fragment>
    );
}