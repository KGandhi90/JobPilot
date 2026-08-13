'use client';

import { useEffect, useState } from 'react';

interface CallRecord {
  timestamp: string;
  channel: string;
  duration: string;
  outcome: 'success' | 'failed';
  agent: string;
}

interface AnalyticsData {
  total_calls: number;
  successful_calls: number;
  failed_calls: number;
  calls: CallRecord[];
}

export default function DispatchDeskPage() {
  const [data, setData] = useState<AnalyticsData>({
    total_calls: 0,
    successful_calls: 0,
    failed_calls: 0,
    calls: [],
  });

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3000);
    return () => clearInterval(interval);
  }, []);

  const successRate = data.total_calls > 0
    ? Math.round((data.successful_calls / data.total_calls) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F4ECDD] text-[#241C14] font-sans p-6 md:p-12 selection:bg-[#C89B3C]/20">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Masthead Header */}
        <header className="border-b-2 border-[#241C14] pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3F5D4E] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3F5D4E] animate-pulse"></span>
              LIVE DISPATCH FEED
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-[#241C14]">
            Dispatch Desk
          </h1>
          <p className="font-serif italic text-lg text-[#241C14]/75">
            Real-time audit log and performance metrics for JobPilot Learning & Literacy agent.
          </p>
        </header>

        {/* Wire Ticker Scoreboard (Hairline Divider Layout) */}
        <section className="border-y border-[#D9CBB0] py-8 my-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-[#D9CBB0]">

            {/* Total Calls */}
            <div className="md:px-6 first:pl-0">
              <div className="font-mono text-xs uppercase tracking-wider text-[#241C14]/60 font-semibold mb-1">
                TOTAL CALLS
              </div>
              <div className="font-mono text-5xl md:text-6xl font-bold text-[#C89B3C]">
                {data.total_calls}
              </div>
            </div>

            {/* Successful Calls */}
            <div className="md:px-6">
              <div className="font-mono text-xs uppercase tracking-wider text-[#3F5D4E] font-semibold mb-1">
                SUCCESSFUL
              </div>
              <div className="font-mono text-5xl md:text-6xl font-bold text-[#3F5D4E]">
                {data.successful_calls}
              </div>
            </div>

            {/* Failed Calls */}
            <div className="md:px-6">
              <div className="font-mono text-xs uppercase tracking-wider text-[#A63D2A] font-semibold mb-1">
                FAILED
              </div>
              <div className="font-mono text-5xl md:text-6xl font-bold text-[#A63D2A]">
                {data.failed_calls}
              </div>
            </div>

            {/* Success Rate */}
            <div className="md:px-6 last:pr-0">
              <div className="font-mono text-xs uppercase tracking-wider text-[#241C14]/60 font-semibold mb-1">
                SUCCESS RATE
              </div>
              <div className="font-mono text-5xl md:text-6xl font-bold text-[#241C14]">
                {successRate}<span className="text-3xl">%</span>
              </div>
            </div>

          </div>
        </section>

        {/* Call History Manifest */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9CBB0] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#241C14]">Recent Call Log</h2>
            <span className="font-mono text-xs text-[#241C14]/60">
              Showing last {data.calls.length} entries
            </span>
          </div>

          {data.calls.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#D9CBB0] rounded-sm font-mono text-sm text-[#241C14]/50">
              NO RECENT DISPATCHES RECORDED.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#D9CBB0] bg-[#F4ECDD]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D9CBB0] bg-[#241C14]/5 font-mono text-xs uppercase text-[#241C14]/70">
                    <th className="p-3">TIMESTAMP</th>
                    <th className="p-3">CHANNEL</th>
                    <th className="p-3">DURATION</th>
                    <th className="p-3">OUTCOME</th>
                    <th className="p-3 text-right">AGENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9CBB0] font-mono text-sm">
                  {data.calls.slice().reverse().map((call, idx) => (
                    <tr key={idx} className="hover:bg-[#241C14]/5 transition-colors">
                      <td className="p-3 font-mono text-xs text-[#241C14]">
                        {new Date(call.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="uppercase text-xs font-semibold px-2 py-0.5 border border-[#D9CBB0] rounded-sm">
                          {call.channel || 'browser'}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-[#241C14]/80">
                        {call.duration || 'N/A'}
                      </td>
                      <td className="p-3">
                        {call.outcome === 'success' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3F5D4E] uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#3F5D4E]"></span>
                            SUCCESS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A63D2A] uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#A63D2A]"></span>
                            FAILED
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right text-xs text-[#241C14]/60 uppercase">
                        {call.agent || 'inbound'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
