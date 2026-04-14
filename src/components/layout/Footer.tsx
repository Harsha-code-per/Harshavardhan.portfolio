import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  PLACEHOLDER_ADDRESS,
  PRIMARY_EMAIL,
  PROFILE_NAME,
  WHATSAPP_NUMBER,
} from "@/data/profile";

const footerLinks = [
  {
    href: `mailto:${PRIMARY_EMAIL}`,
    label: "Email",
    Icon: FaEnvelope,
  },
  {
    href: LINKEDIN_URL,
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  {
    href: GITHUB_URL,
    label: "GitHub",
    Icon: FaGithub,
  },
  {
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    label: "WhatsApp",
    Icon: FaWhatsapp,
  },
] as const;

export function Footer() {
  return (
    <footer className="relative z-20 mt-8 border-t border-white/10 bg-black/70 py-10 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 text-center text-sm text-slate-300 md:px-10 lg:px-12">
        <div className="space-y-1">
          <p>© 2026 {PROFILE_NAME}. All rights reserved.</p>
          <p>{PRIMARY_EMAIL}</p>
          <p>{PLACEHOLDER_ADDRESS}</p>
        </div>

        <div className="flex items-center gap-3">
          {footerLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={label}
              className="inline-flex h-10 w-10 items-center justify-center text-2xl text-slate-200 transition-colors hover:text-cyan-400"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
