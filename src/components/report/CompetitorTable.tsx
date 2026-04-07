'use client';

import { motion } from 'framer-motion';
import { Competitor } from '@/lib/types';

interface CompetitorTableProps {
  competitors: Competitor[];
  targetCompany: string;
}

export function CompetitorTable({ competitors, targetCompany }: CompetitorTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-700 print-section"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
            {['Company', 'Positioning', 'Key Strength', 'Pricing', 'Target Market'].map((col) => (
              <th
                key={col}
                className="px-5 py-3.5 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {competitors.map((comp, i) => {
            const isTarget = comp.name.toLowerCase().includes(targetCompany.toLowerCase());
            return (
              <motion.tr
                key={comp.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`group transition-colors ${
                  isTarget
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isTarget
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {comp.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-semibold ${isTarget ? 'text-indigo-700 dark:text-indigo-300' : ''}`}>
                      {comp.name}
                    </span>
                    {isTarget && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-medium">
                        Target
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400 max-w-[200px]">
                  <p className="line-clamp-2">{comp.positioning}</p>
                </td>
                <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400 max-w-[160px]">
                  <p className="line-clamp-2">{comp.strengths}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {comp.pricing}
                  </span>
                </td>
                <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400">
                  {comp.target}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
