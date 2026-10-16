import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner, FormGroup, Label, Input } from "reactstrap";
import toastService from "@/services/toastService";

export type QuickAddMode = "category" | "vendor" | "account";

interface Props {
  mode: QuickAddMode | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; contact: string }) => void;
}

const TITLES: Record<QuickAddMode, string> = {
  category: "Add Category",
  vendor: "Add Vendor",
  account: "Add Account Number",
};

/** Small "Add New" dialogs used inside the Purchase Order form (category / vendor / account number). */
const PurchaseOrderQuickAddModal: React.FC<Props> = ({ mode, saving, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    if (mode) {
      setName("");
      setContact("");
    }
  }, [mode]);

  const handleSave = () => {
    const n = name.trim();
    if (!n) {
      toastService.error(
        mode === "account" ? "Account No is required!" : mode === "vendor" ? "Name is required!" : "Category Name is required!"
      );
      return;
    }
    if (mode === "account" && !/^[.\d]+$/.test(n)) {
      toastService.error("Account number not valid.");
      return;
    }
    if (mode === "vendor") {
      const c = contact.trim();
      if (!c) {
        toastService.error("Contact No is required!");
        return;
      }
      if (!/^((\+91-?)|0)?[0-9]{10}$/.test(c)) {
        toastService.error("Mobile number not valid.");
        return;
      }
    }
    onSubmit({ name: n, contact: contact.trim() });
  };

  const label = (text: string) => (
    <Label style={{ fontSize: "12px", fontWeight: 500 }}>
      {text}
      <span style={{ color: "red", marginLeft: 4 }}>*</span>
    </Label>
  );

  return (
    <Modal isOpen={!!mode} toggle={saving ? undefined : onClose} centered>
      <ModalHeader toggle={saving ? undefined : onClose}>{mode ? TITLES[mode] : ""}</ModalHeader>
      <ModalBody>
        <FormGroup>
          {label(mode === "account" ? "Account No" : mode === "vendor" ? "Name" : "Category Name")}
          <Input value={name} onChange={(e) => setName(e.target.value)} style={{ fontSize: "11px" }} />
        </FormGroup>
        {mode === "vendor" && (
          <FormGroup>
            {label("Contact")}
            <Input value={contact} onChange={(e) => setContact(e.target.value)} style={{ fontSize: "11px" }} />
          </FormGroup>
        )}
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn-form-action-back" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button type="button" className="btn-form-action-save" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner size="sm" className="me-2 text-white" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default PurchaseOrderQuickAddModal;
