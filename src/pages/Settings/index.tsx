import React, { useEffect, useState } from 'react';
import { Container, Card, CardBody, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { useAuthStore } from '../../store/useAuthStore';
import { getUserFullName, getUserEmail, getUserRole } from '../../helpers/userHelper';

const Settings: React.FC = () => {
  const { user, profileInfo } = useAuthStore();
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');
  const userProfile = profileInfo || JSON.parse(localStorage.getItem('userProfile') || '{}');

  const [companyName, setCompanyName] = useState('HO Tracker Organization');
  const [shiftStart, setShiftStart] = useState('08:00');
  const [idleThreshold, setIdleThreshold] = useState('15');

  useEffect(() => {
    document.title = 'Settings | HO Tracker';
  }, []);

  return (
    <Container fluid className="dashboard-container">
      <div className="mb-4">
        <h1 className="page-title">System Settings & Policies</h1>
        <div className="text-muted small">Configure workplace parameters, notification limits, and authentication preferences</div>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              <h5 className="fw-bold text-dark mb-3">Workforce Tracking Policies</h5>

              <Form onSubmit={(e) => e.preventDefault()}>
                <FormGroup className="mb-3">
                  <Label className="fw-semibold text-dark">Organization Name</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </FormGroup>

                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-semibold text-dark">Default Shift Start Time</Label>
                      <Input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className="fw-semibold text-dark">Idle Detection Timeout (Minutes)</Label>
                      <Input type="number" value={idleThreshold} onChange={(e) => setIdleThreshold(e.target.value)} />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="form-check form-switch mb-3">
                  <Input type="checkbox" className="form-check-input" id="autoClockOut" defaultChecked />
                  <Label className="form-check-label text-muted" htmlFor="autoClockOut">
                    Automatically prompt employees when inactivity exceeds threshold
                  </Label>
                </div>

                <Button color="primary" className="btn-vc1" style={{ width: 'auto' }}>
                  Save Policy Configuration
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              <h5 className="fw-bold text-dark mb-3">User Profile</h5>
              <div className="text-muted small mb-1">Full Name</div>
              <div className="fw-bold text-dark mb-3">{getUserFullName(authUser, userProfile)}</div>

              <div className="text-muted small mb-1">Email / Username</div>
              <div className="fw-bold text-dark mb-3">{getUserEmail(authUser, userProfile)}</div>

              <div className="text-muted small mb-1">Access Role</div>
              <div className="badge bg-primary-subtle text-primary mb-3">{getUserRole(userProfile)}</div>

              <div className="text-muted small mb-1">Session Security</div>
              <div className="text-success small fw-semibold">
                <i className="mdi mdi-shield-check me-1"></i> JWT Bearer Token Active
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
