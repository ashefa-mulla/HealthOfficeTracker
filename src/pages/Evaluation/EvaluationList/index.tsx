import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Spinner } from 'reactstrap';
import { RootState } from '@/slices';
import DeleteModal from '@/Components/Common/DeleteModal';
import {
  EvaluationRow,
  EvaluationSubmissionPayload,
} from '@/types/evaluation/evaluation.types';
import {
  fetchEvaluationSummary,
  fetchEvaluationEmployees,
  saveEvaluationQuestion,
  saveEvaluationSubmissions,
  toggleEvaluationLock,
  toggleEvaluationQuestion,
  removeEvaluationQuestion,
} from '@/slices/evaluation/evaluationThunk';
import { clearList } from '@/slices/evaluation/evaluationSlice';
import toastService from '@/services/toastService';
import { useAuthStore } from '@/store/useAuthStore';
import { getNumericEmployeeId, isAdminUser } from '@/helpers/userHelper';
import EvaluationQuestionModal from '../EvaluationQuestionModal';
import EvaluationCommentModal, { WeekNote } from '../EvaluationCommentModal';
import './evaluation.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** This question always sorts last among the active questions (as in the old screen). */
const SPECIAL_QUESTION = 'did you go above and beyond this week? explain?';

type Option = { value: number; label: string };

/** Local (unsaved) change for one question in one week */
interface CellEdit {
  answer?: boolean;
  note?: WeekNote;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Week n of a month = the nth Monday of the month through that Friday
 * (e.g. October 2026: 05-09, 12-16, 19-23, 26-30). Always 4 weeks.
 */
const weekRange = (year: number, month: number, week: number): string => {
  const d = new Date(year, month - 1, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * (week - 1));
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 4);
  const fmt = (x: Date) => `${pad(x.getDate())} ${SHORT_MONTHS[x.getMonth()]}`;
  return `${fmt(start)} - ${fmt(end)}`;
};

/**
 * The week whose evaluation window is open right now: from that week's Friday 00:00
 * through the following Monday 23:59:59 (same rule as the old Angular screen). Null if none.
 */
const evaluationWindowWeek = (year: number, month: number): number | null => {
  const now = new Date();
  const first = new Date(year, month - 1, 1);
  while (first.getDay() !== 1) first.setDate(first.getDate() + 1);
  for (let w = 0; w < 4; w++) {
    const friday = new Date(first.getFullYear(), first.getMonth(), first.getDate() + 7 * w + 4, 0, 0, 0, 0);
    const mondayEnd = new Date(friday.getFullYear(), friday.getMonth(), friday.getDate() + 3, 23, 59, 59, 999);
    if (now >= friday && now <= mondayEnd) return w + 1;
  }
  return null;
};

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 40,
    fontSize: 13,
    borderRadius: 8,
    borderColor: state.isFocused ? '#0b4d9c' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(11, 77, 156, 0.12)' : 'none',
    '&:hover': { borderColor: '#0b4d9c' },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: 13,
    backgroundColor: state.isSelected ? '#0b4d9c' : state.isFocused ? '#eaf1fb' : '#fff',
    color: state.isSelected ? '#fff' : '#334155',
  }),
  placeholder: (base: any) => ({ ...base, color: '#94a3b8' }),
};

const EvaluationList: React.FC = () => {
  document.title = 'Evaluation | HO Tracker';

  const dispatch = useDispatch<any>();
  const now = new Date();
  const { user, profileInfo } = useAuthStore();
  const loggedInEmployeeId = getNumericEmployeeId(profileInfo, user);
  // Admin: all employees + question management + lock. Others (e.g. Ancillary Staff): own evaluation only.
  const isAdmin = isAdminUser(profileInfo);

  const { list, loading, saving, employeeList } = useSelector(
    (state: RootState) => (state as any).Evaluation
  );

  // Filter selections
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(now.getMonth() + 1);
  const [year, setYear] = useState<number | null>(now.getFullYear());

  // Filters applied by the last Search (drive the table, week dates and saving)
  const [applied, setApplied] = useState<{ employeeId: number; month: number; year: number } | null>(null);

  // Unsaved weekly changes, keyed `${questionId}-${week}`
  const [edits, setEdits] = useState<Record<string, CellEdit>>({});

  // Global Additional Points / Comment (saved on Week 4 of the first row, like the old screen)
  const [additionalPoints, setAdditionalPoints] = useState<string>('');
  const [additionalComment, setAdditionalComment] = useState<string>('');

  // Add / Edit question modal
  const [questionModal, setQuestionModal] = useState(false);
  const [editing, setEditing] = useState<EvaluationRow | null>(null);

  // Comment modal
  const [noteTarget, setNoteTarget] = useState<{ row: EvaluationRow; week: number } | null>(null);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const [hasSearched, setHasSearched] = useState(false);

  const employeeOptions: Option[] = useMemo(
    () => (employeeList || []).map((e: any) => ({ value: e.id, label: e.name })),
    [employeeList]
  );
  const monthOptions: Option[] = useMemo(
    () => MONTHS.map((m, i) => ({ value: i + 1, label: m })),
    []
  );
  // Next year down to five years back (as in the old screen)
  const yearOptions: Option[] = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => ({ value: y + 1 - i, label: String(y + 1 - i) }));
  }, []);

  const load = useCallback(
    (f: { employeeId: number; month: number; year: number }) => {
      setEdits({});
      setApplied(f);
      setHasSearched(true);
      return dispatch(
        fetchEvaluationSummary({ employeeId: f.employeeId, evalYear: f.year, evalMonth: f.month })
      );
    },
    [dispatch]
  );

  // Admin: load the employee list, then open on the logged-in employee for the current month.
  // Others: no list - open straight on their own evaluation.
  useEffect(() => {
    dispatch(clearList());
    if (isAdmin) dispatch(fetchEvaluationEmployees());
  }, [dispatch, isAdmin]);

  const [autoLoaded, setAutoLoaded] = useState(false);
  useEffect(() => {
    if (autoLoaded) return;
    if (isAdmin) {
      if (!employeeList || employeeList.length === 0) return;
      setAutoLoaded(true);
      if (loggedInEmployeeId && employeeList.some((e: any) => e.id === loggedInEmployeeId)) {
        setEmployeeId(loggedInEmployeeId);
        load({ employeeId: loggedInEmployeeId, month: now.getMonth() + 1, year: now.getFullYear() });
      }
    } else if (loggedInEmployeeId) {
      setAutoLoaded(true);
      setEmployeeId(loggedInEmployeeId);
      load({ employeeId: loggedInEmployeeId, month: now.getMonth() + 1, year: now.getFullYear() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeList, autoLoaded, loggedInEmployeeId, isAdmin, load]);

  const reload = () => {
    if (applied) load(applied);
  };

  const handleSearch = () => {
    const emp = isAdmin ? employeeId : loggedInEmployeeId;
    if (!emp || !month || !year) {
      toastService.error('Please select employee, month, and year.');
      return;
    }
    load({ employeeId: emp, month, year });
  };

  /**
   * Visibility (same rule as the old screen): active questions always show; a deactivated
   * question shows only while the selected month is on or before its deactivation month.
   * Order: active first (the "go above and beyond" question last), then deactivated newest first.
   */
  const rows: EvaluationRow[] = useMemo(() => {
    const all: EvaluationRow[] = list || [];
    if (!applied) return all;

    const visible = all.filter((r) => {
      if (r.isActive || !r.deactivatedAt) return true;
      const d = new Date(r.deactivatedAt);
      if (isNaN(d.getTime())) return true;
      const deY = d.getFullYear();
      const deM = d.getMonth() + 1;
      return applied.year < deY || (applied.year === deY && applied.month <= deM);
    });

    return [...visible].sort((a, b) => {
      const aSpecial = a.questionText.trim().toLowerCase() === SPECIAL_QUESTION;
      const bSpecial = b.questionText.trim().toLowerCase() === SPECIAL_QUESTION;
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      if (a.isActive && b.isActive) {
        if (aSpecial) return 1;
        if (bSpecial) return -1;
      }
      if (!a.isActive && !b.isActive) {
        const aT = a.deactivatedAt ? new Date(a.deactivatedAt).getTime() : 0;
        const bT = b.deactivatedAt ? new Date(b.deactivatedAt).getTime() : 0;
        return bT - aT;
      }
      return 0;
    });
  }, [list, applied]);

  const isLocked = rows.some((r) => r.isLocked);

  // ---- access rules (non-admin) ---------------------------------------------
  // Past month: read-only. Future month: blocked. Current month: only inside a week's
  // Friday-to-Monday window, and only that week is editable. Admins can edit any week.
  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth() + 1;
  const isPastMonth =
    !!applied && (applied.year < todayYear || (applied.year === todayYear && applied.month < todayMonth));
  const isFutureMonth =
    !!applied && (applied.year > todayYear || (applied.year === todayYear && applied.month > todayMonth));
  const windowWeek = applied ? evaluationWindowWeek(applied.year, applied.month) : null;
  const activeWeek = isAdmin ? windowWeek : isPastMonth ? null : windowWeek;
  const accessAllowed = isAdmin || !applied ? true : isPastMonth ? true : isFutureMonth ? false : activeWeek !== null;
  const canEditWeek = (week: number) => isAdmin || activeWeek === week;
  const dirtyCount = Object.keys(edits).length;

  // Additional points / comment saved with the list (Week 4 of the first visible row)
  const savedPoints = rows.length > 0 ? rows[0].weeks[3].additionalPoints : null;
  const savedComment = rows.length > 0 ? rows[0].weeks[3].additionalComment || '' : '';

  useEffect(() => {
    setAdditionalPoints(savedPoints === null || savedPoints === undefined ? '' : String(savedPoints));
    setAdditionalComment(savedComment);
  }, [savedPoints, savedComment, list]);

  const additionalChanged =
    additionalPoints !== (savedPoints === null || savedPoints === undefined ? '' : String(savedPoints)) ||
    additionalComment.trim() !== savedComment.trim();

  // ---- weekly cell helpers -------------------------------------------------
  const cellKey = (row: EvaluationRow, week: number) => `${row.questionId}-${week}`;

  const cellAnswer = (row: EvaluationRow, week: number): boolean => {
    const e = edits[cellKey(row, week)];
    if (e && e.answer !== undefined) return e.answer;
    return row.weeks[week - 1].answer === true;
  };

  const cellComment = (row: EvaluationRow, week: number): string => {
    const e = edits[cellKey(row, week)];
    if (e && e.note) return e.note.comment;
    return row.weeks[week - 1].comment || '';
  };

  const setAnswer = (row: EvaluationRow, week: number, value: boolean) => {
    setEdits((prev) => ({
      ...prev,
      [cellKey(row, week)]: { ...prev[cellKey(row, week)], answer: value },
    }));
  };

  const openComment = (row: EvaluationRow, week: number) => {
    if (isLocked) {
      toastService.error('This month is locked by admin. You cannot add or edit comments.');
      return;
    }
    if (!canEditWeek(week)) {
      toastService.error('This week is locked. You can only edit during its Friday to Monday window.');
      return;
    }
    if (!row.isActive) return;
    setNoteTarget({ row, week });
  };

  const applyComment = (note: WeekNote) => {
    if (!noteTarget) return;
    const { row, week } = noteTarget;
    setEdits((prev) => ({
      ...prev,
      [cellKey(row, week)]: { ...prev[cellKey(row, week)], note },
    }));
    setNoteTarget(null);
  };

  // ---- submit evaluation -----------------------------------------------------
  const handleSubmitEvaluation = async () => {
    if (isLocked) {
      toastService.error('This evaluation month is locked by the admin. You cannot submit changes.');
      return;
    }
    if (!applied) {
      toastService.error('Please select employee, month and year before saving.');
      return;
    }
    if (dirtyCount === 0 && !(isAdmin && additionalChanged)) {
      toastService.info('No changes to save.');
      return;
    }

    const today = new Date();
    const updatedDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const firstRow = rows[0];
    const points = additionalPoints.trim() === '' ? null : Number(additionalPoints);

    const payload: EvaluationSubmissionPayload[] = [];
    rows.forEach((row) => {
      [1, 2, 3, 4].forEach((week) => {
        // Additional points/comment live only on Week 4 of the first row
        if (!canEditWeek(week)) return;
        const isExtraCell = isAdmin && week === 4 && row.questionId === firstRow.questionId;
        if (!edits[cellKey(row, week)] && !(isExtraCell && additionalChanged)) return;
        payload.push({
          id: Number(row.weeks[week - 1].id || 0),
          employeeId: applied.employeeId,
          questionId: row.questionId,
          answer: cellAnswer(row, week),
          comment: cellComment(row, week),
          evalYear: applied.year,
          evalMonth: applied.month,
          weekOfMonth: week,
          additionalPoints: isExtraCell ? points : null,
          additionalComment: isExtraCell ? additionalComment.trim() : '',
          updatedDate,
        });
      });
    });

    if (payload.length === 0) {
      toastService.error('None of the modifications are within an active week window.');
      return;
    }

    try {
      await dispatch(saveEvaluationSubmissions(payload)).unwrap();
      if (!isAdmin) {
        toastService.info('This evaluation can be accessed only from Friday to Monday at midnight.');
      }
      reload();
    } catch {
      // error toast shown by the thunk
    }
  };

  // ---- summary: checked answers per week (visible rows) + additional points ---
  const weekTotals = [1, 2, 3, 4].map((week) =>
    rows.reduce((sum, row) => sum + (cellAnswer(row, week) ? 1 : 0), 0)
  );
  const grandTotal = weekTotals.reduce((x, y) => x + y, 0) + Number(additionalPoints || 0);

  // ---- lock ------------------------------------------------------------------
  const handleToggleLock = async (checked: boolean) => {
    if (!applied) return;
    try {
      await dispatch(
        toggleEvaluationLock({
          employeeId: applied.employeeId,
          evalYear: applied.year,
          evalMonth: applied.month,
          isLocked: checked,
          lockedBy: loggedInEmployeeId || null,
        })
      ).unwrap();
    } catch {
      // error toast shown by the thunk
    }
  };

  // ---- question actions ----------------------------------------------------
  const openAdd = () => {
    if (!employeeId) {
      toastService.error('Please select an employee first.');
      return;
    }
    setEditing(null);
    setQuestionModal(true);
  };

  const handleSubmitQuestion = async (questionText: string) => {
    const target = editing ? applied?.employeeId ?? employeeId : employeeId;
    if (!target) return;
    try {
      await dispatch(
        saveEvaluationQuestion({
          id: editing ? editing.questionId : 0,
          employeeId: target,
          questionText,
          isActive: editing ? editing.isActive : true,
          deactivatedAt: editing ? editing.deactivatedAt : null,
        })
      ).unwrap();
      setQuestionModal(false);
      load(
        applied && editing
          ? applied
          : { employeeId: target, month: month || now.getMonth() + 1, year: year || now.getFullYear() }
      );
    } catch {
      // error toast shown by the thunk
    }
  };

  const handleToggleQuestion = async (row: EvaluationRow) => {
    const action = row.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this question?`)) return;
    try {
      await dispatch(toggleEvaluationQuestion(row.questionId)).unwrap();
      reload();
    } catch {
      // error toast shown by the thunk
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeEvaluationQuestion(selectedDeleteId)).unwrap();
      reload();
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const appliedEmployeeName =
    employeeOptions.find((o) => o.value === applied?.employeeId)?.label || '';
  const activeQuestionCount = rows.filter((r) => r.isActive).length;

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <div className="evaluation-page">
          {/* Page header */}
          <div className="page-header-box evaluation-header">
            <div className="evaluation-heading">
              <span className="evaluation-heading-icon">
                <i className="mdi mdi-clipboard-check-outline"></i>
              </span>
              <div>
                <h1 className="page-title-main">Monthly Evaluation Summary</h1>
                <p className="breadcrumb-nav-custom mt-1">
                  {applied
                    ? [appliedEmployeeName, `${MONTHS[applied.month - 1]} ${applied.year}`]
                        .filter(Boolean)
                        .join(' · ')
                    : 'Review and score weekly performance questions'}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="tracker-card evaluation-filter-card">
            <div className="tracker-card-body">
              <div className="row g-3 align-items-end">
                {isAdmin && (
                <div className="col-lg-4 col-md-12">
                  <label className="evaluation-filter-label">
                    <i className="mdi mdi-account-outline"></i> Employee
                  </label>
                  <Select
                    options={employeeOptions}
                    value={employeeOptions.find((o) => o.value === employeeId) || null}
                    onChange={(o) => setEmployeeId((o as Option | null)?.value ?? null)}
                    placeholder="Select Employee"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                  />
                </div>
                )}
                <div className={isAdmin ? 'col-lg-3 col-md-6' : 'col-lg-5 col-md-6'}>
                  <label className="evaluation-filter-label">
                    <i className="mdi mdi-calendar-month-outline"></i> Month
                  </label>
                  <Select
                    options={monthOptions}
                    value={monthOptions.find((o) => o.value === month) || null}
                    onChange={(o) => setMonth((o as Option | null)?.value ?? null)}
                    isClearable
                    placeholder="Select Month"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                  />
                </div>
                <div className={isAdmin ? 'col-lg-3 col-md-6' : 'col-lg-5 col-md-6'}>
                  <label className="evaluation-filter-label">
                    <i className="mdi mdi-calendar-outline"></i> Year
                  </label>
                  <Select
                    options={yearOptions}
                    value={yearOptions.find((o) => o.value === year) || null}
                    onChange={(o) => setYear((o as Option | null)?.value ?? null)}
                    isClearable
                    placeholder="Select Year"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                  />
                </div>
                <div className="col-lg-2 col-md-12">
                  <button
                    type="button"
                    className="btn-form-action-save evaluation-search-btn"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <i className="mdi mdi-magnify"></i> Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Add Question - sits above the Weekly Questions section */}
          {isAdmin && (
            <div className="evaluation-toolbar">
              <button type="button" className="btn-task-add-new evaluation-add-btn" onClick={openAdd}>
                <i className="mdi mdi-plus"></i> Add Question
              </button>
            </div>
          )}

          {/* Restricted (non-admin outside the Friday-Monday window / future month) */}
          {!accessAllowed && (
            <div className="tracker-card evaluation-restricted">
              <div className="tracker-card-body">
                <i className="mdi mdi-lock-clock"></i>
                <h4>Access Restricted</h4>
                <p>
                  The <strong>evaluation form</strong> is accessible only from{' '}
                  <strong>Friday</strong> to <strong>Monday midnight</strong>.
                </p>
                <p className="evaluation-restricted-tip">
                  Tip: set a reminder every Friday to complete your evaluation before access is
                  restricted. You can still review past months using the filters above.
                </p>
              </div>
            </div>
          )}

          {/* Empty / no-data states */}
          {accessAllowed && rows.length === 0 && (
            <div className="tracker-card evaluation-empty-card">
              <div className="tracker-card-body">
                {loading ? (
                  <>
                    <Spinner color="primary" />
                    <p>Loading evaluation...</p>
                  </>
                ) : hasSearched ? (
                  <>
                    <i className="mdi mdi-clipboard-text-off-outline"></i>
                    <h5>No evaluation data found</h5>
                    <p>There are no questions for the selected employee, month and year.</p>
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-clipboard-search-outline"></i>
                    <h5>Select an employee</h5>
                    <p>Choose an employee, month and year, then press Search.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {accessAllowed && rows.length > 0 && (
            <>
              {/* Questions table */}
              <div className="tracker-card evaluation-table-card">
                <div className="evaluation-card-head">
                  <div>
                    <h5>Weekly Questions</h5>
                    <span>
                      {activeQuestionCount} active · {rows.length - activeQuestionCount} deactivated
                    </span>
                  </div>
                  <span className={`evaluation-state-chip ${isLocked ? 'locked' : 'open'}`}>
                    <i className={`mdi ${isLocked ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'}`}></i>
                    {isLocked ? 'Locked' : 'Open'}
                  </span>
                </div>

                <div className="evaluation-table-wrap">
                  <table className="evaluation-table">
                    <thead>
                      <tr>
                        <th className="text-start">Question</th>
                        {[1, 2, 3, 4].map((w) => (
                          <th key={w} className={activeWeek === w ? 'is-current' : ''}>
                            <span className="evaluation-week-name">Week {w}</span>
                            {applied && (
                              <span className="evaluation-week-range">
                                {weekRange(applied.year, applied.month, w)}
                              </span>
                            )}
                            {activeWeek === w && <span className="evaluation-week-now">Open now</span>}
                          </th>
                        ))}
                        {isAdmin && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={row.questionId}
                          className={row.isActive ? '' : 'evaluation-inactive'}
                        >
                          <td className="evaluation-question">
                            <div className="evaluation-question-inner">
                              <span className="evaluation-no">{index + 1}</span>
                              <div>
                                <div className="evaluation-question-text">{row.questionText}</div>
                                {!row.isActive && row.deactivatedAt && (
                                  <span className="evaluation-deactivated">
                                    Deactivated on {row.deactivatedAt.substring(0, 10)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          {[1, 2, 3, 4].map((week) => (
                            <td
                              key={week}
                              className={`evaluation-week ${activeWeek === week ? 'is-current' : ''} ${
                                !canEditWeek(week) ? 'is-blurred' : ''
                              }`}
                            >
                              <div className="evaluation-week-cell">
                                <input
                                  type="checkbox"
                                  checked={cellAnswer(row, week)}
                                  disabled={isLocked || !row.isActive || !canEditWeek(week)}
                                  onChange={(e) => setAnswer(row, week, e.target.checked)}
                                />
                                <button
                                  type="button"
                                  className={`evaluation-comment-btn ${cellComment(row, week) ? 'has-note' : ''}`}
                                  title={
                                    isLocked
                                      ? 'Evaluation locked by admin'
                                      : cellComment(row, week) || 'Add comment'
                                  }
                                  onClick={() => openComment(row, week)}
                                >
                                  <i
                                    className={`mdi ${
                                      cellComment(row, week)
                                        ? 'mdi-comment-text'
                                        : 'mdi-comment-outline'
                                    }`}
                                  ></i>
                                </button>
                              </div>
                            </td>
                          ))}
                          {isAdmin && (
                          <td className="evaluation-actions">
                            <button
                              type="button"
                              className="evaluation-action-btn edit"
                              title="Edit Question"
                              onClick={() => {
                                setEditing(row);
                                setQuestionModal(true);
                              }}
                            >
                              <i className="mdi mdi-pencil-outline"></i>
                            </button>
                            <button
                              type="button"
                              className={`evaluation-action-btn ${row.isActive ? 'power-on' : 'power-off'}`}
                              title={row.isActive ? 'Deactivate Question' : 'Activate Question'}
                              disabled={saving}
                              onClick={() => handleToggleQuestion(row)}
                            >
                              <i className="mdi mdi-power"></i>
                            </button>
                            <button
                              type="button"
                              className="evaluation-action-btn remove"
                              title="Delete Question"
                              onClick={() => {
                                setSelectedDeleteId(row.questionId);
                                setDeleteModal(true);
                              }}
                            >
                              <i className="mdi mdi-trash-can-outline"></i>
                            </button>
                          </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lock + additional points (admin) */}
              {isAdmin && (
              <div className="evaluation-options">
                <div className="evaluation-option">
                  <span className="evaluation-option-icon lock">
                    <i className="mdi mdi-lock-outline"></i>
                  </span>
                  <div className="evaluation-option-body">
                    <label htmlFor="evaluationLock">Lock Evaluation for this Employee</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="evaluationLock"
                        checked={isLocked}
                        disabled={saving}
                        onChange={(e) => handleToggleLock(e.target.checked)}
                      />
                      <span className="evaluation-switch-text">{isLocked ? 'Locked' : 'Unlocked'}</span>
                    </div>
                  </div>
                </div>

                <div className="evaluation-option">
                  <span className="evaluation-option-icon points">
                    <i className="mdi mdi-star-outline"></i>
                  </span>
                  <div className="evaluation-option-body">
                    <label htmlFor="evaluationPoints">Additional Points</label>
                    <input
                      id="evaluationPoints"
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={additionalPoints}
                      disabled={isLocked}
                      onChange={(e) => setAdditionalPoints(e.target.value)}
                    />
                  </div>
                </div>

                <div className="evaluation-option">
                  <span className="evaluation-option-icon comment">
                    <i className="mdi mdi-comment-text-outline"></i>
                  </span>
                  <div className="evaluation-option-body">
                    <label htmlFor="evaluationPointsComment">Additional Point Comment</label>
                    <textarea
                      id="evaluationPointsComment"
                      className="form-control"
                      rows={1}
                      placeholder="Write comment..."
                      value={additionalComment}
                      disabled={isLocked}
                      onChange={(e) => setAdditionalComment(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              )}

              {/* Submit */}
              <div className="evaluation-submit-row">
                <button
                  type="button"
                  className="btn-form-action-save evaluation-submit-btn"
                  disabled={saving}
                  onClick={handleSubmitEvaluation}
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" className="me-2 text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-check-circle-outline"></i> Submit Evaluation
                    </>
                  )}
                </button>
                {(dirtyCount > 0 || (isAdmin && additionalChanged)) && (
                  <span className="evaluation-unsaved">
                    <i className="mdi mdi-circle-medium"></i> Unsaved changes
                  </span>
                )}
              </div>

              {/* Summary tiles */}
              <div className="evaluation-summary">
                <h5 className="evaluation-summary-title">
                  <i className="mdi mdi-chart-box-outline"></i> Monthly Evaluation Summary
                </h5>
                <div className="evaluation-tiles">
                  {weekTotals.map((t, i) => (
                    <div key={i} className={`evaluation-tile week-${i + 1}`}>
                      <span className="evaluation-tile-label">Week {i + 1}</span>
                      <span className="evaluation-tile-value">{t}</span>
                    </div>
                  ))}
                  <div className="evaluation-tile total">
                    <span className="evaluation-tile-label">Week Total</span>
                    <span className="evaluation-tile-value">{grandTotal}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Add / Edit Question Modal */}
        <EvaluationQuestionModal
          isOpen={questionModal}
          questionId={editing ? editing.questionId : 0}
          initialText={editing ? editing.questionText : ''}
          saving={saving}
          onClose={() => setQuestionModal(false)}
          onSubmit={handleSubmitQuestion}
        />

        {/* Comment Modal */}
        <EvaluationCommentModal
          isOpen={!!noteTarget}
          weekLabel={noteTarget ? `Week ${noteTarget.week}` : ''}
          value={{
            comment: noteTarget ? cellComment(noteTarget.row, noteTarget.week) : '',
            additionalPoints: null,
            additionalComment: '',
          }}
          readOnly={isLocked}
          onClose={() => setNoteTarget(null)}
          onApply={applyComment}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleConfirmDelete}
          onCloseClick={() => setDeleteModal(false)}
          loading={saving}
        />
      </div>
    </React.Fragment>
  );
};

export default EvaluationList;
