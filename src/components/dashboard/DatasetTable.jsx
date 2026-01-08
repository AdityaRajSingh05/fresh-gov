import { datasets, Dataset } from '../../data/mockData';




const getClassificationStyle = (classification) => {
  switch (classification) {
    case 'Sensitive':
      return 'text-classification-sensitive';
    case 'Confidential':
      return 'text-classification-confidential';
    case 'Internal':
      return 'text-classification-internal';
    default:
      return 'text-foreground';
  }
};

const DatasetTable = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border">
        <h2 className="text-base md:text-lg font-semibold text-foreground">Registered Dataset</h2>
        <button
          className="px-3 md:px-4 py-2 text-sm font-medium text-foreground bg-background
                     border border-border rounded-lg hover:bg-muted transition-colors duration-200"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-150">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                Name
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                Domain
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                Classification
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-foreground">
                Source Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {datasets.map((dataset) => (
              <tr
                key={dataset.id}
                className="hover:bg-muted/50 transition-colors duration-150"
              >
                <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-foreground font-medium">
                  {dataset.name}
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">
                  {dataset.domain}
                </td>
                <td className={`px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium ${getClassificationStyle(dataset.classification)}`}>
                  {dataset.classification}
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-muted-foreground">
                  {dataset.sourceType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetTable;