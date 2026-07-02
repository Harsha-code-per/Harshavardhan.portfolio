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

  const downloadResumeHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Harshavardhan_K_Resume</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      line-height: 1.5;
      margin: 40px auto;
      max-width: 800px;
      padding: 0 24px;
      background-color: #ffffff;
    }
    
    a {
      color: #2563eb;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    
    header {
      text-align: center;
      margin-bottom: 25px;
      border-bottom: 2.5px solid #f1f5f9;
      padding-bottom: 20px;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 5px 0;
      letter-spacing: -0.025em;
    }
    
    .title {
      font-size: 13px;
      font-weight: 700;
      color: #d97706;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    
    .contact-info {
      font-size: 13px;
      color: #4b5563;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
    }
    
    .contact-info span:not(:last-child)::after {
      content: " |";
      color: #d1d5db;
      margin-left: 12px;
    }
    
    section {
      margin-bottom: 25px;
    }
    
    h2 {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
      margin: 25px 0 15px 0;
    }
    
    .item {
      margin-bottom: 20px;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }
    
    .item-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .item-org {
      font-weight: 600;
      color: #4b5563;
    }
    
    .item-period {
      font-size: 11px;
      font-weight: 600;
      color: #b45309;
      font-family: monospace;
    }
    
    .item-location {
      font-size: 11px;
      color: #4b5563;
      margin-bottom: 6px;
      font-style: italic;
    }
    
    .item-overview {
      font-size: 13px;
      color: #374151;
      margin: 0 0 8px 0;
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
    }
    
    li {
      font-size: 12px;
      color: #374151;
      margin-bottom: 4px;
    }
    
    .tech-stack {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .tech-badge {
      font-size: 10px;
      font-family: monospace;
      background-color: #f3f4f6;
      color: #374151;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #e5e7eb;
    }
    
    .skills-grid {
      display: grid;
      grid-template-cols: 1fr;
      gap: 15px;
    }
    @media (min-width: 600px) {
      .skills-grid {
        grid-template-cols: 1fr 1fr;
      }
    }
    
    .skill-cat {
      background-color: #f9fafb;
      border: 1px solid #f3f4f6;
      padding: 12px 15px;
      border-radius: 6px;
    }
    
    .skill-cat-title {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .skill-cat-desc {
      font-size: 11px;
      color: #4b5563;
      margin: 0 0 10px 0;
    }
    
    .print-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: #d97706;
      color: #ffffff;
      border: none;
      padding: 12px 24px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .print-btn:hover {
      background-color: #b45309;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
        max-width: 100%;
      }
      .print-btn {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <button class="print-btn" onclick="window.print()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
    Save to PDF / Print
  </button>

  <header>
    <h1>Harshavardhan K</h1>
    <div class="title">AI Engineer & Full-Stack Architect</div>
    <div class="contact-info">
      <span>Email: <a href="mailto:harshak1805@gmail.com">harshak1805@gmail.com</a></span>
      <span>Portfolio: <a href="https://www.harshavardhan-k.me" target="_blank">harshavardhan-k.me</a></span>
      <span>GitHub: <a href="https://github.com/Harsha-code-per" target="_blank">github.com/Harsha-code-per</a></span>
      <span>Chennai, India</span>
    </div>
  </header>

  <section>
    <h2>Work History</h2>
    ${workExperience.map(work => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${work.role} <span style="color:#d1d5db;font-weight:normal;">&bull;</span> <span class="item-org">${work.organization}</span></span>
          <span class="item-period">${work.period}</span>
        </div>
        <div class="item-location">${work.location}</div>
        <p class="item-overview">${work.overview}</p>
        <ul>
          ${work.outcomes.map(outcome => `<li>${outcome}</li>`).join("")}
        </ul>
        <div class="tech-stack">
          ${work.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join("")}
        </div>
      </div>
    `).join("")}
  </section>

  <section>
    <h2>Selected Projects</h2>
    ${projects.map(project => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${project.title}</span>
          <span class="item-period">
            ${project.siteUrl ? `<a href="${project.siteUrl}" target="_blank" style="margin-right:12px;">Live Site &rarr;</a>` : ""}
            ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank">Codebase &rarr;</a>` : ""}
          </span>
        </div>
        <p class="item-overview" style="margin-top: 4px;">${project.summary}</p>
        <p class="item-overview" style="font-size:12px; color:#4b5563;"><strong>Outcome:</strong> ${project.impact}</p>
        <div class="tech-stack">
          ${project.stack.map(tech => `<span class="tech-badge">${tech}</span>`).join("")}
        </div>
      </div>
    `).join("")}
  </section>

  <section>
    <h2>Technical Competencies</h2>
    <div class="skills-grid">
      ${skillCategories.map(cat => `
        <div class="skill-cat">
          <div class="skill-cat-title">${cat.title}</div>
          <p class="skill-cat-desc">${cat.description}</p>
          <div class="tech-stack">
            ${cat.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  </section>

</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Harshavardhan_K_Resume.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] px-6 py-28 md:py-36 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-16">
        
        {/* Recruiter Banner Notice */}
        <div className="no-print border border-amber-500/20 bg-amber-500/5 rounded-lg p-4 flex items-center justify-between text-xs sm:text-sm text-amber-300 font-mono tracking-wide">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Recruiter mode enabled // Immersive animation layers suspended</span>
          </div>
          <button 
            onClick={toggleRecruiterMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-[0.625rem] uppercase font-bold tracking-widest text-amber-300 transition-all cursor-pointer"
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

          <button 
            onClick={downloadResumeHtml}
            className="no-print inline-flex items-center gap-2 px-5 py-3 rounded bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold uppercase text-xs tracking-wider transition-colors shadow-lg shadow-amber-500/10 cursor-pointer self-start"
          >
            <Download className="h-4 w-4" /> Download Resume
          </button>
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
                    <Badge key={t} className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[0.625rem] font-mono">{t}</Badge>
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
                  <div className="text-[0.625rem] text-zinc-500 font-mono uppercase mb-2 border-b border-zinc-850 pb-1">Outcome</div>
                  <p className="text-xs text-zinc-300 font-semibold">{project.impact}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map(s => (
                      <Badge key={s} className="bg-zinc-900 text-zinc-500 border-zinc-800 text-[0.5625rem] font-mono">{s}</Badge>
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
                    <Badge key={t} className="bg-zinc-900 text-zinc-400 border-zinc-800 text-[0.5625rem] font-mono">{t}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Quick Contact */}
        <section className="no-print space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-855 pb-2">
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
        <footer className="no-print border-t border-zinc-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
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
