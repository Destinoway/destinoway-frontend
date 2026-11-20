"use client";

import { Controller, get, useFormContext } from "react-hook-form";
import AppSelect from "../inputs/AppSelect";

export default function RHFSelect({ name, ...props }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AppSelect
          {...field}
          {...props}
          value={field.value || undefined}
          onChange={(value) => field.onChange(value)}
          error={get(errors, name)?.message}
        />
      )}
    />
  );
}
