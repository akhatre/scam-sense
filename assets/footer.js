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
    )
}