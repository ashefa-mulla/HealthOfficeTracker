import React, { useEffect } from 'react';
import { Container, Card, CardBody, Table, Badge, Button } from 'reactstrap';

const dummyTasks = [
  { id: 'TSK-401', title: 'React Redux Store Integration', assignee: 'Sarah Jenkins', priority: 'High', status: 'In Progress', due: 'Sep 25' },
  { id: 'TSK-402', title: 'Dashboard Responsive Layouts', assignee: 'Michael Chen', priority: 'Medium', status: 'Completed', due: 'Sep 22' },
  { id: 'TSK-403', title: 'OAuth 2 Flow Verification', assignee: 'David Rodriguez', priority: 'High', status: 'Under Review', due: 'Sep 23' },
];

const Tasks: React.FC = () => {
  useEffect(() => {
    document.title = 'Tasks & Projects | HO Tracker';
  }, []);

  return (
    <Container fluid className="dashboard-container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="page-title">Tasks & Work Projects</h1>
          <div className="text-muted small">Monitor active assignments and productivity deliverables</div>
        </div>
        <Button color="primary" className="btn-vc1 d-inline-flex align-items-center gap-2" style={{ width: 'auto' }}>
          <i className="mdi mdi-plus"></i> New Task
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-3">
        <CardBody className="p-4">
          <Table hover responsive className="custom-table align-middle mb-0">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Project / Task Title</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyTasks.map((t) => (
                <tr key={t.id}>
                  <td className="text-muted font-monospace">{t.id}</td>
                  <td className="fw-semibold text-dark">{t.title}</td>
                  <td>{t.assignee}</td>
                  <td>
                    <Badge color={t.priority === 'High' ? 'danger' : 'info'} pill>
                      {t.priority}
                    </Badge>
                  </td>
                  <td>{t.due}</td>
                  <td>
                    <Badge color={t.status === 'Completed' ? 'success' : t.status === 'In Progress' ? 'primary' : 'warning'} pill>
                      {t.status}
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

export default Tasks;
