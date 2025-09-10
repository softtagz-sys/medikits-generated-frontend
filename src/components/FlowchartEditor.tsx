import React, { useState, useCallback, useRef } from 'react';
import { Plus, Save, Eye, Trash2, Copy, Settings, ArrowRight } from 'lucide-react';
import { Flowchart, FlowchartNode, ReusableStep } from '../types/flowchart';
import { reusableSteps } from '../data/reusableSteps';
import FlowchartVisualizer from './FlowchartVisualizer';

interface Props {
  flowchart: Flowchart;
  onSave: (flowchart: Flowchart) => void;
  onClose: () => void;
}

const FlowchartEditor: React.FC<Props> = ({ flowchart, onSave, onClose }) => {
  const [editingFlowchart, setEditingFlowchart] = useState<Flowchart>(flowchart);
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showReusableSteps, setShowReusableSteps] = useState(false);
  const nodeIdCounter = useRef(editingFlowchart.nodes.length);

  const generateNodeId = () => {
    nodeIdCounter.current += 1;
    return `node-${nodeIdCounter.current}`;
  };

  const addNode = useCallback((type: FlowchartNode['type']) => {
    const newNode: FlowchartNode = {
      id: generateNodeId(),
      type,
      title: type === 'decision' ? 'Nieuwe beslissing' : type === 'end' ? 'Einde' : 'Nieuwe stap',
      instruction: type === 'decision' ? 'Wat is de situatie?' : type === 'end' ? 'Voltooid' : 'Voer deze actie uit',
      position: { x: 100, y: 100 },
      ...(type === 'decision' && { choices: [{ text: 'Ja', nextNodeId: '' }, { text: 'Nee', nextNodeId: '' }] }),
      ...(type === 'end' && { endType: 'success' as const, endMessage: 'Procedure voltooid' }),
    };

    setEditingFlowchart(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date(),
    }));
    setSelectedNode(newNode);
  }, []);

  const addReusableStep = useCallback((reusableStep: ReusableStep) => {
    const newNode: FlowchartNode = {
      id: generateNodeId(),
      type: 'reference',
      title: reusableStep.title,
      instruction: reusableStep.instruction,
      instructionFirstResponder: reusableStep.instructionFirstResponder,
      image: reusableStep.image,
      referenceId: reusableStep.id,
      position: { x: 100, y: 100 },
    };

    setEditingFlowchart(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date(),
    }));
    setSelectedNode(newNode);
    setShowReusableSteps(false);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<FlowchartNode>) => {
    setEditingFlowchart(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ),
      updatedAt: new Date(),
    }));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedNode]);

  const deleteNode = useCallback((nodeId: string) => {
    setEditingFlowchart(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      updatedAt: new Date(),
    }));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const duplicateNode = useCallback((node: FlowchartNode) => {
    const newNode: FlowchartNode = {
      ...node,
      id: generateNodeId(),
      title: `${node.title} (kopie)`,
      position: { 
        x: (node.position?.x || 0) + 50, 
        y: (node.position?.y || 0) + 50 
      },
    };

    setEditingFlowchart(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date(),
    }));
  }, []);

  const handleSave = () => {
    onSave({
      ...editingFlowchart,
      version: editingFlowchart.version + 1,
    });
  };

  const addChoice = () => {
    if (selectedNode?.type === 'decision') {
      const newChoices = [
        ...(selectedNode.choices || []),
        { text: 'Nieuwe keuze', nextNodeId: '' }
      ];
      updateNode(selectedNode.id, { choices: newChoices });
    }
  };

  const updateChoice = (index: number, field: 'text' | 'nextNodeId', value: string) => {
    if (selectedNode?.type === 'decision' && selectedNode.choices) {
      const newChoices = selectedNode.choices.map((choice, i) => 
        i === index ? { ...choice, [field]: value } : choice
      );
      updateNode(selectedNode.id, { choices: newChoices });
    }
  };

  const removeChoice = (index: number) => {
    if (selectedNode?.type === 'decision' && selectedNode.choices) {
      const newChoices = selectedNode.choices.filter((_, i) => i !== index);
      updateNode(selectedNode.id, { choices: newChoices });
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Flowchart Editor</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2">
            <input
              type="text"
              value={editingFlowchart.name}
              onChange={(e) => setEditingFlowchart(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Flowchart naam"
            />
            <textarea
              value={editingFlowchart.description}
              onChange={(e) => setEditingFlowchart(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-20 resize-none"
              placeholder="Beschrijving"
            />
          </div>
        </div>

        {/* Add Nodes */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Nieuwe elementen</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addNode('step')}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              Stap
            </button>
            <button
              onClick={() => addNode('decision')}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              Beslissing
            </button>
            <button
              onClick={() => addNode('end')}
              className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              Einde
            </button>
            <button
              onClick={() => setShowReusableSteps(true)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm transition-colors"
            >
              <Plus size={16} />
              Herbruikbaar
            </button>
          </div>
        </div>

        {/* Node List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="font-medium text-gray-900 mb-3">Nodes ({editingFlowchart.nodes.length})</h3>
          <div className="space-y-2">
            {editingFlowchart.nodes.map((node) => (
              <div
                key={node.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedNode?.id === node.id
                    ? 'border-[#016565] bg-[#016565] bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    node.type === 'step' ? 'bg-blue-100 text-blue-700' :
                    node.type === 'decision' ? 'bg-yellow-100 text-yellow-700' :
                    node.type === 'end' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {node.type === 'reference' ? 'herbruikbaar' : node.type}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateNode(node);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{node.title}</p>
                <p className="text-xs text-gray-600 truncate">{node.instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setShowVisualizer(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#016565] hover:bg-[#014545] text-white rounded-lg transition-colors"
          >
            <Eye size={20} />
            Visualiseer Flowchart
          </button>
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Save size={20} />
            Opslaan
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 p-6">
        {selectedNode ? (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedNode.type === 'reference' ? 'Herbruikbare Stap' : 
                 selectedNode.type === 'decision' ? 'Beslissing' :
                 selectedNode.type === 'end' ? 'Einde Node' : 'Stap'} Bewerken
              </h3>
              <span className="text-sm text-gray-500">ID: {selectedNode.id}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titel</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => updateNode(selectedNode.id, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructie</label>
                <textarea
                  value={selectedNode.instruction}
                  onChange={(e) => updateNode(selectedNode.id, { instruction: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hulpverlener Instructie</label>
                <textarea
                  value={selectedNode.instructionFirstResponder || ''}
                  onChange={(e) => updateNode(selectedNode.id, { instructionFirstResponder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 resize-none"
                  placeholder="Optioneel: gedetailleerde instructies voor hulpverleners"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Afbeelding URL</label>
                <input
                  type="url"
                  value={selectedNode.image || ''}
                  onChange={(e) => updateNode(selectedNode.id, { image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://images.pexels.com/..."
                />
              </div>

              {selectedNode.type === 'decision' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Keuzes</label>
                    <button
                      onClick={addChoice}
                      className="flex items-center gap-1 px-3 py-1 bg-[#016565] hover:bg-[#014545] text-white rounded text-sm transition-colors"
                    >
                      <Plus size={16} />
                      Keuze
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedNode.choices?.map((choice, index) => (
                      <div key={index} className="flex gap-2 items-center p-3 border border-gray-200 rounded-lg">
                        <input
                          type="text"
                          value={choice.text}
                          onChange={(e) => updateChoice(index, 'text', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Keuze tekst"
                        />
                        <ArrowRight size={16} className="text-gray-400" />
                        <select
                          value={choice.nextNodeId}
                          onChange={(e) => updateChoice(index, 'nextNodeId', e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Selecteer volgende node</option>
                          {editingFlowchart.nodes
                            .filter(node => node.id !== selectedNode.id)
                            .map(node => (
                              <option key={node.id} value={node.id}>
                                {node.title}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => removeChoice(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedNode.type === 'end' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Einde Type</label>
                    <select
                      value={selectedNode.endType || 'success'}
                      onChange={(e) => updateNode(selectedNode.id, { endType: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="success">Succesvol voltooid</option>
                      <option value="continue">Ga door met monitoring</option>
                      <option value="emergency">Noodsituatie - direct 112</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Einde Bericht</label>
                    <textarea
                      value={selectedNode.endMessage || ''}
                      onChange={(e) => updateNode(selectedNode.id, { endMessage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 resize-none"
                      placeholder="Bericht dat getoond wordt aan het einde"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Settings size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Selecteer een node om te bewerken</p>
              <p className="text-gray-400 text-sm">Of voeg een nieuwe node toe vanuit het zijpaneel</p>
            </div>
          </div>
        )}
      </div>

      {/* Reusable Steps Modal */}
      {showReusableSteps && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Herbruikbare Stappen</h3>
                <button
                  onClick={() => setShowReusableSteps(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid md:grid-cols-2 gap-4">
                {reusableSteps.map((step) => (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#016565] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{step.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{step.instruction}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        step.type === 'common' ? 'bg-blue-100 text-blue-700' :
                        step.type === 'emergency' ? 'bg-red-100 text-red-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {step.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {step.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => addReusableStep(step)}
                        className="px-3 py-1 bg-[#016565] hover:bg-[#014545] text-white rounded text-sm transition-colors"
                      >
                        Toevoegen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visualizer Modal */}
      {showVisualizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Flowchart Visualisatie</h3>
                <button
                  onClick={() => setShowVisualizer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[75vh]">
              <FlowchartVisualizer flowchart={editingFlowchart} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowchartEditor;