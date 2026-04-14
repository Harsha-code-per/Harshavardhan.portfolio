const timelineMilestones = [
  {
    year: "2025",
    title: "Intelligent UAV Research & Full-Stack Engineering",
    highlights: [
      'Publication: "Development of an IoT-based UAV Platform for intelligent 360* Aerial Security Surveillance".',
      'ResPro Labs Internship: "Engineered a scalable Employee Management System (EMS). Executed complex SQL architecture for real-time reporting and optimized HR data processes."',
    ],
  },
  {
    year: "2024 - Present",
    title: "B.Tech Artificial Intelligence & Data Science",
    highlights: [
      "R.M.K. College of Engineering And Technology.",
      "Focused on bridging AI model training with full-stack web deployment.",
    ],
  },
  {
    year: "2021 - 2023",
    title: "Academic Foundation",
    highlights: ["Velankanni Public School (Biology and Maths HSC - 86.2%)."],
  },
] as const;

export function TimelineExperience() {
  return (
    <section className="relative px-6 pb-20 pt-10 md:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">
            Experience Timeline
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Milestones in AI & Engineering
          </h2>
        </div>

        <div className="space-y-6">
          {timelineMilestones.map((milestone, index) => {
            const isLast = index === timelineMilestones.length - 1;

            return (
              <article
                key={`${milestone.year}-${milestone.title}`}
                className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr] md:gap-8"
              >
                <div className="md:pt-7">
                  <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-2xl">
                    {milestone.year}
                  </p>
                </div>

                <div className="relative rounded-2xl border border-slate-200/70 bg-white/60 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-slate-400/80 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25 md:p-7">
                  <span className="absolute -left-1.5 top-8 hidden h-3 w-3 rounded-full border border-slate-300 bg-white dark:border-white/20 dark:bg-slate-900 md:block" />
                  {!isLast ? (
                    <span className="absolute -left-px top-11 hidden h-[calc(100%+1.5rem)] w-px bg-slate-300/70 dark:bg-white/20 md:block" />
                  ) : null}

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {milestone.title}
                  </h3>

                  <div className="mt-4 space-y-2">
                    {milestone.highlights.map((highlight) => (
                      <p key={highlight} className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {highlight}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

