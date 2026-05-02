/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Search,
  Filter,
  ArrowRight,
  BrainCircuit,
  Zap,
  ShieldCheck,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { predictionService, PredictionResult } from './services/predictionService';
import { StudentData } from './lib/ml';
import { cn } from './lib/utils';

// Components
import { StatsOverview } from './components/StatsOverview';
import { FeatureImportanceChart } from './components/FeatureImportance';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { StudentList } from './components/StudentList';
import { PredictionDetails } from './components/PredictionDetails';
import { FairnessChart } from './components/FairnessChart';

export default function App() {
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'fairness'>('overview');
  
  const trainingData = useMemo(() => predictionService.getTrainingData(), []);
  
  const predictions = useMemo(() => {
    return trainingData.map(s => ({
      student: s,
      result: predictionService.predict(s)
    }));
  }, [trainingData]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter(p => {
      const matchesSearch = p.student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === 'All' || p.result.riskLevel === filterRisk;
      return matchesSearch && matchesRisk;
    });
  }, [predictions, searchTerm, filterRisk]);

  const stats = useMemo(() => {
    const total = predictions.length;
    const highRisk = predictions.filter(p => p.result.riskLevel === 'High Risk').length;
    const medRisk = predictions.filter(p => p.result.riskLevel === 'Medium Risk').length;
    const lowRisk = predictions.filter(p => p.result.riskLevel === 'Low Risk').length;
    const passProb = predictions.filter(p => p.result.prediction === 'Pass').length / total;

    return { total, highRisk, medRisk, lowRisk, passProb };
  }, [predictions]);

  const featureImportance = useMemo(() => {
    const imp = predictionService.getFeatureImportance();
    return Object.entries(imp).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, []);

  const fairnessData = useMemo(() => {
    const groups = ['A', 'B', 'C'];
    return groups.map(g => {
      const groupData = predictions.filter(p => p.student.demographic_group === g);
      const passRate = groupData.filter(p => p.result.prediction === 'Pass').length / groupData.length;
      return { group: `Group ${g}`, passRate: Math.round(passRate * 100) };
    });
  }, [predictions]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans">
      {/* Sidebar / Navigation */}
      <nav className="fixed top-0 left-0 h-full w-20 bg-white border-r border-[#E5E5E7] flex flex-col items-center py-8 gap-10 z-50">
        <div className="w-12 h-12 bg-[#0071E3] rounded-2xl flex items-center justify-center text-white shadow-lg">
          <BrainCircuit size={28} />
        </div>
        <div className="flex flex-col gap-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn("p-3 rounded-xl transition-all", activeTab === 'overview' ? "bg-[#0071E3]/10 text-[#0071E3]" : "text-[#86868B] hover:bg-gray-100")}
          >
            <BarChart3 size={24} />
          </button>
          <button 
            onClick={() => setActiveTab('fairness')}
            className={cn("p-3 rounded-xl transition-all", activeTab === 'fairness' ? "bg-[#0071E3]/10 text-[#0071E3]" : "text-[#86868B] hover:bg-gray-100")}
          >
            <ShieldCheck size={24} />
          </button>
          <div className="h-px bg-gray-200 w-8 mx-auto my-2" />
          <Users className="text-[#86868B] p-0.5 cursor-not-allowed opacity-30" />
          <Zap className="text-[#86868B] p-0.5 cursor-not-allowed opacity-30" />
          <History className="text-[#86868B] p-0.5 cursor-not-allowed opacity-30" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-28 pr-8 py-8 max-w-[1600px] mx-auto">
        <header className="mb-10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-semibold text-[#0071E3] uppercase tracking-wider mb-2">Academic Intelligence v2.0</p>
              <h1 className="text-4xl font-bold tracking-tight">EduSense Dashboard</h1>
              <div className="flex gap-4 mt-2">
                <p className="text-[#86868B]">Industry-Grade Risk Analysis & Intervention Engine.</p>
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap size={10} /> Live Simulation
                </span>
              </div>
            </div>
            {activeTab === 'overview' && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search student ID..." 
                    className="pl-10 pr-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl focus:ring-2 focus:ring-[#0071E3] outline-none transition-all w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  className="px-4 py-2.5 bg-white border border-[#D2D2D7] rounded-xl focus:ring-2 focus:ring-[#0071E3] outline-none transition-all cursor-pointer text-sm font-medium"
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                >
                  <option value="All">All Risk Levels</option>
                  <option value="High Risk">High Risk</option>
                  <option value="Medium Risk">Medium Risk</option>
                  <option value="Low Risk">Low Risk</option>
                </select>
              </div>
            )}
          </div>
        </header>

        {activeTab === 'overview' ? (
          <>
            <StatsOverview stats={stats} />
            <div className="grid grid-cols-12 gap-8 mt-10">
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-8">
                  <FeatureImportanceChart data={featureImportance} />
                  <div className="bg-white p-6 rounded-3xl border border-[#E5E5E7] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-lg">Risk Distribution</h3>
                      <TrendingUp size={18} className="text-[#86868B]" />
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Low Risk', value: stats.lowRisk },
                              { name: 'Medium Risk', value: stats.medRisk },
                              { name: 'High Risk', value: stats.highRisk },
                            ]}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#34C759" />
                            <Cell fill="#FF9500" />
                            <Cell fill="#FF3B30" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <StudentList 
                  predictions={filteredPredictions} 
                  onSelect={setSelectedStudent} 
                  selectedStudentId={selectedStudent?.id}
                />
              </div>
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                <AnimatePresence mode="wait" initial={false}>
                  {selectedStudent ? (
                    <PredictionDetails 
                      key={selectedStudent.id}
                      student={selectedStudent} 
                      result={predictionService.predict(selectedStudent)} 
                      onClose={() => setSelectedStudent(null)}
                    />
                  ) : (
                    <ScenarioSimulator key="simulator" />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-7">
              <FairnessChart data={fairnessData} />
            </div>
            <div className="col-span-12 lg:col-span-5 bg-white p-8 rounded-3xl border border-[#E5E5E7] shadow-sm h-fit">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <ShieldCheck className="text-[#0071E3]" /> Ethical AI Guidelines
              </h3>
              <p className="text-[#86868B] text-sm leading-relaxed mb-6">
                Our model undergoes regular fairness auditing to ensure that demographic variables 
                (Race, Gender, Socio-economic status) do not introduce bias into behavioral predictions.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 italic">
                  <p className="text-xs font-semibold text-[#1D1D1F]">"AI models should augment human educators, not replace them. Every prediction serves as a signal for support, not a final judgment."</p>
                </div>
                <ul className="space-y-3 text-xs font-medium text-[#86868B]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                    Equal Opportunity: Pass rates consistent within ±5% across groups.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                    Unbiased Features: Prioritiezed behavioral signals (attendance, effort) over demographic data.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={14} />
                    Human-in-the-loop validation for all High Risk interventions.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

