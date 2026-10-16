/**
 * Evaluation types (Admin > Evaluation)
 * Backend: EmployeeController (getmonthlyevaluationsummary, addeditevaluationquestion, ...)
 */

/** One week of an evaluation question */
export interface EvaluationWeek {
  id: number | null;
  /** true = Yes, false = No, null = not answered */
  answer: boolean | null;
  comment: string | null;
  additionalPoints: number | null;
  additionalComment: string | null;
}

/** Normalised row from GET /api/employee/getmonthlyevaluationsummary (sp_getmonthlyevaluationsummary_Result) */
export interface EvaluationRow {
  questionId: number;
  questionText: string;
  isActive: boolean;
  deactivatedAt: string | null;
  isLocked: boolean;
  /** Id of the lock record for this employee/month (0 = none yet) */
  lockId: number;
  /** Always 4 entries: Week 1..4 */
  weeks: EvaluationWeek[];
}

/** One weekly answer for POST /api/employee/addmonthlyevaluationsubmission (EvaluationSubmissionModel) */
export interface EvaluationSubmissionPayload {
  id: number;
  employeeId: number;
  questionId: number;
  answer: boolean;
  comment: string;
  evalYear: number;
  evalMonth: number;
  weekOfMonth: number;
  additionalPoints: number | null;
  additionalComment: string;
  /** "YYYY-MM-DD" */
  updatedDate: string;
}

/** Payload for POST /api/employee/addeditevaluationquestion (EvaluationQuestionModel) */
export interface EvaluationQuestionPayload {
  id: number;
  employeeId: number;
  questionText: string;
  isActive: boolean;
  deactivatedAt: string | null;
}

/** Payload for POST /api/employee/lockevaluation (EvaluationLockModel) */
export interface EvaluationLockPayload {
  id: number;
  employeeId: number;
  evalYear: number;
  evalMonth: number;
  isLocked: boolean;
  lockedAt: string | null;
  lockedBy: number | null;
}
