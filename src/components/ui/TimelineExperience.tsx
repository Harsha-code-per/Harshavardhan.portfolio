"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { publications } from "@/data/publications";
import { workExperience } from "@/data/work";

type JourneyMilestone = {
  year: string;
  title: string;
  highlights: string[];
};

const journeyMilestones: JourneyMilestone[] = [
  ...workExperience.map((work) => ({
    year: work.period,
    title: `${work.role} · ${work.organization}`,
    highlights: [work.overview, ...work.outcomes],
  })),
  ...publications.map((publication) => ({
    year: publication.year,
    title: publication.title,
    highlights: [publication.publisher, publication.summary],
  })),
];

export function TimelineExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end 60%"],
  });

  // Ensure scaleY starts at 0 and goes to 1
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative px-[clamp(1rem,5vw,4rem)] py-20"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-primary-light)]"
          >
            Journey Timeline
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-[clamp(1.8rem,4vw,3.3rem)] font-black uppercase tracking-tight text-[var(--text-primary)]"
          >
            Milestones in AI & Engineering
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base"
          >
            Key chapters in my engineering journey — from academic foundations to production delivery.
          </motion.p>
        </div>

        <div className="relative">
          {/* Spine container - positioned exactly at left: 31.5px to intersect center of 64px col */}
          <div className="absolute left-[31.5px] top-10 bottom-0 w-px hidden md:block z-0">
            {/* Background spine line */}
            <span className="absolute inset-0 w-full bg-white/10" />
            {/* Animated progress spine */}
            <motion.span
              className="absolute top-0 left-0 w-full h-full origin-top"
              style={{
                scaleY,
                background: "linear-gradient(to bottom, var(--accent-primary), var(--accent-tertiary))",
                boxShadow: "0 0 12px var(--accent-primary-glow)",
              }}
            />
          </div>

          <div className="relative flex flex-col gap-6 z-10">
            {journeyMilestones.map((milestone, index) => (
              <motion.article
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.5, margin: "-10% 0px -20% 0px" }}
                key={`${milestone.year}-${milestone.title}`}
                className="group relative flex items-start w-full"
              >
                {/* Dot Container - Fixed width perfectly centers the dot over the 31.5px spine */}
                <div className="hidden md:flex w-16 shrink-0 justify-center pt-8 z-10">
                  <motion.span
                    variants={{
                      hidden: { 
                        scale: 1, 
                        backgroundColor: "var(--bg-surface)",
                        boxShadow: "none",
                        borderColor: "rgba(255,255,255,0.2)"
                      },
                      visible: { 
                        scale: 1.6, 
                        backgroundColor: "var(--accent-primary)",
                        boxShadow: "0 0 22px var(--accent-primary-glow)",
                        borderColor: "var(--accent-primary)"
                      }
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-4 w-4 rounded-full border-2"
                  />
                </div>

                {/* Card Container */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="card-glass relative rounded-2xl p-6 transition-all duration-300"
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 0 30px var(--accent-primary-glow)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-[0.8rem] uppercase tracking-wide text-[var(--accent-primary-light)]">
                        {milestone.year}
                      </p>
                      <span className="h-px flex-1 bg-[var(--border-default)]" />
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <motion.h3
                      variants={{
                        hidden: { color: "var(--text-primary)" },
                        visible: { color: "var(--accent-primary-light)" }
                      }}
                      className="mt-3 text-[1.1rem] font-bold"
                    >
                      {milestone.title}
                    </motion.h3>

                    <div className="mt-4 space-y-2">
                      {milestone.highlights.map((highlight) => (
                        <p
                          key={highlight}
                          className="text-sm leading-[1.7] text-[var(--text-secondary)]"
                        >
                          {highlight}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
