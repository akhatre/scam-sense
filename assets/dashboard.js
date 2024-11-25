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
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
    },
    fetchApi: (input, init) => {
        return fetch(input, {
            ...init,
            credentials: 'include', // Add this to enable cookies
        });
    },
}));


const Dashboard = function (props) {
    const sendLesson = (e) => {
        e.preventDefault();
        alert('A training example has been sent!')
    }

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudents = async () => {
            try {
                const response = await studentsApiClient.studentsGetStudentsList();
                setStudents(response); // Assuming response.data contains the list of students
                console.log(response);
            } catch (err) {
                setError('Failed to fetch students');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        // Fetch students from API
        fetchStudents();
    }, []);

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        age: '',
        nativeLanguage: '',
    });
    const [current_alert, setAlert] = useState({show: false, variant: '', message: ''});

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
                first_name: formData.name || "",
                second_name: formData.surname || "",
                email: formData.email || "",
                native_language: formData.nativeLanguage || "",
            };
            // Replace with your OpenAPI client call
            await studentsApiClient.studentsAddStudentCreate({addStudent: payload});
            setAlert({show: true, variant: 'success', message: 'Student added successfully!'});
            fetchStudents();
        } catch (error) {
            setAlert({show: true, variant: 'danger', message: 'Failed to add student. Please try again.'});
        } finally {
            handleClose();
        }
    };

    return (
        <div>
            <MainNavbar/>

            <div className="mx-4">
            <h3 className="mt-4">Your Students</h3>

            <div>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                    <tr style={{backgroundColor: '#f2f2f2'}}>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>First Name</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Second Name</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Age</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Native Language</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.id} style={{border: '1px solid #ddd'}}>
                            <td style={{padding: '8px'}}>{student.first_name}</td>
                            <td style={{padding: '8px'}}>{student.second_name}</td>
                            <td style={{padding: '8px'}}>{student.age}</td>
                            <td style={{padding: '8px'}}>{student.native_language}</td>
                            <td style={{padding: '8px'}}>{student.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>





            <div>
                <Button variant="primary" onClick={handleShow} className="my-3">
                    Add Student
                </Button>

                {current_alert.show && (
                    <Alert variant={current_alert.variant} className="mt-3">
                        {current_alert.message}
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


            <button onClick={sendLesson} className="btn btn-primary my-3">Send a training example</button>
            </div>

            <Footer/>
        </div>
    )
}

root.render(
    <BrowserRouter>
        <Dashboard/>
    </BrowserRouter>
);