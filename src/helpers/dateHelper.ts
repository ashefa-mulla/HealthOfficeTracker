/**
 * Date Helper functions for handling local date/time serialization and display
 * without unwanted timezone shifting (e.g. converting local 12:27 to UTC 16:27).
 */

/**
 * Parses any date value (ISO string, Date object, formatted string e.g. "10/08/2026 09:27 AM", or timestamp)
 * into a local Date object without UTC timezone shifting.
 */
export const parseSafeDate = (val: any): Date | null => {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;

    // 1. Match MM/DD/YYYY [hh:mm[:ss]] [AM|PM] (e.g. "10/08/2026 09:27 AM", "10/08/2026 12:27 PM", "10/08/2026")
    const mdyMatch = trimmed.match(
      /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i
    );
    if (mdyMatch) {
      const [, m, d, y, rawH, min, s, ampm] = mdyMatch;
      let h = rawH !== undefined ? Number(rawH) : 0;
      if (ampm) {
        const isPm = ampm.toUpperCase() === 'PM';
        if (isPm && h < 12) h += 12;
        if (!isPm && h === 12) h = 0;
      }
      const parsed = new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        h,
        min !== undefined ? Number(min) : 0,
        s !== undefined ? Number(s) : 0
      );
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // 2. Match YYYY-MM-DD or YYYY/MM/DD [T|space] [hh:mm[:ss]] [AM|PM] (e.g. "2026-10-08T09:27:00.000Z")
    const ymdMatch = trimmed.match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?\s*(AM|PM)?(?:Z|[+-]\d{2}:?\d{2})?)?$/i
    );
    if (ymdMatch) {
      const [, y, m, d, rawH, min, s, ampm] = ymdMatch;
      let h = rawH !== undefined ? Number(rawH) : 0;
      if (ampm) {
        const isPm = ampm.toUpperCase() === 'PM';
        if (isPm && h < 12) h += 12;
        if (!isPm && h === 12) h = 0;
      }
      const parsed = new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        h,
        min !== undefined ? Number(min) : 0,
        s !== undefined ? Number(s) : 0
      );
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    const fallback = new Date(trimmed);
    return isNaN(fallback.getTime()) ? null : fallback;
  }
  return null;
};

/**
 * Formats a Date object, ISO string, or date string into a local ISO timestamp string
 * ("YYYY-MM-DDTHH:mm:ss.000Z") preserving the exact local hours/minutes without timezone shift.
 */
export const formatLocalDateToIso = (dateVal: any): string => {
  if (!dateVal) return '';
  const d = parseSafeDate(dateVal);
  if (!d) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
};

/**
 * Formats a date value for UI display (MM/DD/YYYY)
 */
export const formatDateOnly = (dateVal?: string | Date | null): string => {
  if (!dateVal) return '-';
  const d = parseSafeDate(dateVal);
  if (!d) return '-';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
};

/**
 * Formats a date value with time for UI display (MM/DD/YYYY hh:mm A)
 */
export const formatDateTimeDisplay = (dateVal?: string | Date | null): string => {
  if (!dateVal) return '';
  const d = parseSafeDate(dateVal);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(hours)}:${pad(d.getMinutes())} ${ampm}`;
};
