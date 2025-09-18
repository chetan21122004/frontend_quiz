import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const Timer = ({ 
  initialTime = 300, // 5 minutes in seconds
  onTimeUp = () => {},
  showWarningAt = 60, // Show warning when 1 minute left
  className = '',
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 40) return 'success';
    if (percentage > 20) return 'warning';
    return 'danger';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'fs-6';
      case 'large': return 'fs-4';
      default: return 'fs-5';
    }
  };

  const isWarning = timeLeft <= showWarningAt && timeLeft > 0;
  const isDanger = timeLeft <= 30 && timeLeft > 0;

  return (
    <div className={`d-flex align-items-center ${className}`}>
      <div className={`timer-badge bg-${getTimerColor()} text-white ${getSizeClass()} ${
        isDanger ? 'timer-danger' : isWarning ? 'timer-warning' : ''
      }`}>
        <Clock size={size === 'large' ? 24 : size === 'small' ? 14 : 18} className="me-2" />
        {formatTime(timeLeft)}
      </div>
      
      {/* Warning indicator */}
      {isWarning && (
        <AlertTriangle 
          className={`ms-2 ${isDanger ? 'text-danger' : 'text-warning'}`} 
          size={size === 'large' ? 24 : size === 'small' ? 16 : 20}
        />
      )}
    </div>
  );
};

// Hook for timer functionality
export const useTimer = (initialTime = 300, onTimeUp = () => {}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 40) return 'success';
    if (percentage > 20) return 'warning';
    return 'danger';
  };

  return {
    timeLeft,
    isActive,
    start,
    pause,
    reset,
    formatTime: () => formatTime(timeLeft),
    getTimerColor,
    isExpired: timeLeft === 0,
    percentage: (timeLeft / initialTime) * 100
  };
};

export default Timer;
