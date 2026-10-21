import React, { useState } from "react";

type ClearableInputProps = {
  value?: string;
  onValueChange?: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

/** Text input with a clear (✕) button and Escape-to-clear. Controlled when `value` is passed, otherwise self-managed. */
const ClearableInput: React.FC<ClearableInputProps> = ({ value, onValueChange, style, onKeyDown, ...props }) => {
  const [inner, setInner] = useState("");
  const current = value ?? inner;

  const update = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <span style={{ position: "relative", display: "flex", flex: "1 1 auto", minWidth: 0 }}>
      <input
        {...props}
        value={current}
        onChange={e => update(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Escape") update("");
          onKeyDown?.(e);
        }}
        style={{ ...style, width: "100%", paddingRight: current ? "2rem" : undefined }}
      />
      {current && (
        <button
          type="button"
          aria-label="Clear search"
          title="Clear search"
          onClick={() => update("")}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            color: "#94a3b8",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            fontSize: "1.1rem",
          }}
        >
          <i className="mdi mdi-close-circle"></i>
        </button>
      )}
    </span>
  );
};

export default ClearableInput;
