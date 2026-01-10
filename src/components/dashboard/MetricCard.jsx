function MetricCard ({ icon, value, label, colorClass }) {
  return (
    <div className="metric-card">
      <div className="flex items-center gap-4">
        <div className={`metric-icon ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground">
            {value}
          </p>
          <p className="text-sm text-muted-foreground">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;