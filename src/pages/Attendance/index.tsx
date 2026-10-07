import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Table,
  Button,
  Badge,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import Timer from '../Timer';

const dummyAttendance : any[ ]=[];

const Attendance: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'timesheet' | 'clock'>(
    tabParam === 'clock' || tabParam === 'live' ? 'clock' : 'timesheet'
  );

  useEffect(() => {
    if (tabParam === 'clock' || tabParam === 'live') {
      setActiveTab('clock');
    } else if (tabParam === 'timesheet') {
      setActiveTab('timesheet');
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'timesheet' | 'clock') => {
    setActiveTab(tab);
    setSearchParams(tab === 'clock' ? { tab: 'clock' } : {});
  };

  return (
    <Container fluid className="dashboard-container">
      {/* Top Header & Tab Navigation */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="page-title">Time & Attendance Tracking</h1>
          <div className="text-muted small">
            Real-time timesheets, employee punch timer, and shift monitoring
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Nav pills className="bg-light p-1 rounded-3 border">
            <NavItem>
              <NavLink
                className={`py-1 px-3 fw-semibold cursor-pointer rounded-2 ${activeTab === 'timesheet' ? 'active shadow-sm' : 'text-muted'
                  }`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleTabChange('timesheet')}
              >
                <i className="mdi mdi-table-clock me-1"></i> Timesheet Logs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`py-1 px-3 fw-semibold cursor-pointer rounded-2 ${activeTab === 'clock' ? 'active shadow-sm' : 'text-muted'
                  }`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleTabChange('clock')}
              >
                <i className="mdi mdi-clock-fast me-1"></i> Punch Kiosk / Timer
              </NavLink>
            </NavItem>
          </Nav>

          {activeTab === 'timesheet' && (
            <Button
              color="primary"
              className="btn-vc1 d-inline-flex align-items-center gap-2"
              style={{ width: 'auto' }}
            >
              <i className="mdi mdi-download"></i> Export Timesheet (CSV)
            </Button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'clock' ? (
        <Timer />
      ) : (
        <Card className="border-0 shadow-sm rounded-3">
          <CardBody className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark m-0">Daily Shift Summary</h5>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                Today's Activity
              </span>
            </div>

            <Table hover responsive className="custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Clock-In</th>
                  <th>Clock-Out</th>
                  <th>Duration</th>
                  <th>Punctuality</th>
                </tr>
              </thead>
              <tbody>
                {dummyAttendance.map((log) => (
                  <tr key={log.id}>
                    <td className="text-muted font-monospace">{log.id}</td>
                    <td className="fw-semibold text-dark">{log.employee}</td>
                    <td>{log.date}</td>
                    <td className="font-monospace text-dark">{log.clockIn}</td>
                    <td className="font-monospace text-primary">{log.clockOut}</td>
                    <td className="fw-bold">{log.total}</td>
                    <td>
                      <Badge
                        color={log.status.includes('Late') ? 'warning' : 'success'}
                        pill
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </Container>
  );
};

export default Attendance;
