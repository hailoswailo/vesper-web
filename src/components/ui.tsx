import Link from 'next/link';
import type { ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-body text-xs tracking-[0.2em] uppercase text-brass mb-2">
      {children}
    </p>
  );
}

export function Display({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`font-display font-semibold text-ivory text-4xl sm:text-5xl leading-[1.1] ${className}`}>
      {children}
    </h1>
  );
}

export function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display font-semibold text-ivory text-2xl sm:text-3xl leading-tight ${className}`}>
      {children}
    </h2>
  );
}

export function Body({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-body text-ivory/90 leading-relaxed ${className}`}>{children}</p>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-navy border border-brass/25 rounded-2xl p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export function Button({ children, href, onClick, type = 'button', variant = 'primary', disabled, className = '' }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-6 py-3.5 font-body text-xs tracking-[0.15em] uppercase font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';
  const styles =
    variant === 'primary'
      ? 'bg-brass text-midnight hover:opacity-90'
      : 'bg-transparent text-brass border border-brass/50 hover:bg-brass/10';

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Input({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block mb-4">
      <span className="block font-body text-[11px] tracking-[0.15em] uppercase text-smoked-oak mb-2">{label}</span>
      <input
        {...rest}
        className="w-full rounded-lg border border-brass/35 bg-white/[0.03] px-3.5 py-3 font-body text-ivory placeholder:text-ivory/35 outline-none focus:border-brass"
      />
    </label>
  );
}

export function Textarea({
  label,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block mb-4">
      <span className="block font-body text-[11px] tracking-[0.15em] uppercase text-smoked-oak mb-2">{label}</span>
      <textarea
        {...rest}
        className="w-full rounded-lg border border-brass/35 bg-white/[0.03] px-3.5 py-3 font-body text-ivory placeholder:text-ivory/35 outline-none focus:border-brass"
      />
    </label>
  );
}
