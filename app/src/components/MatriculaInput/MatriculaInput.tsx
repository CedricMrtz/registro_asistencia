"use client";

import { useState } from "react";

interface MatriculaInputProps {
  disabled: boolean;
  isSubmitting?: boolean;
  onSubmit: (matricula: string) => Promise<void> | void;
}

export function MatriculaInput({
  disabled,
  isSubmitting = false,
  onSubmit,
}: MatriculaInputProps) {
  const [value, setValue] = useState("");

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const matricula = value.trim();
        if (!matricula || disabled || isSubmitting) {
          return;
        }

        await onSubmit(matricula);
        setValue("");
      }}
    >
      <label className="text-sm text-stone-700">Matricula</label>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Matricula del estudiante"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-10 w-full rounded-md border border-stone-200 px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-40"
          disabled={disabled || isSubmitting}
          title={disabled ? "Selecciona un evento primero" : ""}
        />
        <button
          type="submit"
          className="h-10 px-5 rounded-md bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 disabled:opacity-40 transition-colors"
          disabled={disabled || isSubmitting || !value.trim()}
          title={disabled ? "Selecciona un evento primero" : ""}
        >
          Registrar
        </button>
      </div>
    </form>
  );
}
