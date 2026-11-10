import type { ReactNode } from 'react';
import clsx from 'clsx';

export function PageTitle({ children, intro }: { children: ReactNode; intro?: ReactNode }) {
  return (
    <div className="mb-12">
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-ink">
        {children}
      </h1>
      {intro ? <div className="mt-3 max-w-[38rem] text-ink-2">{intro}</div> : null}
    </div>
  );
}

export function Section({
  title,
  action,
  children,
  className,
  id,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={clsx('mt-16 first:mt-0', className)}>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {action ? <div className="text-sm">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** A row with a narrow date gutter on the left; stacks on small screens. */
export function DatedRow({
  date,
  children,
  wide,
}: {
  date: ReactNode;
  children: ReactNode;
  /** Wider gutter for date ranges such as "Sep 2021 – Jun 2023". */
  wide?: boolean;
}) {
  return (
    <div
      className={clsx(
        'grid gap-x-6 gap-y-0.5',
        wide ? 'sm:grid-cols-[9.5rem_1fr]' : 'sm:grid-cols-[6.5rem_1fr]'
      )}
    >
      <div className="tabular text-sm leading-6 text-muted sm:pt-px">{date}</div>
      <div className="min-w-0 max-w-[46rem]">{children}</div>
    </div>
  );
}
