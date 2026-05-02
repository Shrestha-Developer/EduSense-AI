/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BrainCircuit } from 'lucide-react';

interface FeatureImportanceProps {
  data: { name: string; value: number }[];
}

export const FeatureImportanceChart: React.FC<FeatureImportanceProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E5E5E7] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Predictor Importance</h3>
        <BrainCircuit size={18} className="text-[#0071E3]" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={140} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fontWeight: 500 }}
              // Formatting internal keys to readable names
              tickFormatter={(val) => val.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#0071E3' : '#E5E5E7'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};