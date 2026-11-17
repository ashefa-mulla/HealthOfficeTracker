import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import {
  RHFInput,
  RHFSelect,
  SelectOption,
} from '@/Components/Common/Forms';
import { RootState } from '@/slices';
import { EmployeeAttendanceForm } from '@/types/employeeAttendance/employeeAttendance.schema';

interface EmployeeAttendanceFormInfoProps {
  onNavigateToAllowanceTab?: () => void;
  isEdit?: boolean;
  isViewMode?: boolean;
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

const EmployeeAttendanceFormInfo: React.FC<EmployeeAttendanceFormInfoProps> = ({
  onNavigateToAllowanceTab,
  isEdit = false,
  isViewMode: propIsViewMode,
}) => {
  const { dropdowns, selected } = useSelector(
    (state: RootState) => (state as any).EmployeeAttendance
  );

  const { watch, register, setValue } = useFormContext<EmployeeAttendanceForm>();
  const watchedEmpId = watch('empId');
  const currentEmpId = Number(watchedEmpId || selected?.empId || 0);

  const [searchParams] = useSearchParams();
  const isViewMode = propIsViewMode !== undefined ? propIsViewMode : searchParams.get('view') === '1';

  const watchedApproved = watch('isApproved');
  const isApproved = Boolean(
    watchedApproved !== undefined
      ? watchedApproved
      : (selected?.isApproved ?? selected?.isapproved ?? selected?.IsApproved ?? false)
  );

  const isLocked = isViewMode || isApproved;

  const employeeOptions = useMemo<SelectOption[]>(() => {
    const rawList = dropdowns?.employees || dropdowns?.employeeList || [];
    const list: SelectOption[] = rawList.map((e: any) => ({
      value: Number(e.id ?? e.ID ?? 0),
      label: e.name || e.fullname || e.Fullname || `Employee #${e.id}`,
    }));

    // If in edit mode and the selected employee is not in list yet, preserve it
    const currentEmpId = Number(selected?.empId || 0);
    if (currentEmpId > 0 && !list.some((o) => Number(o.value) === currentEmpId)) {
      const fallbackName =
        selected?.fullname ||
        selected?.Fullname ||
        selected?.employeeName ||
        `Employee #${currentEmpId}`;
      list.unshift({
        value: currentEmpId,
        label: fallbackName,
      });
    }

    return list;
  }, [dropdowns?.employees, dropdowns?.employeeList, selected]);

  const monthOptions = useMemo<SelectOption[]>(() => {
    return MONTH_NAMES.map((name, i) => ({
      value: i + 1,
      label: name,
    }));
  }, []);

  const yearOptions = useMemo<SelectOption[]>(() => {
    const curYear = new Date().getFullYear();
    const years = [curYear - 2, curYear - 1, curYear, curYear + 1, curYear + 2];
    return years.map((y) => ({
      value: y,
      label: String(y),
    }));
  }, []);

  return (
    <>
      <input type="hidden" {...register('isApproved')} />

      {/* Approval Status Banner with Approve Action Button (Only shown in Edit / View, HIDDEN on Add) */}
      {isEdit && (
        <div
          className={`p-3 rounded-3 mb-3 border d-flex align-items-center justify-content-between flex-wrap gap-2 ${
            isApproved ? 'bg-success-subtle border-success-subtle' : 'bg-light border'
          }`}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className={`avatar-xs rounded-circle d-flex align-items-center justify-content-center ${
                isApproved ? 'bg-success text-white' : 'bg-secondary text-white'
              }`}
            >
              <i className={`mdi ${isApproved ? 'mdi-check-decagram' : 'mdi-clock-outline'} font-size-16`}></i>
            </div>
            <div>
              <div className="fw-semibold text-dark">
                Status:{' '}
                {isApproved ? (
                  <span className="badge bg-success text-white ms-1">Approved</span>
                ) : (
                  <span className="badge bg-secondary text-white ms-1">Pending Approval</span>
                )}
              </div>
              <small className="text-muted">
                {isViewMode
                  ? isApproved
                    ? 'This attendance record is approved and locked (view-only).'
                    : 'This attendance record is pending approval (view-only).'
                  : isApproved
                  ? 'Attendance is approved and locked. Click "Approved" button to unlock and edit.'
                  : 'Click "Approve" button to verify and lock this attendance record.'}
              </small>
            </div>
          </div>

          <div>
            {isViewMode ? (
              // IN VIEW MODE: Non-clickable / disabled button (cannot enable or disable)
              isApproved ? (
                <button
                  type="button"
                  className="btn btn-sm btn-success d-flex align-items-center gap-1 shadow-sm px-3 py-2"
                  style={{ borderRadius: 8, cursor: 'default', pointerEvents: 'none' }}
                  disabled
                  title="Approved record is locked"
                >
                  <i className="mdi mdi-check-decagram font-size-16"></i>
                  <span className="fw-semibold">Approved</span>
                  <span className="badge bg-white text-success ms-1 font-size-10">Locked</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-3 py-2"
                  style={{ borderRadius: 8, cursor: 'default', pointerEvents: 'none' }}
                  disabled
                  title="Pending approval"
                >
                  <i className="mdi mdi-clock-outline font-size-16"></i>
                  <span className="fw-semibold">Pending Approval</span>
                </button>
              )
            ) : (
              // IN EDIT MODE: User can toggle between Approved (Locked) and Approve
              isApproved ? (
                <button
                  type="button"
                  className="btn btn-sm btn-success d-flex align-items-center gap-1 shadow-sm px-3 py-2"
                  style={{ borderRadius: 8 }}
                  onClick={() => setValue('isApproved', false, { shouldDirty: true, shouldValidate: true })}
                  title="Click to unlock and edit fields"
                >
                  <i className="mdi mdi-check-decagram font-size-16"></i>
                  <span className="fw-semibold">Approved</span>
                  <span className="badge bg-white text-success ms-1 font-size-10">Locked</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 px-3 py-2"
                  style={{ borderRadius: 8 }}
                  onClick={() => setValue('isApproved', true, { shouldDirty: true, shouldValidate: true })}
                  title="Click to approve and lock fields"
                >
                  <i className="mdi mdi-check-circle-outline font-size-16"></i>
                  <span className="fw-semibold">Approve</span>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {isEdit && currentEmpId > 0 && onNavigateToAllowanceTab && (
        <div className="d-flex align-items-center justify-content-between p-2 px-3 bg-light rounded-3 border mb-3">
          <div className="d-flex align-items-center gap-2 text-muted small">
            <i className="mdi mdi-cash-plus text-primary font-size-16"></i>
            <span>
              Manage monthly allowances for this employee in the <strong>Monthly Allowance</strong> tab.
            </span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-primary text-decoration-none p-0 fw-semibold"
            onClick={onNavigateToAllowanceTab}
          >
            Go to Monthly Allowance &rarr;
          </button>
        </div>
      )}

      <Row className="g-3 mb-3">
        <Col md={6} sm={12}>
          <RHFSelect<EmployeeAttendanceForm>
            name="empId"
            label="Employee"
            placeholder="-- Select Employee --"
            options={employeeOptions}
            required
            isDisabled={isLocked}
          />
        </Col>
        <Col md={3} sm={6}>
          <RHFSelect<EmployeeAttendanceForm>
            name="month"
            label="Month"
            placeholder="-- Select Month --"
            options={monthOptions}
            required
            isDisabled={isLocked}
          />
        </Col>
        <Col md={3} sm={6}>
          <RHFSelect<EmployeeAttendanceForm>
            name="year"
            label="Year"
            placeholder="-- Select Year --"
            options={yearOptions}
            required
            isDisabled={isLocked}
          />
        </Col>
      </Row>

      <Row className="g-3 mb-3">
        <Col md={6} sm={12}>
          <RHFInput<EmployeeAttendanceForm>
            name="workingDays"
            label="Total Working Days"
            type="number"
            placeholder="e.g. 26"
            required
            disabled={isLocked}
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeAttendanceForm>
            name="attendance"
            label="Attendance (Days Present)"
            type="number"
            placeholder="e.g. 24"
            required
            disabled={isLocked}
          />
        </Col>
      </Row>

      <div className="p-3 bg-light rounded-3 mb-3 border">
        <h6 className="fw-semibold text-muted mb-3" style={{ fontSize: '13px' }}>
          <i className="mdi mdi-calendar-remove-outline me-1"></i> Leave Breakdown (Days)
        </h6>
        <Row className="g-3">
          <Col md={4} sm={12}>
            <RHFInput<EmployeeAttendanceForm>
              name="pl"
              label="Paid Leave (PL)"
              type="number"
              placeholder="0"
              disabled={isLocked}
            />
          </Col>
          <Col md={4} sm={12}>
            <RHFInput<EmployeeAttendanceForm>
              name="cl"
              label="Casual Leave (CL)"
              type="number"
              placeholder="0"
              disabled={isLocked}
            />
          </Col>
          <Col md={4} sm={12}>
            <RHFInput<EmployeeAttendanceForm>
              name="sl"
              label="Sick Leave (SL)"
              type="number"
              placeholder="0"
              disabled={isLocked}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EmployeeAttendanceFormInfo;
