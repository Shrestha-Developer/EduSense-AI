/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { StudentData } from '../lib/ml';
import { PredictionResult } from '../services/predictionService';

interface StudentListProps {
  predictions: { student: StudentData; result: PredictionResult }[];
  onSelect: (student: StudentData) => void;
  selectedStudentId?: string;
}

export const StudentList: React.FC<StudentListProps> = ({ predictions, onSelect, selectedStudentId }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E7] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-bottom border-[#F5F5F7] bg-[#FAFAFB] flex justify-between items-center">
        <h3 className="font-semibold">Student Directory</h3>
        <span className="text-xs text-[#86868B] font-medium uppercase tracking-wider">{predictions.length} Total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-[#86868B] border-b border-[#F5F5F7]">
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">GPA</th>
              <th className="px-6 py-4 font-semibold">Attendance</th>
              <th className="px-6 py-4 font-semibold">Quiz Avg</th>
              <th className="px-6 py-4 font-semibold">Risk Level</th>
              <th className="px-6 py-4 font-semibold">Prob.</th>
              <th className="px-6 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F7]">
            {predictions.slice(0, 15).map(({ student, result }) => (
              <tr 
                key={student.id} 
                className={cn(
                  "group hover:bg-[#F5F5F7] transition-colors cursor-pointer",
                  selectedStudentId === student.id ? "bg-[#F5F5F7]" : ""
                )}
                onClick={() => onSelect(student)}
              >
                <td className="px-6 py-4 font-medium text-sm">{student.id}</td>
                <td className="px-6 py-4 text-sm">{student.prior_gpa}</td>
                <td className="px-6 py-4 text-sm">{student.attendance_pct}%</td>
                <td className="px-6 py-4 text-sm">{student.quiz_avg}%</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                    result.riskLevel === 'High Risk' ? "bg-red-100 text-red-600" :
                    result.riskLevel === 'Medium Risk' ? "bg-orange-100 text-orange-600" :
                    "bg-green-100 text-green-600"
                  )}>
                    {result.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs opacity-60">
                  {result.probability}
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight size={16} className="text-[#D2D2D7] group-hover:text-[#0071E3] transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {predictions.length > 15 && (
          <div className="p-4 text-center border-t border-[#F5F5F7]">
            <button className="text-sm font-medium text-[#0071E3] hover:underline">View All Students</button>
          </div>
        )}
      </div>
    </div>
  );
};