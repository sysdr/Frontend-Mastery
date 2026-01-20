import React from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  trend = 'neutral',
  icon,
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {unit && <span className="ml-2 text-sm text-gray-500">{unit}</span>}
      </div>
      {trend !== 'neutral' && (
        <div className="mt-2">
          <span className={`text-xs ${trendColors[trend]}`}>
            {trend === 'up' ? '↑' : '↓'} {trend === 'up' ? 'Increased' : 'Decreased'}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
