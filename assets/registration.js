import React, {useState} from "react";
import {useContext, useEffect, createContext, useRef} from 'react';
import { UsersApi, Configuration } from '../openapi';
import ReactDOM from "react-dom/client";
import Cookies from 'js-cookie';

import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown} from 'react-bootstrap';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import {MainNavbar} from "./navbar";

const root = ReactDOM.createRoot(document.getElementById('root'));
import '../assets/scss/index.scss';



const apiUrl = process.env.API_URL;

const usersApiClient = new UsersApi(new Configuration({
    basePath: apiUrl,
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
    }
}));

function RegistrationForm() {
    const [formData, setFormData] = useState({
        firstName: "asd",
        lastName: "asd",
        email: "asd@asd.com",
        password: "asd",
        confirmPassword: "asd",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const payload = {
    first_name: formData.firstName || "",
    last_name: formData.lastName || "",
    email: formData.email || "",
    password: formData.password || "",
    confirm_password: formData.confirmPassword || "",
};


        // const response = await usersApiClient.usersRegisterCreateRaw({
        //         firstName: formData.firstName,
        //         lastName: formData.lastName,
        //         password: formData.password,
        //         confirmPassword: formData.confirmPassword,
        //         email: formData.email,
        //     });

        console.log(payload);
        const response = await usersApiClient.usersRegisterCreate({ userRegistration: payload });

        console.log(response);
        // setMessage(response.message);

        // try {
        //     const response = await usersApiClient.usersRegisterCreate({
        //         firstName: formData.firstName,
        //         lastName: formData.lastName,
        //         email: formData.email,
        //         password: formData.password,
        //         confirmPassword: formData.confirmPassword,
        //     });
        //     setMessage(response.message);
        //     console.log(response);
        // } catch (err) {
        //     setError(err.response?.data?.detail || "An error occurred.");
        // }
    };

    return (
        <Container>
            <MainNavbar/>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header text-center">
                                <h3>Register</h3>
                            </div>
                            <div className="card-body">
                                {message && <div className="alert alert-success">{message}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    {/* Form fields */}
                                    <div className="mb-3">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary">Register</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

root.render(
    <BrowserRouter>
        <RegistrationForm/>
    </BrowserRouter>
);