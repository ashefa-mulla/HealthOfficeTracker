import {
  Controller,
  FieldValues,
  Path,
  useFormContext,
  get,
} from "react-hook-form";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { FormGroup, Label, FormFeedback } from "reactstrap";
import "./RHFFlatPicker.css";
import { parseSafeDate, formatLocalDateToIso } from "@/helpers/dateHelper";

interface RHFFlatpickrProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  mode?: "date" | "datetime" | "time";
  isEdit?: boolean;
  required?: boolean;
  disabled?: boolean;
  isClear?: boolean;
  placeholder?: string;
}

export function RHFFlatpickr<T extends FieldValues>({
  name,
  label,
  mode = "date",
  isEdit = true,
  required = false,
  disabled = false,
  isClear = true,
  placeholder,
}: RHFFlatpickrProps<T>) {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext<T>();

  const error = get(errors, name);
  const value = watch(name);

  const getOptions = () => {
    switch (mode) {
      case "datetime":
        return {
          enableTime: true,
          dateFormat: "m/d/Y h:i K",
          time_24hr: false,
          minuteIncrement: 5,
          allowInput: true,
        };
      case "time":
        return {
          enableTime: true,
          noCalendar: true,
          dateFormat: "h:i K",
          time_24hr: false,
          minuteIncrement: 5,
          allowInput: true,
        };
      default:
        return {
          dateFormat: "m/d/Y",
          allowInput: true,
        };
    }
  };

  const formatDisplay = () => {
    const d = parseSafeDate(value);
    if (!d) return "";
    if (mode === "datetime") return d.toLocaleString();
    if (mode === "time") return d.toLocaleTimeString();
    return d.toLocaleDateString();
  };

  const handleClear = () => {
    setValue(name, "" as any, {
      shouldDirty: true,
      shouldValidate: true,
    });
    trigger(name);
  };

  return (
    <FormGroup>
      {label && (
        <Label style={{ fontSize: "12px", fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
        </Label>
      )}

      {!isEdit ? (
        <div
          style={{
            padding: "8px 12px",
            minHeight: "38px",
            border: "1px solid #ced4da",
            borderRadius: "6px",
            backgroundColor: "#f8f9fa",
            fontSize: "12px",
          }}
        >
          {formatDisplay()}
        </div>
      ) : (
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const selectedDate = parseSafeDate(field.value);

            return (
              <div style={{ position: "relative" }}>
                <Flatpickr
                  value={selectedDate ? selectedDate : ""}
                  onChange={([date], dateStr) => {
                    const parsed = date || parseSafeDate(dateStr);
                    const isoStr = parsed ? formatLocalDateToIso(parsed) : "";
                    field.onChange(isoStr || dateStr || "");
                  }}
                  onClose={([date], dateStr) => {
                    const parsed = date || parseSafeDate(dateStr);
                    if (parsed) {
                      const isoStr = formatLocalDateToIso(parsed);
                      field.onChange(isoStr);
                    }
                    field.onBlur();
                  }}
                  options={getOptions()}
                  className={`form-control fp-small ${
                    error ? "is-invalid" : ""
                  }`}
                  disabled={disabled}
                  placeholder={
                    placeholder ||
                    (mode === "datetime"
                      ? "MM/DD/YYYY hh:mm AM/PM"
                      : "MM/DD/YYYY")
                  }
                  style={{
                    fontSize: "12px",
                    paddingRight:
                      isClear && selectedDate && !disabled ? "60px" : "36px",
                  }}
                />

                {/* Calendar / Clock Icon */}
                <span
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement;
                    const input = container?.querySelector("input");
                    if (input) {
                      if ((input as any)._flatpickr) {
                        (input as any)._flatpickr.open();
                      } else {
                        input.focus();
                      }
                    }
                  }}
                  style={{
                    position: "absolute",
                    right:
                      isClear && selectedDate && !disabled ? "32px" : "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: disabled ? "default" : "pointer",
                    color: "#7ab4e7",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                  }}
                  title="Open picker"
                >
                  <i
                    className={
                      mode === "time"
                        ? "mdi mdi-clock-outline"
                        : "mdi mdi-calendar"
                    }
                  ></i>
                </span>

                {/* Clear Button */}
                {isClear && selectedDate && !disabled && (
                  <span
                    onClick={handleClear}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#dc3545",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                    }}
                    title="Clear"
                  >
                    <i className="mdi mdi-close"></i>
                  </span>
                )}
              </div>
            );
          }}
        />
      )}

      {error && (
        <FormFeedback style={{ display: "block" }}>
          {error.message as string}
        </FormFeedback>
      )}
    </FormGroup>
  );
}
