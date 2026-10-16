import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "reactstrap";
import { useFormContext } from "react-hook-form";
import {
  RHFInput,
  RHFSelect,
  RHFCheckBox,
  RHFFlatpickr,
  RHFTextArea,
  SelectOption,
} from "@/Components/Common/Forms";
import { RootState } from "@/slices";
import {
  PurchaseOrderForm,
  PAYTYPE_OPTIONS,
  PROCESS_METHOD_OPTIONS,
  PO_TYPE_OPTIONS,
} from "@/types/purchaseOrder/purchaseOrder.schema";
import { getFileUrl } from "@/types/employee/employee.mapper";
import {
  fetchPoVendors,
  fetchPoAccountNumbers,
  fetchPoRefDocs,
  removePoRefDoc,
  quickAddPoCategory,
  quickAddPoVendor,
  quickAddPoAccountNumber,
} from "@/slices/purchaseOrder/purchaseOrderThunk";
import toastService from "@/services/toastService";
import PurchaseOrderQuickAddModal, { QuickAddMode } from "./PurchaseOrderQuickAddModal";

const toOptions = (items: { id: number; name: string }[]): SelectOption[] =>
  (items || []).map((i) => ({ value: i.id, label: i.name }));

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h6 className="fw-semibold text-primary border-bottom pb-2 mb-3 mt-3">{title}</h6>
);

/** "Add New" link shown at the top-right of a select's label row */
const AddNew: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="btn btn-link p-0 text-decoration-none"
    style={{ position: "absolute", right: 12, top: -2, fontSize: "11px", fontWeight: 600 }}
  >
    <i className="mdi mdi-plus-circle-outline me-1"></i>Add New
  </button>
);

interface Props {
  pendingFile: File | null;
  onFileChange: (file: File | null) => void;
}

const PurchaseOrderPersonalInfo: React.FC<Props> = ({ pendingFile, onFileChange }) => {
  const dispatch = useDispatch<any>();
  const { watch, setValue } = useFormContext<PurchaseOrderForm>();
  const { dropdowns, refDocs, saving } = useSelector((state: RootState) => (state as any).PurchaseOrder);

  const id = Number(watch("id") || 0);
  const isEdit = id > 0;
  const categoryId = watch("categoryId");
  const vendorId = watch("vendorId");

  const [quickMode, setQuickMode] = useState<QuickAddMode | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Category -> Vendor -> Account No
  useEffect(() => {
    dispatch(fetchPoVendors(Number(categoryId || 0)));
  }, [dispatch, categoryId]);

  useEffect(() => {
    dispatch(fetchPoAccountNumbers(Number(vendorId || 0)));
  }, [dispatch, vendorId]);

  // Reference documents (saved purchase orders only)
  useEffect(() => {
    if (id > 0) dispatch(fetchPoRefDocs(id));
  }, [dispatch, id]);

  const openQuickAdd = (mode: QuickAddMode) => {
    if (mode === "vendor" && !categoryId) {
      toastService.info("Select Category");
      return;
    }
    if (mode === "account" && !vendorId) {
      toastService.info("Select Vendor");
      return;
    }
    setQuickMode(mode);
  };

  const handleQuickSubmit = async (values: { name: string; contact: string }) => {
    try {
      if (quickMode === "category") {
        await dispatch(quickAddPoCategory(values.name)).unwrap();
      } else if (quickMode === "vendor") {
        await dispatch(
          quickAddPoVendor({ categoryId: Number(categoryId), name: values.name, contact: values.contact })
        ).unwrap();
      } else if (quickMode === "account") {
        await dispatch(
          quickAddPoAccountNumber({ vendorId: Number(vendorId), accountNo: values.name })
        ).unwrap();
      }
      setQuickMode(null);
    } catch {
      // error toast shown by the thunk
    }
  };

  const handleDeleteDoc = (docId: number) => {
    if (!window.confirm("Are you sure to delete File?")) return;
    dispatch(removePoRefDoc({ docId, purchaseOrderId: id }));
  };

  const accountOptions: SelectOption[] = (dropdowns.accountNumbers || []).map((a: any) => ({
    value: a.id,
    label: a.accountNo,
  }));

  return (
    <>
      <SectionTitle title="Order Details" />
      <Row>
        {isEdit && (
          <Col md={3} sm={12}>
            <RHFInput<PurchaseOrderForm> name="code" label="Purchase Order Code" disabled />
          </Col>
        )}
        <Col md={3} sm={12}>
          <RHFFlatpickr<PurchaseOrderForm> name="podate" label="Purchase Order Date" mode="date" required />
        </Col>
        <Col md={3} sm={12}>
          <RHFSelect<PurchaseOrderForm>
            name="poType"
            label="Order Type"
            placeholder="--Select--"
            options={PO_TYPE_OPTIONS}
            isClearable={false}
            required
          />
        </Col>
        <Col md={3} sm={12}>
          <RHFFlatpickr<PurchaseOrderForm> name="startDate" label="Start Date" mode="date" />
        </Col>
        <Col md={3} sm={12}>
          <RHFFlatpickr<PurchaseOrderForm> name="endDate" label="End Date" mode="date" />
        </Col>
      </Row>

      <SectionTitle title="Vendor & Account" />
      <Row>
        <Col md={4} sm={12} className="position-relative">
          <AddNew onClick={() => openQuickAdd("category")} />
          <RHFSelect<PurchaseOrderForm>
            name="categoryId"
            label="Category"
            placeholder="-- Select Category --"
            options={toOptions(dropdowns.categories)}
            onChange={() => {
              setValue("vendorId", null as any);
              setValue("vendorAccountNo", null);
            }}
            required
          />
        </Col>
        <Col md={4} sm={12} className="position-relative">
          <AddNew onClick={() => openQuickAdd("vendor")} />
          <RHFSelect<PurchaseOrderForm>
            name="vendorId"
            label="Vendor"
            placeholder="-- Select Vendor --"
            options={toOptions(dropdowns.vendors)}
            onChange={() => setValue("vendorAccountNo", null)}
            required
          />
        </Col>
        <Col md={4} sm={12} className="position-relative">
          <AddNew onClick={() => openQuickAdd("account")} />
          <RHFSelect<PurchaseOrderForm>
            name="vendorAccountNo"
            label="Account No"
            placeholder="-- Select Account No --"
            options={accountOptions}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFInput<PurchaseOrderForm> name="why" label="Why (Who is it for)" />
        </Col>
        <Col md={4} sm={12}>
          <RHFInput<PurchaseOrderForm> name="accountable" label="Accountable" />
        </Col>
        <Col md={4} sm={12}>
          <RHFSelect<PurchaseOrderForm>
            name="costCentreId"
            label="Cost Center"
            placeholder="-- Select Cost Center --"
            options={toOptions(dropdowns.costCentres)}
          />
        </Col>
      </Row>

      <SectionTitle title="Amounts & Payment" />
      <Row>
        <Col md={3} sm={12}>
          <RHFInput<PurchaseOrderForm> name="noOfQty" label="No of Qty" type="number" required />
        </Col>
        <Col md={3} sm={12}>
          <RHFInput<PurchaseOrderForm> name="poAmount" label="Amount" type="number" required />
        </Col>
        <Col md={3} sm={12}>
          <RHFInput<PurchaseOrderForm> name="lowerLimit" label="Lower Limit" type="number" required />
        </Col>
        <Col md={3} sm={12}>
          <RHFInput<PurchaseOrderForm> name="upperLimit" label="Upper Limit" type="number" required />
        </Col>
      </Row>
      <Row>
        <Col md={3} sm={12}>
          <RHFInput<PurchaseOrderForm> name="principalAmt" label="Principal Amount" type="number" required />
        </Col>
        <Col md={3} sm={12}>
          <RHFInput<PurchaseOrderForm> name="interestAmt" label="Interest Amount" type="number" required />
        </Col>
        <Col md={3} sm={12}>
          <RHFSelect<PurchaseOrderForm>
            name="paytype"
            label="Frequency of Payment"
            placeholder="--Select--"
            options={PAYTYPE_OPTIONS}
          />
        </Col>
        <Col md={3} sm={12}>
          <RHFFlatpickr<PurchaseOrderForm> name="paymentDueDate" label="Payment Due Date" mode="date" />
        </Col>
      </Row>
      <Row>
        <Col md={3} sm={12}>
          <RHFSelect<PurchaseOrderForm>
            name="payby"
            label="Pay By"
            placeholder="-- Select Pay By --"
            options={toOptions(dropdowns.payBy)}
          />
        </Col>
        <Col md={3} sm={12}>
          <RHFSelect<PurchaseOrderForm>
            name="processMethod"
            label="Process Method"
            placeholder="--Select--"
            options={PROCESS_METHOD_OPTIONS}
            isClearable={false}
            required
          />
        </Col>
        <Col md={3} sm={12}>
          <RHFSelect<PurchaseOrderForm>
            name="snailMail"
            label="Snail Mail"
            placeholder="-- Select Snail Mail --"
            options={toOptions(dropdowns.snailMail)}
          />
        </Col>
        <Col md={3} sm={12}>
          <RHFTextArea<PurchaseOrderForm> name="remarks" label="Unique" rows={1} />
        </Col>
      </Row>
      <Row>
        <Col md={3} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<PurchaseOrderForm> name="active" label="Active" />
        </Col>
      </Row>

      <SectionTitle title="Online Access" />
      <Row>
        <Col md={4} sm={12}>
          <RHFInput<PurchaseOrderForm> name="weblink" label="Web Link" />
        </Col>
        <Col md={4} sm={12}>
          <RHFInput<PurchaseOrderForm> name="onlineAccessUsername" label="User Name" />
        </Col>
        <Col md={4} sm={12}>
          <RHFInput<PurchaseOrderForm> name="onlineAccessPassword" label="Password" />
        </Col>
      </Row>

      <SectionTitle title="Documents" />
      <Row>
        <Col md={6} sm={12}>
          <label style={{ fontSize: "12px", fontWeight: 500 }}>Account Summary .xls</label>
          {isEdit ? (
            <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
              <input
                ref={fileRef}
                type="file"
                className="d-none"
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                disabled={saving}
                onClick={() => fileRef.current?.click()}
              >
                {pendingFile ? "Replace" : "Choose a file"}
              </button>
              {pendingFile ? (
                <>
                  <span style={{ fontSize: "12px" }}>{pendingFile.name}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      onFileChange(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-muted" style={{ fontSize: "12px" }}>
                  Max 200 KB. Uploaded when you press Update.
                </span>
              )}
            </div>
          ) : (
            <p className="text-muted" style={{ fontSize: "12px" }}>
              Save the purchase order first, then edit it to attach the Account Summary file.
            </p>
          )}
        </Col>
        {isEdit && (
          <Col md={6} sm={12}>
            <label style={{ fontSize: "12px", fontWeight: 500 }}>Reference Document</label>
            <table className="table table-sm table-striped align-middle" style={{ fontSize: "12px" }}>
              <thead>
                <tr>
                  <th>Document Code</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                {(refDocs || []).length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center text-muted">
                      No data available
                    </td>
                  </tr>
                ) : (
                  (refDocs || []).map((d: any) => (
                    <tr key={d.id}>
                      <td>{d.docCode || "-"}</td>
                      <td>
                        <a
                          href={getFileUrl(d.path) || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="me-3"
                          title="Download"
                        >
                          <i className="mdi mdi-download"></i>
                        </a>
                        <button
                          type="button"
                          className="task-action-icon delete-icon"
                          title="Delete File"
                          onClick={() => handleDeleteDoc(d.id)}
                        >
                          <i className="mdi mdi-close-circle-outline"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Col>
        )}
      </Row>

      <SectionTitle title="Work Flow" />
      <Row>
        <Col md={12}>
          <RHFTextArea<PurchaseOrderForm> name="workflow" rows={6} placeholder="Describe the work flow..." />
        </Col>
      </Row>

      <PurchaseOrderQuickAddModal
        mode={quickMode}
        saving={saving}
        onClose={() => setQuickMode(null)}
        onSubmit={handleQuickSubmit}
      />
    </>
  );
};

export default PurchaseOrderPersonalInfo;
