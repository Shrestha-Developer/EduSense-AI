/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, RefreshCw, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StudentData } from '../lib/ml';
import { predictionService } from '../services/predictionService';
import { cn } from '../lib/utils';

export const ScenarioSimulator: React.FC = () => {
  const [params, setParams] = useState<StudentData>({
    id: 'SIM-001',
    prior_gpa: 3.0,
    attendance_pct: 85,
    quiz_avg: 75,
    assignment_avg: 80,
    midterm_score: 70,
    study_hours_per_week: 15,
    lms_activity: 10,
    submission_consistency: 0.8,
    demographic_group: 'A',
    target: 1
  });

  const [result, setResult] = useState(() => predictionService.predict(params));
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setIsSimulating(true);
    const timer = setTimeout(() => {
      setResult(predictionService.predict(params));
      setIsSimulating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [params]);

  const handleSliderChange = (key: keyof StudentData, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E7] shadow-lg overflow-hidden sticky top-8">
      <div className="p-6 border-b border-[#F5F5F7] bg-[#FAFAFB]">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="text-[#0071E3]" size={20} />
          <h3 className="font-bold text-xl">Scenario Simulator</h3>
        </div>
        <p className="text-xs text-[#86868B] font-medium uppercase tracking-wider">What-If Analysis Engine</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Prediction Output */}
        <div className="relative p-6 rounded-2xl border bg-gray-50 flex items-center justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {isSimulating && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10"
              >
                <RefreshCw className="animate-spin text-[#0071E3]" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div>
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-1">Predicted Result</div>
            <div className={cn(
              "text-3xl font-black mb-1",
              result.prediction === 'Pass' ? 'text-green-500' : 'text-red-500'
            )}>
              {result.prediction}
            </div>
            <div className="text-xs font-medium text-gray-500">
              Confidence: {Math.round(result.probability * 100)}%
            </div>
          </div>

          <div className={cn(
            "p-3 rounded-2xl",
            result.riskLevel === 'High Risk' ? "bg-red-100 text-red-600" :
            result.riskLevel === 'Medium Risk' ? "bg-orange-100 text-orange-600" :
            "bg-green-100 text-green-600"
          )}>
            {result.riskLevel === 'High Risk' ? <AlertTriangle size={32} /> : 
             result.riskLevel === 'Medium Risk' ? <Zap size={32} /> : 
             <CheckCircle2 size={32} />}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <SliderItem 
            label="Prior GPA" 
            value={params.prior_gpa} 
            min={0} max={4} step={0.1} 
            onChange={(v) => handleSliderChange('prior_gpa', v)} 
          />
          <SliderItem 
            label="Attendance %" 
            value={params.attendance_pct} 
            min={0} max={100} 
            onChange={(v) => handleSliderChange('attendance_pct', v)} 
          />
          <SliderItem 
            label="Quiz Avg %" 
            value={params.quiz_avg} 
            min={0} max={100} 
            onChange={(v) => handleSliderChange('quiz_avg', v)} 
          />
          <SliderItem 
            label="Study Hours / Wk" 
            value={params.study_hours_per_week} 
            min={0} max={50} 
            onChange={(v) => handleSliderChange('study_hours_per_week', v)} 
          />
          <SliderItem 
            label="Submission Consistency" 
            value={params.submission_consistency * 100} 
            min={0} max={100} 
            onChange={(v) => handleSliderChange('submission_consistency', v / 100)} 
            unit="%"
          />
        </div>

        <button 
          onClick={() => setParams({
            ...params,
            prior_gpa: 2.5,
            attendance_pct: 60,
            quiz_avg: 50,
            study_hours_per_week: 5,
            submission_consistency: 0.4
          })}
          className="w-full py-3 border border-[#D2D2D7] rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Zap size={14} /> Reset to High-Risk Baseline
        </button>
      </div>
    </div>
  );
};

const SliderItem = ({ label, value, min, max, step = 1, onChange, unit = '' }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-semibold text-[#1D1D1F]">
      <span className="text-[#86868B] uppercase tracking-wider">{label}</span>
      <span>{value}{unit}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-[#E5E5E7] rounded-full appearance-none cursor-pointer accent-[#0071E3]"
    />
  </div>
);