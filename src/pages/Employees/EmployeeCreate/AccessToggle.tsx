import React from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import "./accessToggle.scss";

interface Props<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  onText?: string;
  offText?: string;
}

/** Large, colour-coded switch for granting / revoking access (bound to a react-hook-form boolean) */
function AccessToggle<T extends FieldValues>({
  name,
  label,
  description,
  onText = "Active",
  offText = "Inactive",
}: Props<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const on = Boolean(field.value);
        return (
          <label className={`access-toggle ${on ? "on" : "off"}`}>
            <input
              type="checkbox"
              className="access-toggle-input"
              checked={on}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              ref={field.ref}
            />
            <span className="access-toggle-icon">
              <i className={`mdi ${on ? "mdi-check-circle" : "mdi-close-circle"}`}></i>
            </span>
            <span className="access-toggle-text">
              <span className="access-toggle-label">{label}</span>
              {description && <span className="access-toggle-desc">{description}</span>}
            </span>
            <span className="access-toggle-status">{on ? onText : offText}</span>
            <span className="access-toggle-switch">
              <span className="access-toggle-knob" />
            </span>
          </label>
        );
      }}
    />
  );
}

export default AccessToggle;
