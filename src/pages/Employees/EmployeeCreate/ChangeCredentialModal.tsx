import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner, FormGroup, Label, Input } from "reactstrap";
import employeeService from "@/services/employeeService";
import toastService from "@/services/toastService";

interface Props {
  mode: "username" | "password" | null;
  identityId: string;
  currentUserName?: string | null;
  onClose: () => void;
  onUserNameChanged: (userName: string) => void;
}

const EMAIL_REGEX = /^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;

/** Admin dialogs for Login Details: change username (EmployeeController Changeusername) / password (changepassword). */
const ChangeCredentialModal: React.FC<Props> = ({
  mode,
  identityId,
  currentUserName,
  onClose,
  onUserNameChanged,
}) => {
  const [userName, setUserName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode) {
      setUserName(currentUserName || "");
      setOldPassword("");
      setPassword("");
      setReTypePassword("");
    }
  }, [mode, currentUserName]);

  const handleSave = async () => {
    if (mode === "username") {
      const name = userName.trim();
      if (!EMAIL_REGEX.test(name)) {
        toastService.error("Username/Email is not valid!");
        return;
      }
      try {
        setSaving(true);
        await employeeService.changeUserName({ identityID: identityId, userName: name });
        onUserNameChanged(name);
        toastService.success("User name is updated");
        onClose();
      } catch (err: any) {
        toastService.error(err?.message || "User name is not updated");
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!oldPassword) {
      toastService.error("Current password is required!");
      return;
    }
    if (!password) {
      toastService.error("New password is required!");
      return;
    }
    if (password !== reTypePassword) {
      toastService.error("'Re-type Password' and 'Password' do not match!");
      return;
    }
    try {
      setSaving(true);
      await employeeService.changePassword({ identityID: identityId, oldPassword, password });
      toastService.success("Password is updated");
      onClose();
    } catch (err: any) {
      toastService.error(err?.message || "Invalid Old Password");
    } finally {
      setSaving(false);
    }
  };

  const label = (text: string) => (
    <Label style={{ fontSize: "12px", fontWeight: 500 }}>
      {text}
      <span style={{ color: "red", marginLeft: 4 }}>*</span>
    </Label>
  );

  return (
    <Modal isOpen={!!mode} toggle={saving ? undefined : onClose} centered>
      <ModalHeader toggle={saving ? undefined : onClose}>
        {mode === "username" ? "Change Username" : "Change Password"}
      </ModalHeader>
      <ModalBody>
        {mode === "username" ? (
          <FormGroup>
            {label("New Username / Email")}
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ fontSize: "11px" }}
            />
          </FormGroup>
        ) : (
          <>
            <FormGroup>
              {label("Current Password")}
              <Input
                type="password"
                autoComplete="off"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ fontSize: "11px" }}
              />
            </FormGroup>
            <FormGroup>
              {label("New Password")}
              <Input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ fontSize: "11px" }}
              />
            </FormGroup>
            <FormGroup>
              {label("Re-type Password")}
              <Input
                type="password"
                autoComplete="new-password"
                value={reTypePassword}
                onChange={(e) => setReTypePassword(e.target.value)}
                style={{ fontSize: "11px" }}
              />
            </FormGroup>
          </>
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
            "Update"
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangeCredentialModal;
