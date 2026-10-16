import { EmployeeForm } from "./employee.schema";
import { formatLocalDateToIso } from "@/helpers/dateHelper";

const text = (v: any) => (v === undefined || v === null ? "" : String(v));
const idOrNull = (v: any) => (v ? Number(v) : null);

/** Resolve a stored file path (e.g. "FileServer\\Employer\\x.png") to a browser URL. */
export const getFileUrl = (path?: string | null): string | null => {
  if (!path || path.trim() === "" || path.toLowerCase() === "nofile") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = (
    import.meta.env.VITE_API_FILE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "https://localhost:44301"
  ).replace(/\/+$/, "");
  return `${base}/${path.replace(/\\/g, "/").replace(/^\/+/, "")}`;
};

export const emptyEmployeeForm = (): EmployeeForm => ({
  id: 0,
  userId: 0,
  identityId: "",
  employerCode: "",
  firstname: "",
  middlename: "",
  lastname: "",
  designationid: null,
  dob: "",
  joiningDate: formatLocalDateToIso(new Date()),
  relieveDate: "",
  maritalStatus: "",
  payrollOn: false,
  noOfChild: null,
  active: true,
  profileimage: "",
  cvdoc: "",
  agreementDoc: "",
  primaryContact: "",
  primaryEmail: "",
  alternateContact: "",
  alternateEmail: "",
  emergencycontactperson: "",
  emergencycontact: "",
  addressLine1: "",
  addressLine2: "",
  countryId: null,
  stateId: null,
  cityId: null,
  zip: "",
  timezone: "",
  comments: "",
  userName: "",
  password: "",
  reTypePassword: "",
  userType: null as any,
  pin: "",
  userActive: true,
});

/** GET /api/Employee/get/{id} returns EmployeeModel with a nested userMaster. */
export const toEmployeeForm = (data: any): EmployeeForm => {
  const user = data?.userMaster || {};
  return {
    id: Number(data?.id || 0),
    userId: Number(data?.userId || 0),
    identityId: text(user.identityID ?? user.identityId),
    employerCode: text(data?.employerCode),
    firstname: text(data?.firstname),
    middlename: text(data?.middlename),
    lastname: text(data?.lastname),
    designationid: idOrNull(data?.designationid),
    dob: data?.dob ? formatLocalDateToIso(data.dob) : "",
    joiningDate: data?.joiningDate ? formatLocalDateToIso(data.joiningDate) : "",
    relieveDate: data?.relieveDate ? formatLocalDateToIso(data.relieveDate) : "",
    maritalStatus: text(data?.maritalStatus),
    payrollOn: Boolean(data?.payrollOn),
    noOfChild: data?.noOfChild === null || data?.noOfChild === undefined ? null : Number(data.noOfChild),
    active: data?.active !== false,
    profileimage: getFileUrl(data?.profileimage) ? text(data?.profileimage) : "",
    cvdoc: getFileUrl(data?.cvdoc) ? text(data?.cvdoc) : "",
    agreementDoc: getFileUrl(data?.agreementDoc) ? text(data?.agreementDoc) : "",
    primaryContact: text(data?.primaryContact),
    primaryEmail: text(data?.primaryEmail),
    alternateContact: text(data?.alternateContact),
    alternateEmail: text(data?.alternateEmail),
    emergencycontactperson: text(data?.emergencycontactperson),
    emergencycontact: text(data?.emergencycontact),
    addressLine1: text(data?.addressLine1),
    addressLine2: text(data?.addressLine2),
    countryId: idOrNull(data?.countryId),
    stateId: idOrNull(data?.stateId),
    cityId: idOrNull(data?.cityId),
    zip: text(data?.zip),
    timezone: text(data?.timezone),
    comments: text(data?.comments),
    userName: text(user.userName),
    password: "",
    reTypePassword: "",
    userType: idOrNull(user.userType) as any,
    pin: text(user.pin),
    userActive: user.active !== false,
  };
};

const dateOrNull = (v: any) => (v ? formatLocalDateToIso(v) : null);

/**
 * Payload for POST /api/Employee/AddEditEmployee (EmployeeFormModel).
 * `raw` is the record loaded by get/{id}; its fields that are not on the form
 * (documents, title, branch...) are sent back unchanged so an update never blanks them.
 */
export const toEmployeeFormModel = (form: EmployeeForm, raw: any, updatedBy: string) => {
  const isEdit = Number(form.id || 0) > 0;
  const { userMaster: _userMaster, ...rawProfile } = raw || {};

  return {
    employeeProfile: {
      ...rawProfile,
      id: Number(form.id || 0),
      userId: Number(form.userId || 0),
      companyId: Number(rawProfile.companyId || localStorage.getItem("companyid") || 1),
      branch: Number(rawProfile.branch || localStorage.getItem("branchid") || 1),
      employerCode: form.employerCode || "0000",
      firstname: form.firstname.trim(),
      middlename: form.middlename || "",
      lastname: form.lastname.trim(),
      designationid: form.designationid,
      dob: dateOrNull(form.dob),
      joiningDate: dateOrNull(form.joiningDate),
      relieveDate: dateOrNull(form.relieveDate),
      maritalStatus: form.maritalStatus || "",
      payrollOn: Boolean(form.payrollOn),
      noOfChild: form.noOfChild,
      addressLine1: form.addressLine1 || "",
      addressLine2: form.addressLine2 || "",
      countryId: form.countryId || 0,
      stateId: form.stateId || 0,
      cityId: form.cityId || 0,
      zip: form.zip || "",
      timezone: form.timezone || "",
      primaryContact: form.primaryContact || "",
      primaryEmail: form.primaryEmail || "",
      alternateContact: form.alternateContact || "",
      alternateEmail: form.alternateEmail || "",
      emergencycontactperson: form.emergencycontactperson || "",
      emergencycontact: form.emergencycontact || "",
      comments: form.comments || "",
      profileimage: form.profileimage || "NoFile",
      cvdoc: form.cvdoc || "NoFile",
      agreementDoc: form.agreementDoc || "NoFile",
      active: Boolean(form.active),
      updatedBy: updatedBy || "admin",
      updatedDate: new Date().toISOString(),
    },
    userDetail: {
      userId: Number(form.userId || 0),
      userName: form.userName.trim(),
      // The API model marks Password/ReTypePassword as [Required]. On edit they are
      // ignored by the update branch (passwords are changed via ChangePassword), so a
      // matching placeholder is sent to satisfy model validation.
      password: isEdit ? "NotChanged@1" : form.password || "",
      reTypePassword: isEdit ? "NotChanged@1" : form.reTypePassword || "",
      userType: Number(form.userType),
      pin: form.pin || "",
      menu: raw?.userMaster?.menu || "",
      active: Boolean(form.userActive),
      identityID: form.identityId || "",
    },
  };
};
