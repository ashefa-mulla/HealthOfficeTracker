import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Spinner } from "reactstrap";
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
import { EmployeeForm } from "@/types/employee/employee.schema";
import { getFileUrl } from "@/types/employee/employee.mapper";
import ChangeCredentialModal from "./ChangeCredentialModal";
import EmployeeFileField from "./EmployeeFileField";
import employeeService from "@/services/employeeService";
import toastService from "@/services/toastService";
import {
  fetchStatesByCountry,
  fetchCitiesByState,
} from "@/slices/employee/employeeThunk";

const MARITAL_OPTIONS: SelectOption[] = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
];

const toOptions = (items: { id: number; name: string }[]): SelectOption[] =>
  (items || []).map((i) => ({ value: i.id, label: i.name }));

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h6 className="fw-semibold text-primary border-bottom pb-2 mb-3 mt-2">{title}</h6>
);

const EmployeePersonalInfo: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { watch, setValue } = useFormContext<EmployeeForm>();
  const { dropdowns } = useSelector((state: RootState) => (state as any).Employee);

  const id = watch("id");
  const countryId = watch("countryId");
  const stateId = watch("stateId");
  const profileimage = watch("profileimage");
  const isEdit = Number(id || 0) > 0;

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [credentialModal, setCredentialModal] = useState<"username" | "password" | null>(null);
  const identityId = watch("identityId") || "";

  // Cascading Country -> State -> City
  useEffect(() => {
    dispatch(fetchStatesByCountry(Number(countryId || 0)));
  }, [dispatch, countryId]);

  useEffect(() => {
    dispatch(fetchCitiesByState(Number(stateId || 0)));
  }, [dispatch, stateId]);

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toastService.error("Please select an image file.");
      return;
    }
    try {
      setUploading(true);
      const dbPath = await employeeService.uploadFile(file, "Employer");
      if (dbPath) setValue("profileimage", dbPath, { shouldDirty: true });
    } catch (err: any) {
      toastService.error(err?.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const avatarUrl = getFileUrl(profileimage);

  return (
    <>
      <SectionTitle title="Personal Information" />
      <Row>
        <Col md={12} className="mb-3 d-flex align-items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="rounded-circle"
              style={{ width: 64, height: 64, objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center"
              style={{ width: 64, height: 64 }}
            >
              <i className="mdi mdi-account font-size-24"></i>
            </div>
          )}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handleProfileUpload}
            />
            <button
              type="button"
              className="btn btn-sm btn-outline-primary me-2"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Spinner size="sm" /> : "Upload Photo"}
            </button>
            {avatarUrl && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setValue("profileimage", "", { shouldDirty: true })}
              >
                Remove
              </button>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFInput<EmployeeForm> name="firstname" label="First Name" required />
        </Col>
        <Col md={4} sm={12}>
          <RHFInput<EmployeeForm> name="middlename" label="Middle Name" />
        </Col>
        <Col md={4} sm={12}>
          <RHFInput<EmployeeForm> name="lastname" label="Last Name" required />
        </Col>
      </Row>
      <Row>
        {isEdit && (
          <Col md={4} sm={12}>
            <RHFInput<EmployeeForm> name="employerCode" label="Employee Code" disabled />
          </Col>
        )}
        <Col md={4} sm={12}>
          <RHFSelect<EmployeeForm>
            name="designationid"
            label="Designation"
            placeholder="-- Select Designation --"
            options={toOptions(dropdowns.designations)}
          />
        </Col>
        <Col md={4} sm={12}>
          <RHFSelect<EmployeeForm>
            name="maritalStatus"
            label="Marital Status"
            placeholder="-- Select --"
            options={MARITAL_OPTIONS}
          />
        </Col>
        <Col md={4} sm={12}>
          <RHFInput<EmployeeForm> name="noOfChild" label="No. of Children" type="number" />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFFlatpickr<EmployeeForm> name="dob" label="Date of Birth" mode="date" />
        </Col>
        <Col md={4} sm={12}>
          <RHFFlatpickr<EmployeeForm> name="joiningDate" label="Joining Date" mode="date" required />
        </Col>
        <Col md={4} sm={12}>
          <RHFFlatpickr<EmployeeForm> name="relieveDate" label="Relieving Date" mode="date" />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<EmployeeForm> name="payrollOn" label="Payroll On" />
        </Col>
        <Col md={4} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<EmployeeForm> name="active" label="Active" />
        </Col>
      </Row>

      <SectionTitle title="Contact Information" />
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="primaryContact" label="Primary Contact" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="primaryEmail" label="Primary Email" type="email" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="alternateContact" label="Alternate Contact" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="alternateEmail" label="Alternate Email" type="email" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="emergencycontactperson" label="Emergency Contact Person" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="emergencycontact" label="Emergency Contact" />
        </Col>
      </Row>

      <SectionTitle title="Address" />
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="addressLine1" label="Address Line 1" />
        </Col>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="addressLine2" label="Address Line 2" />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFSelect<EmployeeForm>
            name="countryId"
            label="Country"
            placeholder="-- Select Country --"
            options={toOptions(dropdowns.countries)}
            onChange={() => {
              setValue("stateId", null);
              setValue("cityId", null);
            }}
          />
        </Col>
        <Col md={4} sm={12}>
          <RHFSelect<EmployeeForm>
            name="stateId"
            label="State"
            placeholder="-- Select State --"
            options={toOptions(dropdowns.states)}
            onChange={() => setValue("cityId", null)}
          />
        </Col>
        <Col md={4} sm={12}>
          <RHFSelect<EmployeeForm>
            name="cityId"
            label="City"
            placeholder="-- Select City --"
            options={toOptions(dropdowns.cities)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} sm={12}>
          <RHFInput<EmployeeForm> name="zip" label="Zip" />
        </Col>
        <Col md={4} sm={12}>
          <RHFSelect<EmployeeForm>
            name="timezone"
            label="Time Zone"
            placeholder="-- Select Time Zone --"
            options={(dropdowns.timeZones || []).map((t: any) => ({
              value: t.name,
              label: t.name,
            }))}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <RHFTextArea<EmployeeForm> name="comments" label="Comments" rows={2} />
        </Col>
      </Row>

      <SectionTitle title="Documents" />
      <Row>
        <Col md={6} sm={12}>
          <EmployeeFileField name="cvdoc" label="CV File" />
        </Col>
        <Col md={6} sm={12}>
          <EmployeeFileField name="agreementDoc" label="Agreement File" />
        </Col>
      </Row>

      <SectionTitle title="Login Details" />
      <Row>
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm>
            name="userName"
            label="Username / Email"
            required
            disabled={isEdit}
          />
        </Col>
        <Col md={6} sm={12}>
          <RHFSelect<EmployeeForm>
            name="userType"
            label="User Type"
            placeholder="-- Select User Type --"
            options={toOptions(dropdowns.userTypes)}
            required
          />
        </Col>
      </Row>
      {isEdit && (
        <Row>
          <Col md={12} className="mb-3 d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              disabled={!identityId}
              onClick={() => setCredentialModal("username")}
            >
              <i className="mdi mdi-account-edit-outline me-1"></i>Change Username
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              disabled={!identityId}
              onClick={() => setCredentialModal("password")}
            >
              <i className="mdi mdi-lock-reset me-1"></i>Change Password
            </button>
          </Col>
        </Row>
      )}
      <Row>
        {!isEdit && (
          <>
            <Col md={6} sm={12}>
              <RHFInput<EmployeeForm> name="password" label="Password" type="password" required />
            </Col>
            <Col md={6} sm={12}>
              <RHFInput<EmployeeForm>
                name="reTypePassword"
                label="Re-type Password"
                type="password"
                required
              />
            </Col>
          </>
        )}
        <Col md={6} sm={12}>
          <RHFInput<EmployeeForm> name="pin" label="Pin" />
        </Col>
        <Col md={6} sm={12} className="d-flex align-items-center">
          <RHFCheckBox<EmployeeForm> name="userActive" label="User Active" />
        </Col>
      </Row>
      <ChangeCredentialModal
        mode={credentialModal}
        identityId={identityId}
        currentUserName={watch("userName")}
        onClose={() => setCredentialModal(null)}
        onUserNameChanged={(name) => setValue("userName", name, { shouldDirty: false })}
      />
    </>
  );
};

export default EmployeePersonalInfo;
