import { useState, useEffect } from 'react';
import './MetricWidget.css';

interface MetricWidgetProps {
  title: string;
  initialValue: number;
  unit?: string;
  prefix?: string;
  trend?: 'up' | 'down' | 'neutral';
  updateInterval?: number;
  isPaused?: boolean;
  maxValue?: number;
}

const MetricWidget = ({ 
  title, 
  initialValue, 
  unit = '', 
  prefix = '',
  trend: _trend = 'neutral',
  updateInterval = 3000,
  isPaused = false,
  maxValue
}: MetricWidgetProps) => {
  const [value, setValue] = useState(initialValue);
  const [previousValue, setPreviousValue] = useState(initialValue);

  // Reset when initialValue changes (for reset functionality)
  useEffect(() => {
    setValue(initialValue);
    setPreviousValue(initialValue);
  }, [initialValue]);

  // Use the trend prop to influence the random direction
  useEffect(() => {
    if (isPaused) return;

    const trendBias = _trend === 'up' ? 0.6 : _trend === 'down' ? 0.4 : 0.5;
    const interval = setInterval(() => {
      setPreviousValue(value);
      // Simulate real-time updates with random fluctuation influenced by trend
      const change = (Math.random() - (1 - trendBias)) * (initialValue * 0.05);
      setValue(prev => {
        let newValue = Math.max(0, Math.round((prev + change) * 100) / 100);
        if (maxValue !== undefined) {
          newValue = Math.min(newValue, maxValue);
        }
        return newValue;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [value, initialValue, updateInterval, _trend, isPaused, maxValue]);

  const getTrendIcon = () => {
    if (value > previousValue) return '↑';
    if (value < previousValue) return '↓';
    return '→';
  };

  const getTrendClass = () => {
    if (value > previousValue) return 'trend-up';
    if (value < previousValue) return 'trend-down';
    return 'trend-neutral';
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toLocaleString();
  };

  return (
    <div className={`metric-widget ${isPaused ? 'paused' : ''}`}>
      <h3>{title}</h3>
      <div className="metric-value">
        <span className="value">{prefix}{formatValue(value)}{unit}</span>
        <span className={`trend ${getTrendClass()}`}>{getTrendIcon()}</span>
      </div>
      <div className="metric-footer">
        <span className={`change ${getTrendClass()}`}>
          {value > previousValue ? '+' : ''}{(value - previousValue).toFixed(1)} from last update
        </span>
      </div>
      {isPaused && <div className="paused-overlay">PAUSED</div>}
    </div>
  );
};

export default MetricWidget;
