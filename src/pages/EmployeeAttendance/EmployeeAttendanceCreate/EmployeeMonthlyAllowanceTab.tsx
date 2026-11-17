import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Badge,
  Table,
  Input,
} from 'reactstrap';
import {
  AllowanceMasterModel,
  EmployeeMonthlyAllowanceModel,
} from '@/types/monthlyAllowance/monthlyAllowance.types';
import monthlyAllowanceService from '@/services/monthlyAllowanceService';
import toastService from '@/services/toastService';
import MonthlyAllowanceModal from './MonthlyAllowanceModal';
import DeleteModal from '@/Components/Common/DeleteModal';

interface EmployeeMonthlyAllowanceTabProps {
  employeeId: number;
  employeeName?: string;
  defaultMonth?: number;
  defaultYear?: number;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const EmployeeMonthlyAllowanceTab: React.FC<EmployeeMonthlyAllowanceTabProps> = ({
  employeeId,
  employeeName,
  defaultMonth,
  defaultYear,
}) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [allowances, setAllowances] = useState<EmployeeMonthlyAllowanceModel[]>([]);
  const [masterAllowances, setMasterAllowances] = useState<AllowanceMasterModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [filterMonth, setFilterMonth] = useState<number>(defaultMonth || currentMonth);
  const [filterYear, setFilterYear] = useState<number>(defaultYear || currentYear);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedAllowance, setSelectedAllowance] = useState<EmployeeMonthlyAllowanceModel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Load Allowance Master on mount
  useEffect(() => {
    monthlyAllowanceService
      .getMonthlyAllowanceMasterList()
      .then((masters) => {
        setMasterAllowances(masters);
      })
      .catch((err) => {
        console.error('Failed to load allowance master list:', err);
      });
  }, []);

  const loadAllowances = useCallback(async () => {
    if (!employeeId || employeeId <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const list = await monthlyAllowanceService.getMonthlyAllowancesByEmpId(employeeId, {
        month: filterMonth > 0 ? filterMonth : undefined,
        year: filterYear > 0 ? filterYear : undefined,
      });
      setAllowances(list);
    } catch (err: any) {
      console.error('Failed to load monthly allowances:', err);
      toastService.error(err?.message || 'Failed to load monthly allowances.');
    } finally {
      setLoading(false);
    }
  }, [employeeId, filterMonth, filterYear]);

  useEffect(() => {
    loadAllowances();
  }, [loadAllowances]);

  // Client-side search filtering
  const filteredAllowances = useMemo(() => {
    if (!searchTerm.trim()) return allowances;
    const term = searchTerm.toLowerCase().trim();
    return allowances.filter((item) => {
      const name = (item.allowanceName || item.AllowanceName || '').toLowerCase();
      const code = (item.allowanceCode || item.AllowanceCode || '').toLowerCase();
      const type = (item.allowanceType || item.AllowanceType || '').toLowerCase();
      const amt = String(item.amount ?? item.Amount ?? '');
      return (
        name.includes(term) ||
        code.includes(term) ||
        type.includes(term) ||
        amt.includes(term)
      );
    });
  }, [allowances, searchTerm]);

  // Summary statistics
  const totalAmount = useMemo(() => {
    return filteredAllowances.reduce((acc, curr) => {
      const isAct =
        curr.isActive !== undefined
          ? Boolean(curr.isActive)
          : curr.IsActive !== undefined
          ? Boolean(curr.IsActive)
          : true;
      if (isAct) {
        return acc + Number(curr.amount ?? curr.Amount ?? 0);
      }
      return acc;
    }, 0);
  }, [filteredAllowances]);

  const handleOpenAddModal = () => {
    setSelectedAllowance(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: EmployeeMonthlyAllowanceModel) => {
    const aId = Number(
      item.allowanceId ??
      item.AllowanceId ??
      item.AllowanceID ??
      item.allowanceID ??
      0
    );
    const m = Number(
      item.month ??
      item.Month ??
      (filterMonth > 0 ? filterMonth : (defaultMonth || currentMonth))
    );
    const y = Number(
      item.year ??
      item.Year ??
      (filterYear > 0 ? filterYear : (defaultYear || currentYear))
    );
    setSelectedAllowance({
      ...item,
      id: Number(item.id ?? item.Id ?? item.ID ?? 0),
      allowanceId: aId,
      month: m,
      year: y,
      amount: Number(item.amount ?? item.Amount ?? 0),
      empId: Number(item.empId ?? item.EmpId ?? item.EmpID ?? employeeId),
    });
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await monthlyAllowanceService.deleteMonthlyAllowance(deleteId);
      toastService.success('Monthly allowance deleted successfully.');
      setDeleteModalOpen(false);
      setDeleteId(null);
      loadAllowances();
    } catch (err: any) {
      console.error('Failed to delete monthly allowance:', err);
      toastService.error(err?.message || 'Failed to delete monthly allowance.');
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount?: number | null): string => {
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return '₹0.00';
    }
    return `₹${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  if (!employeeId || employeeId <= 0) {
    return (
      <div className="text-center py-5">
        <div className="avatar-md mx-auto mb-3">
          <div className="avatar-title bg-light text-primary rounded-circle font-size-24">
            <i className="mdi mdi-information-outline"></i>
          </div>
        </div>
        <h5 className="text-dark fw-bold">Select Employee First</h5>
        <p className="text-muted" style={{ maxWidth: 450, margin: '0 auto' }}>
          Please select an employee in the Attendance Details tab first before managing monthly allowances.
        </p>
      </div>
    );
  }

  return (
    <div className="employee-monthly-allowance-tab">
      {/* Top Controls & Summary Cards */}
      <Row className="mb-4 g-3 align-items-center">
        <Col lg={9} md={6}>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Input
                type="text"
                placeholder="Search allowance name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control-sm"
              />
            </div>
            {searchTerm && (
              <Button
                color="light"
                size="sm"
                onClick={() => setSearchTerm('')}
                title="Clear Search"
              >
                <i className="mdi mdi-close"></i>
              </Button>
            )}
          </div>
        </Col>

        {/* <Col lg={5} md={6}>
          <div className="d-flex align-items-center gap-2">
            <div style={{ minWidth: 130 }}>
              <Input
                type="select"
                className="form-select-sm"
                value={filterMonth}
                onChange={(e) => setFilterMonth(Number(e.target.value))}
              >
                <option value="0">All Months</option>
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </Input>
            </div>

            <div style={{ minWidth: 110 }}>
              <Input
                type="select"
                className="form-select-sm"
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Input>
            </div>

            <Button
              color="light"
              size="sm"
              onClick={loadAllowances}
              title="Refresh Allowances"
            >
              <i className="mdi mdi-refresh"></i>
            </Button>
          </div>
        </Col> */}

        <Col lg={3} className="text-lg-end">
          <Button color="primary" size="sm" onClick={handleOpenAddModal} className="d-inline-flex align-items-center gap-1 shadow-sm">
            <i className="mdi mdi-plus font-size-14"></i>
            <span>Add Monthly Allowance</span>
          </Button>
        </Col>
      </Row>

      {/* Summary KPI Cards */}
      {/* <Row className="g-3 mb-4">
        <Col sm={6} md={4}>
          <Card className="border shadow-none mb-0 bg-light-subtle">
            <CardBody className="p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small fw-medium">Allowances Count</div>
                  <h4 className="fw-bold mb-0 text-dark mt-1">{filteredAllowances.length}</h4>
                </div>
                <div className="avatar-xs">
                  <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                    <i className="mdi mdi-format-list-bulleted font-size-16"></i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col sm={6} md={4}>
          <Card className="border shadow-none mb-0 bg-light-subtle">
            <CardBody className="p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small fw-medium">Active Total Allowance</div>
                  <h4 className="fw-bold mb-0 text-success mt-1">{formatCurrency(totalAmount)}</h4>
                </div>
                <div className="avatar-xs">
                  <div className="avatar-title bg-success-subtle text-success rounded-circle">
                    <i className="mdi mdi-cash font-size-16"></i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col sm={12} md={4}>
          <Card className="border shadow-none mb-0 bg-light-subtle">
            <CardBody className="p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small fw-medium">Target Period</div>
                  <h6 className="fw-bold mb-0 text-dark mt-1">
                    {filterMonth > 0 ? `${MONTH_NAMES[filterMonth - 1]} ${filterYear}` : `All Months of ${filterYear}`}
                  </h6>
                </div>
                <div className="avatar-xs">
                  <div className="avatar-title bg-info-subtle text-info rounded-circle">
                    <i className="mdi mdi-calendar-clock font-size-16"></i>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row> */}

      {/* Allowances Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-2 text-muted fw-medium">Loading allowances...</p>
        </div>
      ) : filteredAllowances.length === 0 ? (
        <div className="text-center py-5 border rounded-3 bg-light-subtle">
          <div className="avatar-md mx-auto mb-3">
            <div className="avatar-title bg-light text-muted rounded-circle font-size-24">
              <i className="mdi mdi-cash-multiple"></i>
            </div>
          </div>
          <h5 className="text-dark fw-bold">No Monthly Allowances Found</h5>
          <p className="text-muted mb-3" style={{ maxWidth: 420, margin: '0 auto' }}>
            {searchTerm
              ? 'No monthly allowances matched your search filter.'
              : 'No allowances have been configured for this employee in the selected period.'}
          </p>
          <Button color="primary" size="sm" onClick={handleOpenAddModal}>
            <i className="mdi mdi-plus me-1"></i> Add Monthly Allowance
          </Button>
        </div>
      ) : (
        <div className="table-responsive">
          <Table className="table align-middle table-nowrap table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Allowance</th>
                <th>Type</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ width: '120px' }} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAllowances.map((item, index) => {
                const id = Number(item.id ?? item.Id ?? item.ID ?? 0);
                const aId = Number(
                  item.allowanceId ??
                  item.AllowanceId ??
                  item.AllowanceID ??
                  item.allowanceID ??
                  0
                );
                const master = masterAllowances.find((mItem) => Number(mItem.id ?? mItem.Id ?? 0) === aId);
                const aName = item.allowanceName || item.AllowanceName || master?.allowanceName || master?.AllowanceName || 'Allowance';
                const aCode = item.allowanceCode || item.AllowanceCode || master?.allowanceCode || master?.AllowanceCode;
                const aType = item.allowanceType || item.AllowanceType || master?.allowanceType || master?.AllowanceType || 'Standard';
                const m = Number(
                  item.month ??
                  item.Month ??
                  (filterMonth > 0 ? filterMonth : (defaultMonth || currentMonth))
                );
                const y = Number(
                  item.year ??
                  item.Year ??
                  (filterYear > 0 ? filterYear : (defaultYear || currentYear))
                );
                const amt = Number(item.amount ?? item.Amount ?? 0);
                const isAct =
                  item.isActive !== undefined
                    ? Boolean(item.isActive)
                    : item.IsActive !== undefined
                    ? Boolean(item.IsActive)
                    : true;

                return (
                  <tr key={id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td>
                      <div className="fw-semibold text-dark">{aName}</div>
                      {aCode && (
                        <span className="badge bg-secondary-subtle text-muted" style={{ fontSize: '11px' }}>
                          {aCode}
                        </span>
                      )}
                    </td>
                    <td>
                      <Badge color="info" className="badge-soft-info">
                        {aType}
                      </Badge>
                    </td>
                    <td>
                      <span className="fw-medium text-dark">
                        {m >= 1 && m <= 12 ? MONTH_NAMES[m - 1] : `Month ${m}`}, {y}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-success font-size-14">
                        {formatCurrency(amt)}
                      </span>
                    </td>
                    <td>
                      {isAct ? (
                        <Badge color="success" className="badge-soft-success">
                          Active
                        </Badge>
                      ) : (
                        <Badge color="danger" className="badge-soft-danger">
                          Inactive
                        </Badge>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <Button
                          color="light"
                          size="sm"
                          className="btn-icon"
                          title="Edit Allowance"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          <i className="mdi mdi-pencil font-size-14 text-primary"></i>
                        </Button>
                        <Button
                          color="light"
                          size="sm"
                          className="btn-icon"
                          title="Delete Allowance"
                          onClick={() => handleOpenDeleteModal(id)}
                        >
                          <i className="mdi mdi-trash-can-outline font-size-14 text-danger"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add / Edit Modal */}
      <MonthlyAllowanceModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        onSuccess={loadAllowances}
        allowanceItem={selectedAllowance}
        empId={employeeId}
        defaultMonth={filterMonth > 0 ? filterMonth : defaultMonth || currentMonth}
        defaultYear={filterYear > 0 ? filterYear : defaultYear || currentYear}
        masterAllowances={masterAllowances}
        employeeName={employeeName}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModalOpen}
        onDeleteClick={handleConfirmDelete}
        onCloseClick={() => {
          setDeleteModalOpen(false);
          setDeleteId(null);
        }}
        loading={deleting}
      />
    </div>
  );
};

export default EmployeeMonthlyAllowanceTab;
