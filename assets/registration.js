import React, {useState} from "react";
import {useContext, useEffect, createContext, useRef} from 'react';
import {UsersApi, Configuration} from '../openapi';
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

    const [isLoginForm, setIsLoginForm] = useState(true);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        // const navigate = useNavigate();

        if (!isLoginForm) {
            const payload = {
                first_name: formData.firstName || "",
                last_name: formData.lastName || "",
                email: formData.email || "",
                password: formData.password || "",
                confirm_password: formData.confirmPassword || "",
            };
            try {
                const response = await usersApiClient.usersRegisterCreate({userRegistration: payload});
                setMessage(response.message);
                window.location.href = '/dashboard';
            } catch (err) {
                setError(err.response?.data?.detail || "An error occurred.");
            }
        } else {
            const payload = {
                email: formData.email || "",
                password: formData.password || "",
            };
            try {
                const response = await usersApiClient.usersLoginCreate({userLogin: payload});
                setMessage(response.message);
                window.location.href = '/dashboard';
            } catch (err) {
                setError(err.response?.data?.detail || "An error occurred.");
            }

        }
    };

    return (
        <div>
            <MainNavbar/>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header text-center">
                                <h3>{!isLoginForm ? "Register" : "Login"}</h3>
                            </div>
                            <div className="card-body">
                                {message && <div className="alert alert-success">{message}</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    {/* Form fields */}
                                    {!isLoginForm ? (
                                        <div>
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
                                        </div>
                                    ) : ""
                                    }
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
                                    {!isLoginForm ? (
                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm
                                                Password</label>
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
                                    ) : ''}
                                    <div className="d-grid">
                                        <button type="submit"
                                                className="btn btn-primary mb-2">{!isLoginForm ? "Register" : "Login"}</button>
                                        {isLoginForm ? (
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setIsLoginForm(false)
                                            }} className="btn btn-secondary">No account? Click here to register
                                            </button>
                                        ) : (
                                            <button onClick={(e) => {
                                                e.preventDefault()
                                                setIsLoginForm(true)
                                            }} className="btn btn-secondary">Already have account? Click here to login
                                            </button>
                                        )}

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// export async function fetchCSRFToken() {
//     const response = await fetch('/csrf/');
//     const data = await response.json();
//     return data.csrfToken;
// }

function fetchCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'csrftoken') {
            return value;
        }
    }
    return null; // Token not found
}



root.render(
    <BrowserRouter>
        <RegistrationForm/>
    </BrowserRouter>
);