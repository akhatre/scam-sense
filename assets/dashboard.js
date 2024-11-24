import React, {useContext, useEffect, useState, createContext, useRef} from 'react';
import ReactDOM from "react-dom/client";
import Cookies from 'js-cookie';

import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown, Button, Alert, Modal, Form} from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import {MainNavbar} from "./navbar";

const root = ReactDOM.createRoot(document.getElementById('root'));
import '../assets/scss/index.scss';
import {Footer} from "./footer";

const isLoggedIn = window.djangoContext?.isLoggedIn || false;

import {StudentsApi, Configuration, UsersApi} from "../openapi";


const apiUrl = process.env.API_URL;

const studentsApiClient = new StudentsApi(new Configuration({
    basePath: apiUrl,
}));




const Dashboard = function (props) {
    const sendLesson = (e) => {
        e.preventDefault();
        alert('A training example has been sent!')
    }

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        age: '',
        nativeLanguage: '',
    });
    const [alert, setAlert] = useState({show: false, variant: '', message: ''});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleAddStudent = async () => {
        try {
            const payload = {
                age: formData.age || null,
                first_name: formData.firstName || "",
                second_name: formData.surname || "",
                email: formData.email || "",
                native_language: formData.nativeLanguage || "",
            };
            // Replace with your OpenAPI client call
            await studentsApiClient.studentsAddStudentCreate({addStudent: payload});
            setAlert({show: true, variant: 'success', message: 'Student added successfully!'});
        } catch (error) {
            setAlert({show: true, variant: 'danger', message: 'Failed to add student. Please try again.'});
        } finally {
            handleClose();
        }
    };

    return (
        <div>
            <MainNavbar/>

            <div>
                <Button variant="primary" onClick={handleShow}>
                    Add Student
                </Button>

                {alert.show && (
                    <Alert variant={alert.variant} className="mt-3">
                        {alert.message}
                    </Alert>
                )}

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Student</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter name"
                                />
                            </Form.Group>
                            <Form.Group controlId="formSurname" className="mt-3">
                                <Form.Label>Surname</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    placeholder="Enter surname"
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail" className="mt-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                />
                            </Form.Group>
                            <Form.Group controlId="formAge" className="mt-3">
                                <Form.Label>Age</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Enter age"
                                />
                            </Form.Group>
                            <Form.Group controlId="formNativeLanguage" className="mt-3">
                                <Form.Label>Native Language</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nativeLanguage"
                                    value={formData.nativeLanguage}
                                    onChange={handleChange}
                                    placeholder="Enter native language"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAddStudent}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>


            <button onClick={sendLesson} className="btn btn-primary">Send a training example</button>

            <Footer/>
        </div>
    )
}

root.render(
    <BrowserRouter>
        <Dashboard/>
    </BrowserRouter>
);