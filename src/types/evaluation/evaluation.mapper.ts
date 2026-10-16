import { EvaluationRow, EvaluationWeek } from "./evaluation.types";

/** Case-insensitive lookup so camelCase spelling differences (questionID / questionId) never matter. */
const pick = (row: any, name: string): any => {
  const wanted = name.toLowerCase();
  for (const key of Object.keys(row || {})) {
    if (key.toLowerCase() === wanted) return row[key];
  }
  return null;
};

const toBoolOrNull = (v: any): boolean | null => {
  if (v === null || v === undefined || v === "") return null;
  return v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";
};

const textOrNull = (v: any): string | null =>
  v === undefined || v === null || v === "" ? null : String(v);

const toWeek = (row: any, n: number): EvaluationWeek => ({
  id: pick(row, `week${n}Id`) ? Number(pick(row, `week${n}Id`)) : null,
  answer: toBoolOrNull(pick(row, `week${n}Answer`)),
  comment: textOrNull(pick(row, `week${n}Comment`)),
  additionalPoints:
    pick(row, `week${n}AdditionalPoints`) === null
      ? null
      : Number(pick(row, `week${n}AdditionalPoints`)),
  additionalComment: textOrNull(pick(row, `week${n}AdditionalComment`)),
});

export const toEvaluationRow = (row: any): EvaluationRow => ({
  questionId: Number(pick(row, "questionId") || 0),
  questionText: String(pick(row, "questionText") ?? ""),
  isActive: pick(row, "isActive") !== false,
  deactivatedAt: textOrNull(pick(row, "deactivatedAt")),
  isLocked: Boolean(pick(row, "isLocked")),
  lockId: Number(pick(row, "lockId") || 0),
  weeks: [1, 2, 3, 4].map((n) => toWeek(row, n)),
});
