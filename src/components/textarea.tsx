import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({ value, onChange }) => {
  return (
    <textarea value={value} onChange={onChange} />
  );
};

export default Textarea;