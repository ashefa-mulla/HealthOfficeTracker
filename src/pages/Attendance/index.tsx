import React, { useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Table, Button, Badge } from 'reactstrap';

const dummyAttendance = [
  { id: 'LOG-881', employee: 'Sarah Jenkins', date: 'Today, Sep 22', clockIn: '08:00 AM', clockOut: 'In Progress', total: '6h 15m', status: 'On Time' },
  { id: 'LOG-882', employee: 'Michael Chen', date: 'Today, Sep 22', clockIn: '08:30 AM', clockOut: 'In Progress', total: '5h 45m', status: 'On Time' },
  { id: 'LOG-883', employee: 'Jessica Taylor', date: 'Today, Sep 22', clockIn: '09:00 AM', clockOut: 'In Progress', total: '5h 15m', status: 'Late (15m)' },
  { id: 'LOG-884', employee: 'David Rodriguez', date: 'Today, Sep 22', clockIn: '07:45 AM', clockOut: 'In Progress', total: '6h 30m', status: 'Early' },
];

const Attendance: React.FC = () => {
  useEffect(() => {
    document.title = 'Time & Attendance | HO Tracker';
  }, []);

  return (
    <Container fluid className="dashboard-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="page-title">Time & Attendance Tracking</h1>
          <div className="text-muted small">Real-time timesheets, shift records, and clock-in logs</div>
        </div>
        <Button color="primary" className="btn-vc1 d-inline-flex align-items-center gap-2" style={{ width: 'auto' }}>
          <i className="mdi mdi-download"></i> Export Timesheet (CSV)
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3">
        <CardBody className="p-4">
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
                    <Badge color={log.status.includes('Late') ? 'warning' : 'success'} pill>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Attendance;
