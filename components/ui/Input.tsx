import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block font-body text-small font-medium text-ink"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-ink/10'} bg-white px-3 py-2 font-body text-body text-ink placeholder:text-ink/40 focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/20 disabled:opacity-50 ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 font-body text-small text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
