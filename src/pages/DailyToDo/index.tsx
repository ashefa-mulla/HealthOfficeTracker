import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import dailyTodoService from '@/services/dailyTodoService';
import toastService from '@/services/toastService';
import { getNumericEmployeeId } from '@/helpers/userHelper';
import './dailyTodo.scss';

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

export interface CalendarDailyEvent {
  id: string | number;
  aid?: number;
  title: string;
  title2?: string;
  start: string;
  end?: string;
  dateStr: string; // YYYY-MM-DD
  rawText: string;
}

// Helper: parse date to YYYY-MM-DD
const parseDateToYMD = (rawDate: any): string => {
  if (!rawDate) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }
  const str = String(rawDate).trim();
  if (str.includes('T')) {
    return str.split('T')[0];
  }
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

const DailyToDo: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const [events, setEvents] = useState<CalendarDailyEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Selected date for bottom dark drawer
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Modal states for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingTodo, setEditingTodo] = useState<{
    id?: number | string;
    title: string;
    date: string;
    details?: string;
  }>({
    title: '',
    date: '',
    details: '',
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const empId = getNumericEmployeeId();

  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  // Fetch events from API (only triggers when month/year changes or on initial load)
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const pad = (n: number) => String(n).padStart(2, '0');
      const totalDays = new Date(currentYear, currentMonth, 0).getDate();

      const start = `${currentYear}-${pad(currentMonth)}-01`;
      const end = `${currentYear}-${pad(currentMonth)}-${pad(totalDays)}`;
      const s_mm = pad(currentMonth);
      const s_yy = String(currentYear);

      const data = await dailyTodoService.onGetDailyEvents(start, end, s_mm, s_yy, empId, 0);

      if (Array.isArray(data)) {
        const mapped: CalendarDailyEvent[] = data.map((e: any) => {
          const dateStr = parseDateToYMD(e.start || e.shift_dt || e.Shift_dt || e.date);
          const rawText = e.title || e.title2 || e.ToDoDetail || 'To-Do Item';
          return {
            id: e.id ?? e.ID ?? `ev-${Math.random()}`,
            aid: e.aid ?? e.Employee_ID,
            title: e.title || rawText,
            title2: e.title2 || rawText,
            start: e.start || dateStr,
            end: e.end,
            dateStr,
            rawText,
          };
        });
        setEvents(mapped);

        // Auto select current date or first date if nothing selected yet
        setSelectedDateStr((prev) => {
          if (prev) return prev;
          const hasToday = mapped.some((m) => m.dateStr === todayStr);
          if (hasToday) return todayStr;
          if (mapped.length > 0) return mapped[0].dateStr;
          return todayStr;
        });
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to load daily events:', err);
      toastService.error('Failed to load To-Do calendar events.');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, empId, todayStr]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Calendar Header Controls
  const handlePrev = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() - 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() - 7);
      } else {
        d.setDate(d.getDate() - 1);
      }
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') {
        d.setMonth(d.getMonth() + 1);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() + 7);
      } else {
        d.setDate(d.getDate() + 1);
      }
      return d;
    });
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(todayStr);
  };

  // Group events by date string
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarDailyEvent[]> = {};
    events.forEach((ev) => {
      if (!map[ev.dateStr]) {
        map[ev.dateStr] = [];
      }
      map[ev.dateStr].push(ev);
    });
    return map;
  }, [events]);

  // Selected Day Events for Bottom Drawer
  const selectedDayEvents = useMemo(() => {
    if (!selectedDateStr) return [];
    return eventsByDate[selectedDateStr] || [];
  }, [selectedDateStr, eventsByDate]);

  // Month Grid Calculation (42 cells / 6 rows of 7 days)
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

    // Leading days from previous month
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

    // Days in current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
      allCells.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
      });
    }

    // Trailing days for next month
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

    // Chunk into rows of 7
    const rows: Array<typeof allCells> = [];
    for (let i = 0; i < allCells.length; i += 7) {
      rows.push(allCells.slice(i, i + 7));
    }
    return rows;
  }, [currentDate, todayStr]);

  // Open Edit Modal
  const handleOpenEdit = async (item: CalendarDailyEvent) => {
    try {
      if (typeof item.id === 'number' || !String(item.id).startsWith('ev-')) {
        const detail = await dailyTodoService.onGetTodobyID(item.id).catch(() => null);
        if (detail) {
          setEditingTodo({
            id: detail.id || detail.ID || item.id,
            title: detail.ToDoDetail || detail.title || item.rawText,
            date: parseDateToYMD(detail.shift_dt || item.dateStr),
            details: detail.comments || detail.description || '',
          });
          setIsEditModalOpen(true);
          return;
        }
      }
    } catch {
      // fallback
    }

    setEditingTodo({
      id: item.id,
      title: item.rawText,
      date: item.dateStr,
      details: '',
    });
    setIsEditModalOpen(true);
  };

  // Save edited Todo
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo.title.trim()) {
      toastService.error('To-Do text is required!');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id: editingTodo.id ? Number(editingTodo.id) || 0 : 0,
        ID: editingTodo.id ? Number(editingTodo.id) || 0 : 0,
        Employee_ID: empId,
        empid: empId,
        ToDoDetail: editingTodo.title.trim(),
        title: editingTodo.title.trim(),
        shift_dt: `${editingTodo.date}T00:00:00`,
      };

      await dailyTodoService.onAddEditTodo(payload);
      toastService.success('To-do updated successfully!');
      setIsEditModalOpen(false);
      loadEvents();
    } catch (err: any) {
      console.error('Failed to save todo:', err);
      toastService.error(err?.message || 'Failed to save to-do.');
    } finally {
      setIsSaving(false);
    }
  };

  // Format header title date
  const displayMonthYear = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <React.Fragment>
      <div className="daily-todo-container">
        <Container fluid>
          {/* Page Title */}
          <div className="daily-todo-title">Daily To Do</div>

          {/* Header Navigation Bar */}
          <div className="calendar-top-header">
            {/* Left Button Group: Previous, Today, Next */}
            <div className="btn-group-nav-pill">
              <button
                type="button"
                className="btn-nav-item"
                onClick={handlePrev}
                title="Previous"
              >
                Previous
              </button>
              <button
                type="button"
                className="btn-nav-item"
                onClick={handleToday}
                title="Today"
              >
                Today
              </button>
              <button
                type="button"
                className="btn-nav-item"
                onClick={handleNext}
                title="Next"
              >
                Next
              </button>
            </div>

            {/* Center Month Year Title */}
            <div className="calendar-center-title">{displayMonthYear}</div>

            {/* Right Button Group: Month, Week, Day */}
            <div className="btn-group-nav-pill">
              <button
                type="button"
                className={`btn-nav-item ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
              <button
                type="button"
                className={`btn-nav-item ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={`btn-nav-item ${viewMode === 'day' ? 'active' : ''}`}
                onClick={() => setViewMode('day')}
              >
                Day
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          {loading && events.length === 0 ? (
            <div className="text-center py-5 border rounded bg-white">
              <Spinner color="primary" />
              <div className="mt-2 text-muted">Loading calendar events...</div>
            </div>
          ) : (
            <div className="position-relative">
              {loading && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-50"
                  style={{ zIndex: 10 }}
                >
                  <Spinner color="primary" />
                </div>
              )}
              <table className="calendar-month-table">
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
                      <React.Fragment key={`week-row-frag-${rIdx}`}>
                        <tr key={`row-${rIdx}`}>
                          {row.map((cell) => {
                            const dayItems = eventsByDate[cell.dateStr] || [];
                            const count = dayItems.length;
                            const isSelected = selectedDateStr === cell.dateStr;

                            return (
                              <td
                                key={cell.dateStr}
                                className={`${!cell.isCurrentMonth ? 'other-month' : ''} ${cell.isToday ? 'today-cell' : ''
                                  } ${isSelected ? 'selected-day' : ''}`}
                                onClick={() =>
                                  setSelectedDateStr(isSelected ? null : cell.dateStr)
                                }
                              >
                                <div className="day-cell-header">
                                  {count > 0 ? (
                                    <span className="red-count-badge" title={`${count} items`}>
                                      {count}
                                    </span>
                                  ) : (
                                    <span></span>
                                  )}
                                  <span className="day-number">{cell.dayNumber}</span>
                                </div>

                                {/* Blue dots grid */}
                                {count > 0 && (
                                  <div className="day-dots-container">
                                    {dayItems.map((item, dotIdx) => (
                                      <span
                                        key={`dot-${dotIdx}`}
                                        className="event-blue-dot"
                                        title={item.rawText}
                                      />
                                    ))}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>

                        {/* Render dark drawer right below this specific week row */}
                        {isSelectedRow && selectedDateStr && (
                          <tr key={`drawer-row-${rIdx}`} className="drawer-table-row">
                            <td colSpan={7} className="drawer-table-cell">
                              <div className="dark-events-drawer">
                                <div className="drawer-header">
                                  <div className="drawer-title">
                                    {new Date(`${selectedDateStr}T00:00:00`).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}{' '}
                                    <span className="text-muted">({selectedDayEvents.length} Items)</span>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn-close-drawer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDateStr(null);
                                    }}
                                    title="Close panel"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {selectedDayEvents.length === 0 ? (
                                  <div className="empty-drawer-text">
                                    No to-do items found for this date.
                                  </div>
                                ) : (
                                  <div className="drawer-events-list">
                                    {selectedDayEvents.map((item, idx) => (
                                      <div key={item.id || idx} className="drawer-event-row">
                                        <div className="event-text-content" title={item.rawText}>
                                          <span className="row-blue-bullet">●</span>
                                          <span className="row-text">{item.rawText}</span>
                                        </div>
                                        {/* <button
                                        type="button"
                                        className="btn-edit-pencil"
                                        title="Edit To-do"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenEdit(item);
                                        }}
                                      >
                                        <i className="mdi mdi-pencil"></i>
                                      </button> */}
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
          )}

          {/* Edit Modal */}
          <Modal
            isOpen={isEditModalOpen}
            toggle={() => setIsEditModalOpen(!isEditModalOpen)}
            centered
            backdrop="static"
          >
            <ModalHeader toggle={() => setIsEditModalOpen(false)}>
              <span className="fw-bold">Edit To-do</span>
            </ModalHeader>
            <form onSubmit={handleSaveEdit}>
              <ModalBody>
                <Row className="g-3">
                  <Col md={12}>
                    <Label className="form-label fw-medium">
                      To-do Detail <span className="text-danger">*</span>
                    </Label>
                    <Input
                      type="textarea"
                      rows={4}
                      className="form-control"
                      value={editingTodo.title}
                      onChange={(e) =>
                        setEditingTodo((p) => ({ ...p, title: e.target.value }))
                      }
                      autoFocus
                    />
                  </Col>

                  <Col md={12}>
                    <Label className="form-label fw-medium">Date</Label>
                    <Input
                      type="date"
                      className="form-control"
                      value={editingTodo.date}
                      onChange={(e) =>
                        setEditingTodo((p) => ({ ...p, date: e.target.value }))
                      }
                    />
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="secondary"
                  outline
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Spinner size="sm" className="me-1" /> Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DailyToDo;
