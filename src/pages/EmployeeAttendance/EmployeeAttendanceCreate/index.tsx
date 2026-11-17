import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Spinner, Form } from 'reactstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootState } from '@/slices';
import {
  fetchEmployeeAttendanceById,
  saveEmployeeAttendance,
  fetchEmployeeAttendanceDropdowns,
} from '@/slices/employeeAttendance/employeeAttendanceThunk';
import { setSelected } from '@/slices/employeeAttendance/employeeAttendanceSlice';
import {
  employeeAttendanceFormSchema,
  EmployeeAttendanceForm,
} from '@/types/employeeAttendance/employeeAttendance.schema';
import {
  emptyEmployeeAttendanceForm,
  toEmployeeAttendanceForm,
} from '@/types/employeeAttendance/employeeAttendance.mapper';
import toastService from '@/services/toastService';
import EmployeeAttendanceFormInfo from './EmployeeAttendanceFormInfo';
import EmployeeMonthlyAllowanceTab from './EmployeeMonthlyAllowanceTab';

const LIST_PATH = '/area/employeeattendance/list';

const EmployeeAttendanceCreate: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'attendance' | 'allowance'>('attendance');

  const { dropdowns, selected, saving, loading } = useSelector(
    (state: RootState) => (state as any).EmployeeAttendance
  );

  const numericId = parseInt(params.id || '0', 10) || 0;
  const isEdit = numericId > 0;

  const methods = useForm<EmployeeAttendanceForm>({
    resolver: zodResolver(employeeAttendanceFormSchema) as any,
    defaultValues: emptyEmployeeAttendanceForm(),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { reset, handleSubmit, watch } = methods;

  const watchedEmpId = watch('empId');
  const watchedMonth = watch('month');
  const watchedYear = watch('year');

  const currentEmpId = Number(watchedEmpId || selected?.empId || 0);
  const currentMonth = Number(watchedMonth || selected?.month || (new Date().getMonth() + 1));
  const currentYear = Number(watchedYear || selected?.year || new Date().getFullYear());

  const isApproved = Boolean(
    watch('isApproved') ??
    selected?.isApproved ??
    selected?.isapproved ??
    selected?.IsApproved ??
    false
  );

  const isViewMode = searchParams.get('view') === '1';
  const pageHeading = isViewMode
    ? 'View Employee Attendance'
    : isEdit
    ? 'Edit Employee Attendance'
    : 'Add Employee Attendance';

  document.title = `${pageHeading} | HO Tracker`;

  const currentEmployeeName = useMemo(() => {
    if (selected?.fullname || selected?.Fullname || selected?.employeeName) {
      return selected?.fullname || selected?.Fullname || selected?.employeeName;
    }
    const empList = dropdowns?.employees || dropdowns?.employeeList || [];
    const found = empList.find((e: any) => Number(e.id ?? e.ID ?? 0) === currentEmpId);
    return found?.name || found?.fullname || (currentEmpId > 0 ? `Employee #${currentEmpId}` : '');
  }, [selected, dropdowns, currentEmpId]);

  useEffect(() => {
    dispatch(fetchEmployeeAttendanceDropdowns());

    if (numericId > 0) {
      dispatch(fetchEmployeeAttendanceById(numericId));
    } else {
      dispatch(setSelected(null));
      reset(emptyEmployeeAttendanceForm());
    }
  }, [dispatch, numericId, reset]);

  useEffect(() => {
    if (selected && numericId > 0) {
      reset(toEmployeeAttendanceForm(selected));
    }
  }, [selected, numericId, reset]);

  const onSubmit = async (formData: EmployeeAttendanceForm) => {
    try {
      await dispatch(saveEmployeeAttendance(formData)).unwrap();
      navigate(LIST_PATH);
    } catch (err: any) {
      console.error('Failed to save employee attendance:', err);
      toastService.error(err?.message || 'Failed to save. Please try again.');
    }
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)?.[0] as any;
    toastService.error(firstError?.message || 'Please fill all required fields.');
  };

  return (
    <React.Fragment>
      <div className="page-content-wrapper">
        <Container fluid>
          <div className="page-header-box">
            <div>
              <h1 className="page-title-main">{pageHeading}</h1>
              <p className="breadcrumb-nav-custom mt-1">
                <Link to="/dashboard">Area</Link> /{' '}
                <Link to={LIST_PATH}>Employee Attendance</Link> /{' '}
                <span>{pageHeading}</span>
              </p>
            </div>
            <div>
              <Link to={LIST_PATH} className="btn-brand-secondary">
                <i className="mdi mdi-arrow-left font-size-16"></i>
                <span>Back to List</span>
              </Link>
            </div>
          </div>

          <Row>
            <Col lg={12}>
              <div className="tracker-card">
                <div className="tracker-card-body">
                  {/* Tab Navigation (Only shown in Edit/View mode; hidden on Add) */}
                  {isEdit && (
                    <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                      <button
                        type="button"
                        className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 ${
                          activeTab === 'attendance'
                            ? 'btn-primary shadow-sm fw-semibold'
                            : 'btn-light text-muted'
                        }`}
                        style={{ borderRadius: 8, fontSize: '13px' }}
                        onClick={() => setActiveTab('attendance')}
                      >
                        <i className="mdi mdi-calendar-check-outline font-size-16"></i>
                        <span>Attendance Details</span>
                      </button>

                      <button
                        type="button"
                        className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 ${
                          activeTab === 'allowance'
                            ? 'btn-primary shadow-sm fw-semibold'
                            : 'btn-light text-muted'
                        }`}
                        style={{ borderRadius: 8, fontSize: '13px' }}
                        onClick={() => {
                          if (!currentEmpId || currentEmpId <= 0) {
                            toastService.info('Please select an employee first before managing monthly allowance.');
                            return;
                          }
                          setActiveTab('allowance');
                        }}
                      >
                        <i className="mdi mdi-cash-plus font-size-16"></i>
                        <span>Monthly Allowance</span>
                        {(!currentEmpId || currentEmpId <= 0) && (
                          <span className="badge bg-secondary-subtle text-muted ms-1" style={{ fontSize: '10px' }}>
                            Select employee first
                          </span>
                        )}
                      </button>
                    </div>
                  )}

                  {(activeTab === 'attendance' || !isEdit) && (
                    <>
                      {loading && numericId > 0 ? (
                        <div className="text-center py-5">
                          <Spinner color="primary" />
                          <p className="mt-2 text-muted fw-medium">Loading details...</p>
                        </div>
                      ) : (
                        <FormProvider {...methods}>
                          <Form onSubmit={handleSubmit(onSubmit as any, onInvalid)} noValidate>
                            <input type="hidden" {...methods.register('id')} />

                            <EmployeeAttendanceFormInfo
                              isEdit={isEdit}
                              isViewMode={isViewMode}
                              onNavigateToAllowanceTab={() => {
                                if (!currentEmpId || currentEmpId <= 0) {
                                  toastService.info('Please select an employee first before managing monthly allowance.');
                                  return;
                                }
                                setActiveTab('allowance');
                              }}
                            />

                            <div className="d-flex align-items-center gap-3 pt-3 border-top">
                              <Link to={LIST_PATH} className="btn-form-action-back">
                                Back
                              </Link>
                              {!isViewMode && (
                                <button
                                  type="submit"
                                  className="btn-form-action-save"
                                  disabled={saving}
                                >
                                  {saving ? (
                                    <>
                                      <Spinner size="sm" className="me-2 text-white" />
                                      Saving...
                                    </>
                                  ) : (
                                    <>{isEdit ? 'Update' : 'Save'}</>
                                  )}
                                </button>
                              )}
                            </div>
                          </Form>
                        </FormProvider>
                      )}
                    </>
                  )}

                  {activeTab === 'allowance' && isEdit && (
                    <EmployeeMonthlyAllowanceTab
                      employeeId={currentEmpId}
                      employeeName={currentEmployeeName}
                      defaultMonth={currentMonth}
                      defaultYear={currentYear}
                    />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EmployeeAttendanceCreate;

