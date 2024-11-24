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

const Dashboard = function (props) {
    return (
        <div>
            <MainNavbar />
            <Footer />
        </div>
    )
}

root.render(
    <BrowserRouter>
        <Dashboard/>
    </BrowserRouter>
);