import React from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Download, FileText, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import jsPDF from 'jspdf';

const ReportPage: React.FC = () => {
  const { state } = useApp();

  const generatePDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('Rescura - Noodhulp Rapport', 20, 20);
    
    pdf.setFontSize(12);
    pdf.text(`Gegenereerd op: ${format(new Date(), 'dd MMMM yyyy HH:mm', { locale: nl })}`, 20, 35);
    
    if (state.currentCategory) {
      pdf.text(`Categorie: ${state.currentCategory.name}`, 20, 45);
    }
    
    pdf.text(`Hulpverlener modus: ${state.isFirstResponderMode ? 'Ja' : 'Nee'}`, 20, 55);
    
    // Steps
    let yPosition = 70;
    pdf.setFontSize(14);
    pdf.text('Uitgevoerde stappen:', 20, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(10);
    
    state.report.forEach((step, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const timeString = format(step.timestamp, 'HH:mm:ss', { locale: nl });
      
      pdf.text(`${index + 1}. ${timeString}`, 20, yPosition);
      yPosition += 7;
      pdf.text(`   ${step.title}`, 20, yPosition);
      yPosition += 7;
      
      // Split long instructions into multiple lines
      const lines = pdf.splitTextToSize(`   ${step.instruction}`, 170);
      pdf.text(lines, 20, yPosition);
      yPosition += lines.length * 5;
      
      if (step.choice) {
        pdf.text(`   Gekozen: ${step.choice}`, 20, yPosition);
        yPosition += 7;
      }
      
      yPosition += 5;
    });
    
    pdf.save(`rescura-rapport-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
  };

  const exportJSON = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      category: state.currentCategory,
      isFirstResponderMode: state.isFirstResponderMode,
      steps: state.report,
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `rescura-rapport-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Noodhulp Rapport</h1>
              <p className="text-gray-600">
                Gegenereerd op {format(new Date(), 'dd MMMM yyyy HH:mm', { locale: nl })}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-4 py-2 bg-[#016565] hover:bg-[#014545] text-white rounded-lg transition-colors"
              >
                <FileText size={20} />
                JSON
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-[#C12F2F] hover:bg-[#A12525] text-white rounded-lg transition-colors"
              >
                <Download size={20} />
                PDF
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Categorie</h3>
              <p className="text-gray-700">
                {state.currentCategory ? `${state.currentCategory.icon} ${state.currentCategory.name}` : 'Niet gedefinieerd'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Modus</h3>
              <p className="text-gray-700">
                {state.isFirstResponderMode ? 'Hulpverlener' : 'Basis gebruiker'}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Aantal stappen</h3>
              <p className="text-gray-700">{state.report.length} stappen</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Uitgevoerde stappen</h2>
            
            {state.report.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nog geen stappen uitgevoerd</p>
              </div>
            ) : (
              <div className="space-y-6">
                {state.report.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#016565] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                        <span className="text-sm text-gray-500">
                          {format(step.timestamp, 'HH:mm:ss', { locale: nl })}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{step.instruction}</p>
                      
                      {step.choice && (
                        <div className="bg-blue-50 border border-blue-200 rounded px-3 py-1 inline-block">
                          <span className="text-blue-800 text-sm font-medium">
                            Gekozen: {step.choice}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;