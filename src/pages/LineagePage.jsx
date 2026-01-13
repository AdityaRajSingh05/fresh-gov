import { useState, useCallback } from 'react';
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    applyEdgeChanges,
    applyNodeChanges,
    Handle,
    Position,
    addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from '../components/Sidebar';
import SidebarToggle from '../components/SidebarToggle';
import Header from '../components/Header';

// --- Custom Node Component ---
const CustomNode = ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-slate-200 min-w-[150px]">
        <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-500" />
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{data.type}</span>
            <span className="text-sm font-semibold text-slate-700">{data.label}</span>
        </div>
        <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-500" />
    </div>
);

// Memoized nodeTypes to avoid React Flow warning
const nodeTypes = { custom: CustomNode };

// --- Mock Data ---
const datasetLineage = {
    external_leads_feed: {
        nodes: [
            { id: '1', type: 'custom', data: { label: 'S3 Bucket (Source)', type: 'Source' }, position: { x: 0, y: 100 } },
            { id: '2', type: 'custom', data: { label: 'external_leads_feed', type: 'Dataset' }, position: { x: 300, y: 100 } },
            { id: '3', type: 'custom', data: { label: 'Sales Warehouse', type: 'Target' }, position: { x: 600, y: 100 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3' },
        ],
    },
    central_customer_300: {
        nodes: [
            { id: '1', type: 'custom', data: { label: 'CRM System', type: 'Source' }, position: { x: 0, y: 50 } },
            { id: '2', type: 'custom', data: { label: 'ERP System', type: 'Target' }, position: { x: 600, y: 150 } },
            { id: '3', type: 'custom', data: { label: 'central_customer_360', type: 'Dataset' }, position: { x: 300, y: 100 } },
            { id: '4', type: 'custom', data: { label: 'Finance Dashboard', type: 'Target' }, position: { x: 600, y: 0 } },
        ],
        edges: [
            { id: 'e1-3', source: '1', target: '3', animated: true },
            { id: 'e3-2', source: '3', target: '2', animated: true },
            { id: 'e3-4', source: '3', target: '4', animated: true },
        ],
    },
};

export default function LineagePage() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState('');

    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge(params, eds));
    }, []);

    const handleDatasetChange = (e) => {
        const val = e.target.value;
        setSelectedDataset(val);
        if (datasetLineage[val]) {
            setNodes(datasetLineage[val].nodes);
            setEdges(datasetLineage[val].edges);
        } else {
            setNodes([]);
            setEdges([]);
        }
    };

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen w-screen bg-[#f8fafc]">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <main className="flex flex-col flex-1">
                {/* Title and Selector */}

                <header className="header-with-toggle">
                    <SidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
                    <Header className="bg-red-500" />
                </header>

                <div className="p-8">
                    <h1 className="text-2xl font-bold text-[#1e293b]">Data Lineage Explorer</h1>
                    <p className="text-slate-500 text-sm">Visualize the end-to-end journey of your data assets.</p>

                    <div className="mt-6 max-w-sm">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                            Select Dataset
                        </label>
                        <select
                            value={selectedDataset}
                            onChange={handleDatasetChange}
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 transition-all cursor-pointer"
                        >
                            <option value="">-- Choose a dataset --</option>
                            <option value="external_leads_feed">external_leads_feed</option>
                            <option value="central_customer_300">central_customer_300</option>
                        </select>
                    </div>
                </div>

                {/* Lineage Canvas */}
                {/* Fix overflow issue by adding relative position */}

                <div className="flex-1 bg-white border border-slate-100 shadow-md relative">
                    {selectedDataset ? (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background
                                bgColor="#f8fafc"
                                id="1"
                                gap={10}
                                color="#f1f1f1"
                                variant={BackgroundVariant.Dots}
                                size={4}
                            />

                            <Background
                                id="2"
                                gap={100}
                                color="#ccc"
                                variant={BackgroundVariant.Lines}
                            />
                            <Controls />
                            <MiniMap nodeStrokeWidth={3} zoomable pannable />
                        </ReactFlow>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="#000" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
                                />
                            </svg>
                            <p className="font-medium">Select a dataset to visualize its lineage</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
 