import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { useFormContext } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFFlatpickr,
  SelectOption,
} from "@/Components/Common/Forms";
import { LeaveForm } from "@/types/leave/leave.schema";
import { calcLeaveDays } from "@/types/leave/leave.mapper";
import { RootState } from "@/slices";
import { useAuthStore } from "@/store/useAuthStore";
import { isAdminUser } from "@/helpers/userHelper";

const ApplyLeavePersonalInfo: React.FC = () => {
  const { profileInfo } = useAuthStore();
  const isAdmin = isAdminUser(profileInfo);
  const { watch, setValue } = useFormContext<LeaveForm>();
  const { employeeList } = useSelector((state: RootState) => (state as any).Leave);

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  const employeeOptions: SelectOption[] = (employeeList || [])
    .filter((e: any) => e.id > 0)
    .map((e: any) => ({ value: e.id, label: e.name }));

  // Keep "Leaves" in sync with the selected date range (still editable, e.g. half day = 0.5)
  useEffect(() => {
    const days = calcLeaveDays(fromDate, toDate);
    if (days > 0) {
      setValue("leaves", days as any, { shouldValidate: true });
    }
  }, [fromDate, toDate, setValue]);

  return (
    <>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<LeaveForm>
            name="empId"
            label="Employee"
            placeholder="-- Select Employee --"
            options={employeeOptions}
            isDisabled={!isAdmin}
            required
          />
        </Col>
      </Row>

      <Row>
        <Col md={6} sm={12}>
          <RHFFlatpickr<LeaveForm>
            name="fromDate"
            label="From Date"
            mode="date"
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFFlatpickr<LeaveForm>
            name="toDate"
            label="To Date"
            mode="date"
            required
          />
        </Col>
      </Row>

      <Row>
        <Col md={6} sm={12}>
          <RHFInput<LeaveForm>
            name="leaves"
            label="Number of Days"
            placeholder="e.g. 1 or 0.5"
            required
          />
        </Col>
        <Col md={6} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<LeaveForm> name="isSickLeaves" label="Sick Leave" />
        </Col>
      </Row>
    </>
  );
};

export default ApplyLeavePersonalInfo;
