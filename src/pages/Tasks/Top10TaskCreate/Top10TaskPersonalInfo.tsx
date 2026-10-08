import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, FormGroup, Label } from "reactstrap";
import { useFormContext } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFFlatpickr,
  RHFTextArea,
  SelectOption,
} from "@/Components/Common/Forms";
import { Top10TaskForm } from "@/types/top10task/top10task.schema";
import { RootState } from "@/slices";
import {
  fetchTrackerSubProjects,
  fetchTrackerSubProjectCategories,
} from "@/slices/top10task/top10taskThunk";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "Not Started", label: "Not Started" },
  { value: "In Process", label: "In Process" },
  { value: "Done", label: "Done" },
];

const Top10TaskPersonalInfo: React.FC = () => {
  const dispatch = useDispatch<any>();
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Top10TaskForm>();

  // Redux state for dropdown lookups
  const {
    pointPersonList,
    projectList,
    subProjectList,
    subProjectCategoryList,
  } = useSelector((state: RootState) => (state as any).Top10Task);

  const selectedProject = watch("project");
  const selectedSubProject = watch("subproject");
  const etaHour = watch("etaHour");
  const etaMinute = watch("etaMinute");

  // Format dropdown options
  const pointPersonOptions: SelectOption[] = (pointPersonList || []).map(
    (p: any) => ({
      value: p.id,
      label: p.name,
    })
  );

  const projectOptions: SelectOption[] = (projectList || []).map((p: any) => ({
    value: p.id,
    label: p.project,
  }));

  const subProjectOptions: SelectOption[] = (subProjectList || []).map(
    (sp: any) => ({
      value: sp.id,
      label: sp.subcategory,
    })
  );

  const categoryOptions: SelectOption[] = (
    subProjectCategoryList || []
  ).map((cat: any) => ({
    value: cat.id,
    label: cat.subcategory,
  }));

  // Cascade handler: Project change
  const handleProjectChange = (val: any) => {
    const projectId = val ? Number(val) : null;
    setValue("subproject", null as any, { shouldValidate: true });
    setValue("subProjectCategory", null as any, { shouldValidate: true });

    if (projectId) {
      dispatch(fetchTrackerSubProjects(projectId));
    }
  };

  // Cascade handler: SubProject change
  const handleSubProjectChange = (val: any) => {
    const subProjectId = val ? Number(val) : null;
    setValue("subProjectCategory", null as any, { shouldValidate: true });

    if (selectedProject && subProjectId) {
      dispatch(
        fetchTrackerSubProjectCategories({
          projectId: Number(selectedProject),
          subProjectCategoryId: Number(subProjectId),
        })
      );
    }
  };

  return (
    <>
      {/* Row 1: Assignee To */}
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<Top10TaskForm>
            name="pointPerson"
            label="Assignee To"
            placeholder="-- Select Assignee --"
            options={pointPersonOptions}
            required
          />
        </Col>
      </Row>

      {/* Row 2: Cost Centre */}
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<Top10TaskForm>
            name="project"
            label="Cost Centre"
            placeholder="-- Select Cost Centre --"
            options={projectOptions}
            onChange={handleProjectChange}
            required
          />
        </Col>
      </Row>

      {/* Row 3: Project & Category */}
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<Top10TaskForm>
            name="subproject"
            label="Project"
            placeholder="-- Select Project --"
            options={subProjectOptions}
            isDisabled={!selectedProject}
            onChange={handleSubProjectChange}
            required
          />
        </Col>

        <Col md={6} sm={12}>
          <RHFSelect<Top10TaskForm>
            name="subProjectCategory"
            label="Category"
            placeholder="-- Select Category --"
            options={categoryOptions}
            isDisabled={!selectedSubProject}
            required
          />
        </Col>
      </Row>

      {/* Row 4: Task & Task Description */}
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<Top10TaskForm>
            name="subject"
            label="Task"
            placeholder="Enter task title"
            required
          />
        </Col>

        <Col md={6} sm={12}>
          <RHFTextArea<Top10TaskForm>
            name="task"
            label="Task Description"
            placeholder="Enter task details (optional)"
            rows={2}
          />
        </Col>
      </Row>

      {/* Row 5: Assign Date & Due Date */}
      <Row>
        <Col md={6} sm={12}>
          <RHFFlatpickr<Top10TaskForm>
            name="assignDate"
            label="Assign Date"
            mode="datetime"
            required
          />
        </Col>

        <Col md={6} sm={12}>
          <RHFFlatpickr<Top10TaskForm>
            name="eta"
            label="Due Date"
            mode="datetime"
          />
        </Col>
      </Row>

      {/* Row 6: Daily Projected Time Widget & Recurrent Task */}
      <Row className="mb-3 align-items-center">
        <Col md={6} sm={12}>
          <FormGroup className="mb-0">
            <Label style={{ fontSize: "12px", fontWeight: 500 }} className="d-block">
              Daily Projected<span style={{ color: "red", marginLeft: 4 }}>*</span>
            </Label>

            <div className="d-flex align-items-center gap-4 mt-1 flex-wrap">
              {/* Custom TimePicker Widget */}
              <div className="timepicker-widget-container">
                {/* Hour unit column */}
                <div className="timepicker-unit-col">
                  <button
                    type="button"
                    className="btn-time-arrow-chevron"
                    onClick={() => {
                      const num =
                        etaHour === ""
                          ? 0
                          : parseInt(String(etaHour), 10) || 0;
                      const next = (num + 1) % 24;
                      setValue("etaHour", String(next).padStart(2, "0"), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    title="Increase Hours"
                  >
                    <i className="mdi mdi-chevron-up"></i>
                  </button>
                  <input
                    type="text"
                    className="time-digit-box form-control text-center"
                    placeholder="HH"
                    maxLength={2}
                    value={etaHour}
                    style={{ fontSize: "12px", height: "36px", width: "48px", padding: 0 }}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setValue("etaHour", raw, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    onBlur={() => {
                      const num =
                        etaHour === "" ? 0 : parseInt(String(etaHour), 10);
                      const clamped = isNaN(num)
                        ? 0
                        : Math.min(23, Math.max(0, num));
                      setValue("etaHour", String(clamped).padStart(2, "0"), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="btn-time-arrow-chevron"
                    onClick={() => {
                      const num =
                        etaHour === ""
                          ? 0
                          : parseInt(String(etaHour), 10) || 0;
                      const next = (num - 1 + 24) % 24;
                      setValue("etaHour", String(next).padStart(2, "0"), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    title="Decrease Hours"
                  >
                    <i className="mdi mdi-chevron-down"></i>
                  </button>
                </div>

                {/* Separator */}
                <div className="timepicker-separator-col">:</div>

                {/* Minute unit column */}
                <div className="timepicker-unit-col">
                  <button
                    type="button"
                    className="btn-time-arrow-chevron"
                    onClick={() => {
                      const num =
                        etaMinute === ""
                          ? 0
                          : parseInt(String(etaMinute), 10) || 0;
                      const next = (num + 1) % 60;
                      setValue("etaMinute", String(next).padStart(2, "0"), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    title="Increase Minutes"
                  >
                    <i className="mdi mdi-chevron-up"></i>
                  </button>
                  <input
                    type="text"
                    className="time-digit-box form-control text-center"
                    placeholder="MM"
                    maxLength={2}
                    value={etaMinute}
                    style={{ fontSize: "12px", height: "36px", width: "48px", padding: 0 }}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setValue("etaMinute", raw, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    onBlur={() => {
                      const num =
                        etaMinute === ""
                          ? 0
                          : parseInt(String(etaMinute), 10);
                      const clamped = isNaN(num)
                        ? 0
                        : Math.min(59, Math.max(0, num));
                      setValue("etaMinute", String(clamped).padStart(2, "0"), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="btn-time-arrow-chevron"
                    onClick={() => {
                      const num =
                        etaMinute === ""
                          ? 0
                          : parseInt(String(etaMinute), 10) || 0;
                      const next = (num - 1 + 60) % 60;
                      setValue("etaMinute", String(next).padStart(2, "0"), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    title="Decrease Minutes"
                  >
                    <i className="mdi mdi-chevron-down"></i>
                  </button>
                </div>
              </div>

              {/* Recurrent Task Checkbox */}
              <RHFCheckBox<Top10TaskForm>
                name="isRecurrent"
                label="Recurrent Task"
              />
            </div>

            {errors.etaHour?.message && (
              <div className="text-danger small mt-1">
                {errors.etaHour.message as string}
              </div>
            )}
          </FormGroup>
        </Col>
      </Row>

      {/* Row 7: Status */}
      <Row className="mb-3">
        <Col md={6} sm={12}>
          <RHFSelect<Top10TaskForm>
            name="completed"
            label="Status"
            options={STATUS_OPTIONS}
            isClearable={false}
          />
        </Col>
      </Row>
    </>
  );
};

export default Top10TaskPersonalInfo;
