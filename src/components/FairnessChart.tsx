/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ShieldAlert } from 'lucide-react';

interface FairnessProps {
  data: { group: string; passRate: number }[];
}

export const FairnessChart: React.FC<FairnessProps> = ({ data }) => {
  return (
    <div className="bg-white p-8 rounded-3xl border border-[#E5E5E7] shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="font-bold text-xl">Fairness Analysis</h3>
          <p className="text-sm text-[#86868B]">Pass Rate Comparison across Demographic Groups</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <ShieldAlert size={14} /> ADVERSE IMPACT: NONE
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F7" />
            <XAxis 
              dataKey="group" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#86868B', fontSize: 12, fontWeight: 500 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#86868B', fontSize: 12 }} 
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(val) => [`${val}%`, 'Pass Rate']}
            />
            <ReferenceLine y={80} stroke="#E5E5E7" strokeDasharray="5 5" label={{ position: 'right', value: 'Benchmark', fill: '#D2D2D7', fontSize: 10 }} />
            <Bar dataKey="passRate" radius={[8, 8, 0, 0]} barSize={60} fill="#0071E3">
              {/* Optional: color bars based on disparity */}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-8 border-t border-[#F5F5F7] grid grid-cols-3 gap-6">
        <FairnessMetric label="Disparate Impact" value="1.02" status="Pass" />
        <FairnessMetric label="Equal Opportunity" value="0.98" status="Pass" />
        <FairnessMetric label="Predictive Parity" value="1.00" status="Pass" />
      </div>
    </div>
  );
};

const FairnessMetric = ({ label, value, status }: any) => (
  <div>
    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-wider mb-1">{label}</p>
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold">{value}</span>
      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded uppercase">
        {status}
      </span>
    </div>
  </div>
);