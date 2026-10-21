import React from 'react';
import { Row, Col, Alert } from 'reactstrap';
import { useFormContext } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  SelectOption,
} from '@/Components/Common/Forms';
import { ActivityEditForm } from '@/types/activity/activity.schema';
import {
  TrackerProjectItem,
  TrackerSubProjectItem,
  TrackerSubProjectCategoryItem,
} from '@/types/top10task/top10task.types';

export interface ActivityPersonalInfoProps {
  projectList: TrackerProjectItem[];
  subprojectList: TrackerSubProjectItem[];
  subprojectCategoryList: TrackerSubProjectCategoryItem[];
  employeeList: any[];
  showAdminField: boolean;
  formError?: string;
  onProjectChange?: (projectId: number) => void;
  onSubProjectChange?: (subProjectId: number) => void;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

const formatDuration = (start: Date, end: Date) => {
  const totalSec = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
  const h = Math.floor(totalSec / 3600);
  return `${pad2(h)}:${pad2(Math.floor((totalSec % 3600) / 60))}:${pad2(totalSec % 60)}`;
};

const formatDisplay = (d: Date) => {
  const h = d.getHours();
  return `${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}/${d.getFullYear()} ${pad2(h % 12 || 12)}:${pad2(d.getMinutes())} ${h >= 12 ? 'PM' : 'AM'}`;
};

const ActivityPersonalInfo: React.FC<ActivityPersonalInfoProps> = ({
  projectList,
  subprojectList,
  subprojectCategoryList,
  employeeList,
  showAdminField,
  formError,
  onProjectChange,
  onSubProjectChange,
}) => {
  const { watch, setValue } = useFormContext<ActivityEditForm>();

  const startTimeValue = watch('startTime');
  const endTimeValue = watch('endTime');

  // Admin edits start/end time: keep display text and duration in sync
  const handleTimeChange = (field: 'startTime' | 'endTime', dates: Date[]) => {
    const picked = dates[0];
    if (!picked) return;
    const start = field === 'startTime' ? picked : new Date(startTimeValue || picked);
    const end = field === 'endTime' ? picked : new Date(endTimeValue || picked);
    setValue(field, picked.toISOString() as any, { shouldDirty: true });
    setValue(
      field === 'startTime' ? 'startTimeDisplay' : 'endTimeDisplay',
      formatDisplay(picked) as any
    );
    setValue('duration', formatDuration(start, end) as any);
  };

  const timePickerOptions = {
    enableTime: true,
    enableSeconds: true,
    time_24hr: false,
    dateFormat: 'm/d/Y h:i:S K',
    allowInput: true,
  };

  const selectedProject = watch('projectId');
  const selectedSubProject = watch('subProjectId');

  const employeeOptions: SelectOption[] = (employeeList || []).map((emp: any) => ({
    value: emp.id,
    label: emp.name || emp.fullname || `Employee #${emp.id}`,
  }));

  const projectOptions: SelectOption[] = (projectList || []).map((p: any) => ({
    value: p.id,
    label: p.project,
  }));

  const subProjectOptions: SelectOption[] = (subprojectList || []).map((sp: any) => ({
    value: sp.id,
    label: sp.subcategory,
  }));

  const categoryOptions: SelectOption[] = (subprojectCategoryList || []).map((cat: any) => ({
    value: cat.id,
    label: cat.subcategory,
  }));

  const handleProjectChange = (val: any) => {
    const projectId = val ? Number(val) : 0;
    setValue('subProjectId', 0 as any, { shouldValidate: true });
    setValue('subProjectCategoryId', 0 as any, { shouldValidate: true });
    onProjectChange?.(projectId);
  };

  const handleSubProjectChange = (val: any) => {
    const subProjectId = val ? Number(val) : 0;
    setValue('subProjectCategoryId', 0 as any, { shouldValidate: true });
    onSubProjectChange?.(subProjectId);
  };

  return (
    <>
      <Row className="g-3">
        {/* Employee Name (for Admin) */}
        {showAdminField && (
          <Col md={6}>
            <RHFSelect<ActivityEditForm>
              name="employeeid"
              label="Name"
              placeholder="Select Employee"
              options={employeeOptions}
              required
            />
          </Col>
        )}

        {/* Client (Project) */}
        <Col md={6}>
          <RHFSelect<ActivityEditForm>
            name="projectId"
            label="Client"
            placeholder="Select Client"
            options={projectOptions}
            onChange={handleProjectChange}
            required
          />
        </Col>

        {/* Project (SubProject) */}
        <Col md={6}>
          <RHFSelect<ActivityEditForm>
            name="subProjectId"
            label="Project"
            placeholder="Select Project"
            options={subProjectOptions}
            isDisabled={!selectedProject}
            onChange={handleSubProjectChange}
            required
          />
        </Col>

        {/* Category (SubProjectCategory) */}
        <Col md={6}>
          <RHFSelect<ActivityEditForm>
            name="subProjectCategoryId"
            label="Category"
            placeholder="Select Category"
            options={categoryOptions}
            isDisabled={!selectedSubProject}
          />
        </Col>

        {/* Activity */}
        <Col md={6}>
          <RHFInput<ActivityEditForm>
            name="activity"
            label="Activity"
            placeholder="Activity"
            required
          />
        </Col>

        {/* Start Time (editable by admin) */}
        <Col md={6}>
          {showAdminField ? (
            <>
              <label className="form-label">Start Time</label>
              <Flatpickr
                className="form-control"
                options={timePickerOptions}
                value={startTimeValue ? new Date(startTimeValue) : undefined}
                onChange={(dates: Date[]) => handleTimeChange('startTime', dates)}
              />
            </>
          ) : (
            <RHFInput<ActivityEditForm>
              name="startTimeDisplay"
              label="Start Time"
              disabled={true}
            />
          )}
        </Col>

        {/* End Time (editable by admin) */}
        <Col md={6}>
          {showAdminField ? (
            <>
              <label className="form-label">End Time</label>
              <Flatpickr
                className="form-control"
                options={timePickerOptions}
                value={endTimeValue ? new Date(endTimeValue) : undefined}
                onChange={(dates: Date[]) => handleTimeChange('endTime', dates)}
              />
            </>
          ) : (
            <RHFInput<ActivityEditForm>
              name="endTimeDisplay"
              label="End Time"
              disabled={true}
            />
          )}
        </Col>

        {/* Duration (Non-editable) */}
        <Col md={6}>
          <RHFInput<ActivityEditForm>
            name="duration"
            label="Duration"
            disabled={true}
          />
        </Col>

        {/* Checkboxes: Invoice & Is Admin */}
        <Col md={3} className="d-flex align-items-center pt-3">
          <RHFCheckBox<ActivityEditForm>
            name="activeInvoice"
            label="Invoice"
          />
        </Col>

        <Col md={3} className="d-flex align-items-center pt-3">
          <RHFCheckBox<ActivityEditForm>
            name="isAdmin"
            label="Is Admin"
          />
        </Col>

        {/* Error Alert Banner */}
        {formError && (
          <Col md={12}>
            <Alert color="danger" className="py-2 mb-0">
              {formError}
            </Alert>
          </Col>
        )}
      </Row>
    </>
  );
};

export default ActivityPersonalInfo;
