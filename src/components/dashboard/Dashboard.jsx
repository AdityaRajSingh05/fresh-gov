import { useState } from 'react';
import { FiList, FiShield, FiGitMerge } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import Header from '../Header';
import MetricCard from './MetricCard';
import DatasetTable from './DatasetTable';
import { metrics } from '../../data/mockData';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">
            Data Steward Dashboard
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <MetricCard
              icon={FiList}
              value={metrics.totalDatasets}
              label="Total Datasets"
            />
            <MetricCard
              icon={FiShield}
              value={metrics.activeRules}
              label="Active Rules"
            />
            <MetricCard
              icon={FiGitMerge}
              value={metrics.lineageMapping}
              label="Lineage Mapping"
            />
          </div>
          <DatasetTable />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;