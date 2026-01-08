import React from 'react';

const MetricCard = ({ icon: Icon, value, label }) => {
  return (
    <div
      className="flex items-center gap-4 px-6 py-5 bg-card rounded-xl border border-border
                 shadow-card hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-metric-icon-bg rounded-lg">
        <Icon className="w-6 h-6 text-metric-icon-color" />
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default MetricCard;