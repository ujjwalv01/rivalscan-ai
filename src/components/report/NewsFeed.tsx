'use client';

import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';
import { NewsItem } from '@/lib/types';

interface NewsFeedProps {
  news: NewsItem[];
}

export function NewsFeed({ news }: NewsFeedProps) {
  if (!news || news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-neutral-900/50 rounded-[32px] border border-dashed border-neutral-300 dark:border-neutral-700">
        <Newspaper className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-4" />
        <p className="text-neutral-500 dark:text-neutral-400 font-medium">No recent news available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-neutral-950 dark:bg-neutral-50 text-white dark:text-black shadow-lg">
          <Newspaper className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Intelligence Feed</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 font-semibold tracking-tight">Latest market movements and press coverage</p>
        </div>
      </div>

      <div className="grid gap-6">
        {news.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="group relative overflow-hidden bg-white dark:bg-neutral-900 rounded-[32px] border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-2xl hover:border-neutral-900 dark:hover:border-neutral-100 transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row gap-0">
              {/* Sidebar Source Name */}
              <div className="md:w-20 shrink-0 flex md:flex-col items-center justify-center py-6 px-3 bg-neutral-100/50 dark:bg-neutral-800/80 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 transition-colors group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-600 dark:text-neutral-400 md:[writing-mode:vertical-lr] md:rotate-180 whitespace-nowrap group-hover:text-neutral-900 dark:group-hover:text-neutral-100">
                  {item.source}
                </span>
              </div>

              <div className="flex-1 p-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-black text-neutral-500 uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-black text-neutral-800 dark:text-neutral-100 leading-tight transition-colors duration-300">
                      {item.headline}
                    </h4>
                    
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-semibold line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[120px]">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                      item.sentiment === 'positive' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : item.sentiment === 'negative'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.sentiment === 'positive' ? 'bg-emerald-500' : item.sentiment === 'negative' ? 'bg-rose-500' : 'bg-neutral-500'
                      }`} />
                      {item.sentiment}
                    </div>
                    
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(item.headline + " " + item.source)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="rounded-xl flex items-center gap-2 px-4 py-2 font-bold text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                    >
                      View Source
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
