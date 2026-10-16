import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Form } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/slices";
import {
  fetchVendorAccountById,
  saveVendorAccount,
  fetchVendorCategories,
} from "@/slices/vendorAccount/vendorAccountThunk";
import { setSelected } from "@/slices/vendorAccount/vendorAccountSlice";
import {
  vendorAccountFormSchema,
  VendorAccountForm,
} from "@/types/vendorAccount/vendorAccount.schema";
import { emptyVendorAccountForm } from "@/types/vendorAccount/vendorAccount.mapper";
import toastService from "@/services/toastService";
import VendorAccountPersonalInfo from "./VendorAccountPersonalInfo";

const LIST_PATH = "/area/vendoraccount/list";

const VendorAccountCreate: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const { selected, saving, loading } = useSelector(
    (state: RootState) => (state as any).VendorAccount
  );

  const numericId = parseInt(params.id || "0", 10) || 0;
  const isEdit = numericId > 0;
  const pageHeading = isEdit ? "Edit Vendor Account" : "Add Vendor Account";

  document.title = `${pageHeading} | HO Tracker`;

  const methods = useForm<VendorAccountForm>({
    resolver: zodResolver(vendorAccountFormSchema) as any,
    defaultValues: emptyVendorAccountForm(),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    dispatch(fetchVendorCategories());

    if (numericId > 0) {
      dispatch(fetchVendorAccountById(numericId));
    } else {
      dispatch(setSelected(null));
      reset(emptyVendorAccountForm());
    }
  }, [dispatch, numericId, reset]);

  useEffect(() => {
    if (selected && numericId > 0) {
      reset(selected);
    }
  }, [selected, numericId, reset]);

  const onSubmit = async (formData: VendorAccountForm) => {
    try {
      await dispatch(saveVendorAccount(formData)).unwrap();
      navigate(LIST_PATH);
    } catch (err: any) {
      console.error("Failed to save vendor account:", err);
      toastService.error(err?.message || "Failed to save. Please try again.");
    }
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)?.[0] as any;
    const nested = Array.isArray(firstError)
      ? (firstError.find(Boolean) as any)?.accountNo
      : null;
    toastService.error(
      nested?.message || firstError?.message || "Please fill all required fields."
    );
  };

  return (
    <React.Fragment>
      <div className="page-content-wrapper">
        <Container fluid>
          <div className="page-header-box">
            <div>
              <h1 className="page-title-main">{pageHeading}</h1>
              <p className="breadcrumb-nav-custom mt-1">
                <Link to="/dashboard">Area</Link> /{" "}
                <Link to={LIST_PATH}>Vendor Account</Link> /{" "}
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
                  {loading && numericId > 0 ? (
                    <div className="text-center py-5">
                      <Spinner color="primary" />
                      <p className="mt-2 text-muted fw-medium">Loading details...</p>
                    </div>
                  ) : (
                    <FormProvider {...methods}>
                      <Form onSubmit={handleSubmit(onSubmit as any, onInvalid)} noValidate>
                        <input type="hidden" {...methods.register("id")} />

                        <VendorAccountPersonalInfo />

                        <div className="d-flex align-items-center gap-3 pt-3 border-top">
                          <Link to={LIST_PATH} className="btn-form-action-back">
                            Back
                          </Link>
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
                              <>{isEdit ? "Update" : "Save"}</>
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

export default VendorAccountCreate;
