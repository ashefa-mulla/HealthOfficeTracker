import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Spinner, Table } from 'reactstrap';
import './employeeWorkSummary.scss';
import chromeLogo from '@/assets/images/apps/chrome.svg';
import edgeLogo from '@/assets/images/apps/edge.svg';
import taskSchedulerLogo from '@/assets/images/apps/task-scheduler.svg';
import snippingToolLogo from '@/assets/images/apps/snipping-tool.svg';
import screenshotLogo from '@/assets/images/apps/screenshot.svg';
import remoteDesktopLogo from '@/assets/images/apps/remote-desktop.svg';
import dashboardService from '@/services/dashboardService';
import {
  EmployeeActivityDetail,
  EmployeeMeetingDetail,
  EmployeeWorkTimeSummary,
} from '@/types/dashboard/dashboard.types';

const AUTO_REFRESH_MS = 2 * 60 * 1000;
// App theme colours (src/assets/scss/_variables.scss): $primary / $secondary
const ACTIVE_COLOUR = '#01a5d6';
const IDLE_COLOUR = '#f59e0b';

const todayYmd =(): string => {
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

/** Brand colours per app (matched on a lowercase substring of the app name): accent, tint, text */
const APP_BRANDS: { match: string[]; accent: string; bg: string; fg: string; grad?: string }[] = [
  // File Explorer, or a folder/drive path used as the window name (e.g. "C:\Windows\...") - checked first
  { match: ['explorer', ':\\'], accent: '#f5b400', bg: '#fff6d9', fg: '#8a6500' },
  { match: ['activepresenter'], accent: '#f26522', bg: '#fdebe2', fg: '#b84712' },
  { match: ['photos'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['calculator', 'calc'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['brave'], accent: '#fb542b', bg: '#ffece7', fg: '#c23a17' },
  { match: ['dropbox'], accent: '#0061ff', bg: '#e0ebff', fg: '#0047bb' },
  { match: ['powershell'], accent: '#5391fe', bg: '#e8f0ff', fg: '#2f5fc4' },
  { match: ['zoom'], accent: '#2d8cff', bg: '#e6f1ff', fg: '#1565c0' },
  { match: ['teams'], accent: '#6264a7', bg: '#ececf7', fg: '#464775' },
  { match: ['meet'], accent: '#00ac47', bg: '#e0f6e9', fg: '#087a36' },
  {
    match: ['chrome'],
    accent: '#f29900',
    bg: '#fff1dc',
    fg: '#b45309',
    // Chrome logo: red, yellow, green, blue
    grad: 'linear-gradient(90deg, #ea4335, #fbbc05, #34a853, #4285f4)',
  },
  { match: ['edge'], accent: '#0f7bd0', bg: '#e1f0fb', fg: '#0b5a9c' },
  { match: ['firefox'], accent: '#ff7139', bg: '#ffeee6', fg: '#c2410c' },
  { match: ['word'], accent: '#2b579a', bg: '#e4ebf6', fg: '#1d3f75' },
  { match: ['excel'], accent: '#217346', bg: '#e1f1e8', fg: '#165232' },
  { match: ['powerpoint'], accent: '#d24726', bg: '#fbe8e3', fg: '#a3351b' },
  { match: ['outlook'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['onenote'], accent: '#7719aa', bg: '#f1e5f7', fg: '#5a1280' },
  { match: ['visual studio code', 'vscode'], accent: '#007acc', bg: '#e0f0fa', fg: '#005a96' },
  { match: ['visual studio'], accent: '#68217a', bg: '#f0e6f3', fg: '#4e195c' },
  { match: ['anydesk'], accent: '#ef443b', bg: '#fdeceb', fg: '#b3261e' },
  { match: ['premiere', 'primear'], accent: '#9999ff', bg: '#ececff', fg: '#4b4bb3' },
  { match: ['docker'], accent: '#2496ed', bg: '#e3f1fd', fg: '#1565a8' },
  { match: ['remote desktop'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['snipping'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['codex'], accent: '#10a37f', bg: '#e1f5ef', fg: '#0b7a5f' },
  { match: ['lightshot'], accent: '#7b3fe4', bg: '#efe9fc', fg: '#5527b0' },
  { match: ['camo'], accent: '#6c4cf1', bg: '#eeeafe', fg: '#4a31b5' },
  { match: ['windows shell', 'shell experience'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['searchhost', 'search'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['copilot'], accent: '#7c4dff', bg: '#efeaff', fg: '#5a35c4' },
  { match: ['task scheduler'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['screenshot'], accent: '#0078d4', bg: '#e0effb', fg: '#005a9e' },
  { match: ['slack'], accent: '#4a154b', bg: '#f1e6f1', fg: '#4a154b' },
  { match: ['skype'], accent: '#00aff0', bg: '#e0f6fd', fg: '#00749f' },
  { match: ['whatsapp'], accent: '#25d366', bg: '#e1f9ea', fg: '#128c4a' },
  { match: ['claude'], accent: '#d97757', bg: '#fbece6', fg: '#a8472a' },
  { match: ['acrobat', 'adobe'], accent: '#ec1c24', bg: '#fde8e9', fg: '#b3141a' },
  { match: ['notepad'], accent: '#0f9fd8', bg: '#e0f4fb', fg: '#0a6f96' },
  { match: ['sql', 'ssms'], accent: '#cc2927', bg: '#fbe6e6', fg: '#9b1d1b' },
];

/** Real brand logos from Simple Icons (CDN, tinted with the brand colour); key = brand's first match string */
const logoUrl = (slug: string, version = '11.14.0') =>
  `https://cdn.jsdelivr.net/npm/simple-icons@${version}/icons/${slug}.svg`;

const APP_LOGOS: Record<string, string> = {
  zoom: logoUrl('zoom'),
  teams: logoUrl('microsoftteams'),
  meet: logoUrl('googlemeet'),
  chrome: logoUrl('googlechrome'),
  edge: logoUrl('microsoftedge'),
  firefox: logoUrl('firefoxbrowser'),
  word: logoUrl('microsoftword'),
  excel: logoUrl('microsoftexcel'),
  powerpoint: logoUrl('microsoftpowerpoint'),
  outlook: logoUrl('microsoftoutlook'),
  onenote: logoUrl('microsoftonenote'),
  'visual studio code': logoUrl('visualstudiocode'),
  'visual studio': logoUrl('visualstudio'),
  slack: logoUrl('slack'),
  skype: logoUrl('skype'),
  whatsapp: logoUrl('whatsapp'),
  claude: logoUrl('claude', '14.0.0'),
  acrobat: logoUrl('adobeacrobatreader'),
  sql: logoUrl('microsoftsqlserver'),
  anydesk: logoUrl('anydesk'),
  premiere: logoUrl('adobepremierepro'),
  docker: logoUrl('docker'),
  codex: logoUrl('openai'),
  powershell: logoUrl('powershell'),
  dropbox: logoUrl('dropbox'),
  brave: logoUrl('brave'),
};

/** Full-colour official logos bundled with the app (shown as-is, not tinted) */
const APP_COLOUR_LOGOS: Record<string, string> = {
  chrome: chromeLogo,
  edge: edgeLogo,
  'task scheduler': taskSchedulerLogo,
  snipping: snippingToolLogo,
  screenshot: screenshotLogo,
  'remote desktop': remoteDesktopLogo,
};

/** No brand logo available: fall back to a generic mdi icon */
const APP_FALLBACK_ICONS: Record<string, string> = {
  explorer: 'mdi-folder',
  notepad: 'mdi-notebook-outline',
  premiere: 'mdi-movie-open',
  'remote desktop': 'mdi-remote-desktop',
  snipping: 'mdi-monitor-screenshot',
  camo: 'mdi-webcam',
  lightshot: 'mdi-feather',
  codex: 'mdi-console',
  powershell: 'mdi-powershell',
  dropbox: 'mdi-dropbox',
  brave: 'mdi-shield-half-full',
  calculator: 'mdi-calculator-variant',
  photos: 'mdi-image-multiple',
  activepresenter: 'mdi-presentation-play',
  searchhost: 'mdi-magnify',
  copilot: 'mdi-creation',
  screenshot: 'mdi-monitor-screenshot',
  'windows shell': 'mdi-microsoft-windows',
  'shell experience': 'mdi-microsoft-windows',
};

/** Proper product names for raw process names (e.g. "chrome" -> "Google Chrome"); other names are shown as-is */
const APP_DISPLAY_NAMES: Record<string, string> = {
  chrome: 'Google Chrome',
  msedge: 'Microsoft Edge',
  edge: 'Microsoft Edge',
  firefox: 'Mozilla Firefox',
  winword: 'Microsoft Word',
  word: 'Microsoft Word',
  excel: 'Microsoft Excel',
  powerpnt: 'Microsoft PowerPoint',
  powerpoint: 'Microsoft PowerPoint',
  outlook: 'Microsoft Outlook',
  onenote: 'Microsoft OneNote',
  teams: 'Microsoft Teams',
  ms_teams: 'Microsoft Teams',
  zoom: 'Zoom',
  code: 'Visual Studio Code',
  devenv: 'Visual Studio',
  explorer: 'File Explorer',
  taskschd: 'Task Scheduler',
  notepad: 'Notepad',
  powershell: 'Windows PowerShell',
  anydesk: 'AnyDesk',
  dropbox: 'Dropbox',
  brave: 'Brave',
  slack: 'Slack',
  whatsapp: 'WhatsApp',
  claude: 'Claude',
  codex: 'Codex',
  lightshot: 'Lightshot',
  acrord32: 'Adobe Acrobat',
  ssms: 'SQL Server Management Studio',
};

const displayAppName = (name: string): string =>
  APP_DISPLAY_NAMES[name.trim().toLowerCase().replace(/\.exe$/, '')] ?? name;

/** App logo in its brand colour (generic grey icon for unknown apps); hover shows the app name */
const renderAppIcon = (name: string) => {
  const n = name.toLowerCase();
  const brand = APP_BRANDS.find((b) => b.match.some((m) => n.includes(m)));
  const key = brand?.match[0] ?? '';
  const colourLogo = APP_COLOUR_LOGOS[key];
  const logo = APP_LOGOS[key];
  const fallbackIcon = APP_FALLBACK_ICONS[key] ?? 'mdi-application-outline';
  const tint = brand?.grad ?? brand?.accent ?? '#64748b';
  return (
    <span
      title={name}
      aria-label={name}
      className="d-inline-flex align-items-center justify-content-center rounded-circle"
      style={{ width: 32, height: 32, background: colourLogo ? '#fff' : brand?.bg ?? '#f1f5f9', color: brand?.accent ?? '#64748b', boxShadow: colourLogo ? 'inset 0 0 0 1px #e2e8f0' : undefined }}
    >
      {colourLogo ? (
        <img src={colourLogo} alt={name} style={{ width: 22, height: 22 }} />
      ) : logo ? (
        <span
          style={{
            width: 18,
            height: 18,
            background: tint,
            WebkitMask: `url(${logo}) center / contain no-repeat`,
            mask: `url(${logo}) center / contain no-repeat`,
          }}
        />
      ) : (
        <i className={`mdi ${fallbackIcon}`} style={{ fontSize: 18 }}></i>
      )}
    </span>
  );
};

const appChipStyle =(name: string): React.CSSProperties | undefined => {
  const n = name.toLowerCase();
  const brand = APP_BRANDS.find((b) => b.match.some((m) => n.includes(m)));
  return brand
    ? ({
        '--chip-bg': brand.bg,
        '--chip-fg': brand.fg,
        '--chip-accent': brand.accent,
        ...(brand.grad ? { '--chip-grad': brand.grad } : {}),
      } as React.CSSProperties)
    : undefined;
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
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selected, setSelected] = useState<EmployeeWorkTimeSummary | null>(null);
  const [details, setDetails] = useState<EmployeeActivityDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
  const [detailsError, setDetailsError] = useState<string>('');
  const [detailsTab, setDetailsTab] = useState<'all' | 'group'>('all');

  const [meetingsOpen, setMeetingsOpen] = useState<boolean>(false);
  const [meetings, setMeetings] = useState<EmployeeMeetingDetail[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState<boolean>(false);
  const [meetingsError, setMeetingsError] = useState<string>('');
  const [meetingsEmployee, setMeetingsEmployee] = useState<string>('');

  // silent = background refresh: no spinner, and a failed call keeps the rows already shown
  const loadSummary = useCallback(async (date: string, silent = false) => {
    // A personal view without a valid employee id must never fall back to "all employees"
    if (isPersonal && !employeeId) {
      setRows([]);
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    try {
      const res = await dashboardService.getEmployeeWorkTimeSummary(date, employeeId);
      const list = Array.isArray(res) ? res : [];
      // Defensive: only keep own rows in the personal view
      const visible = isPersonal ? list.filter((r) => r.employeeId === employeeId) : list;
      setRows([...visible].sort((a, b) => b.totalSeconds - a.totalSeconds));
      setLastRefreshed(new Date());
    } catch (err) {
      console.warn('[Dashboard] Error fetching employee work time summary:', err);
      if (!silent) setRows([]);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, [employeeId, isPersonal]);

  useEffect(() => {
    loadSummary(reportDate);
  }, [reportDate, loadSummary]);

  // Background refresh every 2 minutes (today only - past days don't change; skipped while the tab is hidden)
  useEffect(() => {
    if (reportDate !== todayYmd()) return;
    const refresh = () => {
      if (!document.hidden) loadSummary(reportDate, true);
    };
    const id = setInterval(refresh, AUTO_REFRESH_MS);
    const onVisible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [reportDate, loadSummary]);

  const openDetails = async (row: EmployeeWorkTimeSummary) => {
    setSelected(row);
    setDetailsTab('all');
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

  // target set: admin drilled into one employee's meetings (the row's meeting badge)
  const openMeetings = async (target?: EmployeeWorkTimeSummary) => {
    const targetId = target?.employeeId;
    setMeetingsEmployee(target ? target.employeeName : '');
    setMeetingsOpen(true);
    setMeetings([]);
    setMeetingsError('');
    setMeetingsLoading(true);
    try {
      // Admin: all employees (no employeeId) or one picked employee. Personal view: only the signed-in employee.
      const res = await dashboardService.getEmployeeMeetingDetails(reportDate, targetId ?? employeeId);
      const list = Array.isArray(res) ? res : [];
      const onlyId = isPersonal ? employeeId : targetId;
      const visible = onlyId !== undefined ? list.filter((m) => m.employeeId === onlyId) : list;
      setMeetings(
        [...visible].sort((a, b) => (a.meetingStartLocal || '').localeCompare(b.meetingStartLocal || ''))
      );
    } catch (err) {
      console.warn('[Dashboard] Error fetching employee meeting details:', err);
      setMeetingsError('Failed to load meeting details.');
    } finally {
      setMeetingsLoading(false);
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
      map.set(key, (map.get(key) || 0) + (d.actualSeconds || 0));
    });
    return Array.from(map.entries())
      .map(([name, seconds]) => ({ name, seconds }))
      .sort((a, b) => b.seconds - a.seconds)
      .slice(0, 6);
  }, [details]);

  // Group Activity tab: one block per app, with its window titles in time order
  const groupedActivity = useMemo(() => {
    const map = new Map<string, { name: string; seconds: number; items: EmployeeActivityDetail[] }>();
    details.forEach((d) => {
      const name = d.applicationName || d.processName || 'Unknown';
      const g = map.get(name) ?? { name, seconds: 0, items: [] };
      g.seconds += d.applicationSeconds || 0;
      g.items.push(d);
      map.set(name, g);
    });
    return Array.from(map.values())
      .map((g) => ({
        ...g,
        titleCount: new Set(g.items.map((i) => i.windowTitle || '')).size,
        items: [...g.items].sort((a, b) => (a.startTimeLocal || '').localeCompare(b.startTimeLocal || '')),
      }))
      .sort((a, b) => b.seconds - a.seconds);
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
    { icon: 'mdi-video-outline', label: 'In Meetings', value: formatSeconds(totals.meeting), tone: 'orange', onClick: () => openMeetings() },
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
        <div className="d-flex flex-column align-items-end gap-1">
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
          <div className="d-flex align-items-center gap-1" style={{ fontSize: 11, color: '#16a34a' }}>
            <span>
              {lastRefreshed
                ? `Last refreshed ${lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`
                : 'Loading...'}
            </span>
            <button
              type="button"
              className="btn btn-link p-0 lh-1"
              style={{ color: 'inherit' }}
              title="Refresh now"
              disabled={refreshing || loading}
              onClick={() => {
                setRefreshing(true);
                loadSummary(reportDate, true);
              }}
            >
              <i className={`mdi mdi-refresh ${refreshing ? 'mdi-spin' : ''}`} style={{ fontSize: 15 }}></i>
            </button>
          </div>
        </div>
      </div>

      <div className="ews-kpis">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`ews-kpi ews-kpi-${k.tone}`}
            style={k.onClick ? { cursor: 'pointer' } : undefined}
            onClick={k.onClick}
            title={k.onClick ? 'Click to see meeting times' : undefined}
          >
            <span className="ews-kpi-icon">
              <i className={`mdi ${k.icon}`}></i>
            </span>
            <div>
              <div className="ews-kpi-value">{k.value}</div>
              <div className="ews-kpi-label">{k.label}{k.onClick ? ' · view times' : ''}</div>
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
                  <th>Activities</th>
                  <th style={{ minWidth: 220 }}>Total Time</th>
                  <th>Meetings</th>
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
                        <span
                          className="ews-badge ews-badge-orange"
                          style={{ cursor: 'pointer' }}
                          title={isPersonal ? 'View my meetings' : `View ${r.employeeName}'s meetings`}
                          onClick={() => openMeetings(isPersonal ? undefined : r)}
                        >
                          <i className="mdi mdi-video-outline"></i> {formatSeconds(r.meetingSeconds)}
                        </span>
                      </td>
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
            <div className="ews-app-chips mb-3">
              {appBreakdown.map((a, i) => (
                <span key={a.name} className={`ews-app-chip ews-app-chip-${i % 6}`} style={appChipStyle(a.name)}>
                  <span className="ews-app-chip-name">{a.name}</span>
                  <span className="ews-app-chip-time">{formatSeconds(a.seconds)}</span>
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
            <>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="ews-tabs">
              {([['all', 'All Activity', 'mdi-format-list-bulleted'], ['group', 'Group Activity', 'mdi-view-grid-outline']] as const).map(([key, label, icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDetailsTab(key)}
                  className={`ews-tab ${detailsTab === key ? 'active' : ''}`}
                >
                  <i className={`mdi ${icon}`}></i> {label}
                </button>
              ))}
              </div>
              {detailsTab === 'group' && (
                <div className="ms-auto d-flex align-items-center gap-3 small">
                  <span className="d-inline-flex align-items-center gap-1">
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACTIVE_COLOUR }} /> Active
                  </span>
                  <span className="d-inline-flex align-items-center gap-1">
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: IDLE_COLOUR }} /> Idle
                  </span>
                </div>
              )}
            </div>
            {detailsTab === 'group' ? (
              <div className="d-flex flex-column gap-3">
                {groupedActivity.map((g) => (
                  <div key={g.name} className="border rounded p-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      {renderAppIcon(g.name)}
                      <div>
                        <div className="fw-bold">{displayAppName(g.name)}</div>
                        <div className="text-muted small">Application duration: {formatSeconds(g.seconds)}</div>
                      </div>
                      <span className="ms-auto badge bg-light text-secondary border">
                        {g.titleCount} window title{g.titleCount === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="d-flex flex-column gap-2 ps-2">
                      {g.items.map((d, i) => {
                        const active = Math.max(0, d.actualSeconds || 0);
                        const idle = Math.max(0, d.idleSeconds || 0);
                        const sum = active + idle;
                        const activePct = sum > 0 ? (active / sum) * 100 : 0;
                        return (
                          <div key={`${d.startTimeLocal}-${i}`}>
                            <div className="d-flex justify-content-between gap-3">
                              <div className="fw-semibold">{d.windowTitle || '(no title)'}</div>
                              <div className="small text-nowrap">
                                {formatClock(d.startTimeLocal)} – {formatClock(d.endTimeLocal)}
                              </div>
                            </div>
                            <div className="d-flex my-1" style={{ height: 14, borderRadius: 7, overflow: 'hidden', background: '#cbd5e1', gap: 2 }}>
                              {active > 0 && <div style={{ width: `${activePct}%`, background: ACTIVE_COLOUR }} title={`Active: ${formatSeconds(active)}`} />}
                              {idle > 0 && <div style={{ flex: 1, background: IDLE_COLOUR }} title={`Idle: ${formatSeconds(idle)}`} />}
                            </div>
                            <div className="small text-muted">
                              Active: {formatSeconds(active)} · Idle: {formatSeconds(idle)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <div className="ews-modal-wrap">
              <Table className="modern-table ews-modal-table" size="sm">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>App</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Total</th>
                    <th>Idle</th>
                    <th>Active</th>
                    <th style={{ textAlign: 'left' }}>Title</th>
                    <th>In Meeting</th>
                    <th>Outside Meeting</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((d, i) => (
                    <tr key={`${d.startTimeLocal}-${d.processName}-${i}`}>
                      <td style={{ textAlign: 'left' }}>{renderAppIcon(d.applicationName || d.processName || 'Unknown')}</td>
                      <td>{formatClock(d.startTimeLocal)}</td>
                      <td>{formatClock(d.endTimeLocal)}</td>
                      <td>{d.applicationTime}</td>
                      <td>{d.idleTime}</td>
                      <td>{d.actualTime}</td>
                      <td style={{ textAlign: 'left' }} className="ews-cell-fill" title={d.windowTitle}>
                        {d.windowTitle}
                      </td>
                      <td>{d.timeInMeeting}</td>
                      <td>{d.timeOutsideMeeting}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            )}
            </>
          )}
        </ModalBody>
      </Modal>

      <Modal isOpen={meetingsOpen} toggle={() => setMeetingsOpen(false)} size="xl" scrollable centered>
        <ModalHeader toggle={() => setMeetingsOpen(false)}>
          {isPersonal ? 'My Meetings' : meetingsEmployee ? `${meetingsEmployee} — Meetings` : 'Meetings'} ({reportDate})
        </ModalHeader>
        <ModalBody>
          {meetingsLoading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : meetingsError ? (
            <div className="text-center text-danger py-4">{meetingsError}</div>
          ) : meetings.length === 0 ? (
            <div className="text-center text-muted py-4">
              <div className="d-flex justify-content-center gap-2 mb-2">
                {[
                  { icon: 'mdi-video', bg: '#2d8cff' }, // Zoom
                  { icon: 'mdi-microsoft-teams', bg: '#6264a7' }, // Teams
                  { icon: 'mdi-google-hangouts', bg: '#00ac47' }, // Meet
                ].map((a) => (
                  <span
                    key={a.icon}
                    className="d-inline-flex align-items-center justify-content-center rounded-circle text-white"
                    style={{ width: 44, height: 44, fontSize: 24, background: a.bg }}
                  >
                    <i className={`mdi ${a.icon}`}></i>
                  </span>
                ))}
              </div>
              {meetingsEmployee ? `No meetings for ${meetingsEmployee}` : 'No meetings'} on this date.
            </div>
          ) : (
            <div className="ews-modal-wrap">
              <Table className="modern-table ews-modal-table" size="sm">
                <thead>
                  <tr>
                    {!isPersonal && !meetingsEmployee && <th style={{ textAlign: 'left' }}>Employee</th>}
                    <th style={{ textAlign: 'left' }}>App</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Duration</th>
                    <th>In Meeting</th>
                    <th>Other Apps</th>
                    <th>No Activity</th>
                    <th style={{ textAlign: 'left' }}>Apps Used</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((m, i) => (
                    <tr key={m.meetingActivityId || `${m.employeeId}-${i}`}>
                      {!isPersonal && !meetingsEmployee && <td style={{ textAlign: 'left' }}>{m.employeeName}</td>}
                      <td style={{ textAlign: 'left' }}>
                        {renderAppIcon(m.meetingPlatform || m.applicationName || 'Unknown')}
                      </td>
                      <td>{formatClock(m.meetingStartLocal)}</td>
                      <td>{formatClock(m.meetingEndLocal)}</td>
                      <td>{m.meetingDuration}</td>
                      <td>{m.onMeetingApp}</td>
                      <td>{m.otherApps}</td>
                      <td>{m.noActivity}</td>
                      <td style={{ textAlign: 'left' }} className="ews-cell-fill" title={m.appsUsed}>
                        {m.appsUsed}
                      </td>
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
