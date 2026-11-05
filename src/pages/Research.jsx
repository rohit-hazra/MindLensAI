import { useState } from "react";
import { Check, CheckCircle2, Copy, Download, ExternalLink, Mail } from "lucide-react";
import { Button, Disclaimer, Eyebrow } from "../components/Site";

const title =
  "Context-Aware Explainable Deep Learning for Suicidal Ideation Detection from Social Media Captions";
const team = [
  ["Rohit Hazra", "l.rohit.hazra@gmail.com"],
  ["Tanmay Mohanty", "mohantytanmay396@gmail.com"],
  ["Rashmita Mohalik", "mohaliknitu123@gmail.com"],
  ["Diptiranjan Behera", "beheradiptiranjan435@gmail.com"],
  ["Shubhranshu Sahoo", "shubhranshusahoo98@gmail.com"],
];
const citationFormats = {
  BibTeX: `@unpublished{hazra_context_aware,\n  author = {Hazra, Rohit and Mohanty, Tanmay and Mohalik, Rashmita and Behera, Diptiranjan and Sahoo, Shubhranshu},\n  title = {${title}},\n  institution = {Balasore College of Engineering & Technology},\n  note = {Unpublished research manuscript; DistilRoBERTa + BiGRU + Context Attention}\n}`,
  APA: `Hazra, R., Mohanty, T., Mohalik, R., Behera, D., & Sahoo, S. (n.d.). ${title}. Department of Computer Science & Engineering, Balasore College of Engineering & Technology.`,
  Chicago: `Hazra, Rohit, Tanmay Mohanty, Rashmita Mohalik, Diptiranjan Behera, and Shubhranshu Sahoo. “${title}.” Unpublished research manuscript, Department of Computer Science & Engineering, Balasore College of Engineering & Technology.`,
  MLA: `Hazra, Rohit, et al. “${title}.” Department of Computer Science & Engineering, Balasore College of Engineering & Technology, unpublished research manuscript.`,
  IEEE: `R. Hazra, T. Mohanty, R. Mohalik, D. Behera, and S. Sahoo, “${title},” unpublished research manuscript, Department of Computer Science & Engineering, Balasore College of Engineering & Technology.`,
  Plain: `${title}. Research manuscript by Rohit Hazra, Tanmay Mohanty, Rashmita Mohalik, Diptiranjan Behera, and Shubhranshu Sahoo. Balasore College of Engineering & Technology.`,
};
const metrics = [
  ["Accuracy", "98.80%"],
  ["Precision", "98.80%"],
  ["Recall", "98.80%"],
  ["Macro F1", "98.80%"],
  ["ROC-AUC", "0.9986"],
];

const sections = [
  [
    "01",
    "Abstract",
    <>
      <p>
        Digital mental health surveillance can offer an early window into acute
        psychological distress, but informal syntax, colloquial expressions, and
        subtle emotional intent make social media text difficult to classify.
      </p>
      <p>
        The proposed framework uses a pretrained DistilRoBERTa encoder, a BiGRU,
        and context attention to emphasize salient crisis cues.
      </p>
    </>,
  ],
  [
    "02",
    "Problem statement",
    <p>
      Keyword filters can miss implicit cries for help, while large transformer
      models can be costly to run continuously. The work addresses contextual
      signals in short, noisy captions without treating benchmark labels as
      clinical diagnoses.
    </p>,
  ],
  [
    "03",
    "Motivation",
    <p>
      Meaning is shaped by surrounding language. Combining contextual encoding,
      sequential dependencies, and adaptive cue selection creates a more
      inspectable research baseline for social-media text classification.
    </p>,
  ],
  [
    "04",
    "Research gap",
    <p>
      This project targets the gap between contextual understanding, sequential
      dependency modeling, adaptive context selection, and token-level
      explainability.
    </p>,
  ],
  [
    "05",
    "Proposed approach",
    <p>
      Text is tokenized, encoded with DistilRoBERTa, passed through a
      bidirectional GRU, pooled with context attention, and classified.
      Integrated Gradients and attention-derived signals provide the explanation
      view when available.
    </p>,
  ],
  [
    "06",
    "Model architecture",
    <div className="grid gap-2 sm:grid-cols-5">
      {["DistilRoBERTa", "BiGRU", "Context attention", "Classifier", "XAI"].map(
        (x, i) => (
          <div className="border border-slate-700 p-3" key={x}>
            <span className="text-[10px] text-teal-300">0{i + 1}</span>
            <strong className="mt-5 block text-xs text-white">{x}</strong>
          </div>
        )
      )}
    </div>,
  ],
  [
    "07",
    "Dataset",
    <p>
      The research content describes a balanced 20,000-post corpus derived from
      the Kaggle Suicide and Depression Detection benchmark, with 3,000 held-out
      posts used for evaluation.
    </p>,
  ],
  [
    "08",
    "Experimental setup",
    <p>
      The supplied implementation uses a six-layer RoBERTa configuration with
      768 hidden dimensions, a bidirectional GRU with 128 hidden units per
      direction, context attention, and a two-class classifier.
    </p>,
  ],
  [
    "09",
    "Results",
    <div className="overflow-x-auto">
      <table className="w-full min-w-[360px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-700 text-[10px] uppercase tracking-[.12em] text-slate-500">
            <th className="py-3 pr-6">Metric</th>
            <th className="py-3">Value</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(([label, value]) => (
            <tr className="border-b border-slate-800" key={label}>
              <td className="py-3 pr-6 text-slate-300">{label}</td>
              <td className="py-3 font-semibold text-teal-200">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>,
  ],
  [
    "10",
    "Explainability",
    <p>
      Attention heatmaps and Integrated Gradients provide token-level
      interpretability. The frontend displays explanation values only when
      returned by the model service.
    </p>,
  ],
  [
    "11",
    "Limitations",
    <p>
      Dataset labels represent benchmark categories rather than clinical
      diagnoses. Informal language, dataset bias, distribution shift, and
      attribution limits should be considered.
    </p>,
  ],
  [
    "12",
    "Future work",
    <p>
      Future work can investigate broader datasets, calibration, robustness
      across platforms, and systematic human evaluation of explanations.
    </p>,
  ],
];

function ResearchTeam() {
  return (
    <section className="border-y border-slate-800 bg-[#091514] py-16">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <Eyebrow>Research team</Eyebrow>
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <h2 className="section-title">
              Built by a <em>research team.</em>
            </h2>
            <p className="section-copy mt-5 max-w-sm">
              Department of Computer Science & Engineering
              <br />
              Balasore College of Engineering & Technology · Balasore, India
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {team.map(([name, email], index) => (
              <article
                className="group rounded-lg border border-slate-700 bg-[#101a29] p-5 transition duration-200 hover:-translate-y-1 hover:border-teal-400/70 hover:bg-[#14202d]"
                key={name}
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-10 place-items-center rounded-md border border-teal-400/30 bg-teal-400/10 text-xs font-semibold text-teal-200">
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <span className="text-[10px] text-teal-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-7 text-base font-medium text-white">
                  {name}
                </h3>
                <a
                  className="mt-3 inline-flex items-center gap-2 break-all text-xs text-slate-500 no-underline transition group-hover:text-teal-200"
                  href={`mailto:${email}`}
                >
                  <Mail size={14} strokeWidth={1.7} />
                  {email}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Citation() {
  const [format, setFormat] = useState("BibTeX");
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(citationFormats[format]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  const download = () => {
    const blob = new Blob([citationFormats.BibTeX], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mindlens-research.bib";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="py-16">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <Eyebrow>Cite this research</Eyebrow>
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <h2 className="section-title">
              Use our research <em>in your work?</em>
            </h2>
            <p className="section-copy mt-5 max-w-sm">
              Cite us in your preferred format when referencing the MindLens AI
              research demonstration.
            </p>
          </div>
          <div className="min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-slate-700 bg-[#101a29]">
            <div className="flex max-w-full overflow-x-auto border-b border-slate-700">
              {Object.keys(citationFormats).map((name) => (
                <button
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold transition ${
                    format === name
                      ? "border-teal-400 text-teal-200"
                      : "border-transparent text-slate-500 hover:text-slate-200"
                  }`}
                  key={name}
                  onClick={() => {
                    setFormat(name);
                    setCopied(false);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="min-w-0 p-5 sm:p-7">
              <pre className="m-0 min-h-40 max-w-full overflow-hidden whitespace-pre-wrap break-all rounded-md border border-slate-800 bg-[#091514] p-4 font-mono text-xs leading-6 text-slate-300">
                {citationFormats[format]}
              </pre>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  className="rounded-md bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-300"
                  onClick={copy}
                >
                  <span className="inline-flex items-center gap-2">{copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.8} />}{copied ? "Copied" : "Copy to clipboard"}</span>
                </button>
                {format === "BibTeX" && <button
                  className="rounded-md border border-slate-600 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-teal-400"
                  onClick={download}
                >
                  <span className="inline-flex items-center gap-2"><Download size={14} strokeWidth={1.8} />Download .bib</span>
                </button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const modelComparisons = [
  {
    name: "Proposed Model",
    detail: "DistilRoBERTa + BiGRU + Attention",
    values: [98.8, 98.8, 98.8, 98.8],
    proposed: true,
  },
  {
    name: "BERT-base",
    detail: "Transformer baseline",
    values: [96.1, 96.25, 95.93, 96.09],
  },
  {
    name: "DistilRoBERTa",
    detail: "Standard head",
    values: [97.23, 97.15, 97.33, 97.24],
  },
  {
    name: "BiLSTM Baseline",
    detail: "Recurrent baseline",
    values: [92.4, 92.65, 92.1, 92.37],
  },
];

function ModelComparison() {
  const labels = ["Accuracy", "Precision", "Recall", "F1-Score"];
  return (
    <section className="border-y border-slate-800 bg-[#091514] py-16 sm:py-20">
      <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
        <Eyebrow>Evaluation results</Eyebrow>
        <h2 className="section-title">Model comparison</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-slate-400">Our approach combines contextual encoding, sequence modeling, and attention across the reported evaluation metrics.</p>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead><tr className="border-b border-slate-700 text-slate-100"><th className="px-5 pb-5 text-base font-semibold">Model</th>{labels.map((label) => <th className="px-5 pb-5 text-center text-base font-semibold" key={label}>{label}</th>)}</tr></thead>
            <tbody>{modelComparisons.map((model) => <tr className={`group border-b border-slate-800 transition-colors hover:bg-[#101a29] ${model.proposed ? "bg-[#10242c] text-teal-200 hover:bg-[#102a32]" : "text-slate-300"}`} key={model.name}><td className="px-5 py-6"><div className="flex items-center gap-3"><span className={model.proposed ? "text-teal-300" : "text-transparent"}><CheckCircle2 size={24} strokeWidth={1.8} /></span><div><span className="block font-semibold text-slate-100 group-hover:text-white">{model.name}</span><span className="mt-1 block text-xs text-slate-500">{model.detail}</span></div>{model.proposed && <span className="rounded-full bg-teal-400 px-3 py-1 text-[10px] font-semibold text-slate-950">Our model</span>}</div></td>{model.values.map((value, index) => <td className={`px-5 py-6 text-center font-mono text-base ${model.proposed ? "font-semibold text-teal-300" : ""}`} key={`${model.name}-${index}`}>{value.toFixed(2)}%</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default function Research() {
  return (
    <>
      <section className="mx-auto w-[min(1180px,calc(100%-2rem))] border-b border-slate-800 py-16 sm:py-20">
        <h1 className="max-w-4xl text-[clamp(2.6rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-.07em] text-white">
          The paper behind <em>MindLens AI.</em>
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-xl leading-8 text-slate-300">
          {title}
        </p>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
          A context-aware and explainable deep learning framework for
          identifying suicidal ideation in noisy social media captions—with
          sequential modeling, attention-based explanations, and a lightweight
          transformer backbone.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="inline-flex items-center gap-2 rounded-md border border-teal-400 bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 no-underline hover:bg-teal-300"
            href="/mindlens-research.pdf"
            target="_blank"
            rel="noreferrer"
          >
            View PDF{" "}
            <ExternalLink size={14} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2.5 text-xs font-semibold text-slate-200 no-underline hover:border-teal-400"
            href="/mindlens-research.pdf"
            download="MindLens-Research-Paper.pdf"
          >
            Download paper{" "}
            <Download size={14} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-12 py-12 sm:py-16 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Eyebrow>Contents</Eyebrow>
          <nav className="grid gap-2">
            {sections.map(([n, heading]) => (
              <a
                className="text-xs text-slate-500 no-underline hover:text-teal-200"
                href={`#research-${n}`}
                key={n}
              >
                <span className="mr-3 text-teal-300">{n}</span>
                {heading}
              </a>
            ))}
          </nav>
        </aside>
        <div className="border-t border-slate-800">
          {sections.map(([n, heading, content]) => (
            <article
              className="grid gap-6 border-b border-slate-800 py-9 sm:grid-cols-[120px_1fr]"
              id={`research-${n}`}
              key={n}
            >
              <div>
                <span className="text-xs font-semibold text-teal-300">{n}</span>
                <h2 className="mt-2 text-sm font-semibold text-slate-200">
                  {heading}
                </h2>
              </div>
              <div className="max-w-2xl text-sm leading-7 text-slate-400 [&_p+p]:mt-4 [&_strong]:text-white">
                {content}
              </div>
            </article>
          ))}
        </div>
      </section>
      <ResearchTeam />
      <Citation />
      <ModelComparison />
      <section className="bg-[#101a29] py-14">
        <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow>Research paper PDF</Eyebrow>
            <h2 className="m-0 text-2xl font-medium text-white">
              Read the complete manuscript.
            </h2>
          </div>
          <Button href="/mindlens-research.pdf">Open paper</Button>
        </div>
      </section>
      <Disclaimer />
    </>
  );
}
