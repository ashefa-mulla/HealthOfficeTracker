import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Form } from "reactstrap";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/slices";
import {
  fetchProjectById,
  saveProject,
  fetchProjectDropdowns,
} from "@/slices/project/projectThunk";
import { setSelected } from "@/slices/project/projectSlice";
import { projectFormSchema, ProjectForm } from "@/types/project/project.schema";
import { emptyProjectForm } from "@/types/project/project.mapper";
import toastService from "@/services/toastService";
import ProjectPersonalInfo from "./ProjectPersonalInfo";

const LIST_PATH = "/area/project/list";

const ProjectCreate: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const { selected, saving, loading } = useSelector(
    (state: RootState) => (state as any).Project
  );

  const numericId = parseInt(params.id || "0", 10) || 0;
  const isEdit = numericId > 0;
  const pageHeading = isEdit ? "Edit Project" : "Add Project";

  document.title = `${pageHeading} | HO Tracker`;

  const methods = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema) as any,
    defaultValues: emptyProjectForm(),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    dispatch(fetchProjectDropdowns());

    if (numericId > 0) {
      dispatch(fetchProjectById(numericId));
    } else {
      dispatch(setSelected(null));
      reset(emptyProjectForm());
    }
  }, [dispatch, numericId, reset]);

  useEffect(() => {
    if (selected && numericId > 0) {
      reset(selected);
    }
  }, [selected, numericId, reset]);

  const onSubmit = async (formData: ProjectForm) => {
    try {
      await dispatch(saveProject(formData)).unwrap();
      navigate(LIST_PATH);
    } catch (err: any) {
      console.error("Failed to save project:", err);
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
                <Link to={LIST_PATH}>Projects</Link> /{" "}
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
                        <input type="hidden" {...methods.register("branchId")} />

                        <ProjectPersonalInfo />

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

export default ProjectCreate;
