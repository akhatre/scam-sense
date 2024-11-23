import React, {useContext, useEffect, useState, createContext, useRef} from 'react';
import ReactDOM from "react-dom/client";
import Cookies from 'js-cookie';

import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, useNavigate} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const ScamSenseIndex = function (props) {
    return (
        <div>Hellow world</div>
    )
}

root.render(
    <BrowserRouter>
        <ScamSenseIndex/>,
    </BrowserRouter>
);