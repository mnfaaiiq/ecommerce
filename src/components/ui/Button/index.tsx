import React from "react";

type PropTypes = {
  type: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  children: React.ReactNode;
  variant: "green" | "blue";
};

const Button = (props: PropTypes) => {
  const { type, onClick, children, variant } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full shadow-xl mt-3 py-2.5 px-5 text-sm font-semibold tracking-wider rounded-md text-white bg-${variant}-600 hover:bg-${variant}-700 focus:outline-none transition-all flex items-center justify-center cursor-pointer`}
    >
      {children}
    </button>
  );
};

export default Button;
