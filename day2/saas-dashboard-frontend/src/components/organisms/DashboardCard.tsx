import React from 'react';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  footerActionText?: string;
  onFooterAction?: () => void;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  footerActionText,
  onFooterAction,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 flex flex-col ${className}`}>
      <Text variant="heading3" className="mb-4 text-gray-800">
        {title}
      </Text>
      <div className="flex-grow">
        {children}
      </div>
      {footerActionText && onFooterAction && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onFooterAction}>
            {footerActionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
