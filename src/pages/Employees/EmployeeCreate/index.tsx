import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Form } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/slices";
import {
  fetchEmployeeById,
  saveEmployee,
  fetchEmployeeDropdowns,
} from "@/slices/employee/employeeThunk";
import { setSelected } from "@/slices/employee/employeeSlice";
import { employeeFormSchema, EmployeeForm } from "@/types/employee/employee.schema";
import { emptyEmployeeForm } from "@/types/employee/employee.mapper";
import { useAuthStore } from "@/store/useAuthStore";
import toastService from "@/services/toastService";
import { getOwnEmployeeId } from "@/helpers/userHelper";
import EmployeePersonalInfo from "./EmployeePersonalInfo";

const LIST_PATH = "/area/employee/list";
const PROFILE_PATH = "/settings";

const EmployeeCreate: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id: string }>();

  const { user, profileInfo } = useAuthStore();
  const updatedBy =
    profileInfo?.userName || user?.userName || user?.email || "admin";

  const { selected, selectedRaw, saving, loading } = useSelector(
    (state: RootState) => (state as any).Employee
  );

  // Opened from "Account Settings": use the logged-in user's own employee id
  // and send them back to their profile page instead of the all-users list.
  const fromProfile = !!(location.state as any)?.fromProfile;
  const ownEmployeeId = getOwnEmployeeId(profileInfo);
  const numericId = fromProfile
    ? ownEmployeeId
    : parseInt(params.id || "0", 10) || 0;
  const isEdit = numericId > 0;
  const backPath = fromProfile ? PROFILE_PATH : LIST_PATH;
  const pageHeading = fromProfile
    ? "Edit My Profile"
    : isEdit
    ? "Edit Team Member"
    : "Add Team Member";

  document.title = `${pageHeading} | HO Tracker`;

  const methods = useForm<EmployeeForm>({
    resolver: zodResolver(employeeFormSchema) as any,
    defaultValues: emptyEmployeeForm(),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    dispatch(fetchEmployeeDropdowns());

    if (numericId > 0) {
      dispatch(fetchEmployeeById(numericId));
    } else {
      dispatch(setSelected(null));
      reset(emptyEmployeeForm());
    }
  }, [dispatch, numericId, reset]);

  useEffect(() => {
    if (selected && numericId > 0) {
      reset(selected);
    }
  }, [selected, numericId, reset]);

  const onSubmit = async (formData: EmployeeForm) => {
    try {
      await dispatch(
        saveEmployee({ form: formData, raw: isEdit ? selectedRaw : null, updatedBy })
      ).unwrap();
      navigate(backPath);
    } catch (err: any) {
      console.error("Failed to save team member:", err);
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
                <Link to={backPath}>{fromProfile ? "Profile" : "Team Members"}</Link> /{" "}
                <span>{pageHeading}</span>
              </p>
            </div>
            <div>
              <Link to={backPath} className="btn-brand-secondary">
                <i className="mdi mdi-arrow-left font-size-16"></i>
                <span>{fromProfile ? "Back to Profile" : "Back to List"}</span>
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
                        <input type="hidden" {...methods.register("userId")} />
                        <input type="hidden" {...methods.register("identityId")} />

                        <EmployeePersonalInfo />

                        <div className="d-flex align-items-center gap-3 pt-3 border-top">
                          <Link to={backPath} className="btn-form-action-back">
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

export default EmployeeCreate;
