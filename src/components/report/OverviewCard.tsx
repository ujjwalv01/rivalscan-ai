'use client';

import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Layers, Tag, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CompanyOverview } from '@/lib/types';

interface OverviewCardProps {
  overview: CompanyOverview;
}

export function OverviewCard({ overview }: OverviewCardProps) {
  const meta = [
    { icon: Building2, label: 'Founded', value: overview.founded },
    { icon: MapPin, label: 'HQ', value: overview.hq },
    { icon: Users, label: 'Employees', value: overview.employees },
    { icon: Layers, label: 'Stage', value: overview.stage },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="print-section space-y-12"
    >
      {/* One-liner */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-50 leading-tight tracking-tighter uppercase underline decoration-neutral-200 dark:decoration-neutral-800 underline-offset-8">
          &ldquo;{overview.oneliner}&rdquo;
        </p>
      </motion.div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {meta.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black text-neutral-500 dark:text-neutral-500 uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </div>
            <p className="font-black text-neutral-900 dark:text-neutral-50 text-xl truncate">
              {item.value || 'Unknown'}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Positioning */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative overflow-hidden p-8 rounded-[32px] bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <TrendingUp className="w-32 h-32 text-white" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
               <TrendingUp className="w-4 h-4 text-black" />
            </div>
            <h3 className="font-black text-sm text-neutral-100 uppercase tracking-[0.15em]">
              Market Positioning
            </h3>
          </div>
          <p className="text-neutral-300 text-lg leading-relaxed font-semibold">
            {overview.positioning}
          </p>
        </div>
      </motion.div>

      {/* Tags */}
      {overview.tags && overview.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center gap-3 pt-4"
        >
          {overview.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-neutral-200/50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 border-none hover:bg-neutral-900 hover:text-white transition-colors duration-300"
            >
              {tag}
            </Badge>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
