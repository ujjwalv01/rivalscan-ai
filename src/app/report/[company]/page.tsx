'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  RefreshCw,
  ArrowLeft,
  Globe,
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OverviewCard } from '@/components/report/OverviewCard';
import { SwotAnalysis } from '@/components/report/SwotAnalysis';
import { CompetitorTable } from '@/components/report/CompetitorTable';
import { RadarSpiderChart } from '@/components/report/RadarSpiderChart';
import { NewsFeed } from '@/components/report/NewsFeed';
import { ResearchReport, ResearchStatus } from '@/lib/types';

import { SidebarNav } from '@/components/report/SidebarNav';

const STATUS_STEPS: { status: ResearchStatus; label: string; icon: typeof Globe }[] = [
  { status: 'scraping', label: 'Scraping', icon: Globe },
  { status: 'reading', label: 'Reading', icon: Brain },
  { status: 'generating', label: 'Generating', icon: FileText },
];

function StatusBar({ status, message }: { status: ResearchStatus; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
    >
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping" />
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-[spin_1.5s_linear_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-3 tracking-tight">{message}</h2>
      
      <div className="flex items-center gap-3 mt-4">
        {STATUS_STEPS.map((step, i) => {
          const stepIndex = STATUS_STEPS.findIndex((s) => s.status === status);
          const isDone = i < stepIndex;
          const isActive = step.status === status;
          return (
            <div key={step.status} className="flex items-center gap-3 group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 transition-transform duration-300 scale-110" /> : <step.icon className="w-5 h-5" />}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className="w-8 h-px bg-neutral-200 dark:bg-neutral-800" />
              )}
            </div>
          );
        })}
      </div>
      
      <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-8 font-medium">Researching public data and competitive landscape</p>
    </motion.div>
  );
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const company = decodeURIComponent(params.company as string);

  const [status, setStatus] = useState<ResearchStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const abortRef = useRef<AbortController | null>(null);

  const fetchReport = async () => {
    setStatus('scraping');
    setStatusMessage('Initiating scan...');
    setReport(null);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (!raw) continue;
            try {
              const msg = JSON.parse(raw);
              
              // Only update status state when absolutely necessary to prevent layout freezing
              if (msg.status && msg.status !== status) setStatus(msg.status);
              if (msg.message && msg.message !== statusMessage) setStatusMessage(msg.message);

              if (msg.data) {
                setReport(msg.data);
                setStatus('done');
              }
              if (msg.status === 'error') {
                setError(msg.error || msg.message);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  useEffect(() => {
    fetchReport();
    return () => abortRef.current?.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const handleExportPDF = () => {
    window.print();
  };

  const logoUrl = `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, '')}.com`;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50/50 dark:bg-neutral-950/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 no-print">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-transform active:scale-90"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500"
              >
                <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-[14px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt={`${company} logo`}
                    className="w-11 h-11 rounded-xl object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </motion.div>
              <div>
                <motion.h1 initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-3xl font-black tracking-tight leading-none uppercase">{company}</motion.h1>
                {report && (
                  <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mt-1 uppercase tracking-widest">
                    {report.overview.tags?.slice(0, 3).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchReport}
              disabled={status !== 'done' && status !== 'error'}
              className="gap-2.5 rounded-xl border-neutral-200 dark:border-neutral-800 h-11 px-5 font-bold"
            >
              <RefreshCw className={`w-4 h-4 ${status !== 'done' && 'animate-spin'}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={!report}
              className="gap-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 font-bold shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-4 h-4" />
              Export Result
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === 'error' && !report && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-rose-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-3xl font-black mb-3 italic uppercase">Error Encountered</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm mx-auto font-medium">{error}</p>
              <Button onClick={fetchReport} className="gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-xl">
                <RefreshCw className="w-5 h-5" />
                Try Re-scanning
              </Button>
            </motion.div>
          )}

          {(status === 'scraping' || status === 'reading' || status === 'generating') && !report && (
            <StatusBar status={status} message={statusMessage} />
          )}

          {report && !report.isValid && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-3xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-neutral-400" />
              </div>
              <h2 className="text-3xl font-black mb-3 italic uppercase">Company Not Found</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm mx-auto font-medium">
                We couldn't find verifiable data for "{company}". Please check the spelling or try another company name.
              </p>
              <Button onClick={() => router.push('/')} className="gap-3 bg-neutral-950 dark:bg-neutral-50 text-white dark:text-black rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-xl">
                Try Another Search
              </Button>
            </motion.div>
          )}

          {report && report.isValid && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring' }} className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
              
              <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
              
              <main className="min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="focus:outline-none"
                  >
                    {activeTab === 'overview' && (
                      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-[32px] border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 shadow-2xl shadow-neutral-200/50 dark:shadow-none transition-all">
                        <OverviewCard overview={report.overview} />
                      </div>
                    )}

                    {activeTab === 'swot' && <SwotAnalysis swot={report.swot} />}

                    {activeTab === 'competitors' && (
                      <div className="space-y-10">
                        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-[32px] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 shadow-xl">
                          <CompetitorTable competitors={report.competitors} targetCompany={company} />
                        </div>

                        <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-[32px] border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 shadow-xl">
                          <h3 className="font-black text-2xl mb-10 tracking-tight leading-none uppercase flex items-center gap-3">
                            <span className="w-2 h-8 bg-indigo-500 rounded-full" />
                            Market Score Radar
                          </h3>
                          <div className="h-[450px]">
                            <RadarSpiderChart scores={report.scores} company={company} />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'news' && <NewsFeed news={report.news} />}
                  </motion.div>
                </AnimatePresence>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
