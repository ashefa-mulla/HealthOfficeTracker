import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import Select from 'react-select';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { EmployeeAttendanceListItem } from '@/types/employeeAttendance/employeeAttendance.types';
import UploadAttendanceModal from './UploadAttendanceModal';
import {
  fetchEmployeeAttendanceList,
  fetchEmployeeAttendanceDropdowns,
  removeEmployeeAttendance,
} from '@/slices/employeeAttendance/employeeAttendanceThunk';

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

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

const monthOptions = [
  { value: 0, label: 'All Months' },
  ...MONTH_NAMES.map((name, index) => ({
    value: index + 1,
    label: name,
  })),
];

const yearOptions = [
  { value: 0, label: 'All Years' },
  { value: currentYear + 1, label: String(currentYear + 1) },
  { value: currentYear, label: String(currentYear) },
  { value: currentYear - 1, label: String(currentYear - 1) },
  { value: currentYear - 2, label: String(currentYear - 2) },
  { value: currentYear - 3, label: String(currentYear - 3) },
];

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 38,
    fontSize: 13,
    borderRadius: 8,
    borderColor: state.isFocused ? '#0b4d9c' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(11, 77, 156, 0.12)' : 'none',
    '&:hover': { borderColor: '#0b4d9c' },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: 13,
    backgroundColor: state.isSelected ? '#0b4d9c' : state.isFocused ? '#eaf1fb' : '#fff',
    color: state.isSelected ? '#fff' : '#334155',
  }),
};

const EmployeeAttendanceList: React.FC = () => {
  document.title = 'Employee Attendance | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const {
    list,
    totalRecords,
    totalPages,
    loading,
    saving,
    dropdowns,
  } = useSelector((state: RootState) => (state as any).EmployeeAttendance);

  // Filter & Pagination State - Defaults to current month and year
  const [selectedEmpId, setSelectedEmpId] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize_Local, setPageSize_Local] = useState<number>(100);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  const employeeFilterOptions = useMemo(() => {
    const rawList = dropdowns?.employees || dropdowns?.employeeList || [];
    return [
      { value: 0, label: 'All Employees' },
      ...rawList.map((e: any) => ({
        value: Number(e.id ?? e.ID ?? 0),
        label: e.name || e.fullname || e.Fullname || `Employee #${e.id}`,
      })),
    ];
  }, [dropdowns?.employees, dropdowns?.employeeList]);

  const loadData = useCallback(
    (page: number, size: number, empId: number, m: number, y: number, search: string) => {
      const selectedEmp = (dropdowns?.employees || dropdowns?.employeeList || []).find(
        (e: any) => Number(e.id ?? e.ID) === empId
      );
      const resolvedSearch = search.trim()
        ? search.trim()
        : empId > 0 && selectedEmp?.name
          ? selectedEmp.name
          : undefined;

      dispatch(
        fetchEmployeeAttendanceList({
          pageNumber: page,
          pageSize: size,
          empId: empId > 0 ? empId : undefined,
          month: m > 0 ? m : undefined,
          year: y > 0 ? y : undefined,
          search: resolvedSearch,
        })
      );
    },
    [dispatch, dropdowns?.employees, dropdowns?.employeeList]
  );

  // Initial load with current month and year
  useEffect(() => {
    dispatch(fetchEmployeeAttendanceDropdowns());
    loadData(pageNumber, pageSize_Local, selectedEmpId, selectedMonth, selectedYear, searchTerm);
  }, [dispatch, pageNumber, pageSize_Local, selectedEmpId, selectedMonth, selectedYear, searchTerm]);

  // Handle server-side query changes from TableContainer (search, pagination, pageSize)
  const handleServerChange = (query: any) => {
    if (query.search !== undefined && query.search !== searchTerm) {
      setSearchTerm(query.search);
      setPageNumber(1);
      return;
    }
    if (query.pageSize !== undefined && query.pageSize !== pageSize_Local) {
      setPageSize_Local(query.pageSize);
      setPageNumber(1);
      return;
    }
    if (query.page !== undefined && query.page !== pageNumber) {
      setPageNumber(query.page);
    }
  };

  const handleApplyFilter = () => {
    setPageNumber(1);
    loadData(1, pageSize_Local, selectedEmpId, selectedMonth, selectedYear, searchTerm);
  };

  const handleResetFilter = () => {
    setSelectedEmpId(0);
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setSearchTerm('');
    setPageNumber(1);
    loadData(1, pageSize_Local, 0, currentMonth, currentYear, '');
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeEmployeeAttendance(selectedDeleteId)).unwrap();
      loadData(pageNumber, pageSize_Local, selectedEmpId, selectedMonth, selectedYear, searchTerm);
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<EmployeeAttendanceListItem, any>[]>(
    () => [
      {
        header: 'Employee',
        accessorKey: 'fullname',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const name = row.fullname || row.Fullname || row.employeeName || row.empName || `Employee #${row.employeeID || row.empId || ''}`;
          return (
            <span style={{ fontWeight: 600, color: '#0f172a' }}>
              {name}
            </span>
          );
        },
      },
      {
        header: 'Month',
        accessorKey: 'month',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          if (row.monthName || row.MonthName) {
            return row.monthName || row.MonthName;
          }
          const m = Number(row.month || row.Month || 0);
          return m >= 1 && m <= 12 ? MONTH_NAMES[m - 1] : '-';
        },
      },
      {
        header: 'Year',
        accessorKey: 'year',
        enableColumnFilter: false,
        cell: (info) => info.row.original.year ?? info.row.original.Year ?? '-',
      },
      {
        header: 'Working Days',
        accessorKey: 'working_Days',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val = row.working_Days ?? row.Working_Days ?? row.workingDays ?? 0;
          return <span className="badge bg-light text-dark border px-2 py-1">{val}</span>;
        },
      },
      {
        header: 'Attendance',
        accessorKey: 'attendance',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val = row.attendance ?? row.Attendance ?? 0;
          return (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fw-semibold">
              {val}
            </span>
          );
        },
      },
      {
        header: 'PL',
        accessorKey: 'pl',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val = row.pl ?? row.PL ?? 0;
          return <span className="text-muted">{val}</span>;
        },
      },
      {
        header: 'CL',
        accessorKey: 'cl',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val = row.cl ?? row.CL ?? 0;
          return <span className="text-muted">{val}</span>;
        },
      },
      {
        header: 'SL',
        accessorKey: 'sl',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val = row.sl ?? row.SL ?? 0;
          return <span className="text-muted">{val}</span>;
        },
      },
      {
        header: 'Total Leaves',
        accessorKey: 'totalLeaves',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val =
            row.totalLeaves ??
            row.TotalLeaves ??
            (Number(row.pl || row.PL || 0) + Number(row.cl || row.CL || 0) + Number(row.sl || row.SL || 0));
          return (
            <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">
              {val}
            </span>
          );
        },
      },
      {
        header: 'LOP Days',
        accessorKey: 'lopDays',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val =
            row.lopDays ??
            row.LOPDays ??
            Math.max(
              0,
              Number(row.working_Days || row.Working_Days || row.workingDays || 0) -
              Number(row.attendance || row.Attendance || 0)
            );
          return (
            <span
              className={`badge px-2 py-1 ${Number(val) > 0
                ? 'bg-danger-subtle text-danger border border-danger-subtle'
                : 'bg-light text-muted border'
                }`}
            >
              {val}
            </span>
          );
        },
      },
      {
        header: 'Paid Days',
        accessorKey: 'paidDays',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const val =
            row.paidDays ??
            row.PaidDays ??
            Number(row.attendance || row.Attendance || 0) +
            Number(row.pl || row.PL || 0) +
            Number(row.cl || row.CL || 0) +
            Number(row.sl || row.SL || 0);
          return (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-bold">
              {val}
            </span>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'isApproved',
        enableColumnFilter: false,
        cell: (info) => {
          const row = info.row.original;
          const isApp = Boolean(row.isApproved ?? row.isapproved ?? row.IsApproved);
          return isApp ? (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
              <i className="mdi mdi-check-circle-outline me-1"></i>Approved
            </span>
          ) : (
            <span className="badge bg-secondary-subtle text-muted border px-2 py-1">
              Pending
            </span>
          );
        },
      },
      {
        header: 'Actions',
        accessorKey: 'id',
        enableColumnFilter: false,
        enableSorting: false,
        cell: (info) => {
          const row = info.row.original;
          const id = Number(row.id ?? row.ID ?? 0);
          const isApp = Boolean(
            row.isApproved ??
            row.isapproved ??
            row.IsApproved ??
            row.Isapproved ??
            row.is_approved
          );

          if (isApp) {
            return (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to={`/area/employeeattendance/edit/${id}?view=1`}
                  className="btn btn-sm btn-subtle-secondary"
                  title="View Attendance (Approved)"
                  style={{ padding: '4px 8px' }}
                >
                  <i className="mdi mdi-eye font-size-14 align-middle"></i>
                </Link>
                <span className="text-muted small" title="Attendance is approved and locked">
                  <i className="mdi mdi-lock-outline font-size-14 align-middle"></i>
                </span>
              </div>
            );
          }

          return (
            <div className="d-flex align-items-center gap-2">
              <Link
                to={`/area/employeeattendance/edit/${id}`}
                className="btn btn-sm btn-subtle-primary"
                title="Edit Attendance"
                style={{ padding: '4px 8px' }}
              >
                <i className="mdi mdi-pencil font-size-14 align-middle"></i>
              </Link>
              <button
                type="button"
                className="btn btn-sm btn-subtle-danger"
                title="Delete Attendance"
                style={{ padding: '4px 8px' }}
                onClick={() => {
                  setSelectedDeleteId(id);
                  setDeleteModal(true);
                }}
              >
                <i className="mdi mdi-delete font-size-14 align-middle"></i>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        {/* Page Header */}
        <div className="page-header-box d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="page-title-main">Employee Attendance</h1>
            <p className="breadcrumb-nav-custom mt-1">
              <Link to="/dashboard">Area</Link> / <span>Employee Attendance</span>
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-success d-flex align-items-center gap-1 shadow-sm"
              style={{ minHeight: 38, borderRadius: 20, padding: '6px 18px', fontWeight: 600 }}
              onClick={() => setUploadModalOpen(true)}
              title="Upload Attendance Excel"
            >
              <i className="mdi mdi-file-excel font-size-18"></i>
              <span>Upload Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <Card className="border-0 shadow-sm rounded-3 mb-2">
          <CardBody className="p-3">
            <Row className="g-3 align-items-end">
              <Col lg={4} md={4} sm={12}>
                <label className="form-label small fw-semibold text-muted mb-1">
                  <i className="mdi mdi-account-outline me-1"></i> Employee
                </label>
                <Select
                  options={employeeFilterOptions}
                  value={
                    employeeFilterOptions.find((o) => o.value === selectedEmpId) ||
                    employeeFilterOptions[0]
                  }
                  onChange={(o: any) => setSelectedEmpId(o?.value ?? 0)}
                  placeholder="All Employees"
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                />
              </Col>
              <Col lg={3} md={3} sm={6}>
                <label className="form-label small fw-semibold text-muted mb-1">
                  <i className="mdi mdi-calendar-month-outline me-1"></i> Month
                </label>
                <Select
                  options={monthOptions}
                  value={monthOptions.find((o) => o.value === selectedMonth) || monthOptions[0]}
                  onChange={(o: any) => setSelectedMonth(o?.value ?? 0)}
                  placeholder="Select Month"
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                />
              </Col>
              <Col lg={2} md={2} sm={6}>
                <label className="form-label small fw-semibold text-muted mb-1">
                  <i className="mdi mdi-calendar-outline me-1"></i> Year
                </label>
                <Select
                  options={yearOptions}
                  value={yearOptions.find((o) => o.value === selectedYear) || yearOptions[0]}
                  onChange={(o: any) => setSelectedYear(o?.value ?? 0)}
                  placeholder="Select Year"
                  menuPortalTarget={document.body}
                  styles={selectStyles}
                />
              </Col>
              <Col lg={3} md={3} sm={12} className="d-flex align-items-end gap-2">
                <div className="activity-filter-item activity-filter-item--action">
                  <button
                    type="button"
                    className="btn-activity-print d-flex align-items-center justify-content-center"
                    onClick={handleApplyFilter}
                  >
                    <i className="mdi mdi-magnify me-1"></i> Search
                  </button>
                </div>
                {/* <button
                  type="button"
                  className="btn btn-outline-success d-flex align-items-center justify-content-center"
                  style={{ minHeight: 38, borderRadius: 20, padding: '0 16px', fontWeight: 500 }}
                  onClick={() => setUploadModalOpen(true)}
                  title="Upload Attendance Excel / CSV"
                >
                  <i className="mdi mdi-file-excel me-1 font-size-16"></i> Upload Excel
                </button> */}
                {/* <Button
                  color="primary"
                  className="btn-form-action-save flex-grow-1"
                  onClick={handleApplyFilter}
                  disabled={loading}
                  style={{ minHeight: 38 }}
                >
                  <i className="mdi mdi-magnify me-1"></i> Search
                </Button> */}
                {/* <Button
                  color="light"
                  className="btn-form-action-back"
                  onClick={handleResetFilter}
                  disabled={loading}
                  style={{ minHeight: 38 }}
                  title="Reset Filters"
                >
                  <i className="mdi mdi-refresh"></i>
                </Button> */}
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Attendance Table */}
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={false}
          isColumnFilter={false}
          searchPlaceholder="Search employee, month, attendance..."
          searchAddLayout={true}
          addButtonInFilterRow={true}
          isAddButton={true}
          buttonName="+ Add Attendance"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/employeeattendance/create')}
          // customRightHeader={
          //   <button
          //     type="button"
          //     className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
          //     style={{ borderRadius: 20, padding: '6px 14px', fontWeight: 500 }}
          //     onClick={() => setUploadModalOpen(true)}
          //     title="Upload Attendance Excel"
          //   >
          //     <i className="mdi mdi-file-excel font-size-15"></i> Upload Excel
          //   </button>
          // }
          isServerSidePagination={true}
          serverSideTotalRecords={totalRecords}
          serverSideTotalPages={totalPages}
          serverSideCurrentPage={pageNumber}
          serverSidePageSize={pageSize_Local}
          onServerChange={handleServerChange}
          emptyMessage="No employee attendance records found."
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleConfirmDelete}
        onCloseClick={() => {
          setDeleteModal(false);
          setSelectedDeleteId(null);
        }}
        loading={saving}
      />

      {/* Upload Attendance Excel Modal */}
      <UploadAttendanceModal
        isOpen={uploadModalOpen}
        toggle={() => setUploadModalOpen(false)}
        onSuccess={() => {
          loadData(pageNumber, pageSize_Local, selectedEmpId, selectedMonth, selectedYear, searchTerm);
        }}
      />
    </React.Fragment>
  );
};

export default EmployeeAttendanceList;
