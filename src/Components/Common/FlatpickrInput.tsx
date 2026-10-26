import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import { Options } from 'flatpickr/dist/types/options';
import 'flatpickr/dist/themes/material_blue.css';
import { parseSafeDate } from '@/helpers/dateHelper';

type DateValue = Date | string | number | null | undefined;
type FlatpickrHook = (dates: Date[], dateStr: string, instance: Instance) => void;

export interface FlatpickrInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: DateValue | DateValue[];
  /** Read when the picker is created; later changes to plain (string/number/boolean) options are applied */
  options?: Partial<Options>;
  onChange?: FlatpickrHook;
  onClose?: FlatpickrHook;
  /** Renders an icon that opens the picker */
  icon?: 'calendar' | 'clock';
  /** Distance of the icon from the right edge (px), e.g. to make room for a clear button */
  iconRight?: number;
}

const toDates = (value: FlatpickrInputProps['value']): Date[] =>
  (Array.isArray(value) ? value : [value])
    .map((v) =>
      v instanceof Date ? v : typeof v === 'number' ? new Date(v) : typeof v === 'string' ? parseSafeDate(v) : null
    )
    .filter((d): d is Date => !!d && !isNaN(d.getTime()));

const sameDates = (a: Date[], b: Date[]) =>
  a.length === b.length && a.every((d, i) => d.getTime() === b[i].getTime());

/**
 * Flatpickr on a plain (uncontrolled) input.
 * The date can be typed - it is read on blur / Enter - and the calendar opens only from the icon
 * (`clickOpens: false`). Text that is not a date puts the last value back; an emptied box clears it.
 */
export const FlatpickrInput: React.FC<FlatpickrInputProps> = ({
  value,
  options,
  onChange,
  onClose,
  icon,
  iconRight = 10,
  disabled,
  style,
  onInput,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<Instance | null>(null);
  const lastDates = useRef<Date[]>([]);
  const typedText = useRef('');
  const handlers = useRef({ onChange, onClose });
  handlers.current = { onChange, onClose };

  // Create once - re-creating on every render would close the calendar and wipe typed text
  useEffect(() => {
    if (!inputRef.current) return;
    lastDates.current = toDates(value);
    const fp = flatpickr(inputRef.current, {
      allowInput: true,
      clickOpens: false,
      ...options,
      defaultDate: lastDates.current,
      onChange: (dates, dateStr, instance) => {
        if (dates.length === 0 && typedText.current.trim() !== '') {
          typedText.current = '';
          instance.setDate(lastDates.current, false);
          return;
        }
        typedText.current = '';
        lastDates.current = dates;
        handlers.current.onChange?.(dates, dateStr, instance);
      },
      onClose: (dates, dateStr, instance) => handlers.current.onClose?.(dates, dateStr, instance),
    });
    fpRef.current = fp;
    return () => {
      fp.destroy();
      fpRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow the value from outside; same dates are skipped so text being typed is left alone
  useEffect(() => {
    const fp = fpRef.current;
    if (!fp) return;
    const next = toDates(value);
    if (!sameDates(next, fp.selectedDates)) fp.setDate(next, false);
    lastDates.current = next;
  }, [value]);

  useEffect(() => {
    const fp = fpRef.current;
    if (!fp || !options) return;
    Object.entries(options).forEach(([key, val]) => {
      if (typeof val === 'object' || typeof val === 'function') return;
      if ((fp.config as any)[key] !== val) fp.set(key as keyof Options, val);
    });
  });

  const input = (
    <input
      ref={inputRef}
      {...inputProps}
      disabled={disabled}
      style={icon ? { paddingRight: iconRight + 26, ...style } : style}
      onInput={(e) => {
        typedText.current = e.currentTarget.value;
        onInput?.(e);
      }}
    />
  );

  if (!icon) return input;

  return (
    <div style={{ position: 'relative' }}>
      {input}
      <span
        onClick={() => !disabled && fpRef.current?.open()}
        style={{
          position: 'absolute',
          right: iconRight,
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: disabled ? 'default' : 'pointer',
          color: '#7ab4e7',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          zIndex: 2,
        }}
        title="Open picker"
      >
        <i className={icon === 'clock' ? 'mdi mdi-clock-outline' : 'mdi mdi-calendar'}></i>
      </span>
    </div>
  );
};

export default FlatpickrInput;
