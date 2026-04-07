'use client';

import { motion } from 'framer-motion';
import { Layout, Zap, Users, Newspaper, LucideIcon } from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: Layout },
  { id: 'swot', label: 'SWOT Analysis', icon: Zap },
  { id: 'competitors', label: 'Competitors', icon: Users },
  { id: 'news', label: 'Recent News', icon: Newspaper },
];

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-2 p-3 bg-neutral-100/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl border border-neutral-200 dark:border-neutral-800 h-fit sticky top-24 no-print">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-neutral-900 dark:bg-neutral-100 rounded-2xl -z-10 shadow-lg shadow-neutral-900/10 dark:shadow-none"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <tab.icon
              className={`w-4 h-4 transition-colors duration-300 ${
                isActive ? 'text-white dark:text-black' : 'text-neutral-500'
              }`}
            />
            <span
              className={`text-sm font-black uppercase tracking-widest transition-colors duration-300 ${
                isActive ? 'text-white dark:text-black' : 'text-neutral-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
