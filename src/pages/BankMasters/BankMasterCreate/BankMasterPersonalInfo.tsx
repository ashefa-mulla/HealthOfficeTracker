import React from "react";
import { Row, Col } from "reactstrap";
import { RHFInput, RHFCheckBox, RHFFlatpickr } from "@/Components/Common/Forms";
import { BankMasterForm } from "@/types/bankMaster/bankMaster.schema";

const BankMasterPersonalInfo: React.FC = () => (
  <>
    <Row>
      <Col md={6} sm={12}>
        <RHFInput<BankMasterForm> name="name" label="Bank Name" required />
      </Col>
      <Col md={6} sm={12}>
        <RHFInput<BankMasterForm>
          name="accountNo"
          label="Account Number"
          placeholder="Digits only"
          required
        />
      </Col>
    </Row>
    <Row>
      <Col md={6} sm={12}>
        <RHFFlatpickr<BankMasterForm> name="openingDate" label="Opening Date" mode="date" />
      </Col>
      <Col md={6} sm={12} className="d-flex align-items-center">
        <RHFCheckBox<BankMasterForm> name="active" label="Active" />
      </Col>
    </Row>
  </>
);

export default BankMasterPersonalInfo;
