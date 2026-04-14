'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Globe, Brain, BarChart3, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EXAMPLE_COMPANIES = ['Stripe', 'Notion', 'Figma', 'Linear', 'Vercel', 'Supabase', 'Loom', 'Retool'];

const HOW_IT_WORKS = [
  {
    icon: Globe,
    step: '01',
    title: 'Scrape',
    description: "We crawl the company's public website — homepage, about, pricing, and blog — to gather raw intelligence.",
  },
  {
    icon: Brain,
    step: '02',
    title: 'Analyze',
    description: 'Claude AI digests the content and performs deep competitive analysis grounded in the actual data.',
  },
  {
    icon: BarChart3,
    step: '03',
    title: 'Report',
    description: 'Get a structured intelligence report: SWOT, competitors, scoring radar, and recent news — in seconds.',
  },
];

const RECENT_KEY = 'rivalscan_recent_searches';

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % EXAMPLE_COMPANIES.length);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  const handleSearch = (company: string) => {
    if (!company.trim()) return;
    const trimmed = company.trim();

    // Save to recent searches
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}

    router.push(`/report/${encodeURIComponent(trimmed)}`);
  };

  const removeRecent = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch {}
  };

  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleFeedbackSubmit = () => {
    if (!feedbackMessage.trim()) return;
    const body = `Name: ${feedbackName || 'Anonymous'}\n\nMessage: ${feedbackMessage}`;
    
    // Using the official Gmail web compose URL - much more reliable than mailto for web users
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ujjwalverma010305@gmail.com&su=RivalScan%20Feedback&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 sm:py-32 relative overflow-hidden">
        {/* Background grain effect placeholder or clean background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(10px) grayscale(1) brightness(2)' }}
            animate={{ opacity: 1, filter: 'blur(0px) grayscale(0) brightness(1)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-8 uppercase"
          >
            Research any company <br />
            <span className="text-neutral-900 dark:text-neutral-50 underline decoration-neutral-200 dark:decoration-neutral-800 underline-offset-[12px] decoration-4">
              in seconds
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, filter: 'blur(5px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            RivalScan scrapes public data, runs deep AI analysis, and generates a full competitive intelligence report complete with SWOT, competitors, and market scores.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className={`relative flex items-center transition-all duration-500 rounded-[32px] ${
                focused
                  ? 'ring-1 ring-neutral-400 dark:ring-neutral-600 outline outline-[12px] outline-neutral-100 dark:outline-neutral-900/50'
                  : 'shadow-2xl shadow-neutral-200/30 dark:shadow-neutral-950/50'
              }`}
            >
              <Search className="absolute left-5 sm:left-6 w-5 h-5 text-neutral-500 dark:text-neutral-400 pointer-events-none z-10" />
              <AnimatePresence mode="wait">
                <Input
                  ref={inputRef}
                  id="company-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder={`Try ${EXAMPLE_COMPANIES[placeholderIndex]}...`}
                  className="h-14 sm:h-20 pl-12 sm:pl-16 pr-16 sm:pr-44 text-base sm:text-xl rounded-[32px] border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium"
                />
              </AnimatePresence>
              <Button
                id="analyze-button"
                onClick={() => handleSearch(query)}
                disabled={!query.trim()}
                className="absolute right-1.5 sm:right-2.5 h-11 sm:h-16 px-4 sm:px-8 rounded-[24px] bg-neutral-950 dark:bg-neutral-50 text-white dark:text-black font-black uppercase tracking-widest gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
              >
                <span className="hidden sm:inline">Analyze</span>
                <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4" />
              </Button>
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap items-center gap-2 mt-4 justify-center"
              >
                <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-500 font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" /> Recent:
                </span>
                {recentSearches.map((search) => (
                  <motion.button
                    key={search}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSearch(search)}
                    className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-950 dark:hover:bg-neutral-100 hover:text-white dark:hover:text-black transition-all border border-neutral-200 dark:border-neutral-800"
                  >
                    {search}
                    <span
                      onClick={(e) => removeRecent(search, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 border-t border-neutral-100 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">How it works</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg font-medium">Three steps from company name to competitive insight</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, filter: 'blur(10px) grayscale(1)' }}
                whileInView={{ opacity: 1, filter: 'blur(0px) grayscale(0)' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="group p-8 rounded-[32px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-neutral-200/50 dark:hover:shadow-none"
              >
                <div className="absolute top-6 right-8 text-8xl font-black text-neutral-50 dark:text-neutral-900 select-none">
                  {item.step}
                </div>
                <div className="inline-flex p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-6 group-hover:rotate-6 transition-transform">
                  <item.icon className="w-6 h-6 text-neutral-950 dark:text-neutral-50" />
                </div>
                <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-semibold">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Feedback */}
      <section className="px-4 py-24 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-400 mb-6">Contact Us</h2>
              <p className="text-xl text-neutral-900 dark:text-neutral-100 font-bold mb-4">
                Have questions or need custom intelligence?
              </p>
              <div className="flex flex-col gap-4">
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=ujjwalverma010305@gmail.com&su=RivalScan%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors border-b-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-50 pb-1 font-semibold w-fit"
                >
                  ujjwalverma010305@gmail.com
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('ujjwalverma010305@gmail.com');
                    alert('Email copied to clipboard!');
                  }}
                  className="text-[10px] uppercase font-black tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all text-left"
                >
                  Click to copy email
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-400 mb-6">Feedback</h2>
                <p className="text-xl text-neutral-900 dark:text-neutral-100 font-bold mb-2">
                  Help us improve RivalScan
                </p>
                <p className="text-sm text-neutral-500 font-medium mb-6">
                  Your feedback drives our analysis. Tell us what you think.
                </p>
              </div>

              <div className="space-y-4">
                <Input 
                  placeholder="Your Name (Optional)"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="h-12 rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all font-medium"
                />
                <textarea 
                  placeholder="Enter your message..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full min-h-[120px] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all font-medium text-sm resize-none"
                />
                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackMessage.trim()}
                  className="w-full rounded-xl h-12 bg-neutral-950 dark:bg-neutral-50 text-white dark:text-black font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 disabled:opacity-30"
                >
                  Submit Feedback
                </Button>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-24 pt-8 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">
            <span>© 2026 RivalScan</span>
            <span>Built for intelligence</span>
          </div>
        </div>
      </section>
    </div>
  );
}
