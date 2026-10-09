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
  onSubProjectChange: (subProjectId: number) => Promise<void> | void;
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
    >
      <ModalHeader toggle={toggle}>
        <span className="fw-bold">{initialData.id > 0 ? 'Edit Task' : 'Add Task'}</span>
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
                'Save'
              )}
            </Button>
          </ModalFooter>
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default ActivityEditModal;
