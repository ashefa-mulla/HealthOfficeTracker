import { FieldValues, Path, useFormContext, get, Controller } from "react-hook-form";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";

interface RHFTextAreaProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  isEdit?: boolean;
  required?: boolean;
}

export function RHFTextArea<T extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 3,
  disabled = false,
  isEdit = true,
  required = false,
}: RHFTextAreaProps<T>) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<T>();

  // Safe error access
  const error = get(errors, name);
  const value = watch(name);

  return (
    <FormGroup>
      {label && (
        <Label style={{ fontSize: "12px", fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
        </Label>
      )}

      {!isEdit ? (
        // VIEW MODE
        <div
          style={{
            padding: "8px 12px",
            minHeight: `${rows * 24}px`,
            border: "1px solid #ced4da",
            borderRadius: "6px",
            backgroundColor: "#f8f9fa",
            whiteSpace: "pre-wrap",
            fontSize: "12px",
          }}
        >
          {value || "-"}
        </div>
      ) : (
        // EDIT MODE
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="textarea"
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              invalid={!!error}
              style={{ fontSize: "12px" }}
            />
          )}
        />
      )}

      {error && <FormFeedback style={{ display: "block" }}>{error.message as string}</FormFeedback>}
    </FormGroup>
  );
}
