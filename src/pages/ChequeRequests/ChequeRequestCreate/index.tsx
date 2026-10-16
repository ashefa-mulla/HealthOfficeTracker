import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Form } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/slices";
import {
  fetchChequeRequestById,
  saveChequeRequest,
  fetchChequeRequestDropdowns,
} from "@/slices/chequeRequest/chequeRequestThunk";
import { setSelected } from "@/slices/chequeRequest/chequeRequestSlice";
import {
  chequeRequestFormSchema,
  ChequeRequestForm,
} from "@/types/chequeRequest/chequeRequest.schema";
import { emptyChequeRequestForm } from "@/types/chequeRequest/chequeRequest.mapper";
import { useAuthStore } from "@/store/useAuthStore";
import toastService from "@/services/toastService";
import ChequeRequestPersonalInfo from "./ChequeRequestPersonalInfo";

const LIST_PATH = "/area/chequerequest/list";

const ChequeRequestCreate: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const { user, profileInfo } = useAuthStore();
  // The API uses this as the "from" address of the notification email
  const currentUser =
    profileInfo?.userName || profileInfo?.email || user?.email || user?.userName || "";

  const { selected, saving, loading } = useSelector(
    (state: RootState) => (state as any).ChequeRequest
  );

  const numericId = parseInt(params.id || "0", 10) || 0;
  const isEdit = numericId > 0;
  const pageHeading = isEdit ? "Edit Cheque Request" : "Add Cheque Request";

  document.title = `${pageHeading} | HO Tracker`;

  const methods = useForm<ChequeRequestForm>({
    resolver: zodResolver(chequeRequestFormSchema) as any,
    defaultValues: emptyChequeRequestForm(),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    dispatch(fetchChequeRequestDropdowns());

    if (numericId > 0) {
      dispatch(fetchChequeRequestById(numericId));
    } else {
      dispatch(setSelected(null));
      reset(emptyChequeRequestForm());
    }
  }, [dispatch, numericId, reset]);

  useEffect(() => {
    if (selected && numericId > 0) {
      reset(selected);
    }
  }, [selected, numericId, reset]);

  const onSubmit = async (formData: ChequeRequestForm) => {
    try {
      await dispatch(saveChequeRequest({ form: formData, currentUser })).unwrap();
      navigate(LIST_PATH);
    } catch (err: any) {
      console.error("Failed to save cheque request:", err);
      toastService.error(err?.message || "Failed to save. Please try again.");
    }
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)?.[0] as any;
    toastService.error(firstError?.message || "Please fill all required fields.");
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
                <Link to={LIST_PATH}>Cheque Request</Link> /{" "}
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

                        <ChequeRequestPersonalInfo />

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

export default ChequeRequestCreate;
