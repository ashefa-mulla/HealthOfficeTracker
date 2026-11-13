import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import {
  RHFInput,
  RHFSelect,
  SelectOption,
} from '@/Components/Common/Forms';
import { RootState } from '@/slices';
import { EmployeeAttendanceForm } from '@/types/employeeAttendance/employeeAttendance.schema';

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

const EmployeeAttendanceFormInfo: React.FC = () => {
  const { dropdowns, selected } = useSelector(
    (state: RootState) => (state as any).EmployeeAttendance
  );

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
      <Row className="g-3 mb-3">
        <Col md={6} sm={12}>
          <RHFSelect<EmployeeAttendanceForm>
            name="empId"
            label="Employee"
            placeholder="-- Select Employee --"
            options={employeeOptions}
            required
          />
        </Col>
        <Col md={3} sm={6}>
          <RHFSelect<EmployeeAttendanceForm>
            name="month"
            label="Month"
            placeholder="-- Select Month --"
            options={monthOptions}
            required
          />
        </Col>
        <Col md={3} sm={6}>
          <RHFSelect<EmployeeAttendanceForm>
            name="year"
            label="Year"
            placeholder="-- Select Year --"
            options={yearOptions}
            required
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
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeAttendanceForm>
            name="attendance"
            label="Attendance (Days Present)"
            type="number"
            placeholder="e.g. 24"
            required
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
            />
          </Col>
          <Col md={4} sm={12}>
            <RHFInput<EmployeeAttendanceForm>
              name="cl"
              label="Casual Leave (CL)"
              type="number"
              placeholder="0"
            />
          </Col>
          <Col md={4} sm={12}>
            <RHFInput<EmployeeAttendanceForm>
              name="sl"
              label="Sick Leave (SL)"
              type="number"
              placeholder="0"
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EmployeeAttendanceFormInfo;
