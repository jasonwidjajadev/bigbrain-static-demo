const FormInput = ({
  label,
  type = 'text',
  name,
  id,
  value,
  placeholder,
  onChange,
  autoComplete = 'off',
  required = true,
  errorMessage = '',
  className = '',
}) => {
  return (
    <div>
      <label htmlFor={id || name} className="block mb-1 text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id || name}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={onChange}
        required={required}
        className={className}
      />
      {errorMessage && (
        <div className="text-red-500 text-sm mt-1" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default FormInput;
