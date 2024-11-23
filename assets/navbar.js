import React, {useContext, useEffect, useState, createContext, useRef} from 'react';
import ReactDOM from "react-dom/client";
import Cookies from 'js-cookie';

import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, useNavigate} from 'react-router-dom';
import '../assets/scss/index.scss';

export const MainNavbar = () => {
    return (
        <Container fluid="fluid" className="mx-1">
            <Navbar bg="light" variant="light" expand="lg">
                <Navbar.Brand href="" onClick={() => {
                    navigate("", {replace: true});
                    setParamsFromURL()
                }}>
                    <img src="/static/images/logo.webp" width="30" height="30"
                         className="d-inline-block align-top main-logo" alt=""/>
                    Scam Sense
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <button className="btn btn-outline-primary mx-2" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseExample" aria-expanded="false"
                            aria-controls="collapseExample">
                        Register
                    </button>
                    <button className="btn btn-outline-primary mx-2" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseExample" aria-expanded="false"
                            aria-controls="collapseExample">
                        Dashboard
                    </button>
                    <button className="btn btn-outline-primary mx-2" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseExample" aria-expanded="false"
                            aria-controls="collapseExample">
                        Help
                    </button>
                </Navbar.Collapse>

            </Navbar>
        </Container>
    )
}