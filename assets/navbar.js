import React, {useContext, useEffect, useState, createContext, useRef} from 'react';
import ReactDOM from "react-dom/client";
import Cookies from 'js-cookie';

import {Table, Col, Row, Nav, Navbar, Tab, Container, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../assets/scss/index.scss';



export const MainNavbar = (isLoggedIn = null) => {
    if (isLoggedIn === null) {
        isLoggedIn = window.djangoContext?.isLoggedIn || false;
    }

    return (
        <Container fluid="fluid" className="mx-1">
            <Navbar bg="light" variant="light" expand="lg">
                <Navbar.Brand href="/">
                    <img src="/static/images/logo.webp" width="30" height="30"
                         className="d-inline-block align-top main-logo" alt=""/>
                    Scam Sense
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {
                            isLoggedIn ? <Nav.Link href="dashboard">Dashboard</Nav.Link> : <Nav.Link href="register">Register or Login</Nav.Link>
                        }
                        {
                            isLoggedIn ? <Nav.Link href="logout">Logout</Nav.Link> : ""
                        }
                    </Nav>
                </Navbar.Collapse>

            </Navbar>
        </Container>
    )
}