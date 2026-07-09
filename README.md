# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.












import { useState } from "react";
import {
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  WrenchScrewdriverIcon,
  HandThumbUpIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

import AIHygieneCoach from "./AIHygieneCoach";
import VisualEvidence from "./VisualEvidence";

export default function AIInsights({ report, rawActivity, simplifying, activeModel, onModelChange }) {
  const currentScore = report?.score || 0;
  const potentialScore = currentScore < 9.0 ? 9.2 : Math.min(10, Number((currentScore + 0.8).toFixed(1)));

  let scoreColorClass = "text-emerald-500";
  let scoreTextColor = "text-emerald-600";
  let scoreStatusText = "Excellent, fully clean!";

  if (currentScore < 6.0) {
    scoreColorClass = "text-rose-500";
    scoreTextColor = "text-rose-600";
    scoreStatusText = "Needs urgent attention";
  } else if (currentScore < 8.5) {
    scoreColorClass = "text-amber-500";
    scoreTextColor = "text-amber-600";
    scoreStatusText = "Good, but needs attention";
  }

  const starsCount = Math.min(5, Math.max(1, Math.round(currentScore / 2)));
  
  // Modal states configuration
  const [showRawJson, setShowRawJson] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("raw"); // 'raw' or 'ai'
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedAI, setCopiedAI] = useState(false);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(rawActivity, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleCopyAI = () => {
    if (!report?.explanations) return;
    navigator.clipboard.writeText(JSON.stringify(report.explanations, null, 2));
    setCopiedAI(true);
    setTimeout(() => setCopiedAI(false), 2000);
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Control Bar */}
      <div className="flex justify-between items-center bg-white px-5 py-4 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Report Analytics Active</span>
          </div>
          
          {/* MODEL SWAPPER BUTTONS */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              disabled={simplifying}
              onClick={() => onModelChange?.("gemini")}
              className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                activeModel === "gemini"
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/40"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Gemini
            </button>
            <button
              disabled={simplifying}
              onClick={() => onModelChange?.("groq")}
              className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 ${
                activeModel === "groq"
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200/40"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Groq
            </button>
          </div>
        </div>
        
        {/* ACTION OPTIONS PANEL */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveModalTab("raw"); // Set default visible view layer to context parameters
              setShowRawJson(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer shadow-sm"
          >
            View Original ({activeModel?.toUpperCase() || 'GEMINI'})
          </button>
        </div>
      </div>

      {/* TOP ROW STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start w-full">
        {/* Card 1: Score Tracker Radial Progress */}
        <div className="lg:col-span-3 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[160px] hover:shadow-md transition-all duration-300">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Overall Hygiene Score
          </span>
          <div className="flex items-center gap-6 mt-3">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={scoreColorClass} strokeWidth="3.5" strokeDasharray={`${currentScore * 10}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-slate-900 leading-none">{currentScore.toFixed(1)}</span>
                <span className="block text-[9px] text-slate-400 font-bold tracking-wider mt-0.5">/10</span>
              </div>
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wide ${scoreTextColor}`}>{scoreStatusText}</p>
              <div className="flex gap-0.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-3.5 h-3.5 ${i < starsCount ? 'text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Main AI Paragraph Summary */}
        <div className="lg:col-span-3 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col min-h-[160px] hover:shadow-md transition-all duration-300">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-indigo-600 font-black animate-pulse">✦</span> AI Summary
          </span>
          {simplifying && !report?.explanations?.overall ? (
            <div className="space-y-2 mt-4 flex-1">
              <div className="h-3 bg-slate-100 rounded-md w-full animate-pulse"></div>
              <div className="h-3 bg-slate-100 rounded-md w-5/6 animate-pulse"></div>
              <div className="h-3 bg-slate-100 rounded-md w-4/5 animate-pulse"></div>
            </div>
          ) : (
            <div className="flex flex-col justify-between flex-1 mt-2.5">
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                <TextExpander text={report?.explanations?.overall || report?.explanations?.floor || "The washroom evaluation is completed."} maxLength={120} />
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3 pt-2.5 border-t border-slate-50">
                Target Rating: <span className="text-indigo-600 font-black">{potentialScore.toFixed(1)}/10</span>
              </p>
            </div>
          )}
        </div>

        {/* Card 3: AI Hygiene Coach Panel */}
        <div className="lg:col-span-3">
          <AIHygieneCoach report={report} simplifying={simplifying} />
        </div>

        {/* Card 4: Task Details */}
        <div className="lg:col-span-3 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[160px] hover:shadow-md transition-all duration-300">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Details</span>
          <div className="space-y-2 mt-3 text-[11px] font-semibold text-slate-600">
            <div className="flex justify-between"><span className="text-slate-400">Started</span><span className="text-slate-800">7/1/2026, 12:05:49 PM</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Completed</span><span className="text-slate-800">7/1/2026, 12:07:58 PM</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Duration</span><span className="text-slate-800">2m</span></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-lg border border-emerald-100 uppercase tracking-wider">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: BOTTOM INSIGHTS MATRIX CONDITIONALS */}
      {simplifying ? (
        /* CONDITION A: SHOW SLEEK PULSE SKELETON WHILE AI SWITCHES TRANSLATIONS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full animate-pulse">
          <div className="lg:col-span-7 bg-white p-6 border border-slate-100 rounded-3xl shadow-sm h-[400px] flex flex-col">
            <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-8"></div>
            <div className="space-y-6 flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center flex-1">
                    <div className="w-8 h-8 bg-slate-100 rounded-xl shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-2.5 bg-slate-100 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-slate-100 rounded-xl w-16 mr-12"></div>
                  <div className="h-4 bg-slate-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm h-[400px] flex flex-col justify-between">
            <div>
              <div className="h-3 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="h-2 bg-slate-100 rounded w-1/2 mb-2"></div>
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-100 rounded w-1/2 mb-2"></div>
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
                </div>
              </div>
            </div>
            <div className="h-8 bg-slate-50 rounded-xl w-full"></div>
          </div>
        </div>
      ) : (
        /* CONDITION B: RENDER THE POPULATED CORE ANALYTICS MATRIX ONCE LOADED */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
          {/* Column A: Complete 7-Category AI Insights List */}
          <div className="lg:col-span-7 bg-white p-6 border border-slate-100 rounded-3xl shadow-sm min-h-[300px] hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-slate-900">
                Why this score? <span className="text-indigo-600 font-medium text-sm ml-1">(AI Explainability)</span>
              </h3>
              <div className="hidden sm:flex gap-16 text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-4">
                <span>Impact on Score</span>
                <span className="w-12 text-center">Score</span>
              </div>
            </div>

            <div className="relative pl-6 space-y-5">
              <div className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-orange-400 via-purple-400 to-emerald-400 rounded" />
              {[
                { key: "floor", title: "Floor", icon: <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />, dotColor: "bg-orange-500 ring-orange-200" },
                { key: "urinal", title: "Urinal", icon: <ClipboardDocumentCheckIcon className="w-5 h-5 text-teal-500" />, dotColor: "bg-teal-500 ring-teal-100" },
                { key: "western_toilet", title: "Western Toilet", icon: <ClipboardDocumentCheckIcon className="w-5 h-5 text-blue-500" />, dotColor: "bg-blue-500 ring-blue-100" },
                { key: "indian_toilet", title: "Indian Toilet", icon: <WrenchScrewdriverIcon className="w-5 h-5 text-purple-500" />, dotColor: "bg-purple-500 ring-purple-100" },
                { key: "consumables", title: "Consumables", icon: <HandThumbUpIcon className="w-5 h-5 text-emerald-500" />, dotColor: "bg-emerald-500 ring-emerald-100" },
                { key: "safety", title: "Safety", icon: <ExclamationTriangleIcon className="w-5 h-5 text-rose-500" />, dotColor: "bg-rose-500 ring-rose-200" },
                { key: "infrastructure", title: "Infrastructure", icon: <HandThumbUpIcon className="w-5 h-5 text-slate-500" />, dotColor: "bg-slate-500 ring-slate-100" },
              ].map((insight) => {
                const categoryScore = report?.summary?.[insight.key] ?? report?.summary?.[insight.key === 'consumables' ? 'basin' : ''];
                const dynamicText = report?.explanations?.[insight.key] ?? report?.explanations?.[insight.key === 'consumables' ? 'basin' : ''];

                if (categoryScore === undefined || categoryScore === null) return null;

                let impactLabel = "Positive";
                let impactStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                let scoreColor = "text-emerald-600";

                if (categoryScore < 5.0) {
                  impactLabel = "High"; impactStyle = "bg-rose-50 text-rose-700 border-rose-100"; scoreColor = "text-rose-600";
                } else if (categoryScore < 8.5) {
                  impactLabel = "Medium"; impactStyle = "bg-amber-50 text-amber-700 border-amber-100"; scoreColor = "text-amber-600";
                } else if (categoryScore < 10.0) {
                  impactLabel = "Low"; impactStyle = "bg-orange-50 text-orange-600 border-orange-100"; scoreColor = "text-orange-500";
                }

                return (
                  <div key={insight.key} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0 group animate-fade-in">
                    <div className={`absolute -left-[23px] top-1.5 w-2.5 h-2.5 rounded-full ${insight.dotColor} ring-4 z-10`} />
                    <div className="flex gap-3 items-start flex-1 min-w-0">
                      <div className="mt-0.5 shrink-0 p-1 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition duration-200">{insight.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-800 text-sm">
                          {insight.title} <span className="text-slate-400 font-semibold text-xs ml-0.5">({Number(categoryScore).toFixed(1)}/10)</span>
                        </h5>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                          <TextExpander text={dynamicText || "Evaluation verified successfully."} maxLength={100} />
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-8 sm:gap-12 shrink-0 pt-2 sm:pt-0 border-t border-dashed border-slate-100 sm:border-none">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-xl shrink-0 w-20 text-center border ${impactStyle}`}>{impactLabel}</span>
                      <div className="text-xs font-bold text-slate-400 w-12 text-right sm:text-center">
                        <span className={`text-sm font-extrabold ${scoreColor}`}>{Number(categoryScore).toFixed(1)}</span>/10
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column B: Recommended Actions Conditional Tasks */}
          <div className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recommended Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1"><span className="w-1 h-1.5 rounded bg-indigo-600"></span> Cleaning</h4>
                    {[
                      { targetKey: "floor", condition: (s) => s < 8.0, label: "Dry wet floor areas", time: "5 min", tag: "High", color: "bg-rose-50 text-rose-700 border-rose-100" },
                      { targetKey: "western_toilet", condition: (s) => s < 9.5, label: "Remove toilet stains", time: "10 min", tag: "Medium", color: "bg-amber-50 text-amber-700 border-amber-100" },
                    ].map((task, i) => {
                      const score = report?.summary?.[task.targetKey] ?? 10;
                      if (!task.condition(score)) return null;
                      return (
                        <div key={i} className="flex justify-between items-center text-[11px] bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/60 gap-3">
                          <span className="text-slate-600 font-semibold truncate">{task.label}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${task.color}`}>{task.tag}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-3 border-t text-xs font-bold text-slate-800 flex justify-between">
                    <span className="text-slate-400 font-medium">Cleaning Time</span><span className="text-indigo-600 font-black">25 min</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-1"><span className="w-1 h-1.5 rounded bg-orange-600"></span> Maintenance</h4>
                    {[
                      { targetKey: "indian_toilet", condition: (s) => s < 9.5, label: "Repair platform fixtures", time: "15 min", tag: "Medium", color: "bg-amber-50 text-amber-700 border-amber-100" },
                    ].map((task, i) => {
                      const score = report?.summary?.[task.targetKey] ?? 10;
                      if (!task.condition(score)) return null;
                      return (
                        <div key={i} className="flex justify-between items-center text-[11px] bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/60 gap-3">
                          <span className="text-slate-600 font-semibold truncate">{task.label}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${task.color}`}>{task.tag}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-3 border-t text-xs font-bold text-slate-800 flex justify-between">
                    <span className="text-slate-400 font-medium">Maintenance Time</span><span className="text-orange-600 font-black">30 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <VisualEvidence item={rawActivity} optimizedExplanations={report?.explanations} />

      {/* VIEW ORIGINAL INTEGRATED DATA WORKSPACE MODAL OVERLAY */}
      {showRawJson && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6" onClick={() => setShowRawJson(false)}>
          <div className="bg-white rounded-3xl border shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header Tab Options Layer */}
            <div className="px-6 pt-4 pb-0 border-b flex flex-col sm:flex-row justify-between sm:items-center bg-slate-50/50 gap-4">
              <div className="flex gap-4 border-b border-transparent">
                <button
                  onClick={() => setActiveModalTab("raw")}
                  className={`pb-3 text-xs font-black uppercase tracking-wider transition relative cursor-pointer ${
                    activeModalTab === "raw" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Raw Context Payload
                </button>
                <button
                  onClick={() => setActiveModalTab("ai")}
                  className={`pb-3 text-xs font-black uppercase tracking-wider transition relative cursor-pointer ${
                    activeModalTab === "ai" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  AI Explanations ({activeModel?.toUpperCase() || 'GEMINI'} JSON)
                </button>
              </div>

              {/* Dynamic Action Controls for active view tabs */}
              <div className="flex items-center gap-3 pb-3 sm:pb-0">
                {activeModalTab === "raw" ? (
                  <button
                    onClick={handleCopyRaw}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                  >
                    {copiedRaw ? <span className="text-emerald-600">✓ Copied!</span> : "Copy Raw JSON"}
                  </button>
                ) : (
                  <button
                    disabled={!report?.explanations}
                    onClick={handleCopyAI}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm disabled:opacity-40"
                  >
                    {copiedAI ? <span className="text-emerald-600">✓ Copied!</span> : `Copy ${activeModel?.toUpperCase() || 'GEMINI'} JSON`}
                  </button>
                )}
                
                <button onClick={() => setShowRawJson(false)} className="w-7 h-7 flex items-center justify-center bg-slate-200/60 hover:bg-slate-200 text-slate-500 rounded-full transition cursor-pointer font-bold">
                  &times;
                </button>
              </div>
            </div>

            {/* Dynamic Content JSON viewport matching tab states */}
            <div className="p-6 overflow-auto flex-1 bg-slate-950">
              <pre className="text-[11px] text-slate-100 font-mono whitespace-pre-wrap leading-relaxed">
                {activeModalTab === "raw" 
                  ? JSON.stringify(rawActivity, null, 2)
                  : JSON.stringify(report?.explanations || { error: "AI summary translations unavailable" }, null, 2)
                }
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TextExpander({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!text) return null;
  if (text.length <= maxLength) return <span className="inline">{text}</span>;
  return (
    <span className="inline">
      {isExpanded ? text : `${text.slice(0, maxLength)}... `}
      <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="text-indigo-600 font-bold hover:text-indigo-800 transition duration-150 inline-block focus:outline-none cursor-pointer">
        {isExpanded ? "Show less" : "View more"}
      </button>
    </span>
  );
}