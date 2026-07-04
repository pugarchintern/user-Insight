import { useState } from "react";
import {
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  WrenchScrewdriverIcon,
  HandThumbUpIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

// import ScoreCard from './ScoreCard';
// import SummaryCard from './SummaryCard';
import AIHygieneCoach from "./AIHygieneCoach";
import VisualEvidence from "./VisualEvidence";

export default function AIInsights({ report, rawActivity, simplifying }) {
  if (!report) return null;

  const currentScore = report.score || 0;
  const potentialScore = currentScore < 9.0 ? 9.2 : Math.min(10, Number((currentScore + 0.8).toFixed(1)));
  const scoreUpside = Number((potentialScore - currentScore).toFixed(1));

  // Determine score color classes
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
  const [showRawJson, setShowRawJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(rawActivity, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      {/* Control Bar */}
      <div className="flex justify-between items-center bg-white px-5 py-4 border border-slate-100 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Report Analytics Active</span>
        </div>
        <button
          onClick={() => setShowRawJson(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-700 rounded-2xl text-xs font-extrabold transition-all duration-200 cursor-pointer shadow-sm"
        >
          View Original
        </button>
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
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={scoreColorClass}
                  strokeWidth="3.5"
                  strokeDasharray={`${currentScore * 10}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {currentScore.toFixed(1)}
                </span>
                <span className="block text-[9px] text-slate-400 font-bold tracking-wider mt-0.5">
                  /10
                </span>
              </div>
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wide ${scoreTextColor}`}>
                {scoreStatusText}
              </p>
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
                <TextExpander 
                  text={report?.explanations?.overall || report?.explanations?.floor || "The washroom evaluation is completed. Review individual category breakdowns for ongoing operational metrics."} 
                  maxLength={120} 
                />
              </p>

              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-3 pt-2.5 border-t border-slate-50">
                Target Rating:{" "}
                <span className="text-indigo-600 font-black">{potentialScore.toFixed(1)}/10</span>
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
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Task Details
          </span>
          <div className="space-y-2 mt-3 text-[11px] font-semibold text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Started</span>
              <span className="text-slate-800">
                7/1/2026, 12:05:49 PM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Completed</span>
              <span className="text-slate-800">
                7/1/2026, 12:07:58 PM
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Duration</span>
              <span className="text-slate-800">2m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Status</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded-lg border border-emerald-100 uppercase tracking-wider">
                Completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: FULL WIDTH INTERACTIVE COMPRESSED SLIDER LAYER */}
     

      {/* ROW 3: BOTTOM INSIGHTS MATRIX CONDITIONALS */}
      {simplifying ? (
        /* CONDITION A: RENDER FULL SECTION PULSE SKELETON WHILE AI IS RUNNING */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full animate-pulse">
          <div className="lg:col-span-4 bg-white p-5 border border-slate-100 rounded-2xl shadow-sm h-64 flex flex-col justify-between">
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4 flex-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-5 bg-slate-100 rounded-full shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-2.5 bg-slate-50 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-2xl shadow-sm h-64 flex flex-col justify-between">
            <div className="h-3 bg-slate-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-slate-50 rounded"></div>
                <div className="h-10 bg-slate-50 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-3"></div>
                <div className="h-10 bg-slate-50 rounded"></div>
                <div className="h-10 bg-slate-50 rounded"></div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white p-5 border border-slate-100 rounded-2xl shadow-sm h-64 flex flex-col justify-between items-center">
            <div className="h-3 bg-slate-200 rounded w-2/3 self-start mb-6"></div>
            <div className="w-20 h-20 bg-slate-100 rounded-full"></div>
            <div className="h-3 bg-slate-50 rounded w-5/6 mt-4"></div>
          </div>
        </div>
      ) : (
        /* CONDITION B: RENDER THE POPULATED CORE ANALYTICS MATRIX ONCE LOADED */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start w-full">
          {/* Column A: Dynamic AI Insights List */}
          <div className="lg:col-span-4 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                AI Insights
              </h3>
              <div className="space-y-4">
                {[
                  {
                    key: "floor",
                    title: "Slippery & Dirty Floor",
                    icon: (
                      <ExclamationTriangleIcon className="w-4 h-4 text-rose-500" />
                    ),
                    fallback: "Floor area tracked for moisture patches.",
                  },
                  {
                    key: "western_toilet",
                    title: "Western Toilet Stains",
                    icon: (
                      <ClipboardDocumentCheckIcon className="w-4 h-4 text-amber-500" />
                    ),
                    fallback: "Commode surface checks completed.",
                  },
                  {
                    key: "indian_toilet",
                    title: "Indian Toilet Units",
                    icon: (
                      <WrenchScrewdriverIcon className="w-4 h-4 text-orange-500" />
                    ),
                    fallback: "Squat pan structural checks completed.",
                  },
                  {
                    key: "basin",
                    title: "Wash Basin Area",
                    icon: (
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                    ),
                    fallback: "Faucets evaluated for standard dust stains.",
                  },
                  {
                    key: "infrastructure",
                    title: "Supplies & Infrastructure",
                    icon: (
                      <HandThumbUpIcon className="w-4 h-4 text-emerald-500" />
                    ),
                    fallback: "System dispensers are sound.",
                  },
                ].map((insight) => {
                  const categoryScore = report?.summary?.[insight.key];
                  const dynamicText = report?.explanations?.[insight.key];

                  if (categoryScore === undefined || categoryScore === null)
                    return null;

                  let impactLabel = "Positive Impact";
                  let impactStyle =
                    "bg-emerald-50 text-emerald-700 border border-emerald-100";

                  if (categoryScore < 5.0) {
                    impactLabel = "High Impact";
                    impactStyle =
                      "bg-rose-50 text-rose-700 border border-rose-100";
                  } else if (categoryScore < 8.5) {
                    impactLabel = "Medium Impact";
                    impactStyle =
                      "bg-amber-50 text-amber-700 border border-amber-100";
                  } else if (categoryScore < 10.0) {
                    impactLabel = "Low Impact";
                    impactStyle =
                      "bg-slate-50 text-slate-600 border border-slate-200";
                  }

                  return (
                    <div
                      key={insight.key}
                      className="flex justify-between items-start gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0 group animate-fade-in"
                    >
                      <div className="flex gap-2.5 w-full">
                        <div className="mt-0.5 shrink-0 p-1.5 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition duration-200">{insight.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-extrabold text-slate-800 text-xs">
                            {insight.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                            <TextExpander text={dynamicText || insight.fallback} maxLength={80} />
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap uppercase tracking-wider border ${impactStyle}`}
                      >
                        {impactLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column B: Recommended Actions Conditional Tasks */}
          <div className="lg:col-span-5 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Recommended Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span className="w-1 h-1.5 rounded bg-indigo-600"></span> Cleaning Tasks
                    </h4>
                    {[
                      {
                        targetKey: "floor",
                        condition: (s) => s < 8.0,
                        label: "Dry the wet floor areas immediately",
                        time: "5 min",
                        tag: "High",
                        color: "bg-rose-50 text-rose-700 border border-rose-100",
                      },
                      {
                        targetKey: "western_toilet",
                        condition: (s) => s < 9.5,
                        label: "Remove stains from commode rim units",
                        time: "10 min",
                        tag: "Medium",
                        color:
                          "bg-amber-50 text-amber-700 border border-amber-100",
                      },
                      {
                        targetKey: "basin",
                        condition: (s) => s < 9.5,
                        label: "Clean basin counter area thoroughly",
                        time: "5 min",
                        tag: "Low",
                        color:
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                      },
                      {
                        targetKey: "floor",
                        condition: (s) => s < 9.0,
                        label: "Clean underlying urinal pathway patches",
                        time: "5 min",
                        tag: "Low",
                        color:
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                      },
                    ].map((task, i) => {
                      const score = report?.summary?.[task.targetKey] ?? 10;
                      if (!task.condition(score)) return null;
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center text-[11px] bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/60 gap-3 hover:bg-slate-50 transition duration-150"
                        >
                          <span className="text-slate-600 font-semibold truncate select-none">
                            {task.label}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-slate-400 font-bold text-[9px]">
                              {task.time}
                            </span>
                            <span
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded-lg border uppercase tracking-wider ${task.color}`}
                            >
                              {task.tag}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs font-bold text-slate-800 flex justify-between items-center shrink-0">
                    <span className="text-slate-400 font-medium">
                      Total Cleaning Time
                    </span>
                    <span className="text-indigo-600 font-black">25 min</span>
                  </div>
                </div>

                <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span className="w-1 h-1.5 rounded bg-orange-600"></span> Maintenance Tasks
                    </h4>
                    {[
                      {
                        targetKey: "indian_toilet",
                        condition: (s) => s < 9.5,
                        label: "Repair broken platform tiles/fixtures",
                        time: "15 min",
                        tag: "Medium",
                        color:
                          "bg-amber-50 text-amber-700 border border-amber-100",
                      },
                      {
                        targetKey: "western_toilet",
                        condition: (s) => s < 9.5,
                        label: "Fix flush mechanisms in back units",
                        time: "10 min",
                        tag: "Medium",
                        color:
                          "bg-amber-50 text-amber-700 border border-amber-100",
                      },
                      {
                        targetKey: "infrastructure",
                        condition: (s) => s < 10.0,
                        label: "Check and tighten plumbing fittings",
                        time: "5 min",
                        tag: "Low",
                        color:
                          "bg-emerald-50 text-emerald-700 border border-emerald-100",
                      },
                    ].map((task, i) => {
                      const score = report?.summary?.[task.targetKey] ?? 10;
                      if (!task.condition(score)) return null;
                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center text-[11px] bg-slate-50/50 p-2.5 rounded-2xl border border-slate-100/60 gap-3 hover:bg-slate-50 transition duration-150"
                        >
                          <span className="text-slate-600 font-semibold truncate select-none">
                            {task.label}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-slate-400 font-bold text-[9px]">
                              {task.time}
                            </span>
                            <span
                              className={`text-[8px] font-black px-1.5 py-0.5 rounded-lg border uppercase tracking-wider ${task.color}`}
                            >
                              {task.tag}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs font-bold text-slate-800 flex justify-between items-center shrink-0">
                    <span className="text-slate-400 font-medium">
                      Total Maintenance Time
                    </span>
                    <span className="text-orange-600 font-black">30 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column C: Potential Target Score Upside Calculation */}
          <div className="lg:col-span-3 bg-white p-5 border border-slate-100 rounded-3xl shadow-sm flex flex-col justify-between min-h-[300px] hover:shadow-md transition-all duration-300">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Score Upside
            </h3>
            <div className="flex items-center justify-between my-4 gap-2">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-indigo-500" strokeWidth="3.5" strokeDasharray={`${potentialScore * 10}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">{potentialScore.toFixed(1)}</span>
                  <span className="block text-[9px] text-slate-400 font-bold tracking-wider mt-0.5">/10</span>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-3 text-center h-20 flex flex-col justify-center shrink-0 w-24 shadow-sm shadow-emerald-100/50">
                <span className="text-xl font-black leading-none">+{scoreUpside.toFixed(1)}</span>
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-1.5">Upside</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              Addressing recommended cleaning & maintenance items can optimize the rating to approximately <span className="text-indigo-600 font-black">{potentialScore.toFixed(1)}</span>.
            </p>
          </div>
        </div>
      )}

      <VisualEvidence
        item={rawActivity}
        optimizedExplanations={report.explanations}
      />

      {/* Raw JSON Modal Overlay */}
      {showRawJson && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
          onClick={() => setShowRawJson(false)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div className="flex flex-col">
                <h3 className="font-extrabold text-slate-800 text-sm">
                  Original Inspection Payload
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  Raw JSON Context
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowRawJson(false)}
                  className="w-7 h-7 flex items-center justify-center bg-slate-200/50 hover:bg-slate-200 text-slate-500 rounded-full transition cursor-pointer"
                >
                  <span className="text-lg font-bold leading-none">&times;</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-auto flex-1 bg-slate-950">
              <pre className="text-[11px] text-slate-100 font-mono leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(rawActivity, null, 2)}
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
  if (text.length <= maxLength) {
    return <span className="inline">{text}</span>;
  }

  return (
    <span className="inline">
      {isExpanded ? text : `${text.slice(0, maxLength)}... `}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="text-indigo-600 font-bold hover:text-indigo-800 transition duration-150 inline-block focus:outline-none cursor-pointer"
      >
        {isExpanded ? "Show less" : "View more"}
      </button>
    </span>
  );
}

