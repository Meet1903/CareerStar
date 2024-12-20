import React, {useState, useEffect} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

function Dashboard() {

    const location = useLocation();
    const dispatch = useDispatch();
    const [firstname, setFirstname] = useState(location.state?.firstname || localStorage.getItem('firstname') || '');
    const [userId, setUserId] = useState(location.state?.userId || localStorage.getItem('userId') || '');
    const [userDetails, setUserDetails] = useState({});
    const [selectedPage, setSelectedPage] = useState(() => {
        const pathParts = location.pathname.split('/');
        const page = pathParts[pathParts.length - 1];

        const validPages = ['Home', 'Profile', 'Roadmap', 'Events', 'Network', 'Support'];

        const normalizedPage = page ? page.charAt(0).toUpperCase() + page.slice(1) : null;
        return validPages.includes(normalizedPage) ? normalizedPage : localStorage.getItem('selectedPage') || 'Home';
    });
    const [onboarded, setOnboarded] = useState(false);
    const pages = ['Home', 'Profile', 'Roadmap', 'Events', 'Network','Support'];

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/user/${userId}`);
            // const response = await fetch(`http://localhost:8080/users/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setUserDetails(data);
                dispatch({ type: "SET_STAR_COUNT", payload: data.stars });
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
                    setOnboarded(true);
                }
            } 
        } catch (error) {
            console.error('Error fetching user onboarding details:', error);
        }
    };
    
    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    useEffect(() => {
        localStorage.setItem('selectedPage', selectedPage);
    }, [selectedPage]);

    const handlePageChange = (page) => {
        setSelectedPage(page);
        fetchUserDetails();
    }
    return (
        <div className='dashboard'>
            <Header userName={firstname} onSelectPage={setSelectedPage} />
            <div className='dashboard-container'>
                <Sidebar pages={pages} onSelectPage={setSelectedPage} selectedPage={selectedPage} onboarded={onboarded}/>
                <div className='content'>
                    <DashboardContent selectedPage={selectedPage} onComplete={(page) => handlePageChange(page)} userId={userId}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;