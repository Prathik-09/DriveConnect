import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../CustomAlert'; // Import your custom alert
const styles = {
    body: {
        margin: 0,
        padding: 0,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#0c0c0c',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: (width, height) => ({
        display: 'flex',
        width: width,
        height: height,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
        flexDirection: width < 600 ? 'column' : 'row',
    }),
    leftSection: (width) => ({
        width: width < 600 ? '100%' : '50%',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: width < 600 ? '20px' : '0',
    }),
    rightSection: (width) => ({
        width: width < 600 ? '100%' : '50%', backgroundColor: '#4a4a4a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: width < 600 ? '20px' : '0',
    }),
    formBox: {
        width: '100%',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
    },
    formBoxH2: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    toggleButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        position: 'relative',
    },
    toggleButton: {
        background: 'none',
        border: 'none',
        fontSize: '16px',
        padding: '10px 20px',
        cursor: 'pointer',
        zIndex: 1,
    },
    toggleButtonActive: {
        color: 'white',
    },
    toggleIndicator: {
        position: 'absolute',
        height: '100%',
        width: '50%',
        background: 'linear-gradient(to right, #3b82f6, #1d4ed8)',
        borderRadius: '12px',
        transition: 'transform 0.3s ease',
        zIndex: 0,
    },
    toggleIndicatorLeft: {
        transform: 'translateX(0%)',
    },
    toggleIndicatorRight: {
        transform: 'translateX(100%)',
    },
    formBoxForm: {
        display: 'flex',
        flexDirection: 'column',
    },
    formBoxInput: {
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    forgotPassword: {
        color: '#1d4ed8',
        fontSize: '14px',
        textAlign: 'right',
        marginBottom: '20px',
        display: 'block',
        textDecoration: 'none',
    },
    formBoxButton: {
        backgroundColor: '#1d4ed8',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.3s',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    formBoxButtonHover: {
        backgroundColor: '#090908',
    },
    formFooter: {
        marginTop: '20px',
        fontSize: '14px',
        color: '#555',
    },
    formFooterSpan: {
        color: '#1d4ed8',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    rightSectionH1: {
        fontSize: '28px',
        marginBottom: '10px',
    },
    rightSectionP: {
        fontSize: '18px',
        marginBottom: '20px',
    },
    rightSectionButton: {
        backgroundColor: '#1d4ed8',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.3s',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    rightSectionButtonHover: {
        backgroundColor: '#090908',
    },

};



const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phno: '',
        password: '',
        confirmpassword: ''
    });
    const [alertMessage, setAlertMessage] = useState(null); // To store alert message
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setAlertMessage('User registered successfully!'); // Display success alert
            localStorage.setItem('username', response.data.name);
            console.log(response);
        } catch (error) {
            setAlertMessage('Enter Valid Details'); // Display error alert
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login',{
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setAlertMessage('Login successful!'); // Display success alert
            console.log(response);
            navigate('/home');
        } catch (error) {
            setAlertMessage('Invalid Credentials'); // Display error alert
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='my-5' style={styles.body}>
            <div style={styles.container(windowWidth, window.innerHeight)}>
                <div style={styles.leftSection(windowWidth)}>
                    <div style={styles.formBox}>
                        <h2 style={styles.formBoxH2}>{isSignUp ? 'SIGNUP FORM' : 'LOGIN FORM'}</h2>
                        <div style={styles.toggleButtons}>
                            <button
                                style={{ ...styles.toggleButton, ...(isSignUp ? {} : styles.toggleButtonActive) }}
                                onClick={() => setIsSignUp(false)}
                            >
                                Login
                            </button>
                            <button
                                style={{ ...styles.toggleButton, ...(isSignUp ? styles.toggleButtonActive : {}) }}
                                onClick={() => setIsSignUp(true)}
                            >
                                Signup
                            </button>
                            <div
                                style={{
                                    ...styles.toggleIndicator,
                                    ...(isSignUp ? styles.toggleIndicatorRight : styles.toggleIndicatorLeft),
                                }}
                            ></div>
                        </div>
                        <form style={styles.formBoxForm} onSubmit={isSignUp ? handleSubmit : handleLogin}>
                            {isSignUp && (
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Username"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    style={styles.formBoxInput}
                                />
                            )}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={styles.formBoxInput}
                            />
                            {isSignUp && (
                                <input
                                    type="tel"
                                    name="phno"
                                    placeholder="Phone Number"
                                    value={formData.phno}
                                    onChange={handleChange}
                                    required
                                    style={styles.formBoxInput}
                                />
                            )}
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={styles.formBoxInput}
                            />
                            {isSignUp && (
                                <input
                                    type="password"
                                    name="confirmpassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmpassword}
                                    onChange={handleChange}
                                    required
                                    style={styles.formBoxInput}
                                />
                            )}
                            <Link to="/forgot-password">Forgot Password</Link>
                            {/* {!isSignUp && <a href="/" style={styles.forgotPassword}>Forgot password?</a>} */}
                            <button
                                type="submit"
                                style={styles.formBoxButton}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.formBoxButtonHover.backgroundColor}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.formBoxButton.backgroundColor}
                            >
                                {isSignUp ? 'Sign Up' : 'Login'}
                            </button>
                        </form>
                        <p style={styles.formFooter}>
                            {isSignUp ? "Already have an account?" : "Not a member?"}
                            <span style={styles.formFooterSpan} onClick={toggleForm}>
                                {isSignUp ? " Login now" : " Signup now"}
                            </span>
                        </p>
                    </div>
                </div>
                <div style={styles.rightSection(windowWidth)}>
                    <h1 style={styles.rightSectionH1}>Elevate Your Journey with RideFlex!</h1>
                    <p style={styles.rightSectionP}>New Here?</p>
                    <button
                        style={styles.rightSectionButton}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.rightSectionButtonHover.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.rightSectionButton.backgroundColor}
                        onClick={toggleForm}
                    >
                        {isSignUp ? 'Login' : 'Signup'}
                    </button>
                </div>
            </div>

            {/* Custom Alert */}
            {alertMessage && <CustomAlert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        </div>
    );
};

export default Login;
