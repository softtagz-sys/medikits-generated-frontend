import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Copy, Download, Upload } from 'lucide-react';
import { Flowchart, FlowchartTemplate } from '../types/flowchart';
import { emergencyCategories } from '../data/emergencyData';
import FlowchartEditor from './FlowchartEditor';
import FlowchartVisualizer from './FlowchartVisualizer';

interface Props {
  flowcharts: Flowchart[];
  onSave: (flowchart: Flowchart) => void;
  onDelete: (id: string) => void;
}

const FlowchartManager: React.FC<Props> = ({ flowcharts, onSave, onDelete }) => {
  const [editingFlowchart, setEditingFlowchart] = useState<Flowchart | null>(null);
  const [viewingFlowchart, setViewingFlowchart] = useState<Flowchart | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFlowchartData, setNewFlowchartData] = useState({
    name: '',
    description: '',
    categoryId: '',
  });

  const createNewFlowchart = () => {
    if (!newFlowchartData.name || !newFlowchartData.categoryId) return;

    const newFlowchart: Flowchart = {
      id: `flowchart-${Date.now()}`,
      name: newFlowchartData.name,
      description: newFlowchartData.description,
      categoryId: newFlowchartData.categoryId,
      startNodeId: '',
      nodes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    setEditingFlowchart(newFlowchart);
    setShowCreateModal(false);
    setNewFlowchartData({ name: '', description: '', categoryId: '' });
  };

  const duplicateFlowchart = (flowchart: Flowchart) => {
    const duplicated: Flowchart = {
      ...flowchart,
      id: `flowchart-${Date.now()}`,
      name: `${flowchart.name} (kopie)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      nodes: flowchart.nodes.map(node => ({
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
      })),
    };

    // Update references in choices
    const nodeIdMap: { [oldId: string]: string } = {};
    flowchart.nodes.forEach((node, index) => {
      nodeIdMap[node.id] = duplicated.nodes[index].id;
    });

    duplicated.nodes.forEach(node => {
      if (node.type === 'decision' && node.choices) {
        node.choices = node.choices.map(choice => ({
          ...choice,
          nextNodeId: nodeIdMap[choice.nextNodeId] || choice.nextNodeId,
        }));
      }
    });

    if (duplicated.startNodeId) {
      duplicated.startNodeId = nodeIdMap[duplicated.startNodeId] || duplicated.startNodeId;
    }

    onSave(duplicated);
  };

  const exportFlowchart = (flowchart: Flowchart) => {
    const dataStr = JSON.stringify(flowchart, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `flowchart-${flowchart.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getCategoryName = (categoryId: string) => {
    const category = emergencyCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Onbekende categorie';
  };

  if (editingFlowchart) {
    return (
      <FlowchartEditor
        flowchart={editingFlowchart}
        onSave={(flowchart) => {
          onSave(flowchart);
          setEditingFlowchart(null);
        }}
        onClose={() => setEditingFlowchart(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Flowchart Beheer</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#016565] hover:bg-[#014545] text-white rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nieuwe Flowchart
        </button>
      </div>

      {/* Flowcharts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flowcharts.map((flowchart) => (
          <div key={flowchart.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{flowchart.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{flowchart.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {getCategoryName(flowchart.categoryId)}
                  </span>
                  <span>{flowchart.nodes.length} nodes</span>
                  <span>v{flowchart.version}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewingFlowchart(flowchart)}
                  className="p-2 text-gray-500 hover:text-[#016565] transition-colors"
                  title="Bekijk flowchart"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => setEditingFlowchart(flowchart)}
                  className="p-2 text-gray-500 hover:text-[#016565] transition-colors"
                  title="Bewerk flowchart"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => duplicateFlowchart(flowchart)}
                  className="p-2 text-gray-500 hover:text-[#016565] transition-colors"
                  title="Dupliceer flowchart"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={() => exportFlowchart(flowchart)}
                  className="p-2 text-gray-500 hover:text-[#016565] transition-colors"
                  title="Exporteer flowchart"
                >
                  <Download size={18} />
                </button>
              </div>
              <button
                onClick={() => onDelete(flowchart.id)}
                className="p-2 text-gray-500 hover:text-[#C12F2F] transition-colors"
                title="Verwijder flowchart"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-400">
              Laatst bijgewerkt: {flowchart.updatedAt.toLocaleDateString('nl-NL')}
            </div>
          </div>
        ))}

        {flowcharts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto mb-2" />
              <p className="text-lg">Nog geen flowcharts</p>
              <p className="text-sm">Maak je eerste flowchart aan om te beginnen</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Nieuwe Flowchart</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Naam</label>
                <input
                  type="text"
                  value={newFlowchartData.name}
                  onChange={(e) => setNewFlowchartData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Flowchart naam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschrijving</label>
                <textarea
                  value={newFlowchartData.description}
                  onChange={(e) => setNewFlowchartData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 resize-none"
                  placeholder="Beschrijving van de flowchart"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
                <select
                  value={newFlowchartData.categoryId}
                  onChange={(e) => setNewFlowchartData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Selecteer categorie</option>
                  {emergencyCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={createNewFlowchart}
                disabled={!newFlowchartData.name || !newFlowchartData.categoryId}
                className="flex-1 px-4 py-2 bg-[#016565] hover:bg-[#014545] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aanmaken
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewingFlowchart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{viewingFlowchart.name}</h3>
                  <p className="text-gray-600">{viewingFlowchart.description}</p>
                </div>
                <button
                  onClick={() => setViewingFlowchart(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[75vh]">
              <FlowchartVisualizer flowchart={viewingFlowchart} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowchartManager;