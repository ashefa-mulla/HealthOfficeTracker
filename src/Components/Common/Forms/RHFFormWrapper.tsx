import React from "react";
import {
  FormProvider,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  SubmitErrorHandler,
} from "react-hook-form";
import { Form } from "reactstrap";

interface RHFFormWrapperProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  onInvalid?: SubmitErrorHandler<T>;
  children: React.ReactNode;
  className?: string;
  noValidate?: boolean;
}

export function RHFFormWrapper<T extends FieldValues>({
  methods,
  onSubmit,
  onInvalid,
  children,
  className,
  noValidate = true,
}: RHFFormWrapperProps<T>) {
  return (
    <FormProvider {...methods}>
      <Form
        onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
        className={className}
        noValidate={noValidate}
      >
        {children}
      </Form>
    </FormProvider>
  );
}
