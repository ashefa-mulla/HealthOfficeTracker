import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Alert,
  Badge,
} from 'reactstrap';
import timerService from '../../services/timerService';
import { useAuthStore } from '../../store/useAuthStore';
import { getNumericUserId } from '../../helpers/userHelper';
import { PunchLogItem, CompanyBranchInfo, GeolocationState, PunchDetailPayload } from '../../types/timer/timer.types';
import './timer.css';

const Timer: React.FC = () => {
  const { user, profileInfo } = useAuthStore();

  // Resolve true numeric User ID (matching Angular this.userid = 75)
  const numericUserId = useMemo(() => {
    return getNumericUserId(profileInfo, user);
  }, [user, profileInfo]);

  // Form & Punch State (matching Angular dw_form1)
  const [punchId, setPunchId] = useState<number>(0);
  const [pin, setPin] = useState<string>('');
  const [branchId, setBranchId] = useState<number>(1);
  const [latitude, setLatitude] = useState<string>('0');
  const [longitude, setLongitude] = useState<string>('0');
  const [buttonVal, setButtonVal] = useState<'In' | 'Out'>('In');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // References to guarantee latest values in async handlers
  const punchIdRef = useRef<number>(0);
  const branchIdRef = useRef<number>(1);
  const latitudeRef = useRef<string>('0');
  const longitudeRef = useRef<string>('0');
  const numericUserIdRef = useRef<number>(0);

  // Geolocation State
  const [geoState, setGeoState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    status: 'locating',
    errorMessage: null,
  });

  // Clock State
  const [branchInfo, setBranchInfo] = useState<CompanyBranchInfo | null>(null);
  const [myClockDate, setMyClockDate] = useState<string>('');
  const [myClockTime, setMyClockTime] = useState<string>('00:00:00');
  const [timeZone, setTimeZone] = useState<string>('');
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Logs & Pagination State (matching Angular dw_list1)
  const [logs, setLogs] = useState<PunchLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Notification Toast
  const [notification, setNotification] = useState<{
    type: 'success' | 'danger' | 'warning' | 'info';
    message: string;
  } | null>(null);

  // 1. Geolocation acquisition (matching Angular getLocation)
  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoState({
        latitude: null,
        longitude: null,
        accuracy: null,
        status: 'unavailable',
        errorMessage: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    setGeoState((prev) => ({ ...prev, status: 'locating', errorMessage: null }));

    navigator.geolocation.getCurrentPosition(
      (response) => {
        if (response && response.coords) {
          const latStr = String(response.coords.latitude);
          const lngStr = String(response.coords.longitude);
          latitudeRef.current = latStr;
          longitudeRef.current = lngStr;
          setLatitude(latStr);
          setLongitude(lngStr);
          setGeoState({
            latitude: response.coords.latitude,
            longitude: response.coords.longitude,
            accuracy: response.coords.accuracy,
            status: 'granted',
            errorMessage: null,
          });
        }
      },
      (error) => {
        let msg = 'Position unavailable.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied by user.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setGeoState({
          latitude: null,
          longitude: null,
          accuracy: null,
          status: 'denied',
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 50000,
      }
    );
  }, []);

  // 2. Fetch User Current Punch In/Out Status (matching Angular onGetUserInOutvalue)
  const onGetUserInOutvalue = useCallback(
    async (uid?: number) => {
      const currentUserId = uid !== undefined && uid > 0 ? uid : numericUserId;
      if (!currentUserId || currentUserId <= 0) {
        console.warn('[Timer] Waiting for valid numeric userId');
        return;
      }

      numericUserIdRef.current = currentUserId;

      try {
        console.log('[Timer] Calling onGetUserInOutvalue for userId:', currentUserId);
        const res: any = await timerService.getUserInOutValue(currentUserId);
        console.log('[Timer] onGetUserInOutvalue response:', res);

        // Extract ID from res supporting id, Id, ID
        const extractedId = Number(res?.id ?? res?.Id ?? res?.ID ?? 0);
        const extractedBranch = Number(res?.branch ?? res?.Branch ?? 1);
        const extractedLat = String(res?.latitude ?? res?.Latitude ?? latitudeRef.current ?? '0');
        const extractedLng = String(res?.longitude ?? res?.Longitude ?? longitudeRef.current ?? '0');

        if (res != null && extractedId > 0) {
          // User is clocked IN -> Next action is "Out"
          punchIdRef.current = extractedId;
          setPunchId(extractedId);

          branchIdRef.current = extractedBranch;
          setBranchId(extractedBranch);

          latitudeRef.current = extractedLat;
          setLatitude(extractedLat);

          longitudeRef.current = extractedLng;
          setLongitude(extractedLng);

          setButtonVal('Out');
        } else {
          // User is clocked OUT -> Next action is "In"
          punchIdRef.current = 0;
          setPunchId(0);
          setButtonVal('In');
        }
      } catch (errors: any) {
        console.error('[Timer] onGetUserInOutvalue error:', errors);
      }
    },
    [numericUserId]
  );

  // 3. Fetch Company Branch Info & Timezone (matching Angular onGetCompanyBranchListByCompanyID)
  const onGetCompanyBranchListByCompanyID = useCallback(async () => {
    try {
      let companyid = 1;
      const lsCompany = localStorage.getItem('companyid');
      if (lsCompany && !isNaN(Number(lsCompany))) {
        companyid = Number(lsCompany);
      } else if (profileInfo?.companyId) {
        companyid = Number(profileInfo.companyId);
      } else if (profileInfo?.employerId) {
        companyid = Number(profileInfo.employerId);
      }

      const data = await timerService.getCompanyBranchList(companyid);
      setBranchInfo(data);
      if (data.timeZone) {
        setTimeZone(data.timeZone);
      }
    } catch (err) {
      console.error('[Timer] Error loading company branch:', err);
    }
  }, [profileInfo]);

  // 4. Fetch User Punch Logs (matching Angular onGetUserLogWithCaptureImg)
  const onGetUserLogWithCaptureImg = useCallback(async () => {
    setIsLoadingLogs(true);
    try {
      const data = await timerService.getUserLogsWithCaptureImg();
      setLogs(data);
    } catch (err) {
      console.error('[Timer] Error loading logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  }, []);

  // 5. Update Digital Clock (matching Angular UpdateTimer)
  const updateTimer = (offsetSeconds: number = 0) => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dateNum = now.getDate();
    const yearNum = now.getFullYear();

    setMyClockDate(`${dayName} ${monthName} ${dateNum}, ${yearNum}`);

    let targetTime = now;
    if (offsetSeconds !== 0) {
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      targetTime = new Date(utc + offsetSeconds * 1000);
    }

    const hours = targetTime.getHours().toString().padStart(2, '0');
    const minutes = targetTime.getMinutes().toString().padStart(2, '0');
    const seconds = targetTime.getSeconds().toString().padStart(2, '0');

    setMyClockTime(`${hours}:${minutes}:${seconds}`);
  };

  // Format date/time string matching Angular date: 'MM/dd/yyyy hh:mm:ss a'
  const formatClockDateTime = (dateStr: string | null | undefined): string => {
    if (!dateStr || dateStr.trim() === '' || dateStr === 'null' || dateStr === 'N/A') {
      return '';
    }

    // If already formatted with AM/PM
    if (dateStr.toUpperCase().includes('AM') || dateStr.toUpperCase().includes('PM')) {
      return dateStr;
    }

    try {
      const normalized =
        dateStr.includes(' ') && !dateStr.includes('T')
          ? dateStr.replace(' ', 'T')
          : dateStr;

      const d = new Date(normalized);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split(/[- :T]/);
        if (parts.length >= 6) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          const hour = parseInt(parts[3], 10);
          const minute = parseInt(parts[4], 10);
          const second = parseInt(parts[5], 10);
          const manualDate = new Date(year, month, day, hour, minute, second);
          if (!isNaN(manualDate.getTime())) {
            return formatTo12Hour(manualDate);
          }
        }
        return dateStr;
      }

      return formatTo12Hour(d);
    } catch {
      return dateStr;
    }
  };

  const formatTo12Hour = (d: Date): string => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const hh = String(hours).padStart(2, '0');

    return `${mm}/${dd}/${yyyy} ${hh}:${minutes}:${seconds} ${ampm}`;
  };

  // Initial Load (matching Angular ngOnInit)
  useEffect(() => {
    document.title = 'Timer | HO Tracker';
    getLocation();
    onGetCompanyBranchListByCompanyID();
    onGetUserLogWithCaptureImg();

    if (numericUserId > 0) {
      onGetUserInOutvalue(numericUserId);
    }

    // Start 1-second clock interval
    timerIntervalRef.current = setInterval(() => {
      const offset = branchInfo?.offset || 0;
      updateTimer(offset);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Trigger onGetUserInOutvalue when numericUserId resolves
  useEffect(() => {
    if (numericUserId > 0) {
      onGetUserInOutvalue(numericUserId);
    }
  }, [numericUserId, onGetUserInOutvalue]);

  // Update clock when branchInfo loads
  useEffect(() => {
    if (branchInfo) {
      updateTimer(branchInfo.offset || 0);
    }
  }, [branchInfo]);

  // Keypad Handlers (matching Angular onClick and Cleartext)
  const handleKeypadClick = (char: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + char);
      setFormSubmitted(false);
    }
  };

  const handleClearPin = () => {
    setPin('');
    setFormSubmitted(false);
  };

  // Submit Punch (matching Angular onSubmit and onAddEditPunchDetail)
  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormSubmitted(true);

    if (!pin || pin.trim().length === 0) {
      setNotification({
        type: 'danger',
        message: 'PIN is required!',
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setNotification(null);

    const currentUid = numericUserIdRef.current || getNumericUserId(profileInfo, user);
    const currentPunchId = punchIdRef.current; // Exact punch record ID (25403 when Out, 0 when In)

    const payload: PunchDetailPayload = {
      id: currentPunchId,
      PIN: pin.trim(),
      branch: branchIdRef.current || 1,
      latitude: latitudeRef.current || '0',
      longitude: longitudeRef.current || '0',
      ipAddOut: null,
      userID: currentUid || 0,
    };

    console.log('[Timer] Submitting onAddEditPunchDetail payload:', payload);

    try {
      const res = await timerService.addEditPunchDetail(payload);
      console.log('[Timer] onAddEditPunchDetail response:', res);

      setNotification({
        type: 'success',
        message: res.message || `Successfully Clocked ${buttonVal === 'In' ? 'In' : 'Out'}!`,
      });

      // Clear PIN input
      setPin('');
      setFormSubmitted(false);

      // Refresh log list & re-bind punch state (matching Angular bindModal)
      await onGetUserLogWithCaptureImg();
      await onGetUserInOutvalue(currentUid);
    } catch (errors: any) {
      console.error('[Timer] onAddEditPunchDetail error:', errors);
      const errMsg =
        errors?.response?.data?.message ||
        errors?.message ||
        'Error saving punch detail. Please check your PIN and try again.';
      setNotification({
        type: 'danger',
        message: errMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered & Paginated Punch Logs
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.fullname?.toLowerCase().includes(q) ||
        log.oExecDate?.toLowerCase().includes(q) ||
        (log.oOutDate && log.oOutDate.toLowerCase().includes(q))
    );
  }, [logs, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  return (
    <Container fluid className="timer-wrapper py-3">
      {/* Top Header & Badges */}
      <div className="timer-header">
        <div className="timer-title-group">
          <h1 className="timer-main-title">
            <i className="mdi mdi-clock-check-outline text-primary"></i>
            Time Clock & Attendance
          </h1>
          <p className="timer-subtitle">
            Secure PIN-based workforce time tracking with live timezone tracking & GPS verification
          </p>
        </div>

        <div className="timer-header-badges">
          {/* GPS Status Badge */}
          <div
            className={`gps-badge ${geoState.status === 'granted'
                ? 'gps-active'
                : geoState.status === 'denied'
                  ? 'gps-denied'
                  : ''
              }`}
            title={
              latitude && latitude !== '0'
                ? `Coordinates: Lat ${latitude}, Lng ${longitude}`
                : geoState.errorMessage || 'Locating GPS position...'
            }
          >
            {geoState.status === 'granted' ? (
              <>
                <span className="gps-pulse-dot"></span>
                <i className="mdi mdi-map-marker-check"></i>
                <span>
                  GPS Verified ({parseFloat(latitude).toFixed(2)}°, {parseFloat(longitude).toFixed(2)}°)
                </span>
              </>
            ) : geoState.status === 'locating' ? (
              <>
                <Spinner size="sm" color="secondary" />
                <span>Acquiring GPS...</span>
              </>
            ) : (
              <>
                <i className="mdi mdi-map-marker-off"></i>
                <span>GPS Offline</span>
                <Button
                  color="link"
                  size="sm"
                  className="p-0 text-decoration-none ms-1"
                  onClick={getLocation}
                >
                  (Retry)
                </Button>
              </>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            color="light"
            size="sm"
            className="d-flex align-items-center gap-1 border"
            onClick={() => {
              getLocation();
              onGetUserInOutvalue(numericUserId);
              onGetUserLogWithCaptureImg();
            }}
          >
            <i className="mdi mdi-refresh"></i>
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <Alert
          color={notification.type}
          isOpen={true}
          toggle={() => setNotification(null)}
          className="shadow-sm mb-3"
        >
          <div className="d-flex align-items-center gap-2">
            <i
              className={`mdi ${notification.type === 'success'
                  ? 'mdi-check-circle-outline'
                  : 'mdi-alert-circle-outline'
                } fs-5`}
            ></i>
            <span>{notification.message}</span>
          </div>
        </Alert>
      )}

      {/* Main 2-Column Layout matching Angular timer.component.html */}
      <Row className="g-4">
        {/* Left Column: Form & Keypad */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3">
            <CardBody className="p-4">
              <form onSubmit={onSubmit} noValidate>
                <input type="hidden" name="id" value={punchId} />
                <input type="hidden" name="branch" value={branchId} />
                <input type="hidden" name="latitude" value={latitude} />
                <input type="hidden" name="longitude" value={longitude} />
                <input type="hidden" name="userID" value={numericUserId} />

                <div className="pin-input-container mb-3">
                  <label className="pin-input-label form-label fw-semibold text-dark">
                    <span>
                      PIN <span className="text-danger">*</span>
                    </span>
                    {pin.length > 0 && (
                      <span className="text-muted small">
                        {pin.length} digits entered
                      </span>
                    )}
                  </label>

                  <div className="pin-display-wrapper">
                    <i className="mdi mdi-shield-key-outline pin-action-icon-left"></i>
                    <input
                      type={showPin ? 'text' : 'password'}
                      className={`pin-display-input form-control ${formSubmitted && !pin ? 'is-invalid' : ''
                        }`}
                      placeholder="••••"
                      value={pin}
                      maxLength={8}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="pin-toggle-btn"
                      onClick={() => setShowPin(!showPin)}
                      title={showPin ? 'Hide PIN' : 'Reveal PIN'}
                    >
                      <i className={`mdi ${showPin ? 'mdi-eye-off' : 'mdi-eye'}`}></i>
                    </button>
                  </div>
                  {formSubmitted && !pin && (
                    <div className="text-danger small mt-1">
                      <i className="mdi mdi-alert-circle-outline me-1"></i>
                      PIN is required!
                    </div>
                  )}
                </div>

                {/* Tactile Keypad (3x4 Grid) */}
                <div className="timer-keypad-grid">
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('1')}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('2')}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('3')}
                  >
                    3
                  </button>

                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('4')}
                  >
                    4
                  </button>
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('5')}
                  >
                    5
                  </button>
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('6')}
                  >
                    6
                  </button>

                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('7')}
                  >
                    7
                  </button>
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('8')}
                  >
                    8
                  </button>
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('9')}
                  >
                    9
                  </button>

                  {/* Clear Button */}
                  <button
                    type="button"
                    className="keypad-btn btn-clear"
                    onClick={handleClearPin}
                    title="Clear PIN"
                  >
                    clr
                  </button>

                  {/* 0 Button */}
                  <button
                    type="button"
                    className="keypad-btn"
                    onClick={() => handleKeypadClick('0')}
                  >
                    0
                  </button>

                  {/* Dynamic Action Punch Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`keypad-btn btn-punch-action ${buttonVal === 'Out' ? 'btn-punch-out' : 'btn-punch-in'
                      }`}
                  >
                    {isSubmitting ? (
                      <Spinner size="sm" color="light" />
                    ) : (
                      buttonVal
                    )}
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>

        {/* Right Column: Clock & Activity Log Table */}
        <Col md={8}>
          <div className="timer-dashboard-card">
            {/* Live Synchronized Digital Clock */}
            <div className="digital-clock-banner">
              <div className="clock-date-text">{myClockDate || 'Loading Date...'}</div>

              <div className="clock-digital-display">
                {myClockTime.split(':').map((part, index) => (
                  <React.Fragment key={index}>
                    <span>{part}</span>
                    {index < 2 && <span className="clock-colon">:</span>}
                  </React.Fragment>
                ))}
              </div>

              <div>
                <span className="clock-timezone-pill">
                  <i className="mdi mdi-earth"></i>
                  {timeZone}
                </span>
              </div>
            </div>

            {/* Punch Activity Logs Table */}
            <div className="activity-logs-section">
              <div className="activity-logs-header">
                <div className="activity-logs-title">
                  <i className="mdi mdi-format-list-bulleted-type text-primary"></i>
                  <span>Recent Punch Records</span>
                  <Badge color="light" className="text-muted border ms-2">
                    {filteredLogs.length} Total
                  </Badge>
                </div>

                {/* Search Field */}
                <div className="search-input-wrapper">
                  <i className="mdi mdi-magnify search-input-icon"></i>
                  <input
                    type="text"
                    className="logs-search-input"
                    placeholder="Search by name or date..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Table of Punch Logs */}
              <div className="table-responsive flex-grow-1">
                <table className="punch-table">
                  <thead>
                    <tr>
                      <th style={{ width: '35%' }}>Name</th>
                      <th style={{ width: '25%' }}>Clocked In</th>
                      <th style={{ width: '25%' }}>Clocked Out</th>
                      <th style={{ width: '15%' }} className="text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingLogs ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          <Spinner size="sm" color="primary" className="me-2" />
                          Loading punch history...
                        </td>
                      </tr>
                    ) : paginatedLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          <i className="mdi mdi-information-outline fs-4 d-block mb-1"></i>
                          No punch records found.
                        </td>
                      </tr>
                    ) : (
                      paginatedLogs.map((item) => {
                        const isCurrentlyIn = !item.oOutDate || item.oOutDate.trim() === '';
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="employee-cell">
                                <div className="emp-avatar-sm">
                                  {item.fullname?.charAt(0).toUpperCase() || 'E'}
                                </div>
                                <span className="emp-name-text">{item.fullname}</span>
                              </div>
                            </td>
                            <td>
                              <span className="timestamp-text">
                                <i className="mdi mdi-clock-start text-success me-1"></i>
                                {formatClockDateTime(item.oExecDate) || item.oExecDate || 'N/A'}
                              </span>
                            </td>
                            <td>
                              <span className="timestamp-text">
                                {item.oOutDate && item.oOutDate.trim() !== '' ? (
                                  <>
                                    <i className="mdi mdi-clock-end text-danger me-1"></i>
                                    {formatClockDateTime(item.oOutDate)}
                                  </>
                                ) : (
                                  <span className="text-muted fst-italic">In Progress</span>
                                )}
                              </span>
                            </td>
                            <td className="text-center">
                              {isCurrentlyIn ? (
                                <span className="status-pill-in">
                                  <span className="gps-pulse-dot"></span> Active
                                </span>
                              ) : (
                                <span className="status-pill-out">
                                  <i className="mdi mdi-check"></i> Completed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="punch-pagination-bar">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">Items per page:</span>
                  <select
                    className="page-size-selector"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-muted small ms-2">
                    Showing {paginatedLogs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
                    {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length}
                  </span>
                </div>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    title="First Page"
                  >
                    <i className="mdi mdi-chevron-double-left"></i>
                  </button>
                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <i className="mdi mdi-chevron-left"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      return (
                        <React.Fragment key={p}>
                          {prev && p - prev > 1 && <span className="px-1 text-muted">...</span>}
                          <button
                            type="button"
                            className={`page-btn ${currentPage === p ? 'active' : ''}`}
                            onClick={() => setCurrentPage(p)}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    <i className="mdi mdi-chevron-right"></i>
                  </button>
                  <button
                    type="button"
                    className="page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last Page"
                  >
                    <i className="mdi mdi-chevron-double-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Timer;
