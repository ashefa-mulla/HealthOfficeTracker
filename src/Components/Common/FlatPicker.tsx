import React, { useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import { parseSafeDate, formatLocalDateToIso } from '@/helpers/dateHelper';

export interface FlatPickerProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  onChange?: (date: Date | null, isoStr: string) => void;
  onBlur?: () => void;
  mode?: 'date' | 'datetime' | 'time';
  required?: boolean;
  disabled?: boolean;
  isClear?: boolean;
  error?: string;
  placeholder?: string;
  options?: any;
  className?: string;
}

export const FlatPicker: React.FC<FlatPickerProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  mode = 'datetime',
  required = false,
  disabled = false,
  isClear = true,
  error,
  placeholder,
  options = {},
  className = '',
}) => {
  const fpRef = useRef<any>(null);

  const selectedDate = parseSafeDate(value);

  const getOptions = () => {
    switch (mode) {
      case 'datetime':
        return {
          enableTime: true,
          dateFormat: 'm/d/Y h:i K',
          time_24hr: false,
          minuteIncrement: 5,
          allowInput: true,
          ...options,
        };
      case 'time':
        return {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'h:i K',
          time_24hr: false,
          minuteIncrement: 5,
          allowInput: true,
          ...options,
        };
      default:
        return {
          dateFormat: 'm/d/Y',
          allowInput: true,
          ...options,
        };
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(null, '');
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = e.currentTarget.parentElement;
    const input = container?.querySelector('input');
    if (input) {
      if ((input as any)._flatpickr) {
        (input as any)._flatpickr.open();
      } else {
        input.focus();
      }
    }
  };

  return (
    <FormGroup className="mb-0">
      {label && (
        <Label htmlFor={id || name} className="fw-medium">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </Label>
      )}

      <div style={{ position: 'relative' }}>
        <Flatpickr
          ref={fpRef}
          id={id || name}
          name={name}
          value={selectedDate ? selectedDate : ''}
          onChange={([date], dateStr) => {
            if (onChange) {
              const parsed = date || parseSafeDate(dateStr);
              const isoStr = parsed ? formatLocalDateToIso(parsed) : '';
              onChange(parsed || null, isoStr);
            }
          }}
          onClose={([date], dateStr) => {
            if (onChange) {
              const parsed = date || parseSafeDate(dateStr);
              if (parsed) {
                const isoStr = formatLocalDateToIso(parsed);
                onChange(parsed, isoStr);
              }
            }
            if (onBlur) onBlur();
          }}
          options={getOptions()}
          className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
          disabled={disabled}
          placeholder={placeholder || (mode === 'date' ? 'MM/DD/YYYY' : 'MM/DD/YYYY hh:mm AM/PM')}
          style={{ paddingRight: isClear && selectedDate && !disabled ? '60px' : '36px' }}
        />

        {/* Calendar / Clock Icon */}
        <span
          onClick={handleIconClick}
          style={{
            position: 'absolute',
            right: isClear && selectedDate && !disabled ? '32px' : '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: disabled ? 'default' : 'pointer',
            color: '#7ab4e7',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
          title="Open picker"
        >
          <i className={mode === 'time' ? 'mdi mdi-clock-outline' : 'mdi mdi-calendar'}></i>
        </span>

        {/* Clear Button */}
        {isClear && selectedDate && !disabled && (
          <span
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#dc3545',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
            title="Clear"
          >
            <i className="mdi mdi-close"></i>
          </span>
        )}
      </div>

      {error && (
        <FormFeedback style={{ display: 'block' }}>
          {error}
        </FormFeedback>
      )}
    </FormGroup>
  );
};

export default FlatPicker;
