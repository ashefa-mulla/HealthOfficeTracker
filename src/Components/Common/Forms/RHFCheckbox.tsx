import { Controller, useFormContext, FieldValues, Path, get } from "react-hook-form";
import { Input, Label, FormGroup, FormFeedback } from "reactstrap";

interface Props<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  disabled?: boolean;
}

export function RHFCheckBox<T extends FieldValues>({ name, label, disabled = false }: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = get(errors, name);

  return (
    <FormGroup
      check
      className="d-flex align-items-center mb-0"
      style={{
        minHeight: "38px",
      }}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            type="checkbox"
            id={name as string}
            checked={!!field.value}
            disabled={disabled}
            invalid={!!error}
            onChange={(e) => field.onChange(e.target.checked)}
            style={{
              width: "16px",
              height: "16px",
              marginTop: 0,
              cursor: "pointer",
            }}
          />
        )}
      />

      {label && (
        <Label
          check
          htmlFor={name as string}
          className="ms-2 mb-0"
          style={{
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {label}
        </Label>
      )}

      {error && <FormFeedback style={{ display: "block" }}>{error.message as string}</FormFeedback>}
    </FormGroup>
  );
}
