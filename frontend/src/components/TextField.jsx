import PropTypes from 'prop-types'
import { AlertIcon } from './Icons.jsx'

export default function TextField({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  icon: Icon,
  prefix,
  trailing,
  hint,
  error,
  required = false,
  disabled = false,
  autoFocus = false,
  className = '',
}) {
  const inputId = id || name
  const messageId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
          {label}
          {required ? <span className="ml-0.5 text-brand-600">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        {Icon ? (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300"
          />
        ) : null}

        {prefix ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-ink-400">
            {prefix}
          </span>
        ) : null}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={[
            'w-full rounded-xl border bg-white py-3 pr-4 text-[0.95rem] font-medium text-ink-900',
            'shadow-[0_1px_2px_rgba(8,17,35,0.04)] outline-none transition-all duration-200',
            'placeholder:font-normal placeholder:text-ink-300',
            'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400',
            Icon || prefix ? 'pl-11' : 'pl-4',
            trailing ? 'pr-12' : '',
            error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10'
              : 'border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/12',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {trailing ? (
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
            {trailing}
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 flex animate-fade-in items-center gap-1.5 text-sm font-medium text-rose-600"
        >
          <AlertIcon size={14} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

TextField.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  inputMode: PropTypes.string,
  maxLength: PropTypes.number,
  icon: PropTypes.elementType,
  prefix: PropTypes.string,
  trailing: PropTypes.node,
  hint: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
}
