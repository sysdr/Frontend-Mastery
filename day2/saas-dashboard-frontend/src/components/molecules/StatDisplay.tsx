import React from 'react';
import Text from '../atoms/Text';

interface StatDisplayProps {
  value: string | number;
  label: string;
  className?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ value, label, className = '' }) => {
  return (
    <div className={`flex flex-col items-center p-4 ${className}`}>
      <Text variant="heading2" className="text-blue-700">
        {value}
      </Text>
      <Text variant="caption" className="mt-1">
        {label}
      </Text>
    </div>
  );
};

export default StatDisplay;
