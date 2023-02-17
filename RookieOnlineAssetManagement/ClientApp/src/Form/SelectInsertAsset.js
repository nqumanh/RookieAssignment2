import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BsCheckLg, BsFillCaretDownFill, BsXLg } from "react-icons/bs";
import validateCategoryInsert from "../utils/validateCategoryInsert";
import "./SelectInsertAsset.css";
import axios from "axios";

const SelectInsertAsset = (props) => {
    const [openInput, setOpenInput] = useState(false);
    const [buttonSave, setButtonSave] = useState(false);
    const [categories, setCategories] = useState(undefined);
    const [categorySelected, setCategorySelected] = useState('');
    const [textError, setTextError] = useState({
        name: 'success',
        prefix: 'success'
    });
    const [catNameErr, setCatNameErr] = useState(null);
    const [catPrefixErr, setCatPrefixErr] = useState(null);
    const loadCategories = useCallback(() => {
        axios.get('/api/Categories/GetAll')
            .then((response) => {
                setCategories(response.data)
               /* if (response.data.length > 0) {
                    setCategorySelected(response.data[0].name)
                    props.callCategoryId(response.data[0].id)
                }*/
            })
            .catch((error) => {
                if (error.response.data) {
                    alert(error.response.data.message)
                } else {
                    alert(error.message)
                }
            });
    }, [props])
    const openInputNewCategory = () => {
        setOpenInput(true)
    }
    const changeInput = (e) => {
        let name = document.getElementById('categoryName').value;
        let prefix = document.getElementById('categoryPrefix').value;
        let error = {
            name: '',
            prefix: ''
        };
        error.name = validateCategoryInsert.name(name);
        error.prefix = validateCategoryInsert.prefix(prefix);
        if (error.name === 'success' && error.prefix === 'success') {
            setButtonSave(true)
        } else {
            setButtonSave(false)
        }
        setTextError(error)
    }
    const Dropdown = () => {
        document.querySelector(".content_dropdown").classList.toggle("hiddenContent");
        let radio = document.getElementsByName("category");
        for (const input of radio) {
            if (input.checked) {
                setCategorySelected(input.getAttribute('data-name'))
                props.callCategoryId(input.getAttribute('value'))
            }
        }
        cleanSetup();
    }
    const handleAddCategory = (e) => {
        let name = document.getElementById('categoryName').value;
        let prefix = document.getElementById('categoryPrefix').value;
        let error = {
            name: '',
            prefix: ''
        };
        error.name = validateCategoryInsert.name(name);
        error.prefix = validateCategoryInsert.prefix(prefix);
        if (error.name !== 'success' || error.prefix !== 'success') {
            setButtonSave(false)
            setTextError(error)
        } else {

            const data = {
                name: document.getElementById('categoryName').value,
                prefix: document.getElementById('categoryPrefix').value
            }
            axios.post('/api/Categories/CreateCategory', data)
                .then((response) => {
                    loadCategories();
                    cleanSetup();
                })
                .catch((error) => {
                    if (error.response.data.toString().includes("Category is already existed")) {
                        setCatNameErr(error.response.data)
                        setCatPrefixErr(null)
                    }
                    else {
                        setCatPrefixErr(error.response.data)
                        setCatNameErr(null)
                    }
                    console.log(catNameErr)
                });
        }
    }
    const cleanSetup = () => {
        if (document.getElementById('categoryName')) {
            document.getElementById('categoryName').value = '';
        }
        if (document.getElementById('categoryPrefix')) {
            document.getElementById('categoryPrefix').value = '';
        }


        setTextError({
            name: 'success',
            prefix: 'success'
        })
        setButtonSave(false)
        setOpenInput(false)
        setCatNameErr(null)
        setCatPrefixErr(null)
    }

    useEffect(() => {
        loadCategories()
    }, [loadCategories]);

    useEffect(() => {
        console.log(catNameErr)
    }, [catNameErr]);

    useEffect(() => {
        console.log(catPrefixErr)
    }, [catPrefixErr]);

    const HandleOnInputFormCategory = (event) => {
        setCatNameErr('')
        setCatPrefixErr('')

    }

    return (
        <div className="_select__dropdown" >
            <div className="_select" onClick={Dropdown}>
                <span className="_chooseCategory">{categorySelected}</span>
                <span className="_iconSelect"><BsFillCaretDownFill /></span>
            </div>
            <div className="content_dropdown">
                {
                    (categories) ? categories.map((item, index) => (
                        <div key={index} className="__content" onClick={(e) => {
                            document.getElementById('_select_' + item.id).checked = true;
                            Dropdown()

                        }} >
                            <label htmlFor={'_select_' + item.id} onClick={Dropdown}>{item.name}</label>
                            {
                                (index === 0) ?
                                    <input
                                        /*defaultChecked*/
                                        type={"radio"}
                                        name="category"
                                        data-name={item.name}
                                        value={item.id}
                                        id={'_select_' + item.id}
                                        className="_radioSelect"
                                    /> :
                                    <input id={'_select_' + item.id}
                                        type={"radio"}
                                        name="category"
                                        data-name={item.name}
                                        value={item.id}
                                        className="_radioSelect"
                                    />
                            }

                        </div>
                    )) : null

                }
                {
                    openInput
                        ?
                        <div className="__content __inputText">
                            <form onInput={(event) => HandleOnInputFormCategory(event)}>
                                <div>
                                    <Row >
                                        <Col xs={5} className="p-0">
                                            <input type={"text"}
                                                style={{ width: '100%', fontSize: '1rem', borderRight: 'none' }}
                                                onChange={changeInput}
                                                id='categoryName'
                                                className='_textSelectCategory'
                                                placeholder="Category name"
                                                maxLength={50}
                                            />
                                        </Col>
                                        <Col xs={2} className="p-0">
                                            <input type={"text"}
                                                style={{ width: "70%", float: 'left', fontSize: '1rem' }}
                                                onChange={changeInput}
                                                id='categoryPrefix'
                                                maxLength={2}
                                                className='_textSelectPrefix'
                                                placeholder="Prefix"
                                            />

                                        </Col>
                                        <Col xs={4} className="p-0">
                                            {
                                                buttonSave
                                                    ? <span className="_iconTrick" onClick={handleAddCategory}><BsCheckLg /></span>
                                                    : <span className="_iconTrick _notValidate me-3"  ><BsCheckLg /></span>
                                            }

                                            <span className="_iconX" onClick={cleanSetup}><BsXLg /></span>
                                        </Col>
                                        <span className="text-danger p-0">
                                            {catNameErr ? <small>{catNameErr}</small> : ""}
                                            {catPrefixErr ? <small>{catPrefixErr}</small> : ""}
                                        </span>
                                    </Row>
                                    <Row>
                                        {
                                            (textError.name !== 'success') ?
                                                <Col xs={5} className="p-0 m-0">
                                                    <Form.Text className="_text-select-error text-danger">
                                                        {textError.name}
                                                    </Form.Text>
                                                </Col>
                                                : <Col xs={5} />
                                        }
                                        {
                                            (textError.prefix !== 'success') ?
                                                <Col xs={2} className="p-0 m-0">
                                                    <Form.Text className="_text-select-error text-danger">
                                                        {textError.prefix}
                                                    </Form.Text>
                                                </Col>
                                                : <Col xs={2} />
                                        }
                                    </Row>
                                </div>
                            </form>
                        </div>
                        :
                        <div className="__content __inputText">
                            <span className="_text-add-new-category" onClick={openInputNewCategory}><u><i>Add new category</i></u></span>
                        </div>
                }

            </div>
        </div>
    )
}

export default SelectInsertAsset

