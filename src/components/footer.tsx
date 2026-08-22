export function Footer() {
  return (
    <footer className="border-t border-brass/15 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8 font-body text-xs text-smoked-oak flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} Vesper</span>
        <span>Life after six.</span>
      </div>
    </footer>
  );
}
