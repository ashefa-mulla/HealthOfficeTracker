import React from 'react';
import { Row, Col, Alert } from 'reactstrap';
import { useFormContext } from 'react-hook-form';
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

        {/* Start Time (Non-editable) */}
        <Col md={6}>
          <RHFInput<ActivityEditForm>
            name="startTimeDisplay"
            label="Start Time"
            disabled={true}
          />
        </Col>

        {/* End Time (Non-editable) */}
        <Col md={6}>
          <RHFInput<ActivityEditForm>
            name="endTimeDisplay"
            label="End Time"
            disabled={true}
          />
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
