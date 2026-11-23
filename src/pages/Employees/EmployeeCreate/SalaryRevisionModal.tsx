import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import FlatpickrInput from '@/Components/Common/FlatpickrInput';
import { EmployeeSalaryRevisionModel } from '@/types/salaryRevision/salaryRevision.types';
import salaryRevisionService from '@/services/salaryRevisionService';
import toastService from '@/services/toastService';
import { formatLocalDateToIso, parseSafeDate } from '@/helpers/dateHelper';

interface SalaryRevisionModalProps {
  isOpen: boolean;
  toggle: () => void;
  employeeId: number;
  revision: EmployeeSalaryRevisionModel | null;
  onSuccess: () => void;
  nextSeqNo?: number;
}

const getCaseInsensitive = (obj: any, key: string): any => {
  if (!obj || typeof obj !== 'object') return undefined;
  const target = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase().replace(/[^a-z0-9]/g, '') === target) {
      return obj[k];
    }
  }
  return undefined;
};

const parseCmmBoolean = (val: any): boolean => {
  if (val === false || val === 0 || val === '0' || val === 'false') {
    return false;
  }
  if (val === true || val === 1 || val === '1' || val === 'true') {
    return true;
  }
  // Default to true as per backend model: public bool? IsCurrentMonthMatrix { get; set; } = true;
  return true;
};

const SalaryRevisionModal: React.FC<SalaryRevisionModalProps> = ({
  isOpen,
  toggle,
  employeeId,
  revision,
  onSuccess,
  nextSeqNo = 1,
}) => {
  const isEdit = Boolean(revision && (revision.id || revision.ID));

  const [basic, setBasic] = useState<string>('');
  const [matrix, setMatrix] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [seqNo, setSeqNo] = useState<number>(nextSeqNo);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isCurrentMonthMatrix, setIsCurrentMonthMatrix] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const populate = (data: any) => {
    const b = data.basic ?? data.Basic;
    const m = data.matrix ?? data.Matrix;
    const fd = data.fromDate ?? data.FromDate;
    const td = data.toDate ?? data.ToDate;
    const sq = data.seqNo ?? data.SeqNo;
    const act = data.isActive !== undefined ? data.isActive : data.IsActive;
    const rawCmm = getCaseInsensitive(data, 'iscurrentmonthmatrix');

    setBasic(b !== undefined && b !== null ? String(b) : '');
    setMatrix(m !== undefined && m !== null ? String(m) : '');
    setFromDate(fd ? String(fd).substring(0, 10) : '');
    setToDate(td ? String(td).substring(0, 10) : '');
    setSeqNo(sq !== undefined && sq !== null ? Number(sq) : nextSeqNo);
    setIsActive(act !== undefined && act !== null ? Boolean(act) : true);
    setIsCurrentMonthMatrix(parseCmmBoolean(rawCmm));
  };

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (revision) {
        populate(revision);

        const revId = Number(revision.id ?? revision.ID ?? 0);
        if (revId > 0) {
          salaryRevisionService
            .getSalaryRevisionById(revId)
            .then((fullData) => {
              if (fullData) {
                populate(fullData);
              }
            })
            .catch((err) => {
              console.warn('Could not fetch full revision details:', err);
            });
        }
      } else {
        setBasic('');
        setMatrix('');
        const todayStr = new Date().toISOString().substring(0, 10);
        setFromDate(todayStr);
        setToDate('');
        setSeqNo(nextSeqNo);
        setIsActive(true);
        setIsCurrentMonthMatrix(true);
      }
    }
  }, [isOpen, revision, nextSeqNo]);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!basic || isNaN(Number(basic)) || Number(basic) < 0) {
      errs.basic = 'Please enter a valid Basic salary.';
    }
    if (!matrix || isNaN(Number(matrix)) || Number(matrix) < 0) {
      errs.matrix = 'Please enter a valid Matrix rate.';
    }
    if (!fromDate) {
      errs.fromDate = 'From Date is required.';
    }
    if (fromDate && toDate) {
      const fromD = parseSafeDate(fromDate);
      const toD = parseSafeDate(toDate);
      if (fromD && toD && fromD.getTime() > toD.getTime()) {
        errs.toDate = 'To Date cannot be earlier than From Date.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const idVal = revision?.id ?? revision?.ID ?? 0;
      const model: EmployeeSalaryRevisionModel = {
        id: idVal,
        ID: idVal,
        empId: employeeId,
        Emp_ID: employeeId,
        basic: Number(basic),
        Basic: Number(basic),
        matrix: Number(matrix),
        Matrix: Number(matrix),
        fromDate: fromDate ? formatLocalDateToIso(fromDate) : null,
        FromDate: fromDate ? formatLocalDateToIso(fromDate) : null,
        toDate: toDate ? formatLocalDateToIso(toDate) : null,
        ToDate: toDate ? formatLocalDateToIso(toDate) : null,
        seqNo: Number(seqNo) || 1,
        SeqNo: Number(seqNo) || 1,
        isActive: isActive,
        IsActive: isActive,
        isCurrentMonthMatrix: isCurrentMonthMatrix,
        IsCurrentMonthMatrix: isCurrentMonthMatrix,
      };

      await salaryRevisionService.addEditSalaryRevision(model);
      toastService.success(
        isEdit
          ? 'Salary revision updated successfully.'
          : 'Salary revision added successfully.'
      );
      toggle();
      onSuccess();
    } catch (err: any) {
      console.error('Failed to save salary revision:', err);
      toastService.error(err?.message || 'Failed to save salary revision.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={saving ? undefined : toggle} size="md" centered backdrop="static">
      <ModalHeader toggle={saving ? undefined : toggle}>
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-cash-multiple text-primary font-size-20"></i>
          <span className="fw-bold">
            {isEdit ? 'Edit Salary Revision' : 'Add Salary Revision'}
          </span>
        </div>
      </ModalHeader>

      <Form onSubmit={handleSubmit} noValidate>
        <ModalBody className="p-4">
          <Row className="g-3">
            {/* Basic Salary */}
            <Col md={6}>
              <FormGroup className="mb-0">
                <Label className="form-label fw-semibold text-dark small mb-1">
                  Basic Salary <span className="text-danger">*</span>
                </Label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={basic}
                    onChange={(e) => setBasic(e.target.value)}
                    invalid={Boolean(errors.basic)}
                    required
                  />
                </div>
                {errors.basic && (
                  <div className="text-danger small mt-1">{errors.basic}</div>
                )}
              </FormGroup>
            </Col>

            {/* Matrix Rate */}
            <Col md={6}>
              <FormGroup className="mb-0">
                <Label className="form-label fw-semibold text-dark small mb-1">
                  Matrix Rate <span className="text-danger">*</span>
                </Label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted">₹</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={matrix}
                    onChange={(e) => setMatrix(e.target.value)}
                    invalid={Boolean(errors.matrix)}
                    required
                  />
                </div>
                {errors.matrix && (
                  <div className="text-danger small mt-1">{errors.matrix}</div>
                )}
              </FormGroup>
            </Col>

            {/* From Date */}
            <Col md={6}>
              <FormGroup className="mb-0">
                <Label className="form-label fw-semibold text-dark small mb-1">
                  Effective From <span className="text-danger">*</span>
                </Label>
                <FlatpickrInput
                  value={fromDate}
                  onChange={([d]) => {
                    setFromDate(d ? d.toISOString().substring(0, 10) : '');
                  }}
                  icon="calendar"
                  placeholder="Select Date"
                  className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
                  options={{
                    dateFormat: 'm/d/Y',
                  }}
                />
                {errors.fromDate && (
                  <div className="text-danger small mt-1">{errors.fromDate}</div>
                )}
              </FormGroup>
            </Col>

            {/* To Date */}
            <Col md={6}>
              <FormGroup className="mb-0">
                <Label className="form-label fw-semibold text-dark small mb-1">
                  Effective To <span className="text-muted fw-normal">(Optional)</span>
                </Label>
                <FlatpickrInput
                  value={toDate}
                  onChange={([d]) => {
                    setToDate(d ? d.toISOString().substring(0, 10) : '');
                  }}
                  icon="calendar"
                  placeholder="Ongoing / Open"
                  className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
                  options={{
                    dateFormat: 'Y-m-d',
                  }}
                />
                {errors.toDate && (
                  <div className="text-danger small mt-1">{errors.toDate}</div>
                )}
              </FormGroup>
            </Col>

            {/* Seq No & IsActive */}
            <Col md={6}>
              <FormGroup className="mb-0">
                <Label className="form-label fw-semibold text-dark small mb-1">
                  Sequence No
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={seqNo}
                  onChange={(e) => setSeqNo(Number(e.target.value))}
                />
                <span className="text-muted" style={{ fontSize: '11px' }}>
                  Revision order number
                </span>
              </FormGroup>
            </Col>

            <Col md={6} className="d-flex flex-column justify-content-center gap-2 pt-2">
              <FormGroup check className="mb-0">
                <Input
                  type="checkbox"
                  id="isActiveRevision"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <Label check for="isActiveRevision" className="fw-semibold text-dark ms-2">
                  Current Active Revision
                </Label>
              </FormGroup>

              <FormGroup check className="mb-0">
                <Input
                  type="checkbox"
                  id="isCurrentMonthMatrix"
                  checked={isCurrentMonthMatrix}
                  onChange={(e) => setIsCurrentMonthMatrix(e.target.checked)}
                />
                <Label check for="isCurrentMonthMatrix" className="fw-semibold text-dark ms-2">
                  Current Month Matrix
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter className="d-flex justify-content-between">
          <Button color="secondary" outline onClick={toggle} disabled={saving}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>{isEdit ? 'Update Revision' : 'Save Revision'}</>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default SalaryRevisionModal;

