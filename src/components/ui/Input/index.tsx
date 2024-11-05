import React from "react";

type PropsTypes = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  children?: React.ReactNode;
};

const Input = (props: PropsTypes) => {
  const { label, name, type, placeholder, children } = props;
  return (
    <>
      <div className="mt-8">
        {label && (
          <label htmlFor={name} className="text-gray-800 text-xs block mb-2">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            name={name}
            type={type}
            id={name}
            required
            className="w-full bg-transparent text-sm text-gray-800 border-b border-gray-300 focus:border-blue-500 px-2 py-3 outline-none"
            placeholder={placeholder}
          />
          {children}
        </div>
      </div>
    </>
  );
};

export default Input;
