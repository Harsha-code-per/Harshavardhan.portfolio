"use client";

import { useModeStore } from "@/lib/store";
import { workExperience } from "@/data/work";
import { projects } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { ContactForm } from "@/components/ui/ContactForm";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Briefcase, 
  Code2, 
  Mail, 
  ExternalLink, 
  ChevronRight,
  Compass
} from "lucide-react";

export function RecruiterView() {
  const toggleRecruiterMode = useModeStore((state) => state.toggleRecruiterMode);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] px-6 py-28 md:py-36 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-16">
        
        {/* Recruiter Banner Notice */}
        <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-4 flex items-center justify-between text-xs sm:text-sm text-amber-300 font-mono tracking-wide">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Recruiter mode enabled // Immersive animation layers suspended</span>
          </div>
          <button 
            onClick={toggleRecruiterMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-[10px] uppercase font-bold tracking-widest text-amber-300 transition-all cursor-pointer"
          >
            <Compass className="h-3 w-3" /> Immersive Mode
          </button>
        </div>

        {/* Profile Header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Harshavardhan K
            </h1>
            <p className="mt-2.5 text-lg text-amber-400 font-mono">
              AI Engineer & Full-Stack Architect
            </p>
            <p className="mt-4 text-zinc-400 max-w-2xl leading-relaxed text-sm md:text-base">
              I specialize in building intelligent, production-ready AI systems and high-performance, responsive web architectures. Focused on engineering clean data flows and micro-interactions that elevate product storytelling.
            </p>
          </div>

          <a 
            href="/Harshavardhan_K_Resume.pdf"
            download
            className="inline-flex items-center gap-2 px-5 py-3 rounded bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-amber-500/10 cursor-pointer self-start"
          >
            <Download className="h-4 w-4" /> Download Resume
          </a>
        </header>

        {/* Section: Work Experience */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-850 pb-2">
            <Briefcase className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              Work History
            </h2>
          </div>

          <div className="space-y-8">
            {workExperience.map((work) => (
              <div key={work.organization} className="group relative pl-4 sm:pl-6 border-l border-zinc-800">
                {/* Timeline Dot */}
                <div className="absolute left-[-4.5px] top-1.5 h-2 w-2 rounded-full bg-zinc-800 group-hover:bg-amber-400 transition-colors" />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                  <h3 className="text-lg font-bold text-white leading-none">
                    {work.role} <span className="text-zinc-500 font-medium">&bull;</span> {work.organization}
                  </h3>
                  <span className="text-xs font-mono text-amber-400 font-semibold">{work.period}</span>
                </div>
                <div className="text-xs text-zinc-500 font-mono mt-1">{work.location}</div>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed max-w-3xl">{work.overview}</p>
                
                <ul className="mt-4 space-y-2.5">
                  {work.outcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                      <ChevronRight className="h-3.5 w-3.5 text-amber-500/80 mt-0.5 shrink-0" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {work.technologies.map((t) => (
                    <Badge key={t} className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[10px] font-mono">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Selected Projects */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-855 pb-2">
            <Code2 className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              Selected Projects
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <div 
                key={project.slug}
                className="border border-zinc-800 bg-zinc-950 p-6 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <div className="flex items-center gap-2">
                      {project.repoUrl && (
                        <a 
                          href={project.repoUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                          title="View Repository"
                        >
                          <GithubIcon className="h-4 w-4" />
                        </a>
                      )}
                      {project.siteUrl && (
                        <a 
                          href={project.siteUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                          title="Launch Site"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-3.5 text-xs text-zinc-400 leading-relaxed">{project.summary}</p>
                </div>

                <div className="mt-6">
                  <div className="text-[10px] text-zinc-500 font-mono uppercase mb-2 border-b border-zinc-850 pb-1">Outcome</div>
                  <p className="text-xs text-zinc-300 font-semibold">{project.impact}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map(s => (
                      <Badge key={s} className="bg-zinc-900 text-zinc-500 border-zinc-800 text-[9px] font-mono">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Technical Competencies */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-850 pb-2">
            <Code2 className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              Technical Competencies
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat) => (
              <div key={cat.title} className="border border-zinc-800 bg-zinc-950/40 p-5 rounded-lg">
                <h3 className="font-bold text-white text-sm uppercase tracking-wide border-b border-zinc-800 pb-2 mb-3">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-450 leading-relaxed mb-4">{cat.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.technologies.map(t => (
                    <Badge key={t} className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[9px] font-mono">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Quick Contact */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-850 pb-2">
            <Mail className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h2>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-none w-full">
            <p className="text-xs text-zinc-450 mb-6 font-mono">
              SECURE CONSOLE // TRANSMIT MESSAGE BRIEF
            </p>
            <ContactForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <span>&copy; {new Date().getFullYear()} Harshavardhan K // All rights reserved</span>
          <button 
            onClick={toggleRecruiterMode}
            className="text-amber-500 hover:text-amber-400 hover:underline transition-colors cursor-pointer"
          >
            Return to Cinematic Immersive Mode &rarr;
          </button>
        </footer>

      </div>
    </div>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.18-.35 6.5-1.5 6.5-7.14a5.8 5.8 0 0 0-1.5-3.89 5.5 5.5 0 0 0-.15-3.82s-1.13-.36-3.85 1.4a13.3 13.3 0 0 0-7 0c-2.72-1.76-3.85-1.4-3.85-1.4a5.5 5.5 0 0 0-.15 3.82 5.8 5.8 0 0 0-1.5 3.89c0 5.6 3.32 6.79 6.5 7.14a4.8 4.8 0 0 0-1 3.03v4" />
    </svg>
  );
}
