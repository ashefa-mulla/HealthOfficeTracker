import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Form } from 'reactstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RHFInput, RHFSelect, RHFTextArea, SelectOption } from '@/Components/Common/Forms';
import toastService from '@/services/toastService';
import allowanceMasterService from '@/services/allowanceMasterService';
import {
  allowanceMasterFormSchema,
  AllowanceMasterForm,
  emptyAllowanceMasterForm,
} from '@/types/allowanceMaster/allowanceMaster.schema';
import { AllowanceTypeOption } from '@/types/allowanceMaster/allowanceMaster.types';

const LIST_PATH = '/area/allowancemaster/list';

const AllowanceMasterCreate: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const numericId = parseInt(params.id || '0', 10) || 0;
  const isEdit = numericId > 0;
  const pageHeading = isEdit ? 'Edit Allowance' : 'Add Allowance';

  document.title = `${pageHeading} | HO Tracker`;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([]);

  const methods = useForm<AllowanceMasterForm>({
    resolver: zodResolver(allowanceMasterFormSchema) as any,
    defaultValues: emptyAllowanceMasterForm(),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { reset, handleSubmit } = methods;

  // Dropdown options for Allowance Type
  useEffect(() => {
    allowanceMasterService
      .getAllowanceTypes()
      .then((types: AllowanceTypeOption[]) =>
        setTypeOptions(types.map((t) => ({ value: t.value, label: t.text })))
      )
      .catch((err: any) => toastService.error(err?.message || 'Unable to load allowance types.'));
  }, []);

  // Load the row when editing
  useEffect(() => {
    if (!isEdit) {
      reset(emptyAllowanceMasterForm());
      return;
    }

    let cancelled = false;
    setLoading(true);
    allowanceMasterService
      .getAllowanceMaster(numericId)
      .then((row) => {
        if (cancelled) return;
        if (!row) {
          toastService.error('Allowance not found.');
          navigate(LIST_PATH);
          return;
        }
        reset({
          id: row.id,
          allowanceName: row.allowanceName,
          allowanceCode: row.allowanceCode,
          allowanceType: row.allowanceType,
          description: row.description ?? '',
        });
      })
      .catch((err: any) => {
        if (!cancelled) toastService.error(err?.message || 'Unable to load allowance.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isEdit, numericId, navigate, reset]);

  const onSubmit = async (formData: AllowanceMasterForm) => {
    setSaving(true);
    try {
      const res = await allowanceMasterService.saveAllowanceMaster(formData);
      toastService.success(res?.message || 'Allowance saved successfully.');
      navigate(LIST_PATH);
    } catch (err: any) {
      toastService.error(err?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
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
                <Link to={LIST_PATH}>Allowance Master</Link> /{' '}
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
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2 text-muted fw-medium">Loading details...</p>
                    </div>
                  ) : (
                    <FormProvider {...methods}>
                      <Form onSubmit={handleSubmit(onSubmit as any, onInvalid)} noValidate>
                        <input type="hidden" {...methods.register('id')} />

                        <Row>
                          <Col md={6} sm={12}>
                            <RHFInput<AllowanceMasterForm>
                              name="allowanceName"
                              label="Allowance Name"
                              required
                            />
                          </Col>
                          <Col md={6} sm={12}>
                            <RHFInput<AllowanceMasterForm>
                              name="allowanceCode"
                              label="Allowance Code"
                              required
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6} sm={12}>
                            <RHFSelect<AllowanceMasterForm>
                              name="allowanceType"
                              label="Allowance Type"
                              placeholder="Select type..."
                              options={typeOptions}
                              isClearable={false}
                              required
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12} sm={12}>
                            <RHFTextArea<AllowanceMasterForm>
                              name="description"
                              label="Description"
                              placeholder="Enter a short description..."
                              rows={3}
                            />
                          </Col>
                        </Row>

                        <div className="d-flex align-items-center gap-3 pt-3 border-top">
                          <Link to={LIST_PATH} className="btn-form-action-back">
                            Back
                          </Link>
                          <button type="submit" className="btn-form-action-save" disabled={saving}>
                            {saving ? (
                              <>
                                <Spinner size="sm" className="me-2 text-white" />
                                Saving...
                              </>
                            ) : (
                              <>{isEdit ? 'Update' : 'Save'}</>
                            )}
                          </button>
                        </div>
                      </Form>
                    </FormProvider>
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

export default AllowanceMasterCreate;
