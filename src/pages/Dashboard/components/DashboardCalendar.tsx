import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Spinner, Input } from 'reactstrap';
import Select from 'react-select';
import dailyTodoService from '@/services/dailyTodoService';
import dashboardService from '@/services/dashboardService';
import taskActivityService from '@/services/taskActivityService';
import { PurchaseOrderDueDateEvent } from '@/types/dashboard/dashboard.types';
import toastService from '@/services/toastService';

interface Props {
  initialEmployeeId: number;
  showEmployeeDropdown: boolean;
  userType: number;
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface CalendarEventItem {
  id: string | number;
  title: string;
  dateStr: string;
  color?: string;
  type: 'todo' | 'po';
}

const parseDateToYMD = (rawDate: any): string => {
  if (!rawDate) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  const str = String(rawDate).trim();
  if (str.includes('T')) return str.split('T')[0];
  if (str.includes('/')) {
    const parts = str.split(' ')[0].split('/');
    if (parts.length === 3) {
      const m = parts[0].padStart(2, '0');
      const d = parts[1].padStart(2, '0');
      const y = parts[2];
      return `${y}-${m}-${d}`;
    }
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  return str;
};

export const DashboardCalendar: React.FC<Props> = ({
  initialEmployeeId,
  showEmployeeDropdown,
  userType,
}) => {
  const [activeTab, setActiveTab] = useState<'todo' | 'po'>('todo');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(initialEmployeeId || 0);
  const [employeeOptions, setEmployeeOptions] = useState<Array<{ value: number; label: string }>>([]);

  const [todoEvents, setTodoEvents] = useState<CalendarEventItem[]>([]);
  const [poEvents, setPoEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  // Fetch employee dropdown list
  useEffect(() => {
    if (showEmployeeDropdown) {
      taskActivityService
        .getEmployeeList(1)
        .then((res: any[]) => {
          if (Array.isArray(res)) {
            const opts = res
              .filter((x) => x.id !== 0 && x.name !== '--Select--')
              .map((x) => ({
                value: Number(x.id),
                label: x.name,
              }));
            setEmployeeOptions(opts);
          }
        })
        .catch(() => {});
    }
  }, [showEmployeeDropdown]);

  // Load events based on active tab and month/year
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const loadData = useCallback(async () => {
    setLoading(true);
    const pad = (n: number) => String(n).padStart(2, '0');
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();
    const start = `${currentYear}-${pad(currentMonth)}-01`;
    const end = `${currentYear}-${pad(currentMonth)}-${pad(totalDays)}`;

    try {
      if (activeTab === 'todo') {
        const data = await dailyTodoService.onGetDailyEvents(
          start,
          end,
          pad(currentMonth),
          String(currentYear),
          selectedEmployeeId || 0,
          1
        );
        if (Array.isArray(data)) {
          const mapped: CalendarEventItem[] = data.map((e: any) => ({
            id: e.id ?? e.ID ?? Math.random(),
            title: e.title || e.title2 || e.ToDoDetail || 'To-Do Task',
            dateStr: parseDateToYMD(e.start || e.shift_dt || e.Shift_dt || e.date),
            color: e.color?.primary || '#3b82f6',
            type: 'todo',
          }));
          setTodoEvents(mapped);
        } else {
          setTodoEvents([]);
        }
      } else {
        const poData = await dashboardService.getPurchaseOrderDueDateList(
          currentMonth,
          currentYear
        );
        if (Array.isArray(poData)) {
          const mapped: CalendarEventItem[] = poData.map((p: any) => ({
            id: p.id ?? Math.random(),
            title: p.title || 'PO Due Date',
            dateStr: parseDateToYMD(p.start || p.dueDate),
            color: p.color?.primary || '#ef4444',
            type: 'po',
          }));
          setPoEvents(mapped);
        } else {
          setPoEvents([]);
        }
      }
    } catch (err) {
      console.warn('Error loading calendar events:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentMonth, currentYear, selectedEmployeeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
      else if (viewMode === 'week') d.setDate(d.getDate() - 7);
      else d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
      else if (viewMode === 'week') d.setDate(d.getDate() + 7);
      else d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  const currentEvents = activeTab === 'todo' ? todoEvents : poEvents;

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEventItem[]> = {};
    currentEvents.forEach((ev) => {
      if (!map[ev.dateStr]) map[ev.dateStr] = [];
      map[ev.dateStr].push(ev);
    });
    return map;
  }, [currentEvents]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return eventsByDate[selectedDateStr] || [];
  }, [selectedDateStr, eventsByDate]);

  // Generate 42 month cells
  const monthGridRows = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const pad = (n: number) => String(n).padStart(2, '0');
    const allCells: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    // Leading days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = totalDaysInPrevMonth - i;
      const prevM = month === 0 ? 12 : month;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${pad(prevM)}-${pad(dayNum)}`;
      allCells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    // Current days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
      allCells.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Trailing days
    const remaining = (7 - (allCells.length % 7)) % 7;
    for (let nextD = 1; nextD <= remaining; nextD++) {
      const nextM = month === 11 ? 1 : month + 2;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${pad(nextM)}-${pad(nextD)}`;
      allCells.push({
        dateStr,
        dayNumber: nextD,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
    }

    const rows: Array<typeof allCells> = [];
    for (let i = 0; i < allCells.length; i += 7) {
      rows.push(allCells.slice(i, i + 7));
    }
    return rows;
  }, [currentDate, todayStr]);

  const displayMonthYear = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="dashboard-calendar-card">
      {/* Top Tab Bar */}
      {userType !== 3 && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <button
            type="button"
            className={`btn ${activeTab === 'todo' ? 'btn-primary' : 'btn-outline-primary'} btn-sm px-3 fw-semibold`}
            onClick={() => {
              setActiveTab('todo');
              setSelectedDateStr(null);
            }}
          >
            <i className="mdi mdi-checkbox-marked-circle-outline me-1"></i>
            Daily To Do
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'po' ? 'btn-primary' : 'btn-outline-primary'} btn-sm px-3 fw-semibold`}
            onClick={() => {
              setActiveTab('po');
              setSelectedDateStr(null);
            }}
          >
            <i className="mdi mdi-file-document-outline me-1"></i>
            Purchase Order
          </button>
        </div>
      )}

      {/* Calendar Header Navigation */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 p-2 bg-light rounded-3 border">
        {/* Nav Controls */}
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={handlePrev}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={handleToday}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm px-3"
            onClick={handleNext}
          >
            Next
          </button>
        </div>

        {/* Title */}
        <h4 className="mb-0 fw-bold text-dark">{displayMonthYear}</h4>

        {/* View Mode Buttons */}
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'week' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'day' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('day')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Employee Selector for Daily To-Do (when Admin/Clinician) */}
      {activeTab === 'todo' && showEmployeeDropdown && (
        <Row className="mb-3">
          <Col md={5} lg={4}>
            <label className="form-label fw-medium small text-muted mb-1">Filter By Employee</label>
            <Select
              classNamePrefix="react-select"
              placeholder="Select Employee..."
              options={employeeOptions}
              value={employeeOptions.find((opt) => opt.value === selectedEmployeeId) || null}
              onChange={(opt) => setSelectedEmployeeId(opt ? opt.value : 0)}
              isClearable
            />
          </Col>
        </Row>
      )}

      {/* Calendar Grid */}
      <div className="position-relative">
        {loading && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
            style={{ zIndex: 10, minHeight: 200 }}
          >
            <Spinner color="primary" />
          </div>
        )}

        <table className="calendar-month-table w-100">
          <thead>
            <tr>
              {WEEKDAYS.map((wd) => (
                <th key={wd}>{wd}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthGridRows.map((row, rIdx) => {
              const isSelectedRow = row.some((cell) => cell.dateStr === selectedDateStr);

              return (
                <React.Fragment key={`cal-row-frag-${rIdx}`}>
                  <tr>
                    {row.map((cell) => {
                      const dayItems = eventsByDate[cell.dateStr] || [];
                      const count = dayItems.length;
                      const isSelected = selectedDateStr === cell.dateStr;

                      return (
                        <td
                          key={cell.dateStr}
                          className={`${!cell.isCurrentMonth ? 'other-month' : ''} ${
                            cell.isToday ? 'today-cell' : ''
                          } ${isSelected ? 'selected-day' : ''}`}
                          onClick={() =>
                            setSelectedDateStr(isSelected ? null : cell.dateStr)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="day-cell-header d-flex justify-content-between align-items-center">
                            {count > 0 ? (
                              <span
                                className={`badge ${
                                  activeTab === 'todo' ? 'bg-danger' : 'bg-primary'
                                } rounded-pill`}
                                style={{ fontSize: '10px' }}
                              >
                                {count}
                              </span>
                            ) : (
                              <span></span>
                            )}
                            <span className="day-number fw-semibold">{cell.dayNumber}</span>
                          </div>

                          {/* Event Indicators */}
                          {count > 0 && (
                            <div className="day-dots-container mt-1 d-flex flex-wrap gap-1">
                              {dayItems.slice(0, 6).map((item, dotIdx) => (
                                <span
                                  key={`dot-${dotIdx}`}
                                  className="event-blue-dot"
                                  style={{
                                    backgroundColor: activeTab === 'todo' ? '#3b82f6' : '#ef4444',
                                  }}
                                  title={item.title}
                                />
                              ))}
                              {count > 6 && (
                                <span className="small text-muted" style={{ fontSize: '9px' }}>
                                  +{count - 6}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Drawer for Selected Day Details */}
                  {isSelectedRow && selectedDateStr && (
                    <tr className="drawer-table-row">
                      <td colSpan={7} className="drawer-table-cell p-0">
                        <div className="dark-events-drawer p-3 bg-dark text-white rounded-bottom">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="fw-bold">
                              {new Date(`${selectedDateStr}T00:00:00`).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}{' '}
                              <span className="text-secondary small">
                                ({selectedDayEvents.length} {activeTab === 'todo' ? 'Tasks' : 'POs'})
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light py-0 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDateStr(null);
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          {selectedDayEvents.length === 0 ? (
                            <div className="text-muted small">No items scheduled for this date.</div>
                          ) : (
                            <div className="d-flex flex-column gap-2 mt-2">
                              {selectedDayEvents.map((item, idx) => (
                                <div
                                  key={item.id || idx}
                                  className="p-2 rounded bg-secondary bg-opacity-25 d-flex align-items-center gap-2"
                                >
                                  <span
                                    style={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      backgroundColor:
                                        item.type === 'todo' ? '#38bdf8' : '#f87171',
                                      display: 'inline-block',
                                    }}
                                  ></span>
                                  <span className="small text-white">{item.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardCalendar;
