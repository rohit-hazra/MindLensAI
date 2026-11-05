/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { ArrowUpRight, FileText, Info, Mail, Menu, X } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";

export const go = (path) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};
export function Brand() {
  return (
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        go("/");
      }}
      className="flex items-center gap-2.5 text-sm font-semibold tracking-[-.03em] text-white no-underline"
    >
      <img
        // src="/MindLensAI_Logo.png"
        src="/Logo.png"
        alt=""
        className="size-9 rounded-md object-cover"
      />
      <span>
        MindLens <i className="not-italic text-teal-300">AI</i>
      </span>
    </a>
  );
}
export function Eyebrow({ children }) {
  return (
    <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-teal-300">
      <i className="h-px w-7 bg-teal-400" />
      {children}
    </div>
  );
}
export function Button({
  children,
  href = "#",
  secondary = false,
  onClick,
  disabled = false,
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition ${
    secondary
      ? "border-slate-600 text-slate-200 hover:border-teal-400 hover:text-teal-200"
      : "border-teal-400 bg-teal-500 text-slate-950 hover:bg-teal-300"
  } ${disabled ? "cursor-not-allowed opacity-60" : ""}`;
  const icon = <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" />;
  if (href.endsWith(".pdf"))
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer">
        {children}
        {icon}
      </a>
    );
  if (href !== "#")
    return (
      <a
        className={cls}
        href={href}
        onClick={(e) => {
          e.preventDefault();
          go(href);
        }}
      >
        {children}
        {icon}
      </a>
    );
  return (
    <button className={cls} onClick={onClick} disabled={disabled} type="button">
      {children}
    </button>
  );
}
export function Header({ path }) {
  const [open, setOpen] = useState(false);
  const navigate = (href) => {
    setOpen(false);
    go(href);
  };
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[#071a19]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] w-[min(1180px,calc(100%-2rem))] items-center gap-8">
        <Brand />
        <nav
          className={`${
            open
              ? "absolute left-0 right-0 top-[68px] flex border-b border-slate-800 bg-[#071a19] px-4 py-5"
              : "hidden md:flex"
          } ml-auto flex-col gap-5 text-xs md:flex-row md:items-center md:gap-7`}
        >
          {[
            ["/", "Home"],
            ["/research", "Research"],
          ].map(([href, label]) => (
            <a
              className={`no-underline transition ${
                path === href
                  ? "text-teal-300"
                  : "text-slate-400 hover:text-white"
              }`}
              href={href}
              key={href}
              onClick={(e) => {
                e.preventDefault();
                navigate(href);
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          className="ml-auto hidden rounded-md border border-teal-400/70 px-3 py-2 text-xs font-semibold text-teal-200 no-underline hover:bg-teal-400/10 md:block"
          href="/#analyzer"
          onClick={(e) => {
            e.preventDefault();
            if (path !== "/") navigate("/");
            window.setTimeout(
              () =>
                document
                  .querySelector("#analyzer")
                  ?.scrollIntoView({ behavior: "smooth" }),
              0
            );
          }}
        >
          Try the Demo
        </a>
        <button
          aria-label="Toggle navigation"
          className="ml-auto text-slate-300 md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="border-t-2 border-teal-400 bg-[#151d29]">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))] py-8 sm:py-10">
        <div className="grid gap-7 md:grid-cols-[1.2fr_.8fr_1fr]">
          <div>
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Context-Aware Explainable AI for Suicidal Ideation Detection.
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              An academic research demonstration exploring contextual language
              representations, sequential modeling, and explainable predictions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Quick links</h3>
            <nav className="mt-4 grid gap-3 text-sm text-slate-400">
              <a
                className="inline-flex items-center gap-2 hover:text-teal-200"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  go("/");
                }}
              >
                Home
              </a>
              <a
                className="inline-flex items-center gap-2 hover:text-teal-200"
                href="/research"
                onClick={(e) => {
                  e.preventDefault();
                  go("/research");
                }}
              >
                <FileText size={14} />
                Research paper
              </a>
              <a
                className="inline-flex items-center gap-2 hover:text-teal-200"
                href="/#analyzer"
                onClick={(e) => {
                  e.preventDefault();
                  go("/");
                  window.setTimeout(
                    () =>
                      document
                        .querySelector("#analyzer")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    0
                  );
                }}
              >
                Try the analyzer
              </a>
            </nav>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Developer contact
            </h3>
            <p className="mt-4 text-sm font-semibold text-slate-200">
              Rohit Hazra
            </p>
            <a
              className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400 no-underline hover:text-teal-200"
              href="mailto:l.rohit.hazra@gmail.com"
            >
              <Mail size={16} />
              l.rohit.hazra@gmail.com
            </a>
            <div className="mt-4 flex gap-3">
              <a
                className="rounded-md border border-slate-700 p-2.5 text-slate-400 hover:border-teal-400 hover:text-teal-200"
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github size={17} />
              </a>
              <a
                className="rounded-md border border-slate-700 p-2.5 text-slate-400 hover:border-teal-400 hover:text-teal-200"
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>
              <a
                className="rounded-md border border-slate-700 p-2.5 text-slate-400 hover:border-teal-400 hover:text-teal-200"
                href="mailto:l.rohit.hazra@gmail.com"
                aria-label="Email Rohit Hazra"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-2 border-t border-slate-800 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 MindLens AI. Academic research demonstration.</span>
          <span>
            Built with DistilRoBERTa, BiGRU, Context Attention, and XAI.
          </span>
        </div>
      </div>
    </footer>
  );
}
export function Disclaimer() {
  return (
  <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] gap-3 py-5 text-xs leading-5 text-slate-500">
    <Info
      size={16}
      className="shrink-0 text-teal-300"
      aria-hidden="true"
    />
    <p className="m-0">
      MindLens AI is an academic research demonstration. Its outputs are
      generated by a machine-learning model and are not medical diagnoses,
      clinical assessments, or a substitute for professional support.
    </p>
  </div>
);
}
export function Layout({ path, children }) {
  return (
    <>
      <Header path={path} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
