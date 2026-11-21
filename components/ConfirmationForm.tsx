"use client";

import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

interface ConfirmationFormProps {
  action: (formData: FormData) => void | Promise<void>;
  children?: ReactNode;
  title: string;
  message: string;
  submitLabel: string;
  confirmLabel: string;
  cancelLabel?: string;
    submitClassName?: string;
    confirmClassName?: string;
}

export default function ConfirmationForm({
  action,
  children,
  title,
  message,
  submitLabel,
  confirmLabel,
  cancelLabel = "Cancel",
    submitClassName = "bg-secondary hover:bg-primary text-white",
  confirmClassName = "bg-secondary hover:bg-primary text-white",
}: ConfirmationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const messageId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!confirmedRef.current) {
      event.preventDefault();
      setIsOpen(true);
      return;
    }

    confirmedRef.current = false;
  }

  function handleConfirm() {
    confirmedRef.current = true;
    setIsOpen(false);

    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {children}

        <div className="flex justify-end">
          <button
            type="submit"
            className={`rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${submitClassName}`}
          >
            {submitLabel}
          </button>
        </div>
      </form>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={messageId}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h2
              id={titleId}
              className="text-xl font-semibold text-gray-900"
            >
              {title}
            </h2>

            <p
              id={messageId}
              className="mt-3 text-sm leading-relaxed text-gray-600 whitespace-pre-line"
            >
              {message}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                
                className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${confirmClassName}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
