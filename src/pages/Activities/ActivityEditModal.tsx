import React, { useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Form,
} from 'reactstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TrackerProjectItem,
  TrackerSubProjectItem,
  TrackerSubProjectCategoryItem,
} from '@/types/top10task/top10task.types';
import {
  activityEditFormSchema,
  ActivityEditForm,
} from '@/types/activity/activity.schema';
import ActivityPersonalInfo from './ActivityPersonalInfo';
import './activityEditModal.css';

export interface ActivityEditModalProps {
  isOpen: boolean;
  toggle: () => void;
  initialData: ActivityEditForm;
  projectList: TrackerProjectItem[];
  subprojectList: TrackerSubProjectItem[];
  subprojectCategoryList: TrackerSubProjectCategoryItem[];
  employeeList: any[];
  showAdminField: boolean;
  isLoadingModal: boolean;
  isSubmittingModal: boolean;
  formError?: string;
  onProjectChange: (projectId: number) => Promise<void> | void;
  onSubProjectChange: (projectId: number, subProjectId: number) => Promise<void> | void;
  onSubmitForm: (data: ActivityEditForm) => Promise<void> | void;
}

const ActivityEditModal: React.FC<ActivityEditModalProps> = ({
  isOpen,
  toggle,
  initialData,
  projectList,
  subprojectList,
  subprojectCategoryList,
  employeeList,
  showAdminField,
  isLoadingModal,
  isSubmittingModal,
  formError,
  onProjectChange,
  onSubProjectChange,
  onSubmitForm,
}) => {
  const methods = useForm<ActivityEditForm>({
    resolver: zodResolver(activityEditFormSchema) as any,
    defaultValues: initialData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { reset, handleSubmit } = methods;
  const isEdit = initialData.id > 0;

  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      centered
      backdrop="static"
      className="activity-edit-modal"
    >
      <ModalHeader toggle={toggle} tag="div">
        <div className="activity-modal-heading">
          <span className="activity-modal-icon">
            <i className={`mdi ${isEdit ? 'mdi-pencil-outline' : 'mdi-plus'}`}></i>
          </span>
          <div>
            <div className="activity-modal-title">{isEdit ? 'Edit Task' : 'Add Task'}</div>
            <div className="activity-modal-subtitle">
              {isEdit ? 'Update the activity details and time log' : 'Log a new activity'}
            </div>
          </div>
        </div>
      </ModalHeader>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmitForm as any)} noValidate>
          <ModalBody>
            {isLoadingModal ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
                <div className="mt-2 text-muted">Loading activity details...</div>
              </div>
            ) : (
              <ActivityPersonalInfo
                projectList={projectList}
                subprojectList={subprojectList}
                subprojectCategoryList={subprojectCategoryList}
                employeeList={employeeList}
                showAdminField={showAdminField}
                formError={formError}
                onProjectChange={onProjectChange}
                onSubProjectChange={onSubProjectChange}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="danger"
              outline
              onClick={toggle}
              disabled={isSubmittingModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={isSubmittingModal || isLoadingModal}
            >
              {isSubmittingModal ? (
                <>
                  <Spinner size="sm" className="me-1" /> Saving...
                </>
              ) : (
                <>
                  <i className="mdi mdi-content-save-outline me-1"></i> Save
                </>
              )}
            </Button>
          </ModalFooter>
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default ActivityEditModal;
