'use client';

import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import { HiCheck, HiOutlineArrowDown, HiOutlineArrowRight, HiXMark } from 'react-icons/hi2';
import { delay, Figure, Switch, tone } from './figure';

export type BiasKind = 'language' | 'retrieval';
export type BiasStrategy = { label: string; tone: string };
export type BiasLanguage = { code: string; label: string };
export type BiasModel = { family: string; sizes: string };

/** Lines from the left edge at heights `from` (fractions of the cell) to the right edge at heights `to`, joined in the middle, with arrowheads on the right. */
function Wires({ from, to }: { from: number[]; to: number[] }) {
  const joinX = from.length > 1 ? 30 : 0;
  const forkX = to.length > 1 ? 70 : 100;
  const y = from.length === 1 ? from[0] : to.length === 1 ? to[0] : 0.5;
  const spine = (x: number, ys: number[]) => (ys.length > 1 ? `M${x} ${Math.min(...ys) * 100}V${Math.max(...ys) * 100}` : '');
  const d = [
    ...from.map((f) => `M0 ${f * 100}H${joinX}`),
    spine(joinX, from),
    `M${joinX} ${y * 100}H${forkX}`,
    spine(forkX, to),
    ...to.map((t) => `M${forkX} ${t * 100}H99`),
  ].join('');
  return (
    <div aria-hidden className="relative hidden flex-1 text-muted lg:block">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={d} fill="none" stroke="currentColor" strokeWidth={1.25} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      {to.map((t) => (
        <svg key={t} className="absolute right-0 h-2.5 w-2 -translate-y-1/2" style={{ top: `${t * 100}%` }} viewBox="0 0 8 10">
          <path d="M0 0L8 5L0 10z" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

/** Straight arrow to the next step: right on wide screens, down when the steps stack. */
function Arrow({ className }: { className?: string }) {
  return (
    <span aria-hidden className={clsx('flex items-center justify-center text-muted', className)}>
      <HiOutlineArrowDown className="h-4 w-4 lg:hidden" />
      <HiOutlineArrowRight className="hidden h-4 w-4 lg:block" />
    </span>
  );
}

function DownArrow({ className }: { className?: string }) {
  return <HiOutlineArrowDown aria-hidden className={clsx('mx-auto h-4 w-4 shrink-0 text-muted', className)} />;
}

function Title({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold leading-snug text-ink">{children}</p>;
}

function Sub({ children }: { children: ReactNode }) {
  return <p className="mt-0.5 text-xs leading-snug text-muted">{children}</p>;
}

/** Outline shared by every step, after the black outlines of the paper's figures. */
const CARD = 'rounded-[3px] border border-ink/40 bg-page px-3 py-2.5 text-center';

/** A step of the pipeline. */
function Box({ children, wait }: { children: ReactNode; wait: number }) {
  return (
    <div className={clsx('viz-in w-full', CARD)} style={delay(wait)}>
      {children}
    </div>
  );
}

/** Many items of one kind, drawn as a pile of cards as in the paper. `children` is the card on top. */
function Pile({ children, wait }: { children: ReactNode; wait: number }) {
  return (
    <div className="viz-in relative my-2 mr-2 w-full" style={delay(wait)}>
      <span aria-hidden className="absolute inset-0 translate-x-2 -translate-y-2 rounded-[3px] border border-ink/25 bg-page" />
      <span aria-hidden className="absolute inset-0 translate-x-1 -translate-y-1 rounded-[3px] border border-ink/25 bg-page" />
      <div className="relative">{children}</div>
    </div>
  );
}

/** The social media post, drawn as a speech bubble; `pile` for many posts. */
function Post({ children, wait, pile }: { children: ReactNode; wait: number; pile?: boolean }) {
  const bubble = (
    <div className={clsx('relative', CARD)}>
      {children}
      <span aria-hidden className="absolute -bottom-[6px] left-5 h-2.5 w-2.5 rotate-45 border-b border-r border-ink/40 bg-page" />
    </div>
  );
  if (pile) return <Pile wait={wait}>{bubble}</Pile>;
  return (
    <div className="viz-in w-full" style={delay(wait)}>
      {bubble}
    </div>
  );
}

/** The claim database, drawn as a cylinder. */
function Database({ children, wait }: { children: ReactNode; wait: number }) {
  return (
    <div className="viz-in relative w-full rounded-[50%/0.875rem] border border-ink/40 bg-page px-3 pb-3 pt-8 text-center" style={delay(wait)}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-7 rounded-[50%] border-b border-ink/40" />
      {children}
    </div>
  );
}

/** Hairline with end ticks and a label, marking a part of the figure as in the paper's Figure 1. */
function Span({ label, className }: { label: string; className?: string }) {
  return (
    <div className={clsx('hidden items-center gap-2 text-xs text-muted lg:flex', className)}>
      <span aria-hidden className="h-px flex-1 bg-rule" />
      {label}
      <span aria-hidden className="h-px flex-1 bg-rule" />
    </div>
  );
}

const BIASES: { kind: BiasKind; name: string; detail: string; where: string }[] = [
  { kind: 'language', name: 'Language bias', detail: 'in identifying relevant claims for the post', where: 'Measured on the LLM that judges each pair. Section 3, Figure 2' },
  { kind: 'retrieval', name: 'Retrieval bias', detail: 'in identifying relevant claims for the post', where: 'Measured on the retriever that proposes the claims. Section 4, Figure 3' },
];

function BiasButton({ bias, active, onSelect, wait }: { bias: (typeof BIASES)[number]; active: boolean; onSelect: () => void; wait: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-controls="bias-detail"
      onClick={onSelect}
      className={clsx(
        'viz-in w-full rounded-[3px] border px-3 py-2.5 text-center transition-[box-shadow,opacity] duration-150',
        active ? 'shadow-[inset_0_0_0_1px_rgb(var(--ink)/0.7)]' : 'opacity-70 hover:opacity-100'
      )}
      style={{ background: tone('neutral', 0.85), borderColor: tone('neutral-ink', 0.45), ...delay(wait) }}
    >
      <p className="text-sm leading-snug text-ink">
        <span className="font-semibold">{bias.name}</span> {bias.detail}
      </p>
      <p className="mt-1 text-xs leading-snug text-ink-2">{bias.where}</p>
    </button>
  );
}

/** Figure 1 of the paper: the existing pipeline on the left, the two biases it studies on the right. */
function Overview({ active, onSelect }: { active: BiasKind; onSelect: (kind: BiasKind) => void }) {
  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,9rem)_2.5rem_minmax(0,12rem)_4.5rem_minmax(0,1fr)] lg:grid-rows-[auto_repeat(3,minmax(0,1fr))] lg:gap-0">
      <Span label="Existing pipeline" className="col-span-3 col-start-1 row-start-1 pb-2" />
      <Span label="Our contribution" className="col-start-5 row-start-1 pb-2" />

      <div className="relative flex items-center lg:col-start-3 lg:row-start-2 lg:py-4">
        <Post wait={0}>
          <Title>Post to be verified</Title>
          <Sub>a social media post, in one of many languages</Sub>
        </Post>
        <DownArrow className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 translate-y-1/2 lg:block" />
      </div>
      <DownArrow className="lg:hidden" />

      <div className="flex items-center lg:col-start-1 lg:row-start-3">
        <Database wait={80}>
          <Title>MultiClaim</Title>
          <Sub>fact-checks in 39 languages</Sub>
        </Database>
      </div>
      <Arrow className="lg:col-start-2 lg:row-start-3" />

      <div className="relative flex items-center lg:col-start-3 lg:row-start-3 lg:py-4">
        <Box wait={160}>
          <Title>Similarity retriever</Title>
          <Sub>ranks the fact-checks by embedding similarity to the post</Sub>
        </Box>
        <DownArrow className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 translate-y-1/2 lg:block" />
      </div>
      <DownArrow className="lg:hidden" />

      <div className="flex items-center lg:col-start-3 lg:row-start-4 lg:py-4">
        <Pile wait={240}>
          <div className={CARD}>
            <Title>Fact-checked claims</Title>
            <Sub>the best-ranked candidates for the post</Sub>
          </div>
        </Pile>
      </div>

      <div className="lg:col-start-4 lg:row-span-3 lg:row-start-2 lg:flex lg:px-2">
        <Wires from={[1 / 6, 5 / 6]} to={[1 / 6, 5 / 6]} />
      </div>
      <DownArrow className="lg:hidden" />

      {BIASES.map((bias, i) => (
        <div key={bias.kind} className={clsx('flex items-center', i === 0 ? 'lg:col-start-5 lg:row-start-2' : 'lg:col-start-5 lg:row-start-4')}>
          <BiasButton bias={bias} active={active === bias.kind} onSelect={() => onSelect(bias.kind)} wait={340 + 80 * i} />
        </div>
      ))}
    </div>
  );
}

/** Figure 2 of the paper: four strategies, translated into every instruction language, given to six LLMs that answer relevant or not. */
function LanguageDetail({
  strategies,
  languages,
  baseline,
  models,
}: {
  strategies: BiasStrategy[];
  languages: BiasLanguage[];
  baseline: string;
  models: BiasModel[];
}) {
  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,10rem)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,11rem)_3.5rem_minmax(0,7.5rem)] lg:grid-rows-[repeat(4,minmax(0,1fr))] lg:gap-0">
      <ul className="flex flex-wrap justify-center gap-2 lg:contents" aria-label="Prompting strategies">
        {strategies.map((s, i) => (
          <li
            key={s.label}
            className={clsx(
              'flex items-center lg:col-start-1 lg:py-1.5',
              ['lg:row-start-1', 'lg:row-start-2', 'lg:row-start-3', 'lg:row-start-4'][i]
            )}
          >
            <span
              className="viz-in w-full rounded-[3px] border px-3 py-2 text-center text-sm leading-snug text-ink"
              style={{ background: tone(s.tone, 0.16), borderColor: tone(s.tone, 0.75), ...delay(60 * i) }}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ul>
      {strategies.map((s, i) => (
        <Arrow key={s.label} className={clsx('hidden lg:col-start-2 lg:flex', ['lg:row-start-1', 'lg:row-start-2', 'lg:row-start-3', 'lg:row-start-4'][i])} />
      ))}
      <DownArrow className="lg:hidden" />

      <div className="viz-in flex flex-col rounded-lg border border-ink/40 px-3 py-3 lg:col-start-3 lg:row-span-4 lg:row-start-1" style={delay(260)}>
        <Title>
          <span className="block text-center">Translation</span>
        </Title>
        <p className="mt-0.5 text-center text-xs leading-snug text-muted">
          into {languages.length} instruction languages, GPT-4.1 then checked by native or proficient speakers
        </p>
        <ul className="mx-auto mt-3 grid w-full max-w-[19rem] grid-cols-7 gap-1.5" aria-label="Instruction languages">
          {languages.map((l) => (
            <li
              key={l.code}
              title={l.code === baseline ? `${l.label}, the baseline` : l.label}
              aria-label={l.label}
              className={clsx(
                'tabular flex h-7 items-center justify-center rounded-[2px] border text-xs',
                l.code === baseline ? 'border-dashed border-ink/70 font-semibold text-ink' : 'border-rule text-ink-2'
              )}
            >
              {l.code}
            </li>
          ))}
        </ul>
        <p className="mt-auto pt-3 text-center text-xs leading-snug text-muted">
          Dashed: English, the instruction every other language is compared with.
        </p>
      </div>
      <Arrow className="lg:col-start-4 lg:row-span-4 lg:row-start-1" />

      <div className="flex items-center lg:col-start-5 lg:row-span-4 lg:row-start-1">
        <Box wait={360}>
          <Title>Six open LLMs</Title>
          <ul className="mt-2 space-y-1 text-xs leading-snug text-ink-2">
            {models.map((m) => (
              <li key={m.family}>
                <span className="font-semibold text-ink">{m.family}</span> {m.sizes}
              </li>
            ))}
          </ul>
          <Sub>judge each post and claim pair</Sub>
        </Box>
      </div>

      <div className="lg:col-start-6 lg:row-span-4 lg:row-start-1 lg:flex lg:px-1.5">
        <Wires from={[0.5]} to={[3 / 8, 5 / 8]} />
      </div>
      <DownArrow className="lg:hidden" />

      <ul className="flex justify-center gap-6 lg:contents" aria-label="Answers">
        {[
          { label: 'Relevant', Icon: HiCheck, toneName: 'safe' },
          { label: 'Not relevant', Icon: HiXMark, toneName: 'danger' },
        ].map(({ label, Icon, toneName }, i) => (
          <li
            key={label}
            className={clsx('viz-in flex items-center gap-1.5 text-sm text-ink lg:col-start-7 lg:pl-1.5', i === 0 ? 'lg:row-start-2' : 'lg:row-start-3')}
            style={delay(440 + 60 * i)}
          >
            <Icon aria-hidden className="h-5 w-5 shrink-0" style={{ color: tone(toneName) }} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Figure 3 of the paper: the retriever ranks the claims for each post by cosine similarity and keeps the top K, which are then checked for success and for claims that recur. */
function RetrievalDetail({ retrievers, topK }: { retrievers: string[]; topK: number }) {
  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,11rem)_3.5rem_minmax(0,12rem)_2.5rem_minmax(0,9rem)_3.5rem_minmax(0,1fr)] lg:grid-rows-[repeat(2,minmax(0,1fr))] lg:gap-0">
      <div className="flex items-center lg:col-start-1 lg:row-start-1 lg:py-3">
        <Post wait={0} pile>
          <Title>Posts to be verified</Title>
          <Sub>1,239 test posts of MultiClaim</Sub>
        </Post>
      </div>
      <div className="flex items-center lg:col-start-1 lg:row-start-2 lg:py-3">
        <Database wait={80}>
          <Title>Fact-checked claims</Title>
          <Sub>the database each post is matched against</Sub>
        </Database>
      </div>

      <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:px-1.5">
        <Wires from={[0.25, 0.75]} to={[0.5]} />
      </div>
      <DownArrow className="lg:hidden" />

      <div className="flex items-center lg:col-start-3 lg:row-span-2 lg:row-start-1">
        <Box wait={180}>
          <Title>Semantic matching and ranking</Title>
          <Sub>posts and claims embedded, claims ranked by cosine similarity to the post</Sub>
          <ul className="mt-2 flex flex-wrap justify-center gap-1.5">
            {retrievers.map((r) => (
              <li key={r} className="rounded-full border border-rule px-2 py-0.5 text-xs text-ink-2">
                {r}
              </li>
            ))}
          </ul>
        </Box>
      </div>
      <Arrow className="lg:col-start-4 lg:row-span-2 lg:row-start-1" />

      <div className="flex items-center lg:col-start-5 lg:row-span-2 lg:row-start-1">
        <Pile wait={280}>
          <div className={CARD}>
            <Title>Top {topK} claims</Title>
            <Sub>kept for each post</Sub>
          </div>
        </Pile>
      </div>

      <div className="lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:flex lg:px-1.5">
        <Wires from={[0.5]} to={[0.25, 0.75]} />
      </div>
      <DownArrow className="lg:hidden" />

      <ul className="flex flex-col gap-3 lg:contents" aria-label="Questions asked of the ranked claims">
        {[
          { q: 'Success@K?', sub: 'is a correct claim among the top K: Success@1 to @20, MAP, MRR' },
          { q: 'Frequent claims and topics?', sub: 'which claims come back for many posts, and their themes over 30 topics' },
        ].map(({ q, sub }, i) => (
          <li
            key={q}
            className={clsx('viz-in flex flex-col justify-center lg:col-start-7 lg:pl-2', i === 0 ? 'lg:row-start-1' : 'lg:row-start-2')}
            style={delay(380 + 60 * i)}
          >
            <Title>{q}</Title>
            <Sub>{sub}</Sub>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Where the two biases of the study sit in previously fact-checked claim detection, after Figures 1 to 3 of
 * the paper: the pipeline and the two biases on top; below, how the chosen bias was measured.
 */
export function BiasPipeline({
  title,
  strategies,
  languages,
  baseline,
  models,
  retrievers,
  topK,
  caption,
}: {
  title: string;
  /** Prompting strategies in the order and colours of Figure 2. */
  strategies: BiasStrategy[];
  /** Instruction languages, drawn as the tiles of the translation panel. */
  languages: BiasLanguage[];
  /** Code of the language every other instruction is compared with. */
  baseline: string;
  models: BiasModel[];
  retrievers: string[];
  topK: number;
  caption?: string;
}) {
  const [active, setActive] = useState<BiasKind>('language');
  const index = BIASES.findIndex((b) => b.kind === active);
  return (
    <Figure
      title={title}
      caption={caption}
      controls={<Switch label="Bias" options={BIASES.map((b) => b.name)} value={index} onChange={(i) => setActive(BIASES[i].kind)} />}
    >
      <Overview active={active} onSelect={setActive} />
      <section id="bias-detail" aria-live="polite" className="mt-8 border-t border-rule pt-5">
        <p className="mb-5 text-sm text-ink-2">
          <span className="font-semibold text-ink">How {BIASES[index].name.toLowerCase()} was measured.</span>{' '}
          {active === 'language'
            ? 'Every post and claim pair of AMC-16K is judged with the English instruction and with the translated one, and the Macro F1 of the two is compared.'
            : 'Each post queries the claim database; the claims that come back are scored against the gold pairs and counted across posts.'}
        </p>
        <div key={active}>
          {active === 'language' ? (
            <LanguageDetail strategies={strategies} languages={languages} baseline={baseline} models={models} />
          ) : (
            <RetrievalDetail retrievers={retrievers} topK={topK} />
          )}
        </div>
      </section>
    </Figure>
  );
}
