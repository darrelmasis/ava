import classNames from 'classnames'

const Checkbox = ({
  checked,
  onChange,
  disabled = false,
  label,
  id,
  name,
  className = '',
  labelClassName = '',
}) => {
  const checkboxId = id || `checkbox-${name || 'default'}`

  return (
    <label
      htmlFor={checkboxId}
      className={classNames(
        'group flex items-center space-x-3 cursor-pointer',
        className
      )}
    >
      {/* Custom checkbox container */}
      <div className="relative">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only" // Hide the default checkbox
        />

        {/* Custom checkbox design */}
        <div
          className={classNames(
            'w-5 h-5 border-2 rounded-md flex items-center justify-center',
            {
              // Unchecked state
              'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800':
                !checked,

              // Checked state
              'border-lime-500 bg-lime-500 dark:border-lime-400 dark:bg-lime-400':
                checked,
            }
          )}
        >
          {/* Checkmark icon */}
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Label */}
      <span
        className={classNames(
          'text-sm font-medium select-none text-gray-700 dark:text-gray-200',
          labelClassName
        )}
      >
        {label}
      </span>
    </label>
  )
}

export default Checkbox
