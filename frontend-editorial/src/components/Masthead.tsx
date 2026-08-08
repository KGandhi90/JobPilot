import Link from "next/link";

export default function Masthead() {
  return (
    <header className="w-full py-8 border-b border-[var(--rule)] mb-8 flex justify-between items-end px-4 md:px-8">
      <div>
        <Link href="/">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--ink)] tracking-tight font-medium italic hover:opacity-80 transition-opacity">
            JobPilot
          </h1>
        </Link>
      </div>
      <div className="hidden sm:block">
        <span className="font-mono text-[var(--ink)] uppercase text-xs tracking-widest opacity-60">
          Live Connection
        </span>
      </div>
    </header>
  );
}
