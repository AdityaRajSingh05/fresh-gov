import { useState } from 'react';
import { FiList, FiShield, FiShare2 } from 'react-icons/fi';

import Sidebar from '../Sidebar';
import Header from '../Header';
import SidebarToggle from '../SidebarToggle';
import MetricCard from '../dashboard/MetricCard';
import DatasetTable from '../dashboard/DatasetTable';

function StewardDashboard () {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <main className="flex-1 bg-background">
        {/* Header with Toggle */}
        <header className="header-with-toggle">
          <SidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
          <Header />
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Data Steward Dashboard
          </h1>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              icon={<FiList size={24} />}
              value={5}
              label="Total Datasets"
              colorClass="blue"
            />

            <MetricCard
              icon={<FiShield size={24} />}
              value={3}
              label="Active Rules"
              colorClass="yellow"
            />

            <MetricCard
              icon={<FiShare2 size={24} />}
              value={4}
              label="Lineage Mapping"
              colorClass="purple"
            />
          </div>

          {/* Dataset Table */}
          <DatasetTable />
        </div>
      </main>
    </div>
  );
}

export default StewardDashboard;