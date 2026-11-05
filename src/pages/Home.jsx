import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUp,
  ArrowRight,
  BrainCircuit,
  ChevronDown,
  Eye,
  GitBranch,
  Layers3,
  Network,
  Sparkles,
} from "lucide-react";
import { Button, Disclaimer, Eyebrow } from "../components/Site";


const examples = [
  [
    "Simple Non-Suicidal",
    "I'm feeling overwhelmed with my studies, but I know things will get better with time. I just need to take a deep breath and focus on one task at a time.",
    "safe",
  ],
  [
    "Simple Suicidal",
    "I don't want to live anymore. Nothing seems to have a purpose. I feel like a burden to everyone around me.",
    "risk",
  ],
  [
    "Contextual Non-Suicidal",
    "This assignment is literally killing me, but I'm finally almost done with it. I can't wait to submit it and take a break.",
    "safe",
  ],
  [
    "Contextual Suicidal",
    "Everyone would be better off without me. I'm exhausted from feeling worthless every day. I can't see a way out of this pain.",
    "risk",
  ],
  [
    "Emotional Non-Suicidal",
    "I miss the person I used to be. Life has been difficult lately, but I'm trying to find myself again. I know I can overcome these challenges and rediscover my inner strength.",
    "safe",
  ],
  [
    "Indirect Suicidal",
    "Some days, simply existing feels more exhausting than words can ever express. I wish I could just disappear and never have to face the world again.",
    // "Some days, I feel like fading away would be easier than facing another day.",
    "risk",
  ],
];

const stages = [
  ["01", "Input caption", "Raw social media language"],
  ["02", "DistilRoBERTa", "Contextual token representations"],
  ["03", "BiGRU", "Sequential dependencies"],
  ["04", "Context attention", "Salient context selection"],
  ["05", "Classifier", "Prediction and explanation"],
];
const highlights = [
  [
    BrainCircuit,
    "Context-aware modeling",
    "Meaning is read through relationships between words, not isolated keywords.",
    "text-blue-400",
  ],
  [
    Eye,
    "Explainable predictions",
    "The output is paired with model-derived signals when the service provides them.",
    "text-violet-400",
  ],
  [
    GitBranch,
    "Sequential representation",
    "A bidirectional GRU captures how intent unfolds across a caption.",
    "text-emerald-400",
  ],
  [
    Network,
    "Attention-based analysis",
    "Context attention selects the representation used for classification.",
    "text-cyan-400",
  ],
  [
    Activity,
    "Token-level insights",
    "Integrated Gradients can expose the contribution of individual tokens.",
    "text-teal-300",
  ],
  [
    Layers3,
    "Transformer backbone",
    "DistilRoBERTa provides a compact contextual encoding stage.",
    "text-amber-400",
  ],
];
const evaluationMetrics = [
  ["98.80%", "Accuracy", "Overall correctness on the reported held-out evaluation."],
  ["98.80%", "Precision", "The reported proportion of positive predictions that were correct."],
  ["98.80%", "Recall", "The reported proportion of positive examples identified by the model."],
  ["98.80%", "Macro F1", "The reported balanced F1-score across the two classes."],
  ["0.9986", "ROC-AUC", "The reported ranking performance across classification thresholds."],
  ["20,000", "Balanced posts", "The balanced corpus size described in the research content."],
  ["3,000", "Held-out posts", "The evaluation partition described in the research content."],
  ["768", "Encoder dimensions", "The contextual representation size used by the model encoder."],
];

function Pipeline() {
  return (
    <div>
      {stages.map(([n, title, detail], i) => (
        <div className="relative flex items-center gap-4" key={title}>
          <div
            className={`relative z-10 grid size-9 shrink-0 place-items-center border ${
              i === 0 || i === stages.length - 1
                ? "border-teal-400 bg-teal-400/10 text-teal-200"
                : "border-slate-600 bg-[#101a29] text-slate-400"
            } text-[10px]`}
          >
            {n}
          </div>
          <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3 border-b border-slate-800 py-3">
            <strong className="text-sm font-medium text-slate-100">
              {title}
            </strong>
            <span className="hidden text-right text-[11px] text-slate-500 sm:block">
              {detail}
            </span>
          </div>
          {i < stages.length - 1 && (
            <span className="absolute left-[17px] top-9 h-5 w-px bg-teal-400/40" />
          )}
        </div>
      ))}
    </div>
  );
}
function InfoList({ title, items }) {
  return (
    <div>
      <label className="label">{title}</label>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? (
          items.map((x) => (
            <span
              className="border border-teal-400/30 bg-teal-400/10 px-2 py-1.5 text-xs text-teal-100"
              key={x}
            >
              {x}
            </span>
          ))
        ) : (
          <em className="text-xs text-slate-500">Not provided by the model.</em>
        )}
      </div>
    </div>
  );
}
function Results({ result }) {
  const score = Number(result.riskScore);
  const attrs = Array.isArray(result.attributions) ? result.attributions : [];
  const phrases = result.contextualRiskPhrases || [];
  const triggers = result.topTriggerWords || [];
  const isRiskPrediction = result.label === 1 || result.predictedClass === "Suicidal";
  const hasPrediction = Boolean(result.predictedClass);
  return (
    <div className="mt-8 border border-slate-700 bg-[#101a29] p-5 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-slate-700 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Eyebrow>Model response</Eyebrow>
          <h3 className="m-0 text-2xl font-medium tracking-[-.04em] text-white">
            Prediction returned
          </h3>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[.12em] shadow-[0_0_16px_rgba(20,184,166,.12)] ${
            !hasPrediction
              ? "border-slate-600 bg-slate-800/50 text-slate-300 shadow-none"
              : isRiskPrediction
                ? "border-red-400/60 bg-red-500/10 text-red-200 shadow-[0_0_16px_rgba(248,113,113,.18)]"
                : "border-teal-400/60 bg-teal-400/10 text-teal-100"
          }`}
        >
          <i
            aria-hidden="true"
            className={`size-1.5 rounded-full ${
              !hasPrediction ? "bg-slate-400" : isRiskPrediction ? "bg-red-400" : "bg-teal-300"
            }`}
          />
          {result.predictedClass || "Unavailable"}
        </span>
      </div>
      <div className="grid gap-6 py-6 sm:grid-cols-2">
        <div>
          <label className="label">Predicted class</label>
          <strong className="mt-3 block text-2xl font-medium text-white">
            {result.predictedClass || "—"}
          </strong>
          <p className="mt-2 text-xs text-slate-500">
            Label <b className="text-slate-300">{result.label ?? "—"}</b> ·
            Confidence{" "}
            <b className="text-slate-300">
              {result.confidence != null ? `${result.confidence}%` : "—"}
            </b>
          </p>
        </div>
        <div>
          <label className="label">Model-generated suicidal risk score</label>
          <strong className="mt-3 block text-2xl font-medium text-teal-300">
            {Number.isFinite(score) ? `${score.toFixed(2)}%` : "—"}
          </strong>
          <div className="mt-4 h-1.5 bg-slate-700">
            <i
              className="block h-full bg-teal-400"
              style={{ width: `${Math.min(Math.max(score || 0, 0), 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Research output, not a clinical risk level.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-6">
        <Eyebrow>Explainability</Eyebrow>
        <h4 className="m-0 text-lg font-medium text-white">
          Model explanation
        </h4>
        {attrs.length > 0 && (
          <p className="mt-4 rounded-md border border-slate-700 bg-[#0b171d] p-4 text-sm leading-7 text-slate-300">
            {attrs.map((item, i) => (
              <span
                key={`${item.token}-${i}`}
                className={
                  Number(item.score) > 0
                    ? "rounded bg-teal-400/15 px-1 text-teal-100"
                    : "text-slate-400"
                }
                title={`Attribution: ${item.score}`}
              >
                {item.token}{" "}
              </span>
            ))}
          </p>
        )}
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <InfoList title="Contextual risk phrases" items={phrases} />
          <InfoList title="Top trigger words" items={triggers} />
          <div>
            <label className="label">IG convergence delta</label>
            <strong className="mt-3 block text-xl font-medium text-teal-200">
              {result.igConvergenceDelta ?? "—"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
function Capability({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400 px-3 py-1.5 text-xs font-semibold text-slate-950">
      <Icon size={14} strokeWidth={2} aria-hidden="true" />
      {children}
    </span>
  );
}
function EvaluationMetrics() { const [active, setActive] = useState(0); return <div className="min-w-0"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{evaluationMetrics.map(([value, label], index) => <button key={label} onClick={() => setActive(index)} className={`rounded-lg border p-4 text-left transition duration-200 hover:-translate-y-1 ${active === index ? "border-teal-300 bg-[#102f2b] shadow-[0_8px_24px_rgba(20,184,166,.12)]" : "border-teal-400/20 bg-[#0b2522] hover:border-teal-300/60"}`}><strong className={`text-xl font-medium ${active === index ? "text-teal-200" : "text-teal-300"}`}>{value}</strong><span className="mt-2 block text-[11px] text-slate-400">{label}</span></button>)}</div><div className="mt-4 rounded-lg border border-teal-400/20 bg-[#102f2b] px-4 py-3 text-xs leading-5 text-slate-300"><span className="font-semibold text-teal-200">{evaluationMetrics[active][1]}:</span> {evaluationMetrics[active][2]}</div></div>; }
function Analyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const run = async () => {
    if (!text.trim()) {
      setError("Enter a caption before analyzing.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok)
        throw Error(
          body.error || body.detail || "The analysis service is unavailable."
        );
      setResult(body);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="analyzer" className="bg-[#0c121b] py-16 sm:py-20">
      <div className="mx-auto w-[min(1120px,calc(100%-2rem))]">
        <div className="mx-auto max-w-3xl text-left">
          <h2 className="text-4xl font-semibold tracking-[-.06em] text-slate-100 sm:text-5xl">
            Try MindLens AI
          </h2>
          <p className="mt-5 text-base text-slate-400 sm:text-lg">
            Enter any caption below to see how our research-backed model
            interprets context.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Capability icon={Sparkles}>Research model</Capability>
            <Capability icon={Network}>Context-aware analysis</Capability>
            <Capability icon={Eye}>Explainable output</Capability>
          </div>
        </div>
        <div className="mt-10 rounded-xl border border-slate-700 bg-[#151d29] p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="m-0 text-sm font-semibold text-slate-100">
              Try sample examples:
            </h3>

            <span className="w-fit rounded-full border border-slate-600 px-3 py-1 text-[10px] font-medium text-slate-300">
              Research-backed examples
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {examples.map(([tag, sample, tone]) => (
              <button
                key={sample}
                onClick={() => {
                  setText(sample);
                  setResult(null);
                  setError("");
                }}
                className="min-h-[100px] rounded-lg border border-slate-700 bg-[#0c121b] p-4 text-left transition hover:-translate-y-0.5 hover:border-teal-400/70"
              >
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    tone === "safe"
                      ? "bg-teal-400 text-slate-950"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {tag}
                </span>

                <p className="mt-2.5 text-xs leading-5 text-slate-300">
                  {sample}
                </p>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-slate-700 bg-[#151d29] p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-100">
              Enter text to analyze
            </label>
            <span className="text-xs text-slate-400">{text.length} / 500</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder="Type or paste a caption here..."
            className="mt-3 min-h-[90px] w-full resize-y rounded-lg border border-slate-700 bg-[#0c121b] p-3 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-500 focus:border-teal-400"
          />
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <Button
              secondary
              onClick={() => {
                setText("");
                setResult(null);
                setError("");
              }}
            >
              Clear
            </Button>
            <Button onClick={run} disabled={loading}>
              {loading ? "Analyzing…" : "Analyze caption"}
            </Button>
          </div>
          {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
          {result && <Results result={result} />}
        </div>
      </div>
      <Disclaimer />
    </section>
  );
}

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 360);
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    return () => window.removeEventListener("scroll", updateBackToTop);
  }, []);

  const scrollToApproach = () =>
    document.querySelector("#approach")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <section className="relative isolate mx-auto flex min-h-[calc(100dvh-68px)] w-[min(1180px,calc(100%-2rem))] items-center justify-center overflow-hidden py-16 text-center sm:py-20 lg:h-[calc(100vh-68px)]">
        <img
          src="/mindlens_ai.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(980px,150vw)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-[.12] drop-shadow-[0_0_26px_rgba(45,212,191,.7)] sm:w-[min(1080px,105vw)]"
        />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="mx-auto max-w-3xl text-[clamp(2.7rem,7vw,5.6rem)] font-medium leading-[.98] tracking-[-.07em] text-white">
            MindLens <span className="text-teal-300">AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-2xl leading-tight text-slate-200 sm:text-3xl">
            Context-Aware Explainable AI for Suicidal Ideation Detection
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
            Explore how a hybrid deep learning model uses contextual
            representations, sequential modeling, and attention-based
            explanations to analyze social media captions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#analyzer"
              className="inline-flex items-center gap-2 rounded-md border border-teal-400 bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 no-underline hover:bg-teal-300"
            >
              Analyze a caption <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
            </a>
            <Button href="/research" secondary>
              View research
            </Button>
          </div>
        </div>
        <button
          type="button"
          onClick={scrollToApproach}
          className="hero-scroll-control absolute bottom-4 left-1/2 z-10 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-teal-400/50 bg-[#071a19]/85 px-3.5 py-2 text-xs font-medium text-teal-100 shadow-[0_0_18px_rgba(45,212,191,.12)] backdrop-blur-sm transition duration-300 hover:border-teal-300 hover:bg-teal-400/15 hover:shadow-[0_0_22px_rgba(45,212,191,.28)] sm:bottom-6"
        >
          Scroll to explore
          <ChevronDown size={15} strokeWidth={2} aria-hidden="true" />
        </button>
        {/* <div className="hidden relative overflow-hidden border-y border-slate-700 py-5 sm:py-7">
          <div className="flex items-center justify-between">
            <span className="label">Architecture / 04 layers</span>
            <span className="text-[10px] text-teal-300">RESEARCH FIGURE</span>
          </div>
          <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stages.slice(1, 5).map(([number, name, detail], index) => (
              <div className="relative border border-slate-700 bg-[#101a29] p-3 transition hover:-translate-y-1 hover:border-teal-400/70" key={name}>
                <span className="text-[10px] text-teal-300">{number}</span>
                <strong className="mt-5 block text-xs font-medium text-slate-100">{name}</strong>
                <span className="mt-2 block text-[10px] leading-4 text-slate-500">{detail}</span>
                {index < 3 && <ArrowRight size={15} className="absolute -right-3 top-1/2 z-10 hidden text-teal-300 sm:block" aria-hidden="true" />}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[.14em] text-slate-500"><span className="h-px flex-1 bg-teal-400/40" /><span>caption → representation → decision</span><span className="h-px flex-1 bg-teal-400/40" /></div>
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-[10px] text-slate-500"><span><b className="block text-slate-200">768</b>hidden dimensions</span><span><b className="block text-slate-200">BiGRU</b>sequence layer</span><span><b className="block text-slate-200">XAI</b>token insights</span></div>
        </div> */}
      </section>
      <section id="approach" className="scroll-mt-[68px] border-y border-slate-800 bg-[#091514] py-5">
        <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-3 text-xs text-slate-400 sm:grid-cols-5">
          <span className="label self-center">The approach</span>
          {[
            "Contextual encoding",
            "Sequence modeling",
            "Context attention",
            "Classification",
          ].map((x, i) => (
            <span key={x} className="flex items-center gap-3">
              <b className="text-[10px] text-teal-300">0{i + 1}</b>
              {x}
            </span>
          ))}
        </div>
      </section>
      <section className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-12 py-16 sm:py-20 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <Eyebrow>Why context matters</Eyebrow>
          <h2 className="section-title">
            Language rarely speaks <em>in isolation.</em>
          </h2>
        </div>
        <div>
          <p className="section-copy">
            Words can appear alarming when viewed alone. Their meaning can
            change significantly when the surrounding context is considered.
            MindLens AI explores this distinction through contextual language
            representations, sequential modeling, and attention-based
            explanations.
          </p>
          <div className="mt-8 border-l border-teal-400 pl-5 font-serif text-xl leading-8 text-slate-200">
            “The aim is not only to classify a caption, but to make the path to
            that classification inspectable.”
          </div>
        </div>
      </section>
      <section className="border-y border-slate-800 bg-[#091514] py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <Eyebrow>Understanding the model</Eyebrow>
            <h2 className="section-title">
              From words to <em>context.</em>
            </h2>
            <p className="section-copy mt-5">
              A connected pipeline combining contextual embeddings, sequence
              modeling, and attention.
            </p>
          </div>
          <Pipeline />
        </div>
      </section>
      <Analyzer />
      <section className="mx-auto w-[min(1180px,calc(100%-2rem))] py-16 sm:py-20">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="section-title">From caption to explanation</h2>
        <div className="mt-10 grid gap-0 border-y border-slate-800 sm:grid-cols-5">
          {[
            ["01", "Contextual encoding", "DistilRoBERTa"],
            ["02", "Sequence modeling", "BiGRU"],
            ["03", "Context selection", "Context attention"],
            ["04", "Classification", "Classifier"],
            ["05", "Explanation", "XAI"],
          ].map(([n, a, b]) => (
            <div
              className="border-b border-slate-800 p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-0"
              key={n}
            >
              <span className="text-[10px] text-teal-300">{n}</span>
              <h3 className="mt-7 text-sm font-medium text-white">{a}</h3>
              <p className="mt-2 text-xs text-slate-500">{b}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[#101a29] py-16 sm:py-20">
        <div className="mx-auto w-[min(1180px,calc(100%-2rem))]">
          <Eyebrow>Research highlights</Eyebrow>
          <h2 className="section-title">A considered model, made visible.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map(([Icon, title, copy, color]) => (
              <article className="group rounded-lg border border-slate-700 bg-[#101a29] p-5 transition duration-200 hover:-translate-y-1 hover:border-teal-400/70 hover:bg-[#14202d]" key={title}>
                <Icon
                  size={42}
                  strokeWidth={1.6}
                  className={`${color} transition-transform duration-200 group-hover:scale-110`}
                  aria-hidden="true"
                />
                <h3 className="mt-7 text-base font-medium text-white">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-slate-800 bg-[#0b2522] py-16 sm:py-20">
        <div className="mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Eyebrow>Reported evaluation</Eyebrow>
            <h2 className="section-title">Research metrics</h2>
            <p className="section-copy mt-5">
              Values reported in the project research content for the held-out
              evaluation.
            </p>
          </div>
          <EvaluationMetrics />
        </div>
      </section>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-4 right-4 z-40 grid size-11 place-items-center rounded-full border border-teal-400/50 bg-[#071a19]/90 text-teal-200 shadow-[0_0_18px_rgba(45,212,191,.16)] [-webkit-tap-highlight-color:transparent] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-400/15 hover:shadow-[0_0_22px_rgba(45,212,191,.32)] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071a19] sm:bottom-6 sm:right-6 ${
          showBackToTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
      </button>
    </>
  );
}
