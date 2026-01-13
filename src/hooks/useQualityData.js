import { useState, useEffect } from 'react';

export const useQualityData = (initialData) => {
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem('dq_filter_state') || 'ALL';
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    localStorage.setItem('dq_filter_state', filter);
  }, [filter]);

  const runScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500); // Simulate processing
  };

  const filteredData = initialData.filter(item => {
    const matchesFilter = filter === 'ALL' ? true : item.status === filter;
    const matchesSearch = item.field.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return { filter, setFilter, searchQuery, setSearchQuery, filteredData, isScanning, runScan };
};