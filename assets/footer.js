import React from "react";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="border-top bg-light py-3">
            <div className="container text-center">
                <p className="mb-0">
                    &copy; {currentYear} ScamSense Ltd. All rights reserved.
                </p>
                <p className="mb-0">
                    <a className="text-decoration-none clickable-text" onClick={() => alert("Your data = Our data")}>
                        Privacy Policy
                    </a>{' '}
                    |{' '}
                    <a className="text-decoration-none clickable-text" onClick={() => alert("We do us, you do you")}>
                        Terms of Service
                    </a>
                </p>
            </div>
        </footer>
    )
}