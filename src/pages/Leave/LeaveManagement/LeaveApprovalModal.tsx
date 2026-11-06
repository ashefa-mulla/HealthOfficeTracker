import React, { useEffect } from 'react';
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
import { leaveApprovalSchema, LeaveApprovalForm } from '@/types/leave/leave.schema';
import { RHFInput, RHFFlatpickr } from '@/Components/Common/Forms';
import toastService from '@/services/toastService';

export interface LeaveApprovalModalProps {
  isOpen: boolean;
  toggle: () => void;
  employeeName: string;
  initialData: LeaveApprovalForm;
  isLoading: boolean;
  isSaving: boolean;
  onSubmit: (data: LeaveApprovalForm) => Promise<void> | void;
}

/** Admin: edit an employee's leave (dates, day split) and approve it */
const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  isOpen,
  toggle,
  employeeName,
  initialData,
  isLoading,
  isSaving,
  onSubmit,
}) => {
  const methods = useForm<LeaveApprovalForm>({
    resolver: zodResolver(leaveApprovalSchema) as any,
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

  // The API turns LWP into Leaves when a leave is approved with Leaves = 0 and Sick Leaves = 0
  const [isApprove, leaves, sickLeaves, lwp] = watch(['isApprove', 'leaves', 'sickLeaves', 'lwp']);
  const lwpBecomesLeaves =
    !!isApprove && !Number(leaves) && !Number(sickLeaves) && Number(lwp) > 0;

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)?.[0] as any;
    toastService.error(firstError?.message || 'Please fill all required fields.');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered backdrop="static">
      <ModalHeader toggle={toggle}>
        <span className="fw-bold">Edit Applied Leave</span>
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
                <Row>
                  <Col md={12} className="mb-3">
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>Employee</div>
                    <div className="fw-semibold">{employeeName || '-'}</div>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} sm={12}>
                    <RHFFlatpickr<LeaveApprovalForm>
                      name="fromDate"
                      label="From Date"
                      mode="date"
                      required
                    />
                  </Col>
                  <Col md={6} sm={12}>
                    <RHFFlatpickr<LeaveApprovalForm>
                      name="toDate"
                      label="To Date"
                      mode="date"
                      required
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={4} sm={12}>
                    <RHFInput<LeaveApprovalForm>
                      name="leaves"
                      label="Leaves"
                      type="number"
                      placeholder="0"
                    />
                  </Col>
                  <Col md={4} sm={12}>
                    <RHFInput<LeaveApprovalForm>
                      name="sickLeaves"
                      label="Sick Leaves"
                      type="number"
                      placeholder="0"
                    />
                  </Col>
                  <Col md={4} sm={12}>
                    <RHFInput<LeaveApprovalForm>
                      name="lwp"
                      label="LWP"
                      type="number"
                      placeholder="0"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <button
                      type="button"
                      onClick={() => setValue('isApprove', !isApprove, { shouldDirty: true })}
                      aria-pressed={!!isApprove}
                      className="d-inline-flex align-items-center gap-2 border-0 fw-semibold"
                      style={{
                        padding: '0.6rem 1.4rem',
                        borderRadius: 999,
                        color: isApprove ? '#fff' : '#16a34a',
                        background: isApprove ? 'linear-gradient(135deg, #22c55e, #16a34a)' : '#e8f8ee',
                        boxShadow: isApprove ? '0 4px 12px rgba(22, 163, 74, 0.4)' : 'inset 0 0 0 1.5px #16a34a',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <i className={`mdi ${isApprove ? 'mdi-check-circle' : 'mdi-check-circle-outline'}`} style={{ fontSize: 20 }}></i>
                      {isApprove ? 'Approved' : 'Approve'}
                    </button>
                    {lwpBecomesLeaves && (
                      <small className="text-muted d-block mt-1">
                        With Leaves and Sick Leaves at 0, approving moves the LWP days into Leaves.
                      </small>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button type="button" color="secondary" outline onClick={toggle} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isSaving || isLoading}>
              {isSaving ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  Saving...
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

export default LeaveApprovalModal;
