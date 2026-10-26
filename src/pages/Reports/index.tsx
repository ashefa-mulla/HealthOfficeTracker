import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody, Row, Col } from 'reactstrap';
import { useAuthStore } from '@/store/useAuthStore';
import { ReportItemDefinition } from '@/types/report/report.types';
import ReportModal from './ReportModal';
import './reports.scss';

const REPORTS_LIST: ReportItemDefinition[] = [
  {
    id: 1,
    key: 'po_statement',
    title: 'Purchase Order Statement Report',
    description: '',
    category: 'Financial',
    icon: '',
    color: '',
  },
  {
    id: 2,
    key: 'time_sheet',
    title: 'Time Sheet Report',
    description: '',
    category: 'Productivity',
    icon: '',
    color: '',
  },
  {
    id: 3,
    key: 'monthly_invoice',
    title: 'Monthly Invoice',
    description: '',
    category: 'Financial',
    icon: '',
    color: '',
  },
  {
    id: 4,
    key: 'utilization',
    title: 'Utilization Report',
    description: '',
    category: 'Productivity',
    icon: '',
    color: '',
  },
  {
    id: 5,
    key: 'attendance',
    title: 'Attendance Report',
    description: '',
    category: 'Attendance',
    icon: '',
    color: '',
  },
  {
    id: 6,
    key: 'monthly_invoice_excel',
    title: 'Monthly Invoice in Excel',
    description: '',
    category: 'Financial',
    icon: '',
    color: '',
  },
  {
    id: 7,
    key: 'user_utilization',
    title: 'User Utilization Report',
    description: '',
    category: 'Productivity',
    icon: '',
    color: '',
  },
  {
    id: 8,
    key: 'employee_leave',
    title: 'Employee Leave Report',
    description: '',
    category: 'Attendance',
    icon: '',
    color: '',
  },
  {
    id: 9,
    key: 'utilization_with_project',
    title: 'Utilization Report with Project',
    description: '',
    category: 'Productivity',
    icon: '',
    color: '',
  },
  {
    id: 10,
    key: 'productivity_analytics',
    title: 'Productivity Analytics Report',
    description: '',
    category: 'Productivity',
    icon: '',
    color: '',
  },
  {
    id: 11,
    key: 'employee_wise_production',
    title: 'Employee - Wise Production Report',
    description: '',
    category: 'Productivity',
    icon: '',
    color: '',
  },
  {
    id: 12,
    key: 'monthly_eval_summary',
    title: 'Monthly Evaluation Report Summary',
    description: '',
    category: 'Evaluation',
    icon: '',
    color: '',
  },
];

const Reports: React.FC = () => {
  const { user, profileInfo } = useAuthStore();

  const sessionRole =
    localStorage.getItem('sessionrole') ||
    profileInfo?.userRole ||
    user?.userRole ||
    (profileInfo?.utype === 1 || profileInfo?.utype === 4 ? 'Admin' : '');

  const rawSessionType =
    localStorage.getItem('sessiontype') ||
    (sessionRole === 'Clinicians' ? 2 : profileInfo?.utype ?? 0);
  const sessiontype = Number(rawSessionType) && !isNaN(Number(rawSessionType)) ? Number(rawSessionType) : 0;

  const rawCompanyId = localStorage.getItem('companyid') || profileInfo?.companyId || user?.companyId;
  const companyId = Number(rawCompanyId) && !isNaN(Number(rawCompanyId)) ? Number(rawCompanyId) : 1;

  const rawBranchId = localStorage.getItem('branchid') || profileInfo?.branchId || user?.branchId;
  const branchId = Number(rawBranchId) && !isNaN(Number(rawBranchId)) ? Number(rawBranchId) : 1;

  const rawAdminId =
    localStorage.getItem('userid') ||
    localStorage.getItem('uid') ||
    profileInfo?.userId ||
    profileInfo?.entityId ||
    profileInfo?.id;
  const adminId = Number(rawAdminId) && !isNaN(Number(rawAdminId)) ? Number(rawAdminId) : 0;

  const isClinician = sessiontype === 2 || sessionRole === 'Clinicians';

  const [activeReport, setActiveReport] = useState<ReportItemDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Reports | HO Tracker';
  }, []);

  const handleOpenModal = (report: ReportItemDefinition) => {
    setActiveReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container fluid className="dashboard-container reports-page py-3">
      <Row className="mb-2">
        <Col xs={12}>
          <h4 className="mb-0 text-dark fw-bold">Reports</h4>
          <hr className="my-3" />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="reports-card">
            <CardBody>
              {sessiontype !== 2 ? (
                <ol className="reports-simple-list">
                  {REPORTS_LIST.map((rep) => (
                    <li key={rep.id}>
                      <a
                        href="#/"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenModal(rep);
                        }}
                      >
                        {rep.title}
                      </a>
                    </li>
                  ))}
                </ol>
              ) : (
                <ol className="reports-simple-list">
                  <li>
                    <a
                      href="#/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenModal(REPORTS_LIST[2]); // Monthly Invoice
                      }}
                    >
                      Monthly Invoice
                    </a>
                  </li>
                </ol>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <ReportModal
        isOpen={isModalOpen}
        toggle={handleCloseModal}
        report={activeReport}
        companyId={companyId}
        branchId={branchId}
        adminId={adminId}
        isClinician={isClinician}
      />
    </Container>
  );
};

export default Reports;
