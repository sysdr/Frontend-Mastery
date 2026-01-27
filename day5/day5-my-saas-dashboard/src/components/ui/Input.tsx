import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, errorMessage, ...props }, ref) => {
    const baseStyles = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500';

    const mergedClassName = twMerge(
      baseStyles,
      errorStyles,
      className
    );

    const id = props.id || React.useId();

    return (
      <>
        <input
          type={type}
          className={mergedClassName}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error && errorMessage ? `${id}-error` : undefined}
          id={id}
          {...props}
        />
        {error && errorMessage && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </>
    );
  }
);

Input.displayName = 'Input';
export { Input };
