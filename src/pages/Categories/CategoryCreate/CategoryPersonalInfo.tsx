import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { useFormContext } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFTextArea,
  SelectOption,
} from "@/Components/Common/Forms";
import { RootState } from "@/slices";
import { CategoryForm } from "@/types/category/category.schema";
import { fetchCategoryProjects } from "@/slices/category/categoryThunk";

const toOptions = (items: { id: number; name: string }[]): SelectOption[] =>
  (items || []).map((i) => ({ value: i.id, label: i.name }));

const CategoryPersonalInfo: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { watch, setValue } = useFormContext<CategoryForm>();
  const { dropdowns } = useSelector((state: RootState) => (state as any).Category);

  const clientId = watch("projectId");

  // Client -> Project
  useEffect(() => {
    dispatch(fetchCategoryProjects(Number(clientId || 0)));
  }, [dispatch, clientId]);

  return (
    <>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<CategoryForm>
            name="companyId"
            label="Company"
            placeholder="-- Select Company --"
            options={toOptions(dropdowns.companies)}
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFSelect<CategoryForm>
            name="projectId"
            label="Client"
            placeholder="-- Select Client --"
            options={toOptions(dropdowns.clients)}
            onChange={() => setValue("subprojectId", null as any)}
            required
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<CategoryForm>
            name="subprojectId"
            label="Project"
            placeholder="-- Select Project --"
            options={toOptions(dropdowns.projects)}
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<CategoryForm> name="subcategory" label="Category" required />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<CategoryForm> name="amount" label="Price($)" type="number" />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <RHFTextArea<CategoryForm> name="description" label="Description" rows={2} />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<CategoryForm> name="active" label="Active" />
        </Col>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<CategoryForm> name="projectActive" label="Invoice" />
        </Col>
      </Row>
    </>
  );
};

export default CategoryPersonalInfo;
