import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="border rounded-lg shadow p-4">
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return (
    <div className="border-b pb-4">
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return (
    <h2 className="text-lg font-bold mb-2">
      {children}
    </h2>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
  return (
    <p className="text-sm text-gray-600 mb-4">
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return (
    <div className="py-4">
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return (
    <div className="border-t pt-4">
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };