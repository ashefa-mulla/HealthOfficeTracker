import React from "react";
import { Row, Col } from "reactstrap";
import { RHFInput, RHFCheckBox } from "@/Components/Common/Forms";
import { AccountCategoryForm } from "@/types/accountCategory/accountCategory.schema";

const AccountCategoryPersonalInfo: React.FC = () => (
  <Row>
    <Col md={6} sm={12}>
      <RHFInput<AccountCategoryForm> name="name" label="Category Name" required />
    </Col>
    <Col md={6} sm={12} className="d-flex align-items-center">
      <RHFCheckBox<AccountCategoryForm> name="active" label="Active" />
    </Col>
  </Row>
);

export default AccountCategoryPersonalInfo;
