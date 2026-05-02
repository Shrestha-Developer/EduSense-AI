/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsProps {
  stats: {
    total: number;
    highRisk: number;
    medRisk: number;
    lowRisk: number;
    passProb: number;
  };
}

export const StatsOverview: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Students" 
        value={stats.total} 
        icon={<Users className="text-[#0071E3]" />} 
        color="bg-[#0071E3]/10" 
      />
      <StatCard 
        title="At High Risk" 
        value={stats.highRisk} 
        icon={<AlertTriangle className="text-[#FF3B30]" />} 
        color="bg-[#FF3B30]/10" 
        suffix={`(${(stats.highRisk / stats.total * 100).toFixed(1)}%)`}
      />
      <StatCard 
        title="Pass Probability" 
        value={`${(stats.passProb * 100).toFixed(1)}%`} 
        icon={<CheckCircle className="text-[#34C759]" />} 
        color="bg-[#34C759]/10" 
      />
      <StatCard 
        title="Overall Trend" 
        value="Increasing" 
        icon={<TrendingUp className="text-[#AF52DE]" />} 
        color="bg-[#AF52DE]/10" 
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, color, suffix }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl border border-[#E5E5E7] shadow-sm flex items-center justify-between"
  >
    <div>
      <p className="text-sm font-medium text-[#86868B] mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold">{value}</h4>
        {suffix && <span className="text-xs text-[#86868B] font-medium">{suffix}</span>}
      </div>
    </div>
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
      {icon}
    </div>
  </motion.div>
);