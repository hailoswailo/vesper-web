import Link from 'next/link';

export function Nav() {
  return (
    <header className="border-b border-brass/15">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-display text-xl text-ivory tracking-wide">
          Vesper
        </Link>
        <nav className="flex items-center gap-6 font-body text-sm">
          <Link href="/about" className="text-ivory/80 hover:text-brass transition-colors">
            About
          </Link>
          <Link href="/membership" className="text-ivory/80 hover:text-brass transition-colors">
            Membership
          </Link>
          <Link href="/faq" className="text-ivory/80 hover:text-brass transition-colors">
            FAQ
          </Link>
          <Link
            href="/apply"
            className="text-brass border border-brass/50 rounded-lg px-4 py-2 text-xs tracking-[0.15em] uppercase hover:bg-brass/10 transition-colors"
          >
            Apply
          </Link>
        </nav>
      </div>
    </header>
  );
}
