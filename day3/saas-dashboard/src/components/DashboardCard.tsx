import React from 'react';
import Button from './Button';

interface DashboardCardProps {
  title: string;
  content: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  content,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm mx-auto md:max-w-md lg:max-w-lg w-full transform transition-all hover:scale-105 duration-300">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{content}</p>
      <Button variant="primary" size="md" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </div>
  );
};

export default DashboardCard;
