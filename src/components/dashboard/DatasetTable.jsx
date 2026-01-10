const mockDatasets = [
  {
    id: 1,
    name: 'external_leads_feed',
    domain: 'Sales',
    classification: 'Sensitive',
    sourceType: 'CSV',
  },
  {
    id: 2,
    name: 'central_customer_360',
    domain: 'Finance',
    classification: 'Confidential',
    sourceType: 'JSON',
  },
  {
    id: 3,
    name: 'mkt_segment_export',
    domain: 'Finance',
    classification: 'Internal',
    sourceType: 'XML',
  },
  {
    id: 4,
    name: 'promo_reward_catalog',
    domain: 'Operations',
    classification: 'Confidential',
    sourceType: 'JSON',
  },
];

const getClassificationClass = (classification) => {
  switch (classification) {
    case 'Sensitive':
      return 'sensitive';
    case 'Confidential':
      return 'confidential';
    case 'Internal':
      return 'internal';
    default:
      return '';
  }
};

function DatasetTable () {
  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Registered Dataset
        </h2>
        <button className="view-all-btn">View All</button>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Domain</th>
            <th>Classification</th>
            <th>Source Type</th>
          </tr>
        </thead>
        <tbody>
          {mockDatasets.map((dataset) => (
            <tr key={dataset.id}>
              <td className="font-medium text-foreground">
                {dataset.name}
              </td>
              <td className="text-muted-foreground">
                {dataset.domain}
              </td>
              <td>
                <span
                  className={`classification-badge ${getClassificationClass(
                    dataset.classification
                  )}`}
                >
                  {dataset.classification}
                </span>
              </td>
              <td className="text-muted-foreground">
                {dataset.sourceType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetTable;