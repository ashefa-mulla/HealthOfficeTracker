import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { useFormContext } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFFlatpickr,
  RHFTextArea,
  SelectOption,
} from "@/Components/Common/Forms";
import { RootState } from "@/slices";
import { ChequeRequestForm } from "@/types/chequeRequest/chequeRequest.schema";

const toOptions = (items: { id: number; name: string }[]): SelectOption[] =>
  (items || []).map((i) => ({ value: i.id, label: i.name }));

const ChequeRequestPersonalInfo: React.FC = () => {
  const { dropdowns } = useSelector((state: RootState) => (state as any).ChequeRequest);
  const { watch } = useFormContext<ChequeRequestForm>();

  // Payment Method is stored as text; keep a saved value selectable even if it is no longer in the list
  const payMethodOptions: SelectOption[] = (dropdowns.payMethods || []).map((p: any) => ({
    value: p.name,
    label: p.name,
  }));
  const currentMethod = watch("payMethod");
  if (currentMethod && !payMethodOptions.some((o) => o.value === currentMethod)) {
    payMethodOptions.push({ value: currentMethod, label: currentMethod });
  }

  return (
    <>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<ChequeRequestForm>
            name="bankId"
            label="Bank Name"
            placeholder="-- Select Bank --"
            options={toOptions(dropdowns.banks)}
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFFlatpickr<ChequeRequestForm> name="requestDate" label="Request Date" mode="date" required />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<ChequeRequestForm> name="payTo" label="PayTo" required />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<ChequeRequestForm> name="amount" label="Amount" type="number" required />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<ChequeRequestForm>
            name="costCenterId"
            label="Cost Centre"
            placeholder="-- Select Cost Centre --"
            options={toOptions(dropdowns.costCentres)}
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFSelect<ChequeRequestForm>
            name="payMethod"
            label="Payment Method"
            placeholder="-- Select Payment Method --"
            options={payMethodOptions}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFTextArea<ChequeRequestForm> name="memo" label="Memo" rows={2} />
        </Col>
        <Col md={6} sm={12}>
          <RHFTextArea<ChequeRequestForm> name="address" label="Address" rows={2} />
        </Col>
      </Row>
    </>
  );
};

export default ChequeRequestPersonalInfo;
