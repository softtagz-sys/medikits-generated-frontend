import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Edit, Trash2, Save, Workflow } from 'lucide-react';
import { EmergencyCategory, EmergencyStep } from '../types';
import { Flowchart } from '../types/flowchart';
import FlowchartManager from '../components/FlowchartManager';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'steps' | 'flowcharts'>('categories');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [flowcharts, setFlowcharts] = useState<Flowchart[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'rescura2024') {
      setIsAuthenticated(true);
    } else {
      alert('Onjuist wachtwoord');
    }
  };

  const mockCategories: EmergencyCategory[] = [
    {
      id: 'hartaanval',
      name: 'Hartaanval',
      icon: '💔',
      color: '#C12F2F',
      description: 'Hartstilstand of hartaanval',
      initialStepId: 'heart-check-consciousness',
    },
  ];

  const mockSteps: EmergencyStep[] = [
    {
      id: 'heart-check-consciousness',
      title: 'Controleer bewustzijn',
      instruction: 'Tik op de schouders en roep luid. Reageert het slachtoffer?',
      image: 'https://images.pexels.com/photos/7615464/pexels-photo-7615464.jpeg',
      nextSteps: [
        { text: 'Ja, slachtoffer reageert', stepId: 'heart-comfort-position' },
        { text: 'Nee, geen reactie', stepId: 'heart-check-breathing' },
      ],
    },
  ];

  const handleSaveFlowchart = (flowchart: Flowchart) => {
    setFlowcharts(prev => {
      const existing = prev.find(f => f.id === flowchart.id);
      if (existing) {
        return prev.map(f => f.id === flowchart.id ? flowchart : f);
      } else {
        return [...prev, flowchart];
      }
    });
  };

  const handleDeleteFlowchart = (id: string) => {
    if (confirm('Weet je zeker dat je deze flowchart wilt verwijderen?')) {
      setFlowcharts(prev => prev.filter(f => f.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 pb-8 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <Lock size={48} className="text-[#016565] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600">Voer het beheerderswachtwoord in</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016565] focus:border-transparent"
                  placeholder="Voer wachtwoord in"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#016565] hover:bg-[#014545] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Inloggen
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Terug naar hoofdpagina
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Terug naar app
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-[#016565] text-[#016565]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Categorieën
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'steps'
                    ? 'border-[#016565] text-[#016565]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Stappen
              </button>
              <button
                onClick={() => setActiveTab('flowcharts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'flowcharts'
                    ? 'border-[#016565] text-[#016565]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Workflow size={16} />
                  Flowcharts
                </div>
              </button>
            </nav>
          </div>

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Noodgevallencategorieën</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#016565] hover:bg-[#014545] text-white rounded-lg transition-colors">
                  <Plus size={20} />
                  Nieuwe categorie
                </button>
              </div>

              <div className="space-y-4">
                {mockCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{category.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-[#016565] transition-colors">
                        <Edit size={20} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-[#C12F2F] transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps Tab */}
          {activeTab === 'steps' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Hulpverleningsstappen</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#016565] hover:bg-[#014545] text-white rounded-lg transition-colors">
                  <Plus size={20} />
                  Nieuwe stap
                </button>
              </div>

              <div className="space-y-4">
                {mockSteps.map((step) => (
                  <div key={step.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-700 mb-2">{step.instruction}</p>
                        {step.instructionFirstResponder && (
                          <p className="text-[#016565] text-sm">
                            <strong>Hulpverlener:</strong> {step.instructionFirstResponder}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-500 hover:text-[#016565] transition-colors">
                          <Edit size={20} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-[#C12F2F] transition-colors">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {step.nextSteps && step.nextSteps.length > 0 && (
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Volgende stappen:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {step.nextSteps.map((nextStep, index) => (
                            <li key={index}>• {nextStep.text} → {nextStep.stepId}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flowcharts Tab */}
          {activeTab === 'flowcharts' && (
            <FlowchartManager
              flowcharts={flowcharts}
              onSave={handleSaveFlowchart}
              onDelete={handleDeleteFlowchart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;