import type { Metadata } from 'next';
import { HiArrowUpRight } from 'react-icons/hi2';
import { PageTitle } from 'app/components/section';
import { projectGroups, type Project } from 'app/data/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Code, tools and resources by Ivan Vykopal: research repositories, NLP resources for Slovak and Czech, and earlier work.',
};

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {projects.map((p) => (
        <li key={p.url}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[1fr_auto]"
          >
            <span>
              <span className="font-semibold text-ink transition-colors group-hover:text-accent">{p.name}</span>
              <span className="mt-1 block text-[0.9375rem] text-ink-2">{p.description}</span>
            </span>
            <span className="text-sm text-muted transition-colors group-hover:text-accent sm:pt-0.5">
              {p.host}
              <HiArrowUpRight aria-hidden className="ml-0.5 inline h-3 w-3 align-[-0.05em]" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <>
      <PageTitle intro={<p>Code released with my papers, tools and resources I maintain, and earlier work.</p>}>
        Projects
      </PageTitle>
      <div className="space-y-14">
        {projectGroups.map((g) =>
          g.collapsed ? (
            <details key={g.title} className="group/more">
              <summary className="flex cursor-pointer list-none items-baseline gap-2 [&::-webkit-details-marker]:hidden">
                <h2 className="text-lg font-semibold tracking-tight text-ink">{g.title}</h2>
                <span className="link text-sm">
                  <span className="group-open/more:hidden">Show {g.projects.length}</span>
                  <span className="hidden group-open/more:inline">Hide</span>
                </span>
              </summary>
              {g.intro ? <p className="mb-4 mt-1 text-[0.9375rem] text-muted">{g.intro}</p> : null}
              <ProjectList projects={g.projects} />
            </details>
          ) : (
            <section key={g.title}>
              <h2 className="text-lg font-semibold tracking-tight text-ink">{g.title}</h2>
              {g.intro ? <p className="mt-1 text-[0.9375rem] text-muted">{g.intro}</p> : null}
              <div className="mt-4">
                <ProjectList projects={g.projects} />
              </div>
            </section>
          )
        )}
      </div>
    </>
  );
}
