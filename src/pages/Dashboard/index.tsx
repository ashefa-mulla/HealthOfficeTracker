import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Container, Row, Col, Table, Spinner } from 'reactstrap';
import { useAuthStore } from '@/store/useAuthStore';
import { getUserFullName, getUserRole, getNumericUserId, getNumericEmployeeId, isAdminUser } from '@/helpers/userHelper';
import dashboardService from '@/services/dashboardService';
import presenceService from '@/services/presenceService';
import { normalizeToken } from '@/helpers/tokenHelper';
import {
  Below3HrEmpDuration,
  MentionPointsSummary,
  NotTrackedEmployee,
  OnlineEmployeeDashboard,
  ClientProjectSummaryItem,
  OutstandingInvoiceSummary,
} from '@/types/dashboard/dashboard.types';
import MentionPointsChart from './components/MentionPointsChart';
import DurationUnder3HrChart from './components/DurationUnder3HrChart';
import BillableHoursChart from './components/BillableHoursChart';
import EmployeeWorkSummary from './components/EmployeeWorkSummary';
import defaultAvatar from '@/assets/images/profile-img.png';
import './dashboard.scss';

const Dashboard: React.FC = () => {
  const { user, profileInfo, jwt } = useAuthStore();
  const authUser = user || JSON.parse(localStorage.getItem('authUser') || '{}');
  const userProfile = profileInfo || JSON.parse(localStorage.getItem('userProfile') || '{}');

  const displayName = getUserFullName(authUser, userProfile);
  const userRole = getUserRole(userProfile);
  const numericUserId = getNumericUserId(userProfile, authUser);

  const sessionRole =
    localStorage.getItem('sessionrole') ||
    userProfile?.userRole ||
    (userProfile?.utype === 1 || userProfile?.utype === 4 ? 'Admin' : '');

  // In Angular: this.sessiontype = Number(localStorage.getItem('sessiontype') || 0);
  const sessiontype = Number(
    localStorage.getItem('sessiontype') ||
      (sessionRole === 'Clinicians' ? 2 : userProfile?.utype ?? 0)
  );

  const isAdmin = isAdminUser(userProfile);
  // Non-admins only ever see their own summary; the id comes from localStorage 'employeeid'
  const myEmployeeId = Number(localStorage.getItem('employeeid')) || 0;
  const isClinician = sessiontype === 2 || sessionRole === 'Clinicians';

  // Live time
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  // Online / Dashboard Users
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [onlineDashboard, setOnlineDashboard] = useState<OnlineEmployeeDashboard[]>([]);
  const [dashboardUsers, setDashboardUsers] = useState<OnlineEmployeeDashboard[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);

  // Not tracked yesterday & Below 3hr
  const [notTrackedEmployees, setNotTrackedEmployees] = useState<NotTrackedEmployee[]>([]);
  const [below3HrEmpDuration, setBelow3HrEmpDuration] = useState<Below3HrEmpDuration[]>([]);
  const [yesterdayDateTitle, setYesterdayDateTitle] = useState<string>('');

  // Feedback Summary
  const [mentionPointsSummary, setMentionPointsSummary] = useState<MentionPointsSummary[]>([]);
  const [dateRangeLabel, setDateRangeLabel] = useState<string>('');

  // Client Session (sessiontype === 2)
  const [outstandingInvoice, setOutstandingInvoice] = useState<OutstandingInvoiceSummary>({});
  const [clientProjectSummary, setClientProjectSummary] = useState<ClientProjectSummaryItem[]>([]);

  // Navigation sections tracking
  const sections = useMemo(
    () => [
      { id: 'liveDashboard' },
      { id: 'notTrackedSection' },
      { id: 'chartsSection' },
    ],
    []
  );
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);

  const lastOnlineUserKeyRef = useRef<string>('');

  // Format date helper: YYYY-MM-DD
  const formatDateToYmd = (d: Date): string => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  // Format hours number (e.g. 5.75 -> 05:45)
  const formatHours = (value?: number): string => {
    if (!value || isNaN(value)) return '00:00';
    const parts = value.toString().split('.');
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1] ? parts[1].padEnd(2, '0').substring(0, 2) : '00';
    return `${hours}:${minutes}`;
  };

  // Format profile image path (matches Angular getProfileImage logic)
  const getProfileImage = (path?: string): string => {
    if (!path || path === 'NoFile' || path.trim() === '') {
      return defaultAvatar;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const rawBaseUrl =
      import.meta.env.VITE_API_FILE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'https://apiprod.govirtualnow.in';
    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const cleanPath = path.replace(/^~[\\/]/, '').replace(/\\/g, '/').replace(/^\/+/, '');
    return `${cleanBaseUrl}/${cleanPath}`;
  };

  // Build combined & sorted dashboard users
  const buildDashboardUsers = useCallback(
    (onlineList: OnlineEmployeeDashboard[], onlineIdsList: string[]) => {
      const numOnlineIds = onlineIdsList.map(Number).filter((n) => !isNaN(n));

      const mapped = onlineList.map((user: any) => {
        const userId = user.id ?? user.ID;
        const isOnline = numOnlineIds.includes(Number(userId));
        return {
          ...user,
          id: userId,
          user: user.user ?? user.User,
          totalTasks: user.totalTasks ?? user.TotalTasks ?? 0,
          pending: user.pending ?? user.Pending ?? 0,
          completed: user.completed ?? user.Completed ?? 0,
          assignedHours: user.assignedHours ?? user.AssignedHours ?? 0,
          actualHours: user.actualHours ?? user.ActualHours ?? 0,
          efficiency: user.efficiency ?? user.Efficiency ?? 0,
          oExecDate: user.oExecDate ?? user.OExecDate,
          oOutDate: user.oOutDate ?? user.OOutDate,
          profileimage: user.profileimage ?? user.Profileimage,
          online: isOnline,
        };
      });

      // Sort: Online users first, then alphabetically by user name
      mapped.sort((a, b) => {
        if (a.online !== b.online) {
          return a.online ? -1 : 1;
        }
        return (a.user || '').localeCompare(b.user || '');
      });

      setDashboardUsers(mapped);
    },
    []
  );

  // Load online employee dashboard data
  const loadOnlineDashboard = useCallback(
    async (currentOnlineIds: string[]) => {
      // If no online users, clear dashboard directly without firing 404 API call
      if (!currentOnlineIds || currentOnlineIds.length === 0) {
        lastOnlineUserKeyRef.current = '';
        setOnlineDashboard([]);
        setDashboardUsers([]);
        setLoadingDashboard(false);
        return;
      }

      const userIdsStr = currentOnlineIds.join(',');

      if (lastOnlineUserKeyRef.current === userIdsStr) {
        return;
      }
      lastOnlineUserKeyRef.current = userIdsStr;

      try {
        const data = await dashboardService.getOnlineEmployeeDashboard(userIdsStr);
        const list = Array.isArray(data) ? data : [];
        setOnlineDashboard(list);
        buildDashboardUsers(list, currentOnlineIds);
      } catch (err) {
        console.warn('[Dashboard] Failed to fetch online employee dashboard:', err);
        setOnlineDashboard([]);
        setDashboardUsers([]);
      } finally {
        setLoadingDashboard(false);
      }
    },
    [buildDashboardUsers]
  );

  // Load Feedback / Mention Points Summary for last week
  const loadMentionPointsSummary = useCallback(async (start: string, end: string) => {
    try {
      const res = await dashboardService.getMentionPointsSummary(start, end);
      if (Array.isArray(res)) {
        setMentionPointsSummary(res);
      }
    } catch (err) {
      console.warn('[Dashboard] Error fetching mention points:', err);
    }
  }, []);

  // Load Below 3 Hour data for yesterday
  const loadBelow3HrYesterday = useCallback(async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateToYmd(yesterday);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setYesterdayDateTitle(yesterday.toLocaleDateString('en-US', options));

    try {
      const res = await dashboardService.getBelow3HrEmployeeDailyDuration(
        yesterdayStr,
        yesterdayStr
      );
      if (Array.isArray(res)) {
        setBelow3HrEmpDuration(res);
      }
    } catch (err) {
      console.warn('[Dashboard] Error fetching below 3hr duration:', err);
    }
  }, []);

  // Load Not Tracked Employees Yesterday
  const loadNotTrackedYesterday = useCallback(async () => {
    try {
      const res = await dashboardService.getEmployeesNotTrackedYesterday();
      if (Array.isArray(res)) {
        setNotTrackedEmployees(res);
      }
    } catch (err) {
      console.warn('[Dashboard] Error fetching not tracked employees:', err);
    }
  }, []);

  // Load Clinician / Client specific data
  const loadClientData = useCallback(async () => {
    const adminId = numericUserId || 0;
    try {
      const outstanding = await dashboardService.getCurrentMonthOutstanding(adminId);
      setOutstandingInvoice(outstanding || {});

      const today = new Date();
      const start = formatDateToYmd(new Date(today.getFullYear(), today.getMonth(), 1));
      const end = formatDateToYmd(today);

      const summary = await dashboardService.getClientProjectSummaryByPerson(adminId, start, end);
      if (Array.isArray(summary)) {
        setClientProjectSummary(summary);
      }
    } catch (err) {
      console.warn('[Dashboard] Error loading client dashboard data:', err);
    }
  }, [numericUserId]);

  // Initial Load for static summary and metrics data
  useEffect(() => {
    document.title = 'Dashboard | HO Tracker';

    // System time ticker
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Calculate Last Week Date Range (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Sunday = 7
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - (dayOfWeek - 1));

    const lastMonday = new Date(currentMonday);
    lastMonday.setDate(currentMonday.getDate() - 7);
    const lastSunday = new Date(currentMonday);
    lastSunday.setDate(currentMonday.getDate() - 1);

    const sDate = formatDateToYmd(lastMonday);
    const eDate = formatDateToYmd(lastSunday);
    setDateRangeLabel(`(${sDate} to ${eDate})`);

    // Fetch initial static & overview data
    loadMentionPointsSummary(sDate, eDate);
    loadBelow3HrYesterday();
    loadNotTrackedYesterday();

    if (isClinician) {
      loadClientData();
    }

    return () => {
      clearInterval(timer);
    };
  }, [
    isClinician,
    loadMentionPointsSummary,
    loadBelow3HrYesterday,
    loadNotTrackedYesterday,
    loadClientData,
  ]);

  // Dedicated SignalR Presence Hub lifecycle (Matches Angular PresenceService pattern)
  useEffect(() => {
    const rawToken = jwt || localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
    const token = normalizeToken(rawToken);

    if (token) {
      presenceService.startConnection(token);
    }

    // Subscribe to live online users updates from PresenceHub
    const unsubscribe = presenceService.subscribe((users: string[]) => {
      console.log('[Dashboard] Presence updated with users:', users);
      setOnlineUsers(users);
      loadOnlineDashboard(users);
    });

    // Check if presence service already has current online users cached
    const currentOnline = presenceService.getCurrentOnlineUsers();
    if (currentOnline && currentOnline.length > 0) {
      setOnlineUsers(currentOnline);
      loadOnlineDashboard(currentOnline);
    } else {
      loadOnlineDashboard([]);
    }

    return () => {
      unsubscribe();
      presenceService.stopConnection();
    };
  }, [jwt, loadOnlineDashboard]);

  // Floating scroll navigation
  const scrollNext = () => {
    const scrollPosition = window.scrollY + 100;
    for (let i = 0; i < sections.length; i++) {
      const el = document.getElementById(sections[i].id);
      if (!el) continue;
      if (el.offsetTop > scrollPosition) {
        window.scrollTo({
          top: el.offsetTop - 80,
          behavior: 'smooth',
        });
        setCurrentSectionIndex(i);
        return;
      }
    }
  };

  const scrollPrevious = () => {
    const firstSection = sections[0];
    const el = document.getElementById(firstSection.id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth',
      });
    }
    setCurrentSectionIndex(0);
  };

  return (
    <Container fluid className="dashboard-container">
      {/* Welcome Card Banner */}
      <div className="welcome-card">
        <Row className="align-items-center">
          <Col lg={8}>
            <h1 className="welcome-title">Welcome back, {displayName}! 👋</h1>
            <p className="welcome-subtitle">
              Role: <span className="fw-semibold text-warning">{userRole}</span> • Overview of live workforce productivity & track logs.
            </p>
          </Col>
          <Col lg={4} className="text-lg-end mt-3 mt-lg-0">
            <div className="p-3 bg-white bg-opacity-10 rounded-3 d-inline-block text-start border border-white border-opacity-25 shadow-sm">
              <div className="text-white text-opacity-75 small">System Time</div>
              <div className="fs-3 fw-bold text-white">{currentTime}</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* =========================================================================
          CLIENT SESSION (sessiontype === 2)
          ========================================================================= */}
      {sessiontype === 2 && (
        <div className="client-dashboard-view">
          {/* Outstanding Invoice Banner */}
          <div className="summary-banner blink">
            Current Month Total Outstanding Invoice:
            <span className="amount">
              ${(Number(outstandingInvoice?.totalOutstandingAmount) || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Client Project Summary Table */}
          <div className="dashboard-card">
            <h5 className="fw-bold text-dark mb-3">Client Project Summary</h5>
            <table className="client-summary-table">
              <thead>
                <tr>
                  <th>Person Name</th>
                  <th>Billable Hours</th>
                  <th>Non-Billable Hours</th>
                </tr>
              </thead>
              <tbody>
                {clientProjectSummary.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">
                      No client project summary data found.
                    </td>
                  </tr>
                ) : (
                  clientProjectSummary.map((item, idx) => (
                    <tr key={`client-row-${idx}`}>
                      <td className="fw-medium">{item.person}</td>
                      <td className="text-success fw-bold">{item.billableHours}</td>
                      <td className="text-secondary">{item.nonBillableHours}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Billable Hours Per Person Chart */}
          <div className="dashboard-card">
            <h4 className="text-center fw-bold text-dark mb-3">Billable Hours Per Person</h4>
            <BillableHoursChart data={clientProjectSummary} />
          </div>
        </div>
      )}

      {/* =========================================================================
          STANDARD / ADMIN / EMPLOYEE DASHBOARD (sessiontype !== 2)
          ========================================================================= */}
      {sessiontype !== 2 && (
        <React.Fragment>
          {/* Admin only: employee work-time summary with activity details modal */}
          <EmployeeWorkSummary employeeId={isAdmin ? undefined : myEmployeeId} />

          {/* 1. Live Productivity Dashboard */}
          <section id="liveDashboard" className="live-dashboard mb-4">
            <div className="dashboard-title">
              <i className="mdi mdi-flash fs-4"></i>
              Live Productivity Dashboard
            </div>

            <div className="dashboard-card p-0 overflow-hidden mb-0">
              {loadingDashboard ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <div className="mt-2 text-muted small">Loading live productivity data...</div>
                </div>
              ) : dashboardUsers.length === 0 ? (
                <div className="dashboard-card empty-state">
                  <i className="mdi mdi-account-clock-outline"></i>
                  <p className="mb-0 fw-medium">No employees online right now</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="modern-table">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>Photo</th>
                        <th style={{ textAlign: 'left' }}>Name</th>
                        <th>IN</th>
                        <th>OUT</th>
                        <th>Total Tasks</th>
                        <th>Pending Tasks</th>
                        <th>Completed Tasks</th>
                        <th>Assigned Hrs</th>
                        <th>Actual Hrs</th>
                        <th className="efficiency-header">
                          Efficiency
                          <span className="tooltip-text">
                            Efficiency = (Actual Hours / Assigned Hours) × 100
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardUsers.map((item, idx) => (
                        <tr key={`dash-user-${item.id || idx}`}>
                          {/* Photo */}
                          <td>
                            <img
                              src={getProfileImage(item.profileimage)}
                              alt={item.user || 'User'}
                              className={`user-photo ${item.online ? 'user-online' : 'user-offline'}`}
                              onError={(e: any) => {
                                e.target.src = defaultAvatar;
                              }}
                            />
                          </td>

                          {/* Name + Dot */}
                          <td className="user-cell">
                            <span
                              className={`online-dot ${item.online ? 'online' : 'offline'}`}
                              title={item.online ? 'Online' : 'Offline'}
                            ></span>
                            <span className={`user-name ${!item.online ? 'offline-user' : ''}`}>
                              {item.user}
                            </span>
                          </td>

                          {/* IN Time */}
                          <td>
                            {item.oExecDate
                              ? new Date(item.oExecDate).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </td>

                          {/* OUT Time */}
                          <td>
                            {item.oOutDate
                              ? new Date(item.oOutDate).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '-'}
                          </td>

                          {/* Tasks */}
                          <td>{item.totalTasks || 0}</td>
                          <td className="pending">{item.pending || 0}</td>
                          <td className="completed">{item.completed || 0}</td>

                          {/* Hours */}
                          <td>{formatHours(item.assignedHours)}</td>
                          <td className="fw-semibold">{formatHours(item.actualHours)}</td>

                          {/* Efficiency */}
                          <td className="efficiency-cell">
                            <div className={`efficiency-wrapper ${!item.online ? 'offline' : ''}`}>
                              <div className="efficiency-bar">
                                <div
                                  className={`efficiency-progress ${
                                    (item.efficiency || 0) >= 80
                                      ? 'good'
                                      : (item.efficiency || 0) >= 50
                                      ? 'avg'
                                      : 'bad'
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.max(0, item.efficiency || 0))}%`,
                                  }}
                                />
                              </div>
                              <span className="efficiency-value">{item.efficiency || 0}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </section>

          {/* 2. Didn't Track Hours Yesterday */}
          {notTrackedEmployees.length > 0 && (
            <section id="notTrackedSection" className="not-track-card mb-4">
              <div className="not-track-title">
                <i className="mdi mdi-clock-alert-outline"></i>
                Didn't Track Hours Yesterday
              </div>
              <div className="chip-container">
                {notTrackedEmployees.map((emp, idx) => (
                  <span key={`not-tracked-${emp.id || idx}`} className="chip">
                    {emp.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 3. Side-by-Side Charts: Who Logged Under 3 Hours (Col md=6) & Feedback Summary (Col md=6) */}
          <section id="chartsSection" className="mb-4">
            <Row className="g-4">
              {/* Who Logged Under 3 Hours (Col md=6) */}
              <Col md={6}>
                <div id="durationSection" className="dashboard-card h-100 mb-0">
                  {below3HrEmpDuration.length > 0 ? (
                    <DurationUnder3HrChart
                      data={below3HrEmpDuration}
                      dateTitle={yesterdayDateTitle}
                    />
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="mdi mdi-clock-check-outline fs-2 text-success mb-2 d-block"></i>
                      <h5 className="fw-bold text-dark mb-1 fs-6">Who Logged Under 3 Hours</h5>
                      <div className="small">All employees logged 3+ hours yesterday! 🎉</div>
                    </div>
                  )}
                </div>
              </Col>

              {/* Feedback Summary (Col md=6) */}
              <Col md={6}>
                <div id="feedbackSection" className="dashboard-card h-100 mb-0">
                  <MentionPointsChart
                    data={mentionPointsSummary}
                    dateRangeLabel={dateRangeLabel}
                  />
                </div>
              </Col>
            </Row>
          </section>
         
        </React.Fragment>
      )}

      {/* Floating Scroll Navigation */}
      <div className="scroll-nav">
        <button
          type="button"
          className="scroll-btn up"
          onClick={scrollPrevious}
          title="Scroll Up"
        >
          <i className="mdi mdi-chevron-up"></i>
        </button>
        <button
          type="button"
          className="scroll-btn down"
          onClick={scrollNext}
          title="Scroll Down"
        >
          <i className="mdi mdi-chevron-down"></i>
        </button>
      </div>
    </Container>
  );
};

export default Dashboard;
