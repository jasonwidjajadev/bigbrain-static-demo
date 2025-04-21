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
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  errorMessage = '',
  autoComplete = 'off',
  className = '',
}) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block mb-1 text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        className={`w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-sm font-Nunito-Medium ${className}`}
        placeholder={placeholder}
        required
      />
      {errorMessage && (
        <div className="text-red-500 text-sm mt-1" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default FormInput;
