import React, { useEffect } from 'react';
import { Container, Card, CardBody, Row, Col, Badge } from 'reactstrap';

const dummyLocations = [
  { name: 'Seattle Tech Hub (Remote Cluster)', city: 'Seattle, WA', type: 'Remote Cluster', activeUsers: 48, timezone: 'PST (UTC-8)' },
  { name: 'Chicago Corporate HQ', city: 'Chicago, IL', type: 'Headquarters', activeUsers: 33, timezone: 'CST (UTC-6)' },
  { name: 'Austin Innovation Lab', city: 'Austin, TX', type: 'Branch Office', activeUsers: 27, timezone: 'CST (UTC-6)' },
  { name: 'Denver Cloud Operations', city: 'Denver, CO', type: 'Remote Cluster', activeUsers: 22, timezone: 'MST (UTC-7)' },
];

const Locations: React.FC = () => {
  useEffect(() => {
    document.title = 'Office Locations | HO Tracker';
  }, []);

  return (
    <Container fluid className="dashboard-container">
      <div className="mb-4">
        <h1 className="page-title">Office Branches & Remote Hubs</h1>
        <div className="text-muted small">Workforce geographic centers and timezones</div>
      </div>

      <Row className="g-4">
        {dummyLocations.map((loc, idx) => (
          <Col md={6} key={idx}>
            <Card className="border-0 shadow-sm rounded-3 h-100">
              <CardBody className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{loc.name}</h5>
                    <div className="text-muted small">
                      <i className="mdi mdi-map-marker text-primary me-1"></i>
                      {loc.city}
                    </div>
                  </div>
                  <Badge color="info" pill>{loc.type}</Badge>
                </div>

                <div className="d-flex justify-content-between text-muted small pt-2 border-top">
                  <span><strong>Active Workforce:</strong> {loc.activeUsers} Users</span>
                  <span><strong>Timezone:</strong> {loc.timezone}</span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Locations;
