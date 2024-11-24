import React, {useContext, useEffect, useState, createContext, useRef} from 'react';
import ReactDOM from "react-dom/client";
import Cookies from 'js-cookie';

import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import {MainNavbar} from "./navbar";

const root = ReactDOM.createRoot(document.getElementById('root'));
import '../assets/scss/index.scss';

const isLoggedIn = window.djangoContext?.isLoggedIn || false;

const ScamSenseIndex = function (props) {
    const currentYear = new Date().getFullYear();
    return (
        <div className="main-page">
            <MainNavbar/>
            <div className="image-container"></div>
            <div className="d-flex justify-content-center my-4">
                <button onClick={() => {isLoggedIn ? window.location.href = '/dashboard' : window.location.href = '/register'}} className="btn btn-primary">Start Here</button>
            </div>

            <footer className="border-top bg-light py-3">
                <div className="container text-center">
                    <p className="mb-0">
                        &copy; {currentYear} ScamSense Ltd. All rights reserved.
                    </p>
                    <p className="mb-0">
                        <a href="/" className="text-decoration-none">
                            Privacy Policy
                        </a>{' '}
                        |{' '}
                        <a href="/" className="text-decoration-none">
                            Terms of Service
                        </a>
                    </p>
                </div>
            </footer>

        </div>
    )
}

root.render(
    <BrowserRouter>
        <ScamSenseIndex/>
    </BrowserRouter>
);