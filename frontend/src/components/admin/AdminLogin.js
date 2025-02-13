import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import careerStarLogo from '../../assets/images/career-star-logo-black.png';

const AdminLogin = () => {

    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');

    const [errorusername, seterrorusername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const handleusernameInputChange = (event) => {
        setusername(event.target.value);
        if (event.target.value.trim() !== '') {
            seterrorusername('');
        }
    };

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
        if (event.target.value.trim() !== '') {
            setErrorPassword('');
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        const admin_token = localStorage.getItem('admin_token');
        if (admin_token) {
            verifyToken(admin_token);
        }
    }, []);

    const verifyToken = async (admin_token) => {
        try {
            const response = await axios.get('https://api.careerstar.co/verifyAdminToken', {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                },
            });
            if (response.status === 200) {
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('admin_token');
        }
    };

    const handleLogIn = async () => {
        if (username.trim() === '') {
            seterrorusername('Username cannot be empty*');
            return;
        }
        if (password.trim() === '') {
            setErrorPassword('Password cannot be empty*');
            return;
        }
        try {
            const requestBody = {
                "username": username,
                "password": password
            };

            const response = await axios.post('https://api.careerstar.co/adminlogin', requestBody);
            if (response.status === 200) {
                const admin_token = response.data.access_token;
                localStorage.setItem('admin_token', admin_token);
                navigate('/admin/dashboard');
                // const response2 = await axios.get('https://api.careerstar.co/events',{
                //     headers: {
                //         Authorization: `Bearer ${token}`
                //     }
                // });
            }
        } catch (error) {
            if (error.status === 400) {
                console.log('User does not exist!');
                alert('Incorrect email ID or password. Please try again.');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogIn();
        }
    };

    const navigateToStartPage = () => {
        navigate('/');
    };

    const signUpPageNavigation = () => {
        navigate('/signup');
    }
    return (
        <div>
            <div className='signUp-page'>
                <div className='career-star-logo' onClick={navigateToStartPage}>
                    <img src={careerStarLogo} alt='Career Star Logo' />
                </div>
                <div className='signUp-page-content'>
                    <div className='signUp-page-question'>
                        <h2>Log in to <span className="highlight">admin account</span></h2>
                        <p>Username</p>
                        <input
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={handleusernameInputChange}
                            onKeyDown={handleKeyPress}
                        />
                        {errorusername && <div className='error-text'><p>{errorusername}</p></div>}
                        <p>Password</p>
                        <input
                            type='password'
                            placeholder='**********'
                            onChange={handlePasswordInputChange}
                            onKeyDown={handleKeyPress}
                        />
                        {errorPassword && <div className='error-text'><p>{errorPassword}</p></div>}
                    </div>
                    <div className='signUp-page-button' onClick={handleLogIn}>
                        <p>Continue</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;