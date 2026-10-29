import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Spinner, Table } from 'reactstrap';
import './employeeWorkSummary.scss';
import dashboardService from '@/services/dashboardService';
import {
  EmployeeActivityDetail,
  EmployeeWorkTimeSummary,
} from '@/types/dashboard/dashboard.types';

const todayYmd = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatClock = (value?: string): string =>
  value
    ? new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '-';

const formatSeconds = (total: number): string => {
  const s = Math.max(0, Math.round(total || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(sec).padStart(2, '0')}s`;
  return `${sec}s`;
};

interface Props {
  /** Set for non-admin users: limits the summary and details to this employee only */
  employeeId?: number;
}

/** Everyone's tracked hours for a day (admin) or just the signed-in employee's own (employeeId set) */
const EmployeeWorkSummary: React.FC<Props> = ({ employeeId }) => {
  const isPersonal = employeeId !== undefined;
  const [reportDate, setReportDate] = useState<string>(todayYmd());
  const [rows, setRows] = useState<EmployeeWorkTimeSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selected, setSelected] = useState<EmployeeWorkTimeSummary | null>(null);
  const [details, setDetails] = useState<EmployeeActivityDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string>('');

  const loadSummary = useCallback(async (date: string) => {
    // A personal view without a valid employee id must never fall back to "all employees"
    if (isPersonal && !employeeId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await dashboardService.getEmployeeWorkTimeSummary(date, employeeId);
      const list = Array.isArray(res) ? res : [];
      // Defensive: only keep own rows in the personal view
      const visible = isPersonal ? list.filter((r) => r.employeeId === employeeId) : list;
      setRows([...visible].sort((a, b) => b.totalSeconds - a.totalSeconds));
    } catch (err) {
      console.warn('[Dashboard] Error fetching employee work time summary:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId, isPersonal]);

  useEffect(() => {
    loadSummary(reportDate);
  }, [reportDate, loadSummary]);

  const openDetails = async (row: EmployeeWorkTimeSummary) => {
    setSelected(row);
    setDetails([]);
    setDetailsError('');
    setDetailsLoading(true);
    try {
      const res = await dashboardService.getEmployeeActivityDetails(reportDate, row.employeeId);
      setDetails(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('[Dashboard] Error fetching employee activity details:', err);
      setDetailsError('Failed to load activity details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const totals = useMemo(
    () => ({
      seconds: rows.reduce((sum, r) => sum + (r.totalSeconds || 0), 0),
      meeting: rows.reduce((sum, r) => sum + (r.meetingSeconds || 0), 0),
    }),
    [rows]
  );

  const maxSeconds = Math.max(1, ...rows.map((r) => r.totalSeconds || 0));

  // Per-application breakdown for the open modal
  const appBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    details.forEach((d) => {
      const key = d.applicationName || d.processName || 'Unknown';
      map.set(key, (map.get(key) || 0) + (d.durationSeconds || 0));
    });
    return Array.from(map.entries())
      .map(([name, seconds]) => ({ name, seconds }))
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, 6);
  }, [details]);

  const avgSeconds = rows.length ? totals.seconds / rows.length : 0;
  const initials = (name?: string) =>
    (name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');

  const kpis = [
    isPersonal
      ? { icon: 'mdi-cursor-default-click-outline', label: 'Activities', value: String(rows[0]?.activityCount ?? 0), tone: 'blue' }
      : { icon: 'mdi-account-group-outline', label: 'Employees Tracked', value: String(rows.length), tone: 'blue' },
    { icon: 'mdi-timer-outline', label: 'Total Time', value: formatSeconds(totals.seconds), tone: 'green' },
    isPersonal
      ? { icon: 'mdi-apps', label: 'Applications Used', value: String(rows[0]?.applicationCount ?? 0), tone: 'purple' }
      : { icon: 'mdi-chart-timeline-variant', label: 'Average / Employee', value: formatSeconds(avgSeconds), tone: 'purple' },
    { icon: 'mdi-video-outline', label: 'In Meetings', value: formatSeconds(totals.meeting), tone: 'orange' },
  ];

  return (
    <section id="workSummarySection" className="ews mb-4">
      <div className="ews-header">
        <div className="ews-heading">
          <span className="ews-heading-icon">
            <i className="mdi mdi-timer-outline"></i>
          </span>
          <div>
            <h5 className="ews-heading-title">{isPersonal ? 'My Work Summary' : 'Employee Work Summary'}</h5>
            <div className="ews-heading-sub">{isPersonal ? 'Your tracked hours for the selected day' : 'Tracked hours per employee for the selected day'}</div>
          </div>
        </div>
        <div className="ews-date">
          <i className="mdi mdi-calendar-month-outline"></i>
          <input
            id="workSummaryDate"
            type="date"
            value={reportDate}
            max={todayYmd()}
            onChange={(e) => e.target.value && setReportDate(e.target.value)}
          />
        </div>
      </div>

      <div className="ews-kpis">
        {kpis.map((k) => (
          <div key={k.label} className={`ews-kpi ews-kpi-${k.tone}`}>
            <span className="ews-kpi-icon">
              <i className={`mdi ${k.icon}`}></i>
            </span>
            <div>
              <div className="ews-kpi-value">{k.value}</div>
              <div className="ews-kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ews-card">
        {loading ? (
          <div className="text-center py-5">
            <Spinner color="primary" />
            <div className="mt-2 text-muted small">Loading work summary...</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="ews-empty">
            <i className="mdi mdi-timer-sand-empty"></i>
            <p className="mb-0 fw-medium">No tracked activity for this date</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table className="ews-table mb-0">
              <thead>
                <tr>
                  {!isPersonal && <th style={{ width: 50 }}>#</th>}
                  <th style={{ textAlign: 'left' }}>Employee</th>
                  <th>Active Window</th>
                  <th style={{ minWidth: 220 }}>Total Time</th>
                  <th>Meetings</th>
                  <th>Activities</th>
                  <th>Apps</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => {
                  const pct = ((r.totalSeconds || 0) / maxSeconds) * 100;
                  const tone = r.totalSeconds >= 6 * 3600 ? 'good' : r.totalSeconds >= 3 * 3600 ? 'avg' : 'low';
                  return (
                    <tr key={`work-${r.employeeId}`}>
                      {!isPersonal && (
                        <td>
                          <span className="ews-rank">{idx + 1}</span>
                        </td>
                      )}
                      <td style={{ textAlign: 'left' }}>
                        <div className="ews-emp">
                          <span className="ews-avatar">{initials(r.employeeName)}</span>
                          <span className="ews-emp-name">{r.employeeName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="ews-time-pill">
                          {formatClock(r.firstActivityLocal)} – {formatClock(r.lastActivityLocal)}
                        </span>
                      </td>
                      <td>
                        <div className="ews-bar-row">
                          <div className="ews-bar">
                            <div className={`ews-bar-fill ${tone}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="ews-bar-value">{r.totalTime}</span>
                        </div>
                      </td>
                      <td>
                        <span className="ews-badge ews-badge-orange">
                          <i className="mdi mdi-video-outline"></i> {formatSeconds(r.meetingSeconds)}
                        </span>
                      </td>
                      <td>{r.activityCount}</td>
                      <td>{r.applicationCount}</td>
                      <td>
                        <button type="button" className="ews-details-btn" onClick={() => openDetails(r)}>
                          Details <i className="mdi mdi-arrow-right"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <Modal isOpen={!!selected} toggle={() => setSelected(null)} size="xl" scrollable centered>
        <ModalHeader toggle={() => setSelected(null)}>
          {selected?.employeeName} — Activity Details ({reportDate})
        </ModalHeader>
        <ModalBody>
          {selected && (
            <div className="d-flex flex-wrap gap-4 mb-3">
              <div>
                <div className="text-muted small">Total time</div>
                <div className="fw-bold">{selected.totalTime}</div>
              </div>
              <div>
                <div className="text-muted small">Meetings</div>
                <div className="fw-bold">{formatSeconds(selected.meetingSeconds)}</div>
              </div>
              <div>
                <div className="text-muted small">Activities</div>
                <div className="fw-bold">{selected.activityCount}</div>
              </div>
              <div>
                <div className="text-muted small">Applications</div>
                <div className="fw-bold">{selected.applicationCount}</div>
              </div>
            </div>
          )}

          {appBreakdown.length > 0 && (
            <div className="chip-container mb-3">
              {appBreakdown.map((a) => (
                <span key={a.name} className="chip">
                  {a.name}: {formatSeconds(a.seconds)}
                </span>
              ))}
            </div>
          )}

          {detailsLoading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : detailsError ? (
            <div className="text-center text-danger py-4">{detailsError}</div>
          ) : details.length === 0 ? (
            <div className="text-center text-muted py-4">No activity found.</div>
          ) : (
            <div className="table-responsive">
              <Table className="modern-table" size="sm">
                <thead>
                  <tr>
                    <th>Start</th>
                    <th>End</th>
                    <th>Duration</th>
                    <th style={{ textAlign: 'left' }}>Application</th>
                    <th style={{ textAlign: 'left' }}>Window Title</th>
                    <th>Meeting</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((d) => (
                    <tr key={d.id}>
                      <td>{formatClock(d.startTimeLocal)}</td>
                      <td>{formatClock(d.endTimeLocal)}</td>
                      <td>{formatSeconds(d.durationSeconds)}</td>
                      <td style={{ textAlign: 'left' }}>{d.applicationName || d.processName}</td>
                      <td style={{ textAlign: 'left', maxWidth: 360 }} className="text-truncate" title={d.windowTitle}>
                        {d.windowTitle}
                      </td>
                      <td>{d.isInMeeting ? d.meetingPlatform || 'Yes' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </ModalBody>
      </Modal>
    </section>
  );
};

export default EmployeeWorkSummary;
