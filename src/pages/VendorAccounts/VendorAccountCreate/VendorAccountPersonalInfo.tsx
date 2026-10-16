import React from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFTextArea,
  SelectOption,
} from "@/Components/Common/Forms";
import { RootState } from "@/slices";
import { VendorAccountForm } from "@/types/vendorAccount/vendorAccount.schema";

const VendorAccountPersonalInfo: React.FC = () => {
  const { categories } = useSelector((state: RootState) => (state as any).VendorAccount);
  const { control } = useFormContext<VendorAccountForm>();
  const { fields, append, remove } = useFieldArray({ control, name: "accountNumbers" });

  const categoryOptions: SelectOption[] = (categories || []).map((c: any) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <>
      <Row>
        <Col md={6} sm={12}>
          <RHFSelect<VendorAccountForm>
            name="categoryId"
            label="Category"
            placeholder="-- Select Category --"
            options={categoryOptions}
            required
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<VendorAccountForm> name="name" label="Vendor Name" required />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<VendorAccountForm> name="contact" label="Contact" placeholder="Digits only" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<VendorAccountForm> name="emailId" label="EmailID" type="email" />
        </Col>
      </Row>
      <Row>
        <Col md={6} sm={12}>
          <RHFTextArea<VendorAccountForm> name="address" label="Address" rows={2} />
        </Col>
        <Col md={6} sm={12}>
          <RHFTextArea<VendorAccountForm> name="otherInformation" label="Other Information" rows={2} />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<VendorAccountForm> name="active" label="Active" />
        </Col>
      </Row>

      <h6 className="fw-semibold text-primary border-bottom pb-2 mb-3 mt-3">Account Numbers</h6>
      {fields.length === 0 && (
        <p className="text-muted" style={{ fontSize: "12px" }}>
          No account numbers added.
        </p>
      )}
      {fields.map((field, index) => (
        <Row key={field.id} className="align-items-start">
          <Col md={6} sm={10}>
            <RHFInput<VendorAccountForm>
              name={`accountNumbers.${index}.accountNo` as any}
              label={`Account No ${index + 1}`}
              placeholder="Digits only"
            />
          </Col>
          <Col md={2} sm={2} style={{ paddingTop: "26px" }}>
            {/* Saved account numbers cannot be deleted (the API has no delete endpoint) */}
            {!Number((field as any).rowId || 0) ? (
              <button
                type="button"
                className="task-action-icon delete-icon"
                title="Remove"
                onClick={() => remove(index)}
              >
                <i className="mdi mdi-trash-can-outline"></i>
              </button>
            ) : null}
          </Col>
        </Row>
      ))}
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => append({ rowId: 0, accountNo: "" })}
        >
          <i className="mdi mdi-plus me-1"></i>Add Account No
        </button>
      </div>
    </>
  );
};

export default VendorAccountPersonalInfo;
