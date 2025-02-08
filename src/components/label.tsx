import React from 'react';

interface LabelProps {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children }) => {
  return (
    <label>
      {children}
    </label>
  );
};

export default Label;