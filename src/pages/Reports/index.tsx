import React, { useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Button, Progress } from 'reactstrap';

const Reports: React.FC = () => {
  useEffect(() => {
    document.title = 'Reports & Analytics | HO Tracker';
  }, []);

  return (
    <Container fluid className="dashboard-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="page-title">Productivity Reports & Analytics</h1>
          <div className="text-muted small">Comprehensive employee output, attendance ratios, and audit logs</div>
        </div>
        <Button color="primary" className="btn-vc1 d-inline-flex align-items-center gap-2" style={{ width: 'auto' }}>
          <i className="mdi mdi-chart-box-outline"></i> Generate Monthly Report
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              <h6 className="text-muted mb-2">Total Monthly Work Hours</h6>
              <div className="fs-2 fw-bold text-dark mb-2">24,850 hrs</div>
              <div className="text-success small fw-semibold mb-3">
                <i className="mdi mdi-arrow-up"></i> +8.4% compared to last month
              </div>
              <Progress value={85} color="primary" className="rounded-pill" style={{ height: '6px' }} />
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              <h6 className="text-muted mb-2">Average Active Engagement</h6>
              <div className="fs-2 fw-bold text-dark mb-2">91.6%</div>
              <div className="text-success small fw-semibold mb-3">
                <i className="mdi mdi-arrow-up"></i> +1.2% above baseline target
              </div>
              <Progress value={91.6} color="success" className="rounded-pill" style={{ height: '6px' }} />
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              <h6 className="text-muted mb-2">On-Time Shift Starts</h6>
              <div className="fs-2 fw-bold text-dark mb-2">97.4%</div>
              <div className="text-info small fw-semibold mb-3">
                <i className="mdi mdi-check-circle"></i> Outstanding consistency
              </div>
              <Progress value={97.4} color="info" className="rounded-pill" style={{ height: '6px' }} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
