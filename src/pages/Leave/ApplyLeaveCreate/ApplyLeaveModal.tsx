import React, { useEffect, useRef } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Form,
  Row,
  Col,
} from 'reactstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaveFormSchema, LeaveForm } from '@/types/leave/leave.schema';
import { calcLeaveDays } from '@/types/leave/leave.mapper';
import { LeaveEmployeeItem } from '@/types/leave/leave.types';
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFFlatpickr,
  SelectOption,
} from '@/Components/Common/Forms';
import toastService from '@/services/toastService';

export interface ApplyLeaveModalProps {
  isOpen: boolean;
  toggle: () => void;
  leaveId: number;
  initialData: LeaveForm;
  employeeList: LeaveEmployeeItem[];
  isAdmin: boolean;
  isLoading: boolean;
  isSaving: boolean;
  onSubmit: (data: LeaveForm) => Promise<void> | void;
}

const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  toggle,
  leaveId,
  initialData,
  employeeList,
  isAdmin,
  isLoading,
  isSaving,
  onSubmit,
}) => {
  const isEdit = leaveId > 0;
  const modalTitle = isEdit ? 'Edit Leave' : 'Apply Leave';

  const methods = useForm<LeaveForm>({
    resolver: zodResolver(leaveFormSchema) as any,
    defaultValues: initialData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { reset, handleSubmit, watch, setValue } = methods;

  useEffect(() => {
    if (isOpen) {
      reset(initialData);
    }
  }, [isOpen, initialData, reset]);

  const fromDate = watch('fromDate');
  const toDate = watch('toDate');
  const isFirstRender = useRef(true);
  const prevDates = useRef({ fromDate, toDate });

  useEffect(() => {
    if (!isOpen) {
      isFirstRender.current = true;
      return;
    }
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevDates.current = { fromDate, toDate };
      return;
    }
    if (
      prevDates.current.fromDate !== fromDate ||
      prevDates.current.toDate !== toDate
    ) {
      prevDates.current = { fromDate, toDate };
      const days = calcLeaveDays(fromDate, toDate);
      if (days > 0) {
        setValue('leaves', days as any, { shouldValidate: true });
      }
    }
  }, [fromDate, toDate, isOpen, setValue]);

  const employeeOptions: SelectOption[] = (employeeList || [])
    .filter((e: any) => e.id > 0)
    .map((e: any) => ({ value: e.id, label: e.name }));

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)?.[0] as any;
    toastService.error(firstError?.message || 'Please fill all required fields.');
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size="lg"
      centered
      backdrop="static"
    >
      <ModalHeader toggle={toggle}>
        <span className="fw-bold">{modalTitle}</span>
      </ModalHeader>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit as any, onInvalid)} noValidate>
          <ModalBody className="p-4">
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner color="primary" />
                <p className="mt-2 text-muted fw-medium">Loading leave details...</p>
              </div>
            ) : (
              <>
                <input type="hidden" {...methods.register('id')} />
                <input type="hidden" {...methods.register('isApprove')} />

                <Row>
                  <Col md={12} sm={12}>
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
                  <Col md={6} sm={12} className="d-flex align-items-center pt-2">
                    <RHFCheckBox<LeaveForm>
                      name="isSickLeaves"
                      label="Sick Leave"
                    />
                  </Col>
                </Row>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              outline
              onClick={toggle}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={isSaving || isLoading}
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  {isEdit ? 'Updating...' : 'Applying...'}
                </>
              ) : (
                <>{isEdit ? 'Update' : 'Apply'}</>
              )}
            </Button>
          </ModalFooter>
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default ApplyLeaveModal;
