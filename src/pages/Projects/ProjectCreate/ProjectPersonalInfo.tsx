import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFFlatpickr,
  RHFTextArea,
  SelectOption,
} from "@/Components/Common/Forms";
import { RootState } from "@/slices";
import { ProjectForm } from "@/types/project/project.schema";

const toOptions = (items: { id: number; name: string }[]): SelectOption[] =>
  (items || []).map((i) => ({ value: i.id, label: i.name }));

const ProjectPersonalInfo: React.FC = () => {
  const { dropdowns } = useSelector((state: RootState) => (state as any).Project);

  return (
    <>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<ProjectForm>
            name="companyId"
            label="Company"
            placeholder="-- Select Company --"
            options={toOptions(dropdowns.companies)}
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFSelect<ProjectForm>
            name="projectId"
            label="Client"
            placeholder="-- Select Client --"
            options={toOptions(dropdowns.clients)}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<ProjectForm> name="subcategory" label="Project" required />
        </Col>
        <Col md={3} sm={12}>
          <RHFInput<ProjectForm> name="amount" label="Price($)" type="number" />
        </Col>
        <Col md={3} sm={12}>
          <RHFSelect<ProjectForm>
            name="projectCategory"
            label="Project Category"
            placeholder="-- Select Category --"
            options={toOptions(dropdowns.categories)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <RHFTextArea<ProjectForm> name="description" label="Description" rows={2} />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFFlatpickr<ProjectForm> name="assignDate" label="Assign Date" mode="date" />
        </Col>
        <Col md={4} sm={12}>
          <RHFFlatpickr<ProjectForm> name="eta" label="Due Date" mode="date" />
        </Col>
        <Col md={4} sm={12}>
          <RHFInput<ProjectForm> name="etaTimebyproject" label="ETA Time" placeholder="e.g. 40" />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<ProjectForm> name="active" label="Active" />
        </Col>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<ProjectForm> name="projectActive" label="Invoice" />
        </Col>
      </Row>
    </>
  );
};

export default ProjectPersonalInfo;
