import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { RHFInput, RHFSelect, RHFCheckBox } from '@/Components/Common/Forms';
import { ReportItemDefinition, LookupOption } from '@/types/report/report.types';
import reportService, { openPdfBlob } from '@/services/reportService';
import toastService from '@/services/toastService';

interface ReportModalProps {
  isOpen: boolean;
  toggle: () => void;
  report: ReportItemDefinition | null;
  companyId: number;
  branchId: number;
  adminId: number;
  isClinician: boolean;
}

export interface ReportFormData {
  poid: number | null;
  stDt: string;
  endDt: string;
  empId: number | null;
  projectId: number | null;
  subProjectId: number | null;
  invoiceLayout: number;
  invoiceActive: number;
  monthStr: string;
  selectedMonth: number;
  selectedYear: number;
  getCurrentYearLeaves: boolean;
}

const formatDateToYMD = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatMonthToYM = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  toggle,
  report,
  companyId,
  branchId,
  adminId,
  isClinician,
}) => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Loading & lookups
  const [isLoadingLookups, setIsLoadingLookups] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [poList, setPoList] = useState<LookupOption[]>([]);
  const [employeeList, setEmployeeList] = useState<LookupOption[]>([]);
  const [projectList, setProjectList] = useState<LookupOption[]>([]);
  const [subProjectList, setSubProjectList] = useState<LookupOption[]>([]);
  const [yearList, setYearList] = useState<number[]>([]);
  const [monthList, setMonthList] = useState<LookupOption[]>([]);

  // React Hook Form instance
  const methods = useForm<ReportFormData>({
    defaultValues: {
      poid: null,
      stDt: formatDateToYMD(firstDayOfMonth),
      endDt: formatDateToYMD(now),
      empId: null,
      projectId: null,
      subProjectId: null,
      invoiceLayout: 2,
      invoiceActive: 2,
      monthStr: formatMonthToYM(now),
      selectedMonth: now.getMonth() + 1,
      selectedYear: now.getFullYear(),
      getCurrentYearLeaves: false,
    },
  });

  const { watch, reset, setError, clearErrors } = methods;
  const watchedProjectId = watch('projectId');
  const watchedGetCurrentYearLeaves = watch('getCurrentYearLeaves');

  // Reset form when modal opens or report changes
  useEffect(() => {
    if (isOpen && report) {
      const currentDate = new Date();
      const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      reset({
        poid: null,
        stDt: formatDateToYMD(firstOfMonth),
        endDt: formatDateToYMD(currentDate),
        empId: null,
        projectId: null,
        subProjectId: null,
        invoiceLayout: 2,
        invoiceActive: 2,
        monthStr: formatMonthToYM(currentDate),
        selectedMonth: currentDate.getMonth() + 1,
        selectedYear: currentDate.getFullYear(),
        getCurrentYearLeaves: false,
      });
      clearErrors();

      loadLookupsForReport(report.key);
    }
  }, [isOpen, report]);

  // Load subprojects dynamically when projectId changes
  useEffect(() => {
    if (watchedProjectId && report?.key === 'utilization_with_project') {
      reportService.getSubProjectList(watchedProjectId).then((subs) => {
        setSubProjectList(subs);
        methods.setValue('subProjectId', null);
      });
    } else {
      setSubProjectList([]);
    }
  }, [watchedProjectId, report]);

  const loadLookupsForReport = async (key: string) => {
    setIsLoadingLookups(true);
    try {
      const safeCompanyId = Number(companyId) && !isNaN(Number(companyId)) ? Number(companyId) : 1;
      const safeBranchId = Number(branchId) && !isNaN(Number(branchId)) ? Number(branchId) : 1;
      // const safeAdminId = Number(adminId) && !isNaN(Number(adminId)) ? Number(adminId) : 0;
      const safeAdminId = 0;
      if (key === 'po_statement') {
        const pos = await reportService.getPurchaseOrderList(safeCompanyId);
        setPoList(pos);
      }

      if (
        ['time_sheet', 'utilization', 'employee_leave', 'utilization_with_project', 'employee_wise_production'].includes(key)
      ) {
        const emps = await reportService.getEmployeeList(safeCompanyId);
        setEmployeeList(emps);
      }

      if (['monthly_invoice', 'monthly_invoice_excel', 'utilization_with_project'].includes(key)) {
        const projs = await reportService.getProjectList(safeCompanyId, safeBranchId, safeAdminId, isClinician);
        setProjectList(projs);
      }

      if (key === 'monthly_eval_summary') {
        const [yrs, mths] = await Promise.all([reportService.getYears(), reportService.getMonths()]);
        setYearList(yrs);
        setMonthList(mths);
      }
    } catch (err) {
      console.error('Error loading lookups for report:', err);
    } finally {
      setIsLoadingLookups(false);
    }
  };

  const validateCustom = (data: ReportFormData): boolean => {
    if (!report) return false;
    let isValid = true;
    clearErrors();

    switch (report.key) {
      case 'po_statement':
        if (!data.poid || Number(data.poid) <= 0) {
          setError('poid', { message: 'PO Code is required' });
          isValid = false;
        }
        break;

      case 'time_sheet':
      case 'user_utilization':
      case 'productivity_analytics':
        if (!data.stDt) {
          setError('stDt', { message: 'From Date is required' });
          isValid = false;
        }
        if (!data.endDt) {
          setError('endDt', { message: 'To Date is required' });
          isValid = false;
        }
        if (data.stDt && data.endDt && data.stDt > data.endDt) {
          setError('endDt', { message: 'To Date cannot be earlier than From Date' });
          isValid = false;
        }
        break;

      case 'monthly_invoice':
      case 'monthly_invoice_excel':
        if (!data.projectId || Number(data.projectId) <= 0) {
          setError('projectId', { message: 'Project is required' });
          isValid = false;
        }
        if (!data.stDt) {
          setError('stDt', { message: 'From Date is required' });
          isValid = false;
        }
        if (!data.endDt) {
          setError('endDt', { message: 'To Date is required' });
          isValid = false;
        }
        if (data.stDt && data.endDt && data.stDt > data.endDt) {
          setError('endDt', { message: 'To Date cannot be earlier than From Date' });
          isValid = false;
        }
        break;

      case 'utilization':
      case 'employee_wise_production':
        if (!data.stDt) {
          setError('stDt', { message: 'From Date is required' });
          isValid = false;
        }
        if (!data.endDt) {
          setError('endDt', { message: 'To Date is required' });
          isValid = false;
        }
        if (!data.empId || Number(data.empId) <= 0) {
          setError('empId', { message: 'Employee is required' });
          isValid = false;
        }
        break;

      case 'attendance':
        if (!data.monthStr) {
          setError('monthStr', { message: 'Month-Year is required' });
          isValid = false;
        }
        break;

      case 'employee_leave':
        if (!data.getCurrentYearLeaves && !data.monthStr) {
          setError('monthStr', { message: 'Month-Year is required' });
          isValid = false;
        }
        break;

      case 'utilization_with_project':
        if (!data.stDt) {
          setError('stDt', { message: 'From Date is required' });
          isValid = false;
        }
        if (!data.endDt) {
          setError('endDt', { message: 'To Date is required' });
          isValid = false;
        }
        if (!data.empId || Number(data.empId) <= 0) {
          setError('empId', { message: 'Employee is required' });
          isValid = false;
        }
        if (!data.projectId || Number(data.projectId) <= 0) {
          setError('projectId', { message: 'Project is required' });
          isValid = false;
        }
        break;

      case 'monthly_eval_summary':
        if (!data.selectedMonth) {
          setError('selectedMonth', { message: 'Month is required' });
          isValid = false;
        }
        if (!data.selectedYear) {
          setError('selectedYear', { message: 'Year is required' });
          isValid = false;
        }
        break;

      default:
        break;
    }

    return isValid;
  };

  const onSubmit = async (data: ReportFormData) => {
    if (!report) return;
    if (!validateCustom(data)) return;

    setIsGenerating(true);
    const key = report.key;
    let fileName = `${report.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`;

    try {
      if (key === 'monthly_invoice_excel') {
        await reportService.downloadMonthlyInvoiceExcel({
          stdt: data.stDt,
          enddt: data.endDt,
          id: Number(data.projectId)!,
          invoiceactive: Number(data.invoiceActive) || 1,
        });
        toastService.success('Monthly Invoice Excel exported successfully.');
        toggle();
        return;
      }

      let blob: Blob;

      switch (key) {
        case 'po_statement':
          fileName = `PurchaseOrderStatement_${data.poid}.pdf`;
          blob = await reportService.downloadPurchaseOrderReport(Number(data.poid)!);
          break;

        case 'time_sheet':
          fileName = `TimeSheet_${data.stDt}_to_${data.endDt}.pdf`;
          blob = await reportService.downloadUserLogReport({
            stdt: data.stDt,
            enddt: data.endDt,
            empid: Number(data.empId) || 0,
          });
          break;

        case 'monthly_invoice':
          fileName = `MonthlyInvoice_${data.projectId}_${data.stDt}_to_${data.endDt}.pdf`;
          blob = await reportService.downloadMonthlyInvoiceReport({
            stdt: data.stDt,
            enddt: data.endDt,
            id: Number(data.projectId)!,
            invoicelayout: Number(data.invoiceLayout) || 2,
            invoiceactive: Number(data.invoiceActive) || 1,
          });
          break;

        case 'utilization':
          fileName = `UtilizationReport_${data.empId}_${data.stDt}_to_${data.endDt}.pdf`;
          blob = await reportService.downloadUtilizationUserTaskReport({
            stdt: data.stDt,
            enddt: data.endDt,
            empid: Number(data.empId)!,
            uid: 3,
          });
          break;

        case 'attendance':
          fileName = `AttendanceReport_${data.monthStr}.pdf`;
          blob = await reportService.downloadAttendanceReport(data.monthStr);
          break;

        case 'user_utilization':
          fileName = `UserUtilization_${data.stDt}_to_${data.endDt}.pdf`;
          blob = await reportService.downloadUserUtilizationReport({
            stdt: data.stDt,
            enddt: data.endDt,
          });
          break;

        case 'employee_leave':
          fileName = `LeaveReport_${data.getCurrentYearLeaves ? 'Yearly' : data.monthStr}.pdf`;
          blob = await reportService.downloadLeaveTransactionReport({
            month: data.getCurrentYearLeaves ? '0' : data.monthStr,
            currentyear: data.getCurrentYearLeaves,
            hidedate: data.getCurrentYearLeaves,
            empid: Number(data.empId) || 0,
          });
          break;

        case 'utilization_with_project':
          fileName = `UtilizationWithProject_${data.projectId}_${data.stDt}_to_${data.endDt}.pdf`;
          blob = await reportService.downloadUtilizationReportwithProject({
            stdt: data.stDt,
            enddt: data.endDt,
            empid: Number(data.empId)!,
            projectid: Number(data.projectId)!,
            subprojectid: Number(data.subProjectId) || 0,
            uid: 3,
          });
          break;

        case 'productivity_analytics':
          fileName = `ProductivityAnalytics_${data.stDt}_to_${data.endDt}.pdf`;
          blob = await reportService.downloadProductivityAnalyticsReport({
            stdt: data.stDt,
            enddt: data.endDt,
          });
          break;

        case 'employee_wise_production':
          fileName = `EmployeeProduction_${data.empId}_${data.stDt}_to_${data.endDt}.pdf`;
          blob = await reportService.downloadUserTrackerTaskwithAmount({
            eid: Number(data.empId)!,
            stdt: data.stDt,
            enddt: data.endDt,
          });
          break;

        case 'monthly_eval_summary':
          fileName = `MonthlyEvaluationReportSummary_${data.selectedMonth}_${data.selectedYear}.pdf`;
          blob = await reportService.downloadMonthlyEvaluationReportSummary({
            year: Number(data.selectedYear),
            month: Number(data.selectedMonth),
          });
          break;

        default:
          throw new Error('Unsupported report type');
      }

      if (!blob || blob.size === 0) {
        toastService.warning('No records found for the given criteria.');
        return;
      }

      openPdfBlob(blob, fileName, false);
      toastService.success(`${report.title} generated successfully.`);
      toggle();
    } catch (err: any) {
      console.error('Report generation failed:', err);
      toastService.error(err.message || 'Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!report) return null;

  return (
    <Modal isOpen={isOpen} toggle={isGenerating ? undefined : toggle} size="md" centered backdrop="static">
      <ModalHeader toggle={isGenerating ? undefined : toggle}>
        <span className="fw-bold">{report.title}</span>
      </ModalHeader>

      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <ModalBody className="p-3">
            {isLoadingLookups ? (
              <div className="text-center py-4">
                <Spinner color="primary" size="sm" />
                <div className="mt-2 text-muted small">Loading parameters...</div>
              </div>
            ) : (
              <>
                {/* 1. Purchase Order Statement */}
                {report.key === 'po_statement' && (
                  <RHFSelect<ReportFormData>
                    name="poid"
                    label="PO Code"
                    placeholder="-- Select PO Code --"
                    required
                    options={poList.map((po) => ({ value: po.id, label: po.name }))}
                  />
                )}

                {/* Date Range Inputs */}
                {['time_sheet', 'monthly_invoice', 'monthly_invoice_excel', 'utilization', 'user_utilization', 'utilization_with_project', 'productivity_analytics', 'employee_wise_production'].includes(report.key) && (
                  <Row>
                    <Col md={6}>
                      <RHFInput<ReportFormData>
                        name="stDt"
                        label="From Date"
                        type="date"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <RHFInput<ReportFormData>
                        name="endDt"
                        label="To Date"
                        type="date"
                        required
                      />
                    </Col>
                  </Row>
                )}

                {/* Monthly Invoice (PDF) Options */}
                {report.key === 'monthly_invoice' && (
                  <>
                    <RHFSelect<ReportFormData>
                      name="projectId"
                      label="Project"
                      placeholder="-- Select Project --"
                      required
                      options={projectList.map((p) => ({ value: p.id, label: p.name }))}
                    />

                    <Row>
                      <Col md={6}>
                        <RHFSelect<ReportFormData>
                          name="invoiceLayout"
                          label="Invoice Print"
                          isClearable={false}
                          options={[
                            { value: 1, label: 'Invoice without Person Details' },
                            { value: 2, label: 'Invoice with Person Details' },
                          ]}
                        />
                      </Col>
                      <Col md={6}>
                        <RHFSelect<ReportFormData>
                          name="invoiceActive"
                          label="Projects"
                          isClearable={false}
                          options={[
                            { value: 1, label: 'Active Projects' },
                            { value: 2, label: 'All Projects' },
                          ]}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {/* Monthly Invoice in Excel Options */}
                {report.key === 'monthly_invoice_excel' && (
                  <RHFSelect<ReportFormData>
                    name="projectId"
                    label="Project"
                    placeholder="-- Select Project --"
                    required
                    options={projectList.map((p) => ({ value: p.id, label: p.name }))}
                  />
                )}

                {/* Employee Select */}
                {['time_sheet', 'utilization', 'employee_leave', 'employee_wise_production'].includes(report.key) && (
                  <RHFSelect<ReportFormData>
                    name="empId"
                    label={`Employee ${['utilization', 'employee_wise_production'].includes(report.key) ? '' : '(Optional)'}`}
                    placeholder="-- Select Employee --"
                    required={['utilization', 'employee_wise_production'].includes(report.key)}
                    isClearable={!['utilization', 'employee_wise_production'].includes(report.key)}
                    options={[
                      ...(['time_sheet', 'employee_leave'].includes(report.key) ? [{ value: 0, label: 'All Employees' }] : []),
                      ...employeeList.map((e) => ({ value: e.id, label: e.name })),
                    ]}
                  />
                )}

                {/* Utilization with Project specific options */}
                {report.key === 'utilization_with_project' && (
                  <>
                    <RHFSelect<ReportFormData>
                      name="empId"
                      label="Employee"
                      placeholder="-- Select Employee --"
                      required
                      options={employeeList.map((e) => ({ value: e.id, label: e.name }))}
                    />

                    <RHFSelect<ReportFormData>
                      name="projectId"
                      label="Project"
                      placeholder="-- Select Project --"
                      required
                      options={projectList.map((p) => ({ value: p.id, label: p.name }))}
                    />

                    <RHFSelect<ReportFormData>
                      name="subProjectId"
                      label="Sub Project (Optional)"
                      placeholder={watchedProjectId ? '-- Select Sub Project (Optional) --' : 'Select Project first'}
                      isDisabled={!watchedProjectId || subProjectList.length === 0}
                      options={subProjectList.map((s) => ({ value: s.id, label: s.name }))}
                    />
                  </>
                )}

                {/* Attendance Report */}
                {report.key === 'attendance' && (
                  <RHFInput<ReportFormData>
                    name="monthStr"
                    label="Month-Year"
                    type="month"
                    required
                  />
                )}

                {/* Employee Leave Report */}
                {report.key === 'employee_leave' && (
                  <>
                    <div className="mb-3">
                      <RHFCheckBox<ReportFormData>
                        name="getCurrentYearLeaves"
                        label="Get Current Year Leaves"
                      />
                    </div>

                    {!watchedGetCurrentYearLeaves && (
                      <RHFInput<ReportFormData>
                        name="monthStr"
                        label="Month-Year"
                        type="month"
                        required
                      />
                    )}
                  </>
                )}

                {/* Monthly Evaluation Report Summary */}
                {report.key === 'monthly_eval_summary' && (
                  <Row>
                    <Col md={6}>
                      <RHFSelect<ReportFormData>
                        name="selectedMonth"
                        label="Month"
                        placeholder="Select Month"
                        required
                        isClearable={false}
                        options={monthList.map((m) => ({ value: m.id, label: m.name }))}
                      />
                    </Col>
                    <Col md={6}>
                      <RHFSelect<ReportFormData>
                        name="selectedYear"
                        label="Year"
                        placeholder="Select Year"
                        required
                        isClearable={false}
                        options={yearList.map((y) => ({ value: y, label: String(y) }))}
                      />
                    </Col>
                  </Row>
                )}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button color="danger" outline type="button" onClick={toggle} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={isGenerating || isLoadingLookups}
            >
              {isGenerating ? (
                <>
                  <Spinner size="sm" className="me-1" />
                  <span>Generating...</span>
                </>
              ) : report.key === 'monthly_invoice_excel' ? (
                'Export Excel'
              ) : (
                'Generate'
              )}
            </Button>
          </ModalFooter>
        </Form>
      </FormProvider>
    </Modal>
  );
};

export default ReportModal;
