'use client';

import clsx from 'clsx';
import { HiOutlineArrowDown, HiOutlineArrowRight } from 'react-icons/hi2';
import { delay, Figure, tone } from './figure';

export type FlowNode = {
  title: string;
  /** One line under the title, e.g. the model or the data behind the step. */
  sub?: string;
  /** Short tags inside the node, e.g. the prompting strategies. */
  chips?: string[];
  /** Data colour token from global.css; the node gets a tinted fill and border. Plain outline without it. */
  tone?: string;
  /** A resource the step reads, such as a dataset. Drawn dashed above the step with an arrow into it; it is not a step. */
  input?: FlowNode;
};
/** One panel of the figure: its heading, the steps left to right, and optionally the outcomes the last step splits into. */
export type FlowStage = { label: string; nodes: FlowNode[]; outcomes?: FlowNode[] };

function Box({ node, wait, dashed }: { node: FlowNode; wait: number; dashed?: boolean }) {
  return (
    <div
      className={clsx('viz-in rounded-[3px] border px-4 py-3 text-center', dashed && 'border-dashed', !node.tone && 'border-rule')}
      style={{
        ...(node.tone ? { background: tone(node.tone, 0.14), borderColor: tone(node.tone, 0.8) } : null),
        ...delay(wait),
      }}
    >
      <p className="text-sm font-semibold leading-snug text-ink">{node.title}</p>
      {node.sub ? <p className="mt-0.5 text-sm leading-snug text-muted">{node.sub}</p> : null}
      {node.chips?.length ? (
        <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
          {node.chips.map((chip) => (
            <li key={chip} className="rounded-full border border-rule bg-page px-2 py-0.5 text-xs text-ink-2">
              {chip}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** A step with the resource it reads stacked above it. */
function Step({ node, wait }: { node: FlowNode; wait: number }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-end">
      {node.input ? (
        <>
          <Box node={node.input} wait={wait} dashed />
          <HiOutlineArrowDown aria-hidden className="mx-auto my-1.5 h-4 w-4 shrink-0 text-muted" />
        </>
      ) : null}
      <Box node={node} wait={wait + 60} />
    </div>
  );
}

function Arrow({ centered }: { centered: boolean }) {
  return (
    <span aria-hidden className={clsx('flex shrink-0 justify-center text-muted', centered ? 'lg:self-center' : 'lg:mb-5 lg:self-end')}>
      <HiOutlineArrowDown className="h-4 w-4 lg:hidden" />
      <HiOutlineArrowRight className="hidden h-5 w-5 lg:block" />
    </span>
  );
}

/**
 * Block diagram of a pipeline, as in a paper's overview figure: one panel per stage, stacked, each a left-to-right
 * chain of steps that can read a resource such as a dataset, and optionally ending in the outcomes of its last step.
 * Steps stack on narrow screens.
 */
export function Flow({ title, stages, caption }: { title: string; stages: FlowStage[]; caption?: string }) {
  let step = 0;
  return (
    <Figure title={title} caption={caption}>
      <div className="flex flex-col gap-2">
        {stages.map((stage, si) => {
          const hasInput = stage.nodes.some((n) => n.input);
          return (
            <div key={stage.label}>
              <section className="rounded-[3px] border border-dashed border-rule p-4">
                <h4 className="mb-4 text-center text-sm font-semibold text-ink-2">{stage.label}</h4>
                <div className={clsx('flex flex-col gap-2 lg:flex-row', hasInput ? 'lg:items-end' : 'lg:items-center')}>
                  {stage.nodes.map((node, k) => (
                    <div key={node.title} className="contents">
                      {k > 0 ? <Arrow centered={!hasInput} /> : null}
                      <Step node={node} wait={140 * step++} />
                    </div>
                  ))}
                  {stage.outcomes?.length ? (
                    <>
                      <Arrow centered={!hasInput} />
                      <div className="flex min-w-0 flex-1 flex-col gap-2 lg:max-w-[14rem]">
                        {stage.outcomes.map((node) => (
                          <Box key={node.title} node={node} wait={140 * step++} />
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </section>
              {si < stages.length - 1 ? <HiOutlineArrowDown aria-hidden className="mx-auto mt-2 h-5 w-5 text-muted" /> : null}
            </div>
          );
        })}
      </div>
    </Figure>
  );
}
