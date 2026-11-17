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
import {
  AllowanceMasterModel,
  EmployeeMonthlyAllowanceModel,
} from '@/types/monthlyAllowance/monthlyAllowance.types';
import monthlyAllowanceService from '@/services/monthlyAllowanceService';
import toastService from '@/services/toastService';

interface MonthlyAllowanceModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess: () => void;
  allowanceItem: EmployeeMonthlyAllowanceModel | null;
  empId: number;
  defaultMonth?: number;
  defaultYear?: number;
  masterAllowances: AllowanceMasterModel[];
  employeeName?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MonthlyAllowanceModal: React.FC<MonthlyAllowanceModalProps> = ({
  isOpen,
  toggle,
  onSuccess,
  allowanceItem,
  empId,
  defaultMonth,
  defaultYear,
  masterAllowances,
  employeeName,
}) => {
  const isEdit = !!allowanceItem && Number(allowanceItem.id ?? allowanceItem.Id ?? allowanceItem.ID ?? 0) > 0;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [allowanceId, setAllowanceId] = useState<number>(0);
  const [month, setMonth] = useState<number>(defaultMonth || currentMonth);
  const [year, setYear] = useState<number>(defaultYear || currentYear);
  const [amount, setAmount] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (allowanceItem) {
        const rawAId =
          allowanceItem.allowanceId ??
          allowanceItem.AllowanceId ??
          allowanceItem.AllowanceID ??
          allowanceItem.allowanceID ??
          0;
        setAllowanceId(Number(rawAId));
        setMonth(Number(allowanceItem.month ?? allowanceItem.Month ?? (defaultMonth || currentMonth)));
        setYear(Number(allowanceItem.year ?? allowanceItem.Year ?? (defaultYear || currentYear)));
        setAmount(String(allowanceItem.amount ?? allowanceItem.Amount ?? ''));
        setIsActive(
          allowanceItem.isActive !== undefined
            ? Boolean(allowanceItem.isActive)
            : allowanceItem.IsActive !== undefined
            ? Boolean(allowanceItem.IsActive)
            : true
        );
      } else {
        setAllowanceId(0);
        setMonth(defaultMonth || currentMonth);
        setYear(defaultYear || currentYear);
        setAmount('');
        setIsActive(true);
      }
      setErrors({});
    }
  }, [isOpen, allowanceItem, defaultMonth, defaultYear, currentMonth, currentYear]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!allowanceId || allowanceId <= 0) {
      newErrors.allowanceId = 'Please select an allowance.';
    }

    if (!month || month < 1 || month > 12) {
      newErrors.month = 'Please select a valid month.';
    }

    if (!year || year < 2000 || year > 2100) {
      newErrors.year = 'Please select a valid year.';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!empId || empId <= 0) {
      toastService.error('Invalid employee. Please select an employee first.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<EmployeeMonthlyAllowanceModel> = {
        id: allowanceItem ? Number(allowanceItem.id ?? allowanceItem.Id ?? allowanceItem.ID ?? 0) : 0,
        empId,
        allowanceId,
        month,
        year,
        amount: parseFloat(amount),
        isActive,
      };

      const res = await monthlyAllowanceService.addEditMonthlyAllowance(payload);
      toastService.success(res?.message || 'Monthly allowance saved successfully.');
      onSuccess();
      toggle();
    } catch (err: any) {
      console.error('Failed to save monthly allowance:', err);
      toastService.error(err?.message || 'Failed to save monthly allowance.');
    } finally {
      setSaving(false);
    }
  };

  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  return (
    <Modal isOpen={isOpen} toggle={saving ? undefined : toggle} centered size="md" backdrop="static">
      <ModalHeader toggle={saving ? undefined : toggle} className="border-bottom">
        <span className="fw-bold">
          {isEdit ? 'Edit Monthly Allowance' : 'Add Monthly Allowance'}
        </span>
      </ModalHeader>

      <Form onSubmit={handleSubmit} noValidate>
        <ModalBody className="p-4">
          {employeeName && (
            <div className="mb-3 p-2 px-3 bg-light rounded-3 d-flex align-items-center justify-content-between border">
              <div>
                <span className="text-muted small">Employee: </span>
                <strong className="text-dark">{employeeName}</strong>
              </div>
              <span className="badge bg-primary-subtle text-primary">ID: {empId}</span>
            </div>
          )}

          <FormGroup className="mb-3">
            <Label for="allowanceSelect" className="form-label fw-semibold">
              Allowance <span className="text-danger">*</span>
            </Label>
            <Input
              id="allowanceSelect"
              type="select"
              value={allowanceId}
              onChange={(e) => {
                setAllowanceId(Number(e.target.value));
                if (errors.allowanceId) setErrors((prev) => ({ ...prev, allowanceId: '' }));
              }}
              invalid={!!errors.allowanceId}
            >
              <option value="0">-- Select Allowance --</option>
              {masterAllowances.map((item) => {
                const id = Number(item.id ?? item.Id ?? 0);
                const name = item.allowanceName || item.AllowanceName || 'Unnamed Allowance';
                const code = item.allowanceCode || item.AllowanceCode;
                const type = item.allowanceType || item.AllowanceType;
                return (
                  <option key={id} value={id}>
                    {name} {code ? `(${code})` : ''} {type ? `[${type}]` : ''}
                  </option>
                );
              })}
            </Input>
            {errors.allowanceId && <div className="invalid-feedback d-block">{errors.allowanceId}</div>}
          </FormGroup>

          {/* <Row className="g-3 mb-3">
            <Col md={6}>
              <FormGroup className="mb-0">
                <Label for="monthSelect" className="form-label fw-semibold">
                  Month <span className="text-danger">*</span>
                </Label>
                <Input
                  id="monthSelect"
                  type="select"
                  value={month}
                  onChange={(e) => {
                    setMonth(Number(e.target.value));
                    if (errors.month) setErrors((prev) => ({ ...prev, month: '' }));
                  }}
                  invalid={!!errors.month}
                >
                  {MONTH_NAMES.map((mName, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {mName}
                    </option>
                  ))}
                </Input>
                {errors.month && <div className="invalid-feedback d-block">{errors.month}</div>}
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="mb-0">
                <Label for="yearSelect" className="form-label fw-semibold">
                  Year <span className="text-danger">*</span>
                </Label>
                <Input
                  id="yearSelect"
                  type="select"
                  value={year}
                  onChange={(e) => {
                    setYear(Number(e.target.value));
                    if (errors.year) setErrors((prev) => ({ ...prev, year: '' }));
                  }}
                  invalid={!!errors.year}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Input>
                {errors.year && <div className="invalid-feedback d-block">{errors.year}</div>}
              </FormGroup>
            </Col>
          </Row> */}

          <FormGroup className="mb-3">
            <Label for="allowanceAmount" className="form-label fw-semibold">
              Amount (₹) <span className="text-danger">*</span>
            </Label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted">₹</span>
              <Input
                id="allowanceAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                invalid={!!errors.amount}
              />
            </div>
            {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}
          </FormGroup>

          <FormGroup check className="form-switch mt-3">
            <Input
              type="checkbox"
              id="isActiveSwitch"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <Label check for="isActiveSwitch" className="fw-semibold ms-2">
              Is Active
            </Label>
            <small className="text-muted d-block mt-1">
              Active monthly allowances are included in payroll calculations.
            </small>
          </FormGroup>
        </ModalBody>

        <ModalFooter className="border-top">
          <Button color="secondary" outline type="button" onClick={toggle} disabled={saving}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner size="sm" className="me-2 text-white" />
                Saving...
              </>
            ) : (
              <>{isEdit ? 'Update Allowance' : 'Save Allowance'}</>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default MonthlyAllowanceModal;
