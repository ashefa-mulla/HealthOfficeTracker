import React from 'react';
import { Row, Col, Alert, Label } from 'reactstrap';
import { useFormContext } from 'react-hook-form';
import FlatpickrInput from '@/Components/Common/FlatpickrInput';
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  SelectOption,
} from '@/Components/Common/Forms';
import { ActivityEditForm } from '@/types/activity/activity.schema';
import { parseSafeDate, formatLocalDateToIso } from '@/helpers/dateHelper';
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

const labelStyle = { fontSize: '12px', fontWeight: 500 };

const timePickerOptions = {
  enableTime: true,
  time_24hr: false,
  minuteIncrement: 1,
  dateFormat: 'm/d/Y G:i K',
  allowInput: true,
};

const SectionTitle: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="activity-section-title">
    <i className={`mdi ${icon}`}></i>
    {children}
  </div>
);

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
  const startTimeDisplay = watch('startTimeDisplay');
  const endTimeDisplay = watch('endTimeDisplay');
  const duration = watch('duration');

  // Admin edits start/end time: keep display text and duration in sync
  const handleTimeChange = (field: 'startTime' | 'endTime', dates: Date[]) => {
    const picked = dates[0];
    if (!picked) return;
    const start = field === 'startTime' ? picked : parseSafeDate(startTimeValue) || picked;
    const end = field === 'endTime' ? picked : parseSafeDate(endTimeValue) || picked;
    setValue(field, formatLocalDateToIso(picked) as any, { shouldDirty: true });
    setValue(
      field === 'startTime' ? 'startTimeDisplay' : 'endTimeDisplay',
      formatDisplay(picked) as any
    );
    setValue('duration', formatDuration(start, end) as any);
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

  // Start / End time: date-time picker for admin, read-only value for everyone else
  const renderTimeField = (
    field: 'startTime' | 'endTime',
    label: string,
    value: string | null | undefined,
    display: string
  ) => (
    <div className="mb-3">
      <Label style={labelStyle}>{label}</Label>
      {showAdminField ? (
        <FlatpickrInput
          className="form-control fp-small"
          style={{ fontSize: '12px' }}
          options={timePickerOptions}
          value={value || undefined}
          onChange={(dates: Date[]) => handleTimeChange(field, dates)}
          placeholder="MM/DD/YYYY hh:mm AM/PM"
          icon="calendar"
        />
      ) : (
        <div className="activity-time-readonly">
          <i className="mdi mdi-calendar-clock-outline"></i>
          {display || '-'}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Task details */}
      <SectionTitle icon="mdi-clipboard-text-outline">Task Details</SectionTitle>
      <Row className="gx-3">
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
        <Col md={12}>
          <RHFInput<ActivityEditForm>
            name="activity"
            label="Activity"
            placeholder="What was worked on?"
            required
          />
        </Col>
      </Row>

      {/* Time log */}
      <SectionTitle icon="mdi-clock-outline">Time Log</SectionTitle>
      <div className="activity-time-panel">
        <Row className="gx-3">
          <Col md={5}>
            {renderTimeField('startTime', 'Start Time', startTimeValue, startTimeDisplay)}
          </Col>
          <Col md={5}>
            {renderTimeField('endTime', 'End Time', endTimeValue, endTimeDisplay)}
          </Col>
          <Col md={2}>
            <div className="mb-3">
              <Label style={labelStyle}>Duration</Label>
              <div className="activity-duration" title="Duration (hh:mm:ss)">
                {duration || '00:00:00'}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Options */}
      <div className="activity-options">
        <RHFCheckBox<ActivityEditForm> name="activeInvoice" label="Invoice" />
        <RHFCheckBox<ActivityEditForm> name="isAdmin" label="Is Admin" />
      </div>

      {/* Error Alert Banner */}
      {formError && (
        <Alert color="danger" className="py-2 mt-3 mb-0" style={{ fontSize: '12px' }}>
          <i className="mdi mdi-alert-circle-outline me-1"></i>
          {formError}
        </Alert>
      )}
    </>
  );
};

export default ActivityPersonalInfo;
