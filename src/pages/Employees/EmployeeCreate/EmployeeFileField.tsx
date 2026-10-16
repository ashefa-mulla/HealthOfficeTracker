import React, { useRef, useState } from "react";
import { Spinner, FormGroup, Label } from "reactstrap";
import { useFormContext } from "react-hook-form";
import { EmployeeForm } from "@/types/employee/employee.schema";
import { getFileUrl } from "@/types/employee/employee.mapper";
import employeeService from "@/services/employeeService";
import toastService from "@/services/toastService";

interface Props {
  name: "cvdoc" | "agreementDoc";
  label: string;
  accept?: string;
}

/** Upload / view / remove a document stored on the employee (CV, Agreement). */
const EmployeeFileField: React.FC<Props> = ({
  name,
  label,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
}) => {
  const { watch, setValue } = useFormContext<EmployeeForm>();
  const value = watch(name);
  const url = getFileUrl(value);
  const fileName = value ? String(value).split(/[\\/]/).pop() : "";

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const dbPath = await employeeService.uploadFile(file, "Employer");
      if (dbPath) setValue(name, dbPath, { shouldDirty: true });
    } catch (err: any) {
      toastService.error(err?.message || "Failed to upload file.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <FormGroup>
      <Label style={{ fontSize: "12px", fontWeight: 500 }}>{label}</Label>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="d-none"
          onChange={handleChange}
        />
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Spinner size="sm" /> : url ? "Replace" : "Upload"}
        </button>
        {url && (
          <>
            <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: "12px" }}>
              <i className="mdi mdi-file-document-outline me-1"></i>
              {fileName}
            </a>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setValue(name, "", { shouldDirty: true })}
            >
              Remove
            </button>
          </>
        )}
        {!url && !uploading && (
          <span className="text-muted" style={{ fontSize: "12px" }}>No file</span>
        )}
      </div>
    </FormGroup>
  );
};

export default EmployeeFileField;
