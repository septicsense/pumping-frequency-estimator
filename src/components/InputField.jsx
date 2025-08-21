import React from 'react';

const InputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    options = [],
    infoText = ''
}) => {
    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="input-field"
                    required={required}
                    >
                    <option value="">Select {label}</option>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </select>
                );

            case 'number':
                return (
                    <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="input-field"
                    required={required}
                    min="1"
                    />
                );

            default:
                return (
                    <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="input-field"
                    required={required}
                    />
                );
        }
    };

    return (
        <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        </label>

        {renderInput()}

        {infoText && (
            <p className="mt-1 text-xs text-gray-400">{infoText}</p>
        )}
        </div>
    );
};

export default InputField;
