'use client';

import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { CompanyScores } from '@/lib/types';

interface RadarSpiderChartProps {
  scores: CompanyScores;
  company: string;
}

const AXIS_LABELS: Record<keyof CompanyScores, string> = {
  product: 'Product',
  pricing: 'Pricing',
  market_presence: 'Market Presence',
  brand: 'Brand',
  tech: 'Technology',
  community: 'Community',
};

// Industry average baseline scores
const INDUSTRY_AVERAGES: CompanyScores = {
  product: 6.2,
  pricing: 5.8,
  market_presence: 5.5,
  brand: 5.9,
  tech: 6.0,
  community: 5.4,
};

export function RadarSpiderChart({ scores, company }: RadarSpiderChartProps) {
  const data = (Object.keys(AXIS_LABELS) as (keyof CompanyScores)[]).map((key) => ({
    axis: AXIS_LABELS[key],
    [company]: scores[key] ?? 5,
    'Industry Avg': INDUSTRY_AVERAGES[key],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="print-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid
                stroke="currentColor"
                className="text-neutral-200 dark:text-neutral-700"
                strokeDasharray="3 3"
              />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fontSize: 12, fill: 'currentColor', className: 'text-neutral-500 dark:text-neutral-400' }}
                className="text-neutral-500 dark:text-neutral-400"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={{ fontSize: 10 }}
                tickCount={6}
              />
              <Radar
                name={company}
                dataKey={company}
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Radar
                name="Industry Avg"
                dataKey="Industry Avg"
                stroke="#94a3b8"
                fill="#94a3b8"
                fillOpacity={0.1}
                strokeWidth={1.5}
                strokeDasharray="5 3"
              />
              <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  fontSize: '13px',
                }}
                formatter={(value) => [typeof value === 'number' ? value.toFixed(1) : value, '']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score breakdown */}
        <div className="space-y-3">
          {(Object.keys(AXIS_LABELS) as (keyof CompanyScores)[]).map((key, i) => {
            const score = scores[key] ?? 5;
            const pct = (score / 10) * 100;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-28 flex-shrink-0">
                  {AXIS_LABELS[key]}
                </span>
                <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.07 + 0.2, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  />
                </div>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 w-8 text-right">
                  {score.toFixed(1)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
