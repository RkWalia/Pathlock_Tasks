import React from 'react';
import '../styles/ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="error-close">
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;