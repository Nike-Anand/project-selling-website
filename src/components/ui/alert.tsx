import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  description?: string;
}

const Alert: React.FC<AlertProps> = ({ children, description }) => {
  return (
    <div>
      {children}
      {description && (
        <p className="text-sm text-gray-600 mt-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default Alert;