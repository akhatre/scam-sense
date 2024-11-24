import React, {useContext, useEffect, useState, createContext, useRef} from 'react';
import ReactDOM from "react-dom/client";
import Cookies from 'js-cookie';

import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import {MainNavbar} from "./navbar";

const root = ReactDOM.createRoot(document.getElementById('root'));
import '../assets/scss/index.scss';
import {Footer} from "./footer";

const isLoggedIn = window.djangoContext?.isLoggedIn || false;

const ScamSenseIndex = function (props) {
    return (
        <div className="main-page">
            <MainNavbar/>
            <div className="image-container"></div>
            <div className="d-flex justify-content-center my-4">
                <button onClick={() => {isLoggedIn ? window.location.href = '/dashboard' : window.location.href = '/register'}} className="btn btn-primary">Start Here</button>
            </div>

            <Footer />

        </div>
    )
}

root.render(
    <BrowserRouter>
        <ScamSenseIndex/>
    </BrowserRouter>
);