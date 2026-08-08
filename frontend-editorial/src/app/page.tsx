import Link from "next/link";
import Masthead from "@/components/Masthead";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[var(--paper)] text-[var(--ink)] font-sans flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 md:px-8">
        <Masthead />
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-24 md:py-32">
          <h2 className="text-5xl md:text-7xl font-serif italic mb-8 max-w-3xl leading-tight text-[var(--ink)]">
            A conversational interface for your career trajectory.
          </h2>
          <p className="max-w-xl text-lg md:text-xl font-sans text-[var(--ink)] opacity-80 mb-12">
            Organize your job search, track applications, and prepare for interviews through a natural spoken dialogue.
          </p>
          
          <Link 
            href="/interview" 
            className="px-8 py-4 border border-[var(--ink)] font-mono uppercase tracking-widest text-sm hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors mb-16"
          >
            Begin the Interview
          </Link>
          
          {/* Decorative Visualizer */}
          <div className="flex items-center justify-center gap-2 h-16 w-full max-w-xs opacity-50">
            <div className="w-1.5 h-6 bg-[var(--ink)] rounded-full" />
            <div className="w-1.5 h-10 bg-[var(--ink)] rounded-full" />
            <div className="w-1.5 h-14 bg-[var(--ink)] rounded-full" />
            <div className="w-1.5 h-10 bg-[var(--ink)] rounded-full" />
            <div className="w-1.5 h-6 bg-[var(--ink)] rounded-full" />
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full max-w-3xl mx-auto py-16">
          <div className="border-t border-[var(--rule)] py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)] md:w-1/3">
              01 — Application Memory
            </span>
            <p className="font-sans text-[var(--ink)] md:w-2/3 leading-relaxed opacity-90">
              Seamlessly record and track new job applications, recruiter contacts, and salary expectations without touching a spreadsheet.
            </p>
          </div>
          
          <div className="border-t border-[var(--rule)] py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-secondary)] md:w-1/3">
              02 — Interview Prep
            </span>
            <p className="font-sans text-[var(--ink)] md:w-2/3 leading-relaxed opacity-90">
              Review company details and prepare for upcoming interviews through interactive, voice-first roleplay and summarization.
            </p>
          </div>

          <div className="border-t border-[var(--rule)] py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-gold)] md:w-1/3">
              03 — Analytics & Follow-ups
            </span>
            <p className="font-sans text-[var(--ink)] md:w-2/3 leading-relaxed opacity-90">
              Ask about your interview rate, pending applications, or schedule automated follow-ups for roles that have ghosted you.
            </p>
          </div>
          
          <div className="border-t border-[var(--rule)]"></div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 mt-auto flex justify-center border-t border-[var(--rule)] bg-[var(--paper)]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink)] opacity-60">
          Powered by LiveKit & MurfAI
        </p>
      </footer>
    </main>
  );
}
