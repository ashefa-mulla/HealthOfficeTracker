import React, { useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Table, Button, Input, Badge } from 'reactstrap';

const dummyEmployees = [
  { id: 'HO-001', name: 'Sarah Jenkins', department: 'Engineering', email: 'sarah.j@hotracker.com', status: 'Active', hours: '38.5 hrs' },
  { id: 'HO-002', name: 'Michael Chen', department: 'Product Design', email: 'm.chen@hotracker.com', status: 'Active', hours: '40.0 hrs' },
  { id: 'HO-003', name: 'Jessica Taylor', department: 'Operations', email: 'j.taylor@hotracker.com', status: 'On Break', hours: '35.2 hrs' },
  { id: 'HO-004', name: 'David Rodriguez', department: 'Infrastructure', email: 'd.rodriguez@hotracker.com', status: 'Active', hours: '41.0 hrs' },
  { id: 'HO-005', name: 'Emily Watson', department: 'Quality Assurance', email: 'e.watson@hotracker.com', status: 'Offline', hours: '32.0 hrs' },
];

const Employees: React.FC = () => {
  useEffect(() => {
    document.title = 'Employees & Teams | HO Tracker';
  }, []);

  return (
    <Container fluid className="dashboard-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="page-title">Employees & Workforce Directory</h1>
          <div className="text-muted small">Manage workforce members, department assignments, and permissions</div>
        </div>
        <Button color="primary" className="btn-vc1 d-inline-flex align-items-center gap-2" style={{ width: 'auto' }}>
          <i className="mdi mdi-plus"></i> Add Employee
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3">
        <CardBody className="p-4">
          <Row className="g-3 mb-3">
            <Col md={4}>
              <Input type="text" placeholder="Search by name, email or department..." />
            </Col>
            <Col md={3}>
              <Input type="select">
                <option value="">All Departments</option>
                <option value="eng">Engineering</option>
                <option value="design">Product Design</option>
                <option value="ops">Operations</option>
              </Input>
            </Col>
            <Col md={3}>
              <Input type="select">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="break">On Break</option>
                <option value="offline">Offline</option>
              </Input>
            </Col>
          </Row>

          <Table hover responsive className="custom-table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Weekly Hours</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="text-muted font-monospace">{emp.id}</td>
                  <td>
                    <div className="fw-semibold text-dark">{emp.name}</div>
                    <div className="text-muted small">{emp.email}</div>
                  </td>
                  <td>{emp.department}</td>
                  <td className="fw-medium">{emp.hours}</td>
                  <td>
                    <Badge color={emp.status === 'Active' ? 'success' : emp.status === 'On Break' ? 'warning' : 'secondary'} pill>
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="text-end">
                    <Button size="sm" color="light" className="me-1">
                      <i className="mdi mdi-eye-outline"></i>
                    </Button>
                    <Button size="sm" color="light">
                      <i className="mdi mdi-pencil-outline"></i>
                    </Button>
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

export default Employees;
