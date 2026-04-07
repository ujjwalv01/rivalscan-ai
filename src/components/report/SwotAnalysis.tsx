'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle } from 'lucide-react';
import { SwotAnalysis as SwotType } from '@/lib/types';

interface SwotAnalysisProps {
  swot: SwotType;
}

const QUADRANTS = [
  {
    key: 'strengths' as const,
    label: 'Strengths',
    icon: TrendingUp,
    bg: 'bg-white dark:bg-neutral-900',
    border: 'border-neutral-200 dark:border-neutral-800 border-l-emerald-500 border-l-4',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    headerBg: 'bg-neutral-50 dark:bg-neutral-800/50',
    dotColor: 'bg-emerald-500',
    labelColor: 'text-neutral-900 dark:text-neutral-100',
  },
  {
    key: 'weaknesses' as const,
    label: 'Weaknesses',
    icon: TrendingDown,
    bg: 'bg-white dark:bg-neutral-900',
    border: 'border-neutral-200 dark:border-neutral-800 border-l-rose-500 border-l-4',
    iconColor: 'text-rose-600 dark:text-rose-400',
    headerBg: 'bg-neutral-50 dark:bg-neutral-800/50',
    dotColor: 'bg-rose-500',
    labelColor: 'text-neutral-900 dark:text-neutral-100',
  },
  {
    key: 'opportunities' as const,
    label: 'Opportunities',
    icon: Lightbulb,
    bg: 'bg-white dark:bg-neutral-900',
    border: 'border-neutral-200 dark:border-neutral-800 border-l-blue-500 border-l-4',
    iconColor: 'text-blue-600 dark:text-blue-400',
    headerBg: 'bg-neutral-50 dark:bg-neutral-800/50',
    dotColor: 'bg-blue-500',
    labelColor: 'text-neutral-900 dark:text-neutral-100',
  },
  {
    key: 'threats' as const,
    label: 'Threats',
    icon: AlertTriangle,
    bg: 'bg-white dark:bg-neutral-900',
    border: 'border-neutral-200 dark:border-neutral-800 border-l-amber-500 border-l-4',
    iconColor: 'text-amber-600 dark:text-amber-400',
    headerBg: 'bg-neutral-50 dark:bg-neutral-800/50',
    dotColor: 'bg-amber-500',
    labelColor: 'text-neutral-900 dark:text-neutral-100',
  },
];

export function SwotAnalysis({ swot }: SwotAnalysisProps) {
  const data = QUADRANTS.map((q) => ({
    ...q,
    items: swot[q.key] || [],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full"
    >
      {data.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.15, duration: 0.5, type: 'spring' }}
          className={`relative overflow-hidden p-8 rounded-[32px] border ${item.border} ${item.bg} h-full shadow-2xl transition-all duration-500 hover:scale-[1.02] group`}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className={`p-3 rounded-2xl ${item.iconColor} bg-white dark:bg-neutral-900 shadow-sm transition-transform group-hover:rotate-12`}>
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-black uppercase tracking-widest leading-none ${item.labelColor}`}>
              {item.label}
            </h3>
          </div>

          <ul className="space-y-4 relative">
            {item.items.map((point: string, idx: number) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 + idx * 0.1 }}
                className="flex items-start gap-4 text-neutral-900 dark:text-neutral-300 group/item"
              >
                <div className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dotColor} ring-4 ring-neutral-200/80 dark:ring-neutral-800/50`} />
                <span className="font-bold leading-relaxed transition-colors tracking-tight">{point}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
