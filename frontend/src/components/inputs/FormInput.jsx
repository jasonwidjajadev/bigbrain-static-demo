/**
 * Reusable form input with label and optional error message.
 *
 * @param {string} label - Label text for the input
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} name - Input name and ID
 * @param {string} value - Controlled value of the input
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} [errorMessage] - Optional error message to display
 * @param {string} [autoComplete] - Optional autoComplete attribute
 * @param {string} [className] - Additional custom styling if needed
 * @returns {JSX.Element}
 */
function FormInput({
  id,
  labelContent,

  placeholder = '',

  type = 'text',
  autoComplete = 'off', // name | username | email | current-password | new-password | on/off

  name,
  value,

  autoFocus = false,
  onChange,
  errorMessage = '',

  required = true,
  ariaLabel = '',
  addClassName = '',
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block mb-1 text-sm font-medium"
      >
        {labelContent}
      </label>
      <input
        id={id}

        required={required}
        className={`w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-sm font-Nunito-Medium ${addClassName}`}

        placeholder={placeholder}

        type={type}     autoComplete={autoComplete}
        name={name}     value={value}

        autoFocus={autoFocus}
        onChange={onChange}

        aria-label={ariaLabel || labelContent}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
      />
      {errorMessage && (
        <div
          id={`${id}-error`}
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default FormInput;
