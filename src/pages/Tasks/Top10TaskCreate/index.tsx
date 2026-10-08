import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Form } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/slices";
import {
  fetchTaskById,
  saveTask,
  fetchPointPersonList,
  fetchTrackerProjects,
} from "@/slices/top10task/top10taskThunk";
import { setSelected, setDefaultStatus } from "@/slices/top10task/top10taskSlice";
import {
  top10TaskFormSchema,
  Top10TaskForm,
} from "@/types/top10task/top10task.schema";
import {
  emptyTop10TaskForm,
  toTop10TaskForm,
  toTop10TaskModel,
} from "@/types/top10task/top10task.mapper";
import { useAuthStore } from "@/store/useAuthStore";
import { getNumericUserId } from "@/helpers/userHelper";
import toastService from "@/services/toastService";
import Top10TaskPersonalInfo from "./Top10TaskPersonalInfo";

const Top10TaskCreate: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const { user, profileInfo } = useAuthStore();
  const loggedInUserId = getNumericUserId(profileInfo, user);

  // Redux state
  const { selected, saving, loading } = useSelector(
    (state: RootState) => (state as any).Top10Task
  );

  // Determine mode (Create, Edit, Clone)
  const rawId = params.id || "0";
  const isClone = rawId.includes("Clone");
  const numericId = parseInt(rawId.replace("Clone", ""), 10) || 0;
  const isEdit = numericId > 0 && !isClone;

  const pageHeading = isClone
    ? "Clone Tracker Task"
    : isEdit
      ? "Edit Tracker Task"
      : "Create Tracker Task";

  document.title = `${pageHeading} | HO Tracker`;

  // React Hook Form initialization
  const methods = useForm<Top10TaskForm>({
    resolver: zodResolver(top10TaskFormSchema) as any,
    defaultValues: emptyTop10TaskForm(loggedInUserId),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  // Load Dropdowns and Task on Mount
  useEffect(() => {
    const companyId = Number(localStorage.getItem("companyid")) || 1;
    const branchId = Number(localStorage.getItem("branchid")) || 1;

    // Fetch initial dropdowns concurrently
    dispatch(fetchPointPersonList());
    dispatch(fetchTrackerProjects({ companyId, branchId }));

    if (numericId > 0) {
      dispatch(
        fetchTaskById({
          id: numericId,
          type: isClone ? "C" : "E",
          loggedInUserId,
        })
      );
    } else {
      dispatch(setSelected(null));
      reset(emptyTop10TaskForm(loggedInUserId));
    }
  }, [dispatch, numericId, isClone, loggedInUserId, reset]);

  // Populate form when `selected` changes
  useEffect(() => {
    if (selected && numericId > 0) {
      reset(toTop10TaskForm(selected, isClone, loggedInUserId));
    }
  }, [selected, numericId, isClone, loggedInUserId, reset]);

  // Handle Form Submission
  const onSubmit = async (formData: Top10TaskForm) => {
    const submitId = isClone ? 0 : Number(formData.id || 0);
    const payload = toTop10TaskModel(formData, isClone, loggedInUserId);

    try {
      await dispatch(saveTask({ model: payload, id: submitId })).unwrap();
      dispatch(setDefaultStatus("P"));
      navigate("/area/top10task/list");
    } catch (err: any) {
      console.error("Failed to save task:", err);
      toastService.error(
        err?.message || "Failed to save task. Please try again."
      );
    }
  };

  // Handle Validation Errors
  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)?.[0] as any;
    const nested = firstError ? (Object.values(firstError)?.[0] as any) : null;
    const message =
      nested?.message ||
      firstError?.message ||
      "Please fill all required fields.";
    toastService.error(message);
    console.error("Form validation errors:", errors);
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
                <Link
                  to="/area/top10task/list"
                  onClick={() => dispatch(setDefaultStatus("P"))}
                >
                  My Tracker Task
                </Link> /{" "}
                <span>{pageHeading}</span>
              </p>
            </div>

            <div>
              <Link
                to="/area/top10task/list"
                className="btn-brand-secondary"
                onClick={() => dispatch(setDefaultStatus("P"))}
              >
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
                      <p className="mt-2 text-muted fw-medium">
                        Loading task details...
                      </p>
                    </div>
                  ) : (
                    <FormProvider {...methods}>
                      <Form
                        onSubmit={handleSubmit(onSubmit as any, onInvalid)}
                        noValidate
                      >
                        {/* Hidden identity fields */}
                        <input type="hidden" {...methods.register("id")} />
                        <input
                          type="hidden"
                          {...methods.register("accountablePerson")}
                        />
                        <input
                          type="hidden"
                          {...methods.register("actualTime")}
                        />
                        <input
                          type="hidden"
                          {...methods.register("createdTime")}
                        />

                        {/* Form Fields Component */}
                        <Top10TaskPersonalInfo />

                        {/* Action Buttons: Back & Save */}
                        <div className="d-flex align-items-center gap-3 pt-3 border-top">
                          <Link
                            to="/area/top10task/list"
                            className="btn-form-action-back"
                            onClick={() => dispatch(setDefaultStatus("P"))}
                          >
                            Back
                          </Link>

                          <button
                            type="submit"
                            className="btn-form-action-save"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <Spinner
                                  size="sm"
                                  className="me-2 text-white"
                                />
                                {isClone ? "Cloning..." : "Saving..."}
                              </>
                            ) : (
                              <>{isClone ? "Clone" : "Save"}</>
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

export default Top10TaskCreate;
