/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowUpRight, ArrowDownRight, Zap, GraduationCap, AlertCircle } from 'lucide-react';
import { StudentData } from '../lib/ml';
import { PredictionResult } from '../services/predictionService';
import { cn } from '../lib/utils';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface PredictionDetailsProps {
  student: StudentData;
  result: PredictionResult;
  onClose: () => void;
}

export const PredictionDetails: React.FC<PredictionDetailsProps> = ({ student, result, onClose }) => {
  const radarData = [
    { subject: 'GPA', value: (student.prior_gpa / 4) * 100 },
    { subject: 'Attendance', value: student.attendance_pct },
    { subject: 'Quizzes', value: student.quiz_avg },
    { subject: 'LMS Activity', value: student.lms_activity * 5 },
    { subject: 'Consistency', value: student.submission_consistency * 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-3xl border border-[#E5E5E7] shadow-xl overflow-hidden sticky top-8"
    >
      <div className="p-6 border-b border-[#F5F5F7] flex justify-between items-center bg-[#FAFAFB]">
        <div>
          <h3 className="font-bold text-xl">{student.id}</h3>
          <p className="text-xs text-[#86868B] font-medium uppercase tracking-wider">Predictive Analysis Report</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Risk Score Gauge */}
        <div className="mb-8 text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 italic">
          <div className="text-4xl font-black mb-1" style={{ color: result.prediction === 'Pass' ? '#34C759' : '#FF3B30' }}>
            {Math.round(result.probability * 100)}%
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Survival Probability</div>
          <div className={cn(
            "mt-4 inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase",
            result.riskLevel === 'High Risk' ? "bg-red-500 text-white" :
            result.riskLevel === 'Medium Risk' ? "bg-orange-500 text-white" :
            "bg-green-500 text-white"
          )}>
            Prediction: {result.prediction}
          </div>
        </div>

        {/* Explainable AI: Radar Chart */}
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#86868B] mb-4 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" /> Feature Performance
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E5E5E7" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#86868B' }} />
                <Radar
                  name="Student"
                  dataKey="value"
                  stroke="#0071E3"
                  fill="#0071E3"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Factors (SHAP like) */}
        <div className="mb-8">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#86868B] mb-4">Key Impact Factors</h4>
          <div className="space-y-3">
            {Object.entries(result.shaps)
              .sort((a, b) => Math.abs(b[1] as number) - Math.abs(a[1] as number))
              .slice(0, 3)
              .map(([key, val]) => {
                const numericVal = val as number;
                return (
                  <div key={key} className="flex justify-between items-center p-3 bg-white border border-[#E5E5E7] rounded-xl text-sm">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <div className={cn("flex items-center font-bold", numericVal >= 0 ? "text-green-600" : "text-red-500")}>
                      {numericVal >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {Math.abs(Math.round(numericVal * 100))}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Interventions */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#86868B] mb-4 flex items-center gap-2">
            <GraduationCap size={16} className="text-blue-500" /> Prescribed Interventions
          </h4>
          <div className="space-y-3">
            {result.interventions.map((int, i) => (
              <div key={i} className="flex gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <AlertCircle size={18} className="text-blue-500 shrink-0" />
                <p className="text-xs leading-relaxed text-[#1D1D1F]">{int}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};