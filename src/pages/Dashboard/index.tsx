import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Card, CardBody, Table, Progress, Button } from 'reactstrap';
import { useAuthStore } from '../../store/useAuthStore';
import { getUserFullName, getUserRole } from '../../helpers/userHelper';
import './dashboard.css';

interface EmployeeActivity {
  id: string;
  name: string;
  role: string;
  location: string;
  clockIn: string;
  hoursWorked: string;
  status: 'Active' | 'Break' | 'Offline';
  activityScore: number;
}

const dummyActivities: EmployeeActivity[] = [
  {
    id: 'EMP-101',
    name: 'Sarah Jenkins',
    role: 'Senior Frontend Engineer',
    location: 'Remote (Seattle, WA)',
    clockIn: '08:00 AM',
    hoursWorked: '6h 15m',
    status: 'Active',
    activityScore: 96,
  },
  {
    id: 'EMP-102',
    name: 'Michael Chen',
    role: 'Product Designer',
    location: 'Remote (Austin, TX)',
    clockIn: '08:30 AM',
    hoursWorked: '5h 45m',
    status: 'Active',
    activityScore: 92,
  },
  {
    id: 'EMP-103',
    name: 'Jessica Taylor',
    role: 'Backend Developer',
    location: 'On-site (Chicago HQ)',
    clockIn: '09:00 AM',
    hoursWorked: '5h 15m',
    status: 'Break',
    activityScore: 88,
  },
  {
    id: 'EMP-104',
    name: 'David Rodriguez',
    role: 'DevOps Specialist',
    location: 'Remote (Denver, CO)',
    clockIn: '07:45 AM',
    hoursWorked: '6h 30m',
    status: 'Active',
    activityScore: 98,
  },
  {
    id: 'EMP-105',
    name: 'Emily Watson',
    role: 'QA Automation Lead',
    location: 'On-site (New York Office)',
    clockIn: '09:15 AM',
    hoursWorked: '5h 00m',
    status: 'Offline',
    activityScore: 84,
  },
];

const Dashboard: React.FC = () => {
  const { user, profileInfo } = useAuthStore();
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');
  const userProfile = profileInfo || JSON.parse(localStorage.getItem('userProfile') || '{}');
  const displayName = getUserFullName(authUser, userProfile);
  const userRole = getUserRole(userProfile);

  const [isClockedIn, setIsClockedIn] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    document.title = 'Dashboard | HO Tracker';
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container fluid className="dashboard-container">
      {/* Welcome Banner */}
      <div className="welcome-card">
        <Row className="align-items-center">
          <Col lg={8}>
            <h1 className="welcome-title">Welcome back, {displayName}! 👋</h1>
            {/* <p className="welcome-subtitle">
              Here is what is happening across your home office workforce today. 148 team members are currently logged in with an overall productivity rate of 94.2%.
            </p> */}
            <div className="d-flex flex-wrap gap-2">
              {/* <Button
                color={isClockedIn ? 'light' : 'info'}
                className="fw-semibold px-3 py-2 shadow-sm"
                onClick={() => setIsClockedIn(!isClockedIn)}
              >
                <i className={`mdi ${isClockedIn ? 'mdi-stop-circle-outline text-danger' : 'mdi-play-circle-outline'} me-2`}></i>
                {isClockedIn ? 'Clock Out (Active)' : 'Clock In Now'}
              </Button>
              <Button color="outline-light" className="fw-semibold px-3 py-2">
                <i className="mdi mdi-download me-2"></i>
                Export Today's Summary
              </Button> */}
            </div>
          </Col>
          <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
            <div className="p-3 bg-white bg-opacity-10 rounded-3 d-inline-block text-start border border-white border-opacity-25">
              <div className="text-white text-opacity-75 small">System Time</div>
              <div className="fs-3 fw-bold text-white">{currentTime}</div>
              {/* <div className="text-white text-opacity-75 small mt-1">
                <i className="mdi mdi-map-marker me-1"></i> HQ Server • Online
              </div> */}
            </div>
          </Col>
        </Row>
      </div>



    </Container>
  );
};

export default Dashboard;
