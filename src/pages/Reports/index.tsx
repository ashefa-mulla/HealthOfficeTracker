import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, CardBody, Row, Col } from 'reactstrap';
import { useAuthStore } from '@/store/useAuthStore';
import { ReportItemDefinition } from '@/types/report/report.types';
import { getNumericEmployeeId, getOwnEmployeeId } from '@/helpers/userHelper';
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
    category: 'Financial',
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
    category: 'Financial',
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
  {
    id: 13,
    key: 'employee_payslip',
    title: 'Employee Pay Slip Report',
    description: '',
    category: 'Financial',
    icon: '',
    color: '',
  },
  {
    id: 14,
    key: 'payroll_ledger',
    title: 'Payroll Ledger',
    description: '',
    category: 'Payroll',
    icon: '',
    color: '',
  },
];

// Employee-accessible reports (strictly the 3 employee reports)
const EMPLOYEE_REPORT_KEYS = [
  'time_sheet',
  'employee_leave',
  'employee_payslip',
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

  const storedProfile = (() => {
    try {
      return JSON.parse(localStorage.getItem('userProfile') || '{}');
    } catch {
      return {};
    }
  })();

  const profileUserType = Number(
    profileInfo?.utype ??
    profileInfo?.usertype ??
    profileInfo?.userType ??
    storedProfile?.utype ??
    storedProfile?.usertype ??
    storedProfile?.userType ??
    0
  );

  const ownEmpId = getOwnEmployeeId(profileInfo) || getNumericEmployeeId(profileInfo, user);

  // Admin / Super Admin (1, 4, 12)
  const isAdmin =
    [1, 4, 12].includes(profileUserType) ||
    ownEmpId === 78 ||
    ownEmpId === 68 ||
    sessionRole.toLowerCase() === 'admin' ||
    sessionRole.toLowerCase() === 'administrator';

  // Ancillary Staff (7)
  const isAncillary =
    profileUserType === 7 ||
    sessionRole.toLowerCase().includes('ancillary');

  // Manager / Supervisor / SubAdmin (2, 13)
  const isManager =
    [2, 13].includes(profileUserType) ||
    sessionRole.toLowerCase().includes('manager') ||
    sessionRole.toLowerCase().includes('supervisor');

  // Clinician (sessiontype 2 or Clinicians role)
  const isClinician = sessiontype === 2 || sessionRole === 'Clinicians';

  // Strictly Employee: userType 3, or non-admin, non-ancillary, non-manager, non-clinician
  const isEmployee =
    !isAdmin &&
    !isAncillary &&
    !isManager &&
    !isClinician &&
    (profileUserType === 3 ||
      sessionRole.toLowerCase().includes('employee') ||
      sessionRole.toLowerCase().includes('member') ||
      profileUserType === 0);

  const [activeReport, setActiveReport] = useState<ReportItemDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Reports | HO Tracker';
  }, []);

  const visibleReports = useMemo(() => {
    if (isClinician) {
      return REPORTS_LIST.filter((rep) => rep.key === 'monthly_invoice');
    }
    if (isEmployee) {
      return REPORTS_LIST.filter((rep) => EMPLOYEE_REPORT_KEYS.includes(rep.key));
    }
    return REPORTS_LIST;
  }, [isClinician, isEmployee]);

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
          <h4 className="mb-0 text-dark fw-bold">
            {isEmployee ? 'My Reports' : 'Reports'}
          </h4>
          <hr className="my-3" />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card className="reports-card">
            <CardBody>
              <ol className="reports-simple-list">
                {visibleReports.map((rep) => (
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
