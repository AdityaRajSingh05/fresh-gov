import { useState, useEffect, useCallback } from 'react';
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
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getLineage, getDataset } from '../api/Lineage';
import Sidebar from '../components/Sidebar';
import SidebarToggle from '../components/SidebarToggle';
import Header from '../components/Header';

// --- Custom Node Component ---
// UPDATED: Removed dataset name entirely. Now shows Dept and Format.
const CustomNode = ({ data }) => (
    <div
        className={`px-4 py-3 shadow-md rounded-lg border-2 min-w-[160px] text-center ${data.isMain ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200'}`}
        title={`Dataset: ${data.label}`} // Full name remains available on hover only
    >
        <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-500" />

        <div className="flex flex-col items-center gap-2">
            {/* Owner Unit - The Primary Identifier */}
            <span className="px-2 py-1 rounded text-[11px] font-bold uppercase tracking-widest bg-slate-800 text-white w-full">
                {data.label || 'Unknown Dept'}
            </span>

            {/* Data Format / Source Type */}
            <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-tighter">
                    {data.type || 'DATA'}
                </span>
            </div>
        </div>

        <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-500" />
    </div>
);

const nodeTypes = { custom: CustomNode };

export default function LineagePage() {
    const [datasetId, setDatasetId] = useState('');
    const [datasets, setDatasets] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        getDataset().then(data => {
            setDatasets(data);
        });
    }, []);

    // Fetch Data
    useEffect(() => {

        if (!datasetId) return;

        getLineage(datasetId).then(data => {
            // Process nodes
            const fetchedNodes = data.nodes.map((node) => ({
                id: `node-${node.id}`,
                type: 'custom',
                data: {
                    label: node.data.label,
                    type: node.data.type
                },
                position: node.position,
            }));

            const fetchedEdges = data.edges.map((edge, index) => ({
                id: `edge-${index}`,
                source: `node-${edge.source}`,
                target: `node-${edge.target}`,
                markerEnd: {
                    type: MarkerType.Arrow,
                },
                animated: true,
                style: { stroke: '#3b82f6' },
            }));

            setNodes(fetchedNodes);
            setEdges(fetchedEdges);
        });
    }, [datasetId]);

    // --- Helper to find Owner Name ---
    // const getOwnerName = useCallback((ownerId) => {
    //     if (!orgUnits.length) return 'Loading...';
    //     const unit = orgUnits.find(u => u.id === ownerId);
    //     return unit ? unit.name : 'Unassigned';
    // }, [orgUnits]);

    // Build Graph

    // Handlers
    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
    const handleDatasetChange = (e) => {
        const selectedId = e.target.value;
        setDatasetId(selectedId);
    }
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen w-screen bg-[#f8fafc]">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <main className="flex flex-col flex-1 h-screen overflow-hidden">
                <header className="header-with-toggle">
                    <SidebarToggle isOpen={sidebarOpen} onToggle={toggleSidebar} />
                    <Header />
                </header>

                <div className="p-8 pb-0">
                    <h1 className="text-2xl font-bold text-[#1e293b]">Data Lineage Explorer</h1>
                    <div className="mt-6 max-w-sm mb-4">
                        <select
                            value={datasetId}
                            onChange={handleDatasetChange}
                            className="w-full p-3 bg-white border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-slate-700"
                        >
                            <option value="">-- Select Dataset --</option>
                            {datasets.map(ds => (
                                <option key={ds.id} value={ds.id}>{ds.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex-1 bg-white border-t border-slate-200 relative w-full h-full">
                    {datasetId && nodes.length > 0 && (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background bgColor="#f8fafc" gap={16} size={1} />
                            <Controls />
                            <MiniMap nodeColor={n => n.data.isMain ? '#3b82f6' : '#e2e8f0'} />
                        </ReactFlow>
                    )}
                    {datasetId && nodes.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>Loading lineage data...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}