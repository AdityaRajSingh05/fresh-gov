import { useState } from 'react';
import { FiChevronRight, FiChevronLeft, FiSearch } from 'react-icons/fi';

function PolicyAssignment({ datasets, assignedDatasetIds, onAssign }) {
    const [searchAvailable, setSearchAvailable] = useState('');
    const [searchAssigned, setSearchAssigned] = useState('');
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedAssigned, setSelectedAssigned] = useState([]);

    // Split datasets into available and assigned
    const assignedDatasets = datasets.filter(d => assignedDatasetIds.includes(d.id));
    const availableDatasets = datasets.filter(d => !assignedDatasetIds.includes(d.id));

    // Filter datasets based on search
    const filteredAvailable = availableDatasets.filter(d =>
        d.name.toLowerCase().includes(searchAvailable.toLowerCase())
    );
    const filteredAssigned = assignedDatasets.filter(d =>
        d.name.toLowerCase().includes(searchAssigned.toLowerCase())
    );

    // Handle moving datasets
    const moveToAssigned = () => {
        const newAssigned = [...assignedDatasetIds, ...selectedAvailable];
        onAssign(newAssigned);
        setSelectedAvailable([]);
    };

    const moveToAvailable = () => {
        const newAssigned = assignedDatasetIds.filter(id => !selectedAssigned.includes(id));
        onAssign(newAssigned);
        setSelectedAssigned([]);
    };

    const toggleSelection = (id, list, setList) => {
        if (list.includes(id)) {
            setList(list.filter(item => item !== id));
        } else {
            setList([...list, id]);
        }
    };

    const getClassificationColor = (classification) => {
        const colors = {
            'Sensitive': 'text-red-600 bg-red-50',
            'Confidential': 'text-orange-600 bg-orange-50',
            'Internal': 'text-green-600 bg-green-50'
        };
        return colors[classification] || 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Assign datasets to this policy by moving them between the lists.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4">
                {/* Available Datasets */}
                <div className="space-y-3">
                    <div>
                        <label htmlFor="search-available" className="block text-sm font-medium text-foreground mb-2">
                            Available Datasets ({filteredAvailable.length})
                        </label>
                        <div className="relative">
                            <FiSearch
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={16}
                            />
                            <input
                                id="search-available"
                                type="text"
                                placeholder="Search..."
                                value={searchAvailable}
                                onChange={(e) => setSearchAvailable(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                                aria-label="Search available datasets"
                            />
                        </div>
                    </div>

                    <div
                        className="border border-border rounded-md bg-card overflow-hidden"
                        role="listbox"
                        aria-label="Available datasets"
                        aria-multiselectable="true"
                    >
                        <div className="max-h-64 overflow-y-auto">
                            {filteredAvailable.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No datasets available
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {filteredAvailable.map((dataset) => (
                                        <button
                                            key={dataset.id}
                                            onClick={() => toggleSelection(dataset.id, selectedAvailable, setSelectedAvailable)}
                                            className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedAvailable.includes(dataset.id) ? 'bg-primary/10' : ''
                                                }`}
                                            role="option"
                                            aria-selected={selectedAvailable.includes(dataset.id)}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {dataset.name}
                                                    </p>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getClassificationColor(dataset.classification)}`}>
                                                        {dataset.classification}
                                                    </span>
                                                </div>
                                                {selectedAvailable.includes(dataset.id) && (
                                                    <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Move Buttons */}
                <div className="flex md:flex-col items-center justify-center gap-2">
                    <button
                        onClick={moveToAssigned}
                        disabled={selectedAvailable.length === 0}
                        className="p-3 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Move selected datasets to assigned"
                        title="Assign selected"
                    >
                        <FiChevronRight size={20} className="hidden md:block" />
                        <span className="md:hidden">Assign →</span>
                    </button>
                    <button
                        onClick={moveToAvailable}
                        disabled={selectedAssigned.length === 0}
                        className="p-3 bg-muted text-foreground rounded-md hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        aria-label="Move selected datasets to available"
                        title="Remove selected"
                    >
                        <FiChevronLeft size={20} className="hidden md:block" />
                        <span className="md:hidden">← Remove</span>
                    </button>
                </div>

                {/* Assigned Datasets */}
                <div className="space-y-3">
                    <div>
                        <label htmlFor="search-assigned" className="block text-sm font-medium text-foreground mb-2">
                            Assigned Datasets ({filteredAssigned.length})
                        </label>
                        <div className="relative">
                            <FiSearch
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                size={16}
                            />
                            <input
                                id="search-assigned"
                                type="text"
                                placeholder="Search..."
                                value={searchAssigned}
                                onChange={(e) => setSearchAssigned(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
                                aria-label="Search assigned datasets"
                            />
                        </div>
                    </div>

                    <div
                        className="border border-border rounded-md bg-card overflow-hidden"
                        role="listbox"
                        aria-label="Assigned datasets"
                        aria-multiselectable="true"
                    >
                        <div className="max-h-64 overflow-y-auto">
                            {filteredAssigned.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No datasets assigned
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {filteredAssigned.map((dataset) => (
                                        <button
                                            key={dataset.id}
                                            onClick={() => toggleSelection(dataset.id, selectedAssigned, setSelectedAssigned)}
                                            className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${selectedAssigned.includes(dataset.id) ? 'bg-primary/10' : ''
                                                }`}
                                            role="option"
                                            aria-selected={selectedAssigned.includes(dataset.id)}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {dataset.name}
                                                    </p>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getClassificationColor(dataset.classification)}`}>
                                                        {dataset.classification}
                                                    </span>
                                                </div>
                                                {selectedAssigned.includes(dataset.id) && (
                                                    <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PolicyAssignment;
