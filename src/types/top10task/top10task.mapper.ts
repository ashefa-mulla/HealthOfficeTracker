import { Top10TaskForm } from "./top10task.schema";
import { Top10TaskModel } from "./top10task.types";
import { formatLocalDateToIso } from "@/helpers/dateHelper";

export const emptyTop10TaskForm = (loggedInUserId?: number): Top10TaskForm => ({
  id: 0,
  pointPerson: null as any,
  secondPerson: null,
  accountablePerson: loggedInUserId || null,
  project: null as any,
  subproject: null as any,
  subProjectCategory: null as any,
  task: "",
  subject: "",
  completed: "Not Started",
  duration: 0,
  projected: 0,
  eta: formatLocalDateToIso(new Date()),
  etaHour: "00",
  etaMinute: "00",
  actualTime: 0,
  createdTime: formatLocalDateToIso(new Date()),
  assignDate: formatLocalDateToIso(new Date()),
  isRecurrent: false,
});

export const toTop10TaskForm = (
  data: Top10TaskModel | any,
  isClone: boolean = false,
  loggedInUserId?: number
): Top10TaskForm => {
  let etaH = 0;
  let etaM = 0;

  if (typeof data?.etaTime === "object" && data?.etaTime !== null) {
    etaH = Number((data.etaTime as any).hour || 0);
    etaM = Number((data.etaTime as any).minute || 0);
  } else if (typeof data?.etaTime === "number") {
    etaH = Math.floor(data.etaTime / 60);
    etaM = data.etaTime % 60;
  } else if (data?.etahh !== undefined || data?.etamm !== undefined) {
    etaH = Number(data.etahh || 0);
    etaM = Number(data.etamm || 0);
  } else if (data?.projected) {
    etaH = Math.floor(Number(data.projected) / 60);
    etaM = Number(data.projected) % 60;
  }

  return {
    id: isClone ? 0 : Number(data?.id || 0),
    pointPerson: data?.pointPerson ? Number(data.pointPerson) : (null as any),
    secondPerson: isClone
      ? data?.pointPerson ? Number(data.pointPerson) : null
      : (data?.secondPerson ? Number(data.secondPerson) : (data?.pointPerson ? Number(data.pointPerson) : null)),
    accountablePerson: isClone
      ? (loggedInUserId || null)
      : (data?.accountablePerson ? Number(data.accountablePerson) : (loggedInUserId || null)),
    project: data?.project ? Number(data.project) : (null as any),
    subproject: data?.subproject ? Number(data.subproject) : (null as any),
    subProjectCategory: data?.subProjectCategory ? Number(data.subProjectCategory) : (null as any),
    task: data?.task || "",
    subject: data?.subject || "",
    completed: isClone ? "Not Started" : (data?.completed || "Not Started"),
    duration: isClone ? 0 : Number(data?.duration || 0),
    projected: isClone ? 0 : Number(data?.projected || 0),
    eta: isClone
      ? formatLocalDateToIso(new Date())
      : (data?.eta ? formatLocalDateToIso(data.eta) : formatLocalDateToIso(new Date())),
    etaHour: isClone ? "00" : String(etaH ?? 0).padStart(2, "0"),
    etaMinute: isClone ? "00" : String(etaM ?? 0).padStart(2, "0"),
    actualTime: isClone ? 0 : Number(data?.actualTime || 0),
    createdTime: formatLocalDateToIso(new Date()),
    assignDate: isClone
      ? formatLocalDateToIso(new Date())
      : (data?.assignDate ? formatLocalDateToIso(data.assignDate) : formatLocalDateToIso(new Date())),
    isRecurrent: isClone ? false : Boolean(data?.isRecurrent),
  };
};

export const toTop10TaskModel = (
  form: Top10TaskForm,
  isClone: boolean = false,
  loggedInUserId?: number
): Top10TaskModel => {
  const submitId = isClone ? 0 : Number(form.id || 0);
  const totalMinutes =
    (parseInt(form.etaHour || "0", 10) || 0) * 60 +
    (parseInt(form.etaMinute || "0", 10) || 0);

  const pointPersonId = Number(form.pointPerson) || null;
  const secondPersonId =
    submitId === 0
      ? pointPersonId
      : (Number(form.secondPerson) || pointPersonId);
  const accountableId =
    submitId === 0
      ? (loggedInUserId || null)
      : (Number(form.accountablePerson) || loggedInUserId || null);

  return {
    id: submitId,
    pointPerson: pointPersonId,
    secondPerson: secondPersonId,
    accountablePerson: accountableId,
    project: Number(form.project) || null,
    subproject: Number(form.subproject) || null,
    subProjectCategory: Number(form.subProjectCategory) || null,
    task: form.task || "",
    subject: (form.subject || "").trim(),
    completed: form.completed || "Not Started",
    duration: Number(form.duration || 0),
    projected: totalMinutes,
    eta: form.eta ? formatLocalDateToIso(form.eta) : formatLocalDateToIso(new Date()),
    etaTime: totalMinutes,
    etahh: parseInt(form.etaHour || "0", 10) || 0,
    etamm: parseInt(form.etaMinute || "0", 10) || 0,
    actualTime: submitId === 0 ? 0 : Number(form.actualTime || 0),
    createdTime: form.createdTime ? formatLocalDateToIso(form.createdTime) : formatLocalDateToIso(new Date()),
    assignDate: form.assignDate ? formatLocalDateToIso(form.assignDate) : formatLocalDateToIso(new Date()),
    isRecurrent: Boolean(form.isRecurrent),
  };
};
