import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import careerStarLogo from '../assets/images/main-page-career-star-logo-white.png';
import astroaut from '../assets/images/main-page-astronaut.png';

function StartPage() {

    const navigate = useNavigate(); 

    const handleClick = () => {
        console.log('Div clicked!');
        navigate('/signup');
    };

    const logInPageNavigation = () => {
        navigate('/login');
    }

    return (
        <div className='main-page'>
            <div className='career-star-logo'>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='main-page-contnent'>
                <div className='hey'>
                    <img src={astroaut} alt='Astronaut' />
                </div>

                <div className='main-page-header'>
                    <h1>Start owning your</h1>
                    <h1>career journey</h1>
                    <p>Personalized & motivating professional development tool that puts people first. Built with love. </p>
                </div>

                <div className='main-page-button' onClick={handleClick}>
                    <p>Get Started Free &rarr;</p>
                </div>

                <div className='main-page-footer'>
                    <p>Have an account? <a onClick={logInPageNavigation}>Log in</a></p>
                </div>
            </div>
        </div>
    );
}

export default StartPage;