import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button className="bg-blue-500 text-white rounded p-2" {...props} />
  );
};

export default Button;
