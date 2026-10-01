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
            <p className="welcome-subtitle">
              Here is what is happening across your home office workforce today. 148 team members are currently logged in with an overall productivity rate of 94.2%.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Button
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
              </Button>
            </div>
          </Col>
          <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
            <div className="p-3 bg-white bg-opacity-10 rounded-3 d-inline-block text-start border border-white border-opacity-25">
              <div className="text-white text-opacity-75 small">System Time</div>
              <div className="fs-3 fw-bold text-white">{currentTime}</div>
              <div className="text-white text-opacity-75 small mt-1">
                <i className="mdi mdi-map-marker me-1"></i> HQ Server • Online
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Metric Cards Row */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Active Employees</span>
              <div className="stat-icon-wrapper stat-icon-blue">
                <i className="mdi mdi-account-multiple-check"></i>
              </div>
            </div>
            <div className="stat-value">148</div>
            <div className="stat-trend positive">
              <i className="mdi mdi-arrow-top-right"></i>
              <span>+12% vs last week</span>
            </div>
          </div>
        </Col>

        <Col sm={6} lg={3}>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Hours Tracked Today</span>
              <div className="stat-icon-wrapper stat-icon-teal">
                <i className="mdi mdi-timer-sand"></i>
              </div>
            </div>
            <div className="stat-value">1,240 <span className="fs-6 text-muted font-monospace">hrs</span></div>
            <div className="stat-trend positive">
              <i className="mdi mdi-arrow-top-right"></i>
              <span>Avg 7.8 hrs / user</span>
            </div>
          </div>
        </Col>

        <Col sm={6} lg={3}>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Productivity Rate</span>
              <div className="stat-icon-wrapper stat-icon-emerald">
                <i className="mdi mdi-chart-line-variant"></i>
              </div>
            </div>
            <div className="stat-value">94.2%</div>
            <div className="stat-trend positive">
              <i className="mdi mdi-arrow-top-right"></i>
              <span>+2.4% target met</span>
            </div>
          </div>
        </Col>

        <Col sm={6} lg={3}>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Workstations</span>
              <div className="stat-icon-wrapper stat-icon-amber">
                <i className="mdi mdi-desktop-mac-dashboard"></i>
              </div>
            </div>
            <div className="stat-value">60</div>
            <div className="stat-trend neutral">
              <i className="mdi mdi-home-city"></i>
              <span>42 Remote • 18 On-site</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Content: Table & Quick Actions */}
      <Row className="g-4">
        {/* Left Column: Live Activity Table */}
        <Col lg={8}>
          <div className="content-card">
            <div className="card-header-custom">
              <div>
                <h2 className="card-title-custom">Live Employee Workforce Status</h2>
                <div className="text-muted small">Real-time attendance & home office activity feed</div>
              </div>
              <Button color="link" className="text-primary text-decoration-none fw-semibold p-0">
                View All <i className="mdi mdi-chevron-right"></i>
              </Button>
            </div>

            <div className="table-responsive">
              <Table hover className="custom-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Location</th>
                    <th>Clock-In</th>
                    <th>Hours</th>
                    <th>Activity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyActivities.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar-badge me-2" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{emp.name}</div>
                            <div className="text-muted small">{emp.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-muted small">
                        <i className="mdi mdi-map-marker-outline me-1"></i>
                        {emp.location}
                      </td>
                      <td className="text-dark font-monospace small">{emp.clockIn}</td>
                      <td className="text-dark fw-medium">{emp.hoursWorked}</td>
                      <td style={{ minWidth: '120px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <Progress
                            value={emp.activityScore}
                            color={emp.activityScore > 90 ? 'success' : emp.activityScore > 80 ? 'info' : 'warning'}
                            style={{ height: '6px', flex: 1 }}
                            className="rounded-pill"
                          />
                          <span className="small fw-semibold text-muted">{emp.activityScore}%</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${emp.status === 'Active'
                              ? 'status-active'
                              : emp.status === 'Break'
                                ? 'status-break'
                                : 'status-offline'
                            }`}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: emp.status === 'Active' ? '#16a34a' : emp.status === 'Break' ? '#ca8a04' : '#64748b',
                            }}
                          ></span>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>

        {/* Right Column: Quick Actions & Office Locations */}
        <Col lg={4}>
          <div className="content-card mb-4">
            <div className="card-header-custom">
              <h2 className="card-title-custom">Quick Actions</h2>
            </div>
            <div className="p-3 d-flex flex-column gap-2">
              <button className="quick-action-btn">
                <i className="mdi mdi-account-plus-outline"></i>
                <div>
                  <div>Add New Team Member</div>
                  <div className="text-muted small fw-normal">Register employee & assign workspace</div>
                </div>
              </button>

              <button className="quick-action-btn">
                <i className="mdi mdi-calendar-clock-outline"></i>
                <div>
                  <div>Manual Time Adjustment</div>
                  <div className="text-muted small fw-normal">Review attendance correction requests</div>
                </div>
              </button>

              <button className="quick-action-btn">
                <i className="mdi mdi-file-chart-outline"></i>
                <div>
                  <div>Generate Productivity Audit</div>
                  <div className="text-muted small fw-normal">Export PDF/Excel weekly timesheets</div>
                </div>
              </button>

              <button className="quick-action-btn">
                <i className="mdi mdi-cog-transfer-outline"></i>
                <div>
                  <div>Workspace Policy Rules</div>
                  <div className="text-muted small fw-normal">Configure shift hours and idle limits</div>
                </div>
              </button>
            </div>
          </div>

          <div className="content-card">
            <div className="card-header-custom">
              <h2 className="card-title-custom">Workforce Distribution</h2>
            </div>
            <CardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span>Remote Home Offices</span>
                  <span>70% (104 Users)</span>
                </div>
                <Progress value={70} color="info" className="rounded-pill" style={{ height: '8px' }} />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span>Headquarters & On-Site</span>
                  <span>22% (33 Users)</span>
                </div>
                <Progress value={22} color="success" className="rounded-pill" style={{ height: '8px' }} />
              </div>

              <div>
                <div className="d-flex justify-content-between small fw-semibold mb-1">
                  <span>On Leave / Off Shift</span>
                  <span>8% (11 Users)</span>
                </div>
                <Progress value={8} color="secondary" className="rounded-pill" style={{ height: '8px' }} />
              </div>
            </CardBody>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
