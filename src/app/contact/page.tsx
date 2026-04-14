import {
  GitBranch as Github,
  Link as Linkedin,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PRIMARY_EMAIL,
  PROFILE_NAME,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/data/profile";
import { ContactForm } from "@/components/ui/ContactForm";

const socialLinks = [
  {
    label: "Email",
    handle: PRIMARY_EMAIL,
    href: `mailto:${PRIMARY_EMAIL}`,
    icon: Mail,
    external: false,
  },
  {
    label: "LinkedIn",
    handle: LINKEDIN_URL,
    href: LINKEDIN_URL,
    icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    handle: GITHUB_URL,
    href: GITHUB_URL,
    icon: Github,
    external: true,
  },
  {
    label: "WhatsApp",
    handle: WHATSAPP_DISPLAY,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: MessageSquare,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen px-6 pb-16 pt-24 md:px-10 lg:px-16">
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
            Let&apos;s Build Something.
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-600 dark:text-slate-400">
            {PROFILE_NAME} — I collaborate on intelligent interfaces, performant systems, and product experiences that leave a lasting impression.
          </p>

          <ul className="mt-8 space-y-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300/70 bg-white/70 text-slate-700 transition group-hover:scale-105 group-hover:text-slate-900 dark:border-white/15 dark:bg-white/10 dark:text-slate-300 dark:group-hover:text-slate-100">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.handle}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center md:justify-end">
          <div className="w-full max-w-xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
