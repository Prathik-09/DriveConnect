import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // Extract query parameter from URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    useEffect(() => {
        if (!token) {
            setMessage("No token provided");
        }
    }, [token]);

    const handlePasswordReset = (e) => {
        e.preventDefault();

        // Sending token and password to the backend
        axios
            .post("http://localhost:8000/reset-password", { password, token })
            .then((response) => {
                if (response.data.Status === "Success") {
                    setMessage("Password reset successfully. Redirecting to login...");
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                }
            })
            .catch((err) => {
                setMessage("Error resetting password");
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h4>Reset Password</h4>
                <form onSubmit={handlePasswordReset}>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>New Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="form-control rounded-0"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Reset Password
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default ResetPassword;
