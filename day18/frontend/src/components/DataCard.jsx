import React from 'react';
import './DataCard.css';

const DataCard = ({ title, value, unit, trend, icon, onClick }) => {
    const isTrendUp = trend && trend > 0;
    const isTrendDown = trend && trend < 0;
    const trendIcon = isTrendUp ? '▲' : isTrendDown ? '▼' : '';
    const trendColorClass = isTrendUp ? 'trend-up' : isTrendDown ? 'trend-down' : '';
    const formattedTrend = trend ? `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%` : '';

    return (
        <div 
            className="data-card" 
            onClick={onClick} 
            aria-label={`Dashboard metric: ${title} with value ${value} ${unit}, trending ${formattedTrend}`}
            role="button"
            tabIndex="0"
        >
            <div className="card-header">
                {icon && <span className="card-icon" aria-hidden="true">{icon}</span>}
                <h3 className="card-title">{title}</h3>
            </div>
            <div className="card-body">
                <span className="card-value">{value}</span>
                {unit && <span className="card-unit">{unit}</span>}
            </div>
            {trend !== undefined && (
                <div className={`card-footer ${trendColorClass}`}>
                    <span className="trend-indicator" aria-hidden="true">{trendIcon}</span>
                    <span className="trend-text">{formattedTrend}</span>
                </div>
            )}
        </div>
    );
};

export default React.memo(DataCard);
