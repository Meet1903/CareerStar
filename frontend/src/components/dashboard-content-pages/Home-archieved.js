import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import astronaut from '../../assets/images/home-page-astronaut.png'
import star from '../../assets/images/star.png'
import HomepageQuestion1 from "../homepage-questionnaires/HomepageQuestion1";
import HomepageQuestion2 from "../homepage-questionnaires/HomepageQuestion2";
import HomepageQuestion3 from "../homepage-questionnaires/HomepageQuestion3";
import HomepageQuestion4 from "../homepage-questionnaires/HomepageQuestion4";
import HomepageQuestion5 from "../homepage-questionnaires/HomepageQuestion5";
import ProgressBar from "../ProgressBar";
import Activities from "../Activities";
import CalendarComponent from "./CalendarComponent";
import QoD from "../question-of-the-day/QoD";

function Home({ onComplete, userId }) {
    const stars = useSelector(state => state.starCount);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [activityChoices, setActivityChoices] = useState([]);
    const [answers, setAnswers] = useState({
        describeMe: '',
        currentSituation: '',
        goal: '',
        onboarded: false,
        choice: '',
        summary: 'My summary',
        degree: '',
        major: '',
        activityChoices: [],
    });
    const [errors, setErrors] = useState({
        describeMe: '',
        currentSituation: '',
        goal: '',
        degree: '',
        major: '',
    });

    const totalSteps = 4;

    const buttonVisibility = {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/user/${userId}`);
                // const response = await fetch(`http://localhost:8080/users/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUserDetails(data);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }

            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/onboarding/${userId}`);
                // const response = await fetch(`http://localhost:8080/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.onboarded) {
                        setCurrentStep(6);
                    }
                    setAnswers((prevAnswers) => ({
                        ...prevAnswers,
                        ["describeMe"]: data.describeMe,
                        ["currentSituation"]: data.currentSituation,
                        ["goal"]: data.goal,
                        ["onboarded"]: data.onboarded,
                    }));
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentStep, answers]);

    const handleOptionSelect = async (selectedOption) => {
        if (selectedOption === 'roadmap') {
            answers.onboarded = true;
            answers.choice = 'roadmap';
            await addUserOnboardingDeatils();
            onComplete('Roadmap');
        } else if (selectedOption === 'activities') {
            answers.onboarded = true;
            answers.choice = 'activities';
            // await addUserOnboardingDeatils();
            setCurrentStep(currentStep + 1);
        }
    };

    const saveUserOnboardingDetailsWithActivities = async () => {
        setLoading(true);
        answers.onboarded = true;
        answers.choice = 'activities';
        answers.activityChoices = activityChoices;
        try {
            await addUserOnboardingDeatils();
        } catch (error) {
            console.error("Error adding onboarding details:", error);
        } finally {
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                onComplete('Home');
            }, 0);
            setLoading(false);
        }
    }

    const handleActivityChoicesSelect = async (selectedActivities) => {
        setActivityChoices(selectedActivities);
    }

    const addUserOnboardingDeatils = async () => {
        try {
            const requestBody = {
                "userId": userId,
                "describeMe": answers.describeMe,
                "currentSituation": answers.currentSituation,
                "goal": answers.goal,
                "onboarded": answers.onboarded,
                "choice": answers.choice,
                "summary": answers.summary,
                "degree": answers.degree,
                "major": answers.major,
                "activityChoices": answers.activityChoices,
            };
            const response = await axios.post('https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/onboarding', requestBody);
            // const response = await axios.post('http://localhost:8080/onboarding', requestBody);
            if (response.status === 200) {
                const { responseUserId } = response.data;
                return true;
            } else {
                console.error('Error adding user onboarding details:', response);
                return false;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return false;
        }
    }


    const handleAnswerChange = (field, value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [field]: value,
        }));
    }

    const renderPage = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <HomepageQuestion1 onChange={(value) => handleAnswerChange('describeMe', value)} />
                        {errors.describeMe && <div className='error-text'><p>{errors.describeMe}</p></div>}
                    </>
                );
            case 2:
                return (
                    <>
                        <HomepageQuestion2 onChange={(value) => handleAnswerChange('currentSituation', value)} />
                        {errors.currentSituation && <div className='error-text'><p>{errors.currentSituation}</p></div>}
                    </>
                );
            case 3:
                return (
                    <>
                        <HomepageQuestion3 onChange={(value) => handleAnswerChange('goal', value)} />
                        {errors.goal && <div className='error-text'><p>{errors.goal}</p></div>}
                    </>
                );
            case 4:
                return (
                    <>
                        <HomepageQuestion4 onChangeDegree={(value) => handleAnswerChange('degree', value)} onChangeMajor={(value) => handleAnswerChange('major', value)} />
                        {errors.degree && <div className='error-text'><p>{errors.degree}</p></div>}
                        {errors.major && <div className='error-text'><p>{errors.major}</p></div>}
                    </>
                );
            case 5:
                return <HomepageQuestion5 onActivityChoicesSelect={handleActivityChoicesSelect} />;
            case 6:
                return <><Activities userId={userId} /><QoD /></>;
                // return <><CalendarComponent /><Activities userId={userId} /></>;
            default:
                return <HomepageQuestion1 />;
        }
    };

    const validateStep = () => {
        let stepErrors = {};
        if (currentStep === 1 && !answers.describeMe.trim()) {
            stepErrors.describeMe = 'This field cannot be empty*';
        }
        if (currentStep === 2 && !answers.currentSituation.trim()) {
            stepErrors.currentSituation = 'This field cannot be empty*';
        }
        if (currentStep === 3 && !answers.goal.trim()) {
            stepErrors.goal = 'This field cannot be empty*';
        }
        if (currentStep === 4 && !answers.degree.trim()) {
            stepErrors.degree = 'Please choose your degree*';
        }
        if (currentStep === 4 && !answers.major.trim()) {
            stepErrors.major = 'Please choose your major*';
        }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const handleClick = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSkipVideo = () => {
        setCurrentStep(1);
    }

    const handleVideoEnd = () => {
        setVideoEnded(true);
    }

    return (
        <div className="home">
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="home-welcome">
                <div className='home-welcome-left'>
                    <img src={astronaut} alt="Astronaut" />
                    <div className="home-welcome-left-text">
                        <h1>Welcome, {userDetails.firstname}!</h1>
                        <p>It's great day to be a career star!</p>
                    </div>
                </div>
                <div className="home-welcome-right"><span className="star-count"> {stars} </span>  <img src={star} className='star' /></div>
            </div>
            {currentStep >= 1 && currentStep <= totalSteps ? (
                <div className="home-questions">
                    <span className="personalize-text">LET'S PERSONALIZE YOUR CAREERSTAR JOURNEY</span>
                    <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                    <div className="home-question-wrapper">
                        {renderPage()}
                    </div>
                    {buttonVisibility[currentStep] && (
                        <div className='home-page-button' onClick={handleClick}>
                            <p>Continue</p>
                        </div>
                    )}
                </div>
            ) : currentStep === (totalSteps + 1) ? (
                <div className="home-questions">
                    <span className="personalize-text">LET'S GET GOING THEN!</span>
                    <div className="home-question-wrapper">
                        {renderPage()}
                    </div>
                    <div className='home-page-button' onClick={() => { saveUserOnboardingDetailsWithActivities(); }}>
                        <p>Continue</p>
                    </div>
                </div>
            ) : currentStep === (totalSteps + 2) ? (
                <div className="">
                    {renderPage()}
                </div>
            ) : (
                <div className="home-questions">
                    <iframe
                        width="754"
                        height="392"
                        src="https://www.youtube.com/embed/b7eMnAn_WhI?si=_JK_K37lxh5f7HI0"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onEnded={handleVideoEnd}
                    >
                    </iframe>
                    <div className='home-page-skip-video-button' onClick={handleSkipVideo}>
                        <p>{videoEnded ? "Next" : "Skip Video"}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;