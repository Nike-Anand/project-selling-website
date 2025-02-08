import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input className="border rounded p-2" {...props} />
  );
};

export default Input;
