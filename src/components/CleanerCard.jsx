
import { MapPinIcon, PhotoIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';

export default function CleanerCard({ item, onViewReport }) {
  const cleanerName = item?.cleaner?.name || 'Unknown Cleaner';
  const locationName = item?.location?.name || 'Unknown Location';
  const rawScore = item?.hygiene_ai?.score ?? item?.activity?.score ?? 0;
  const imagesAnalyzed = item?.hygiene_ai?.details?.images_analyzed || 0;
  const status = item?.activity?.status || 'pending';

  let scoreBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
  let indicatorColor = 'bg-emerald-500';
  if (rawScore < 6.0) {
    scoreBg = 'bg-rose-50 text-rose-700 border-rose-100';
    indicatorColor = 'bg-rose-500';
  } else if (rawScore < 8.5) {
    scoreBg = 'bg-amber-50 text-amber-700 border-amber-100';
    indicatorColor = 'bg-amber-500';
  }

  return (
    <div className="relative bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-100/80 hover:border-slate-200/60 -translate-y-0.5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
      {/* Score color indicator bar at the top */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${indicatorColor}`}></div>
      
      <div>
        <div className="flex justify-between items-start gap-4 mb-3 mt-1">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-indigo-600 transition duration-200 truncate max-w-[180px]">
              {cleanerName}
            </h3>
            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium mt-1">
              <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span className="truncate max-w-[160px]">{locationName}</span>
            </div>
          </div>

          <div className={`border px-3 py-1 rounded-2xl text-center font-mono shrink-0 shadow-sm ${scoreBg}`}>
            <span className="text-sm font-black block leading-tight">{rawScore.toFixed(1)}</span>
            <span className="text-[9px] font-black block tracking-wider uppercase opacity-80">Score</span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-b border-slate-50 py-3 my-4 text-xs font-semibold">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Status</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg font-bold uppercase text-[9px] tracking-wider ${
              status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {status}
            </span>
          </div>
          <div className="border-l border-slate-100 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Evidence</span>
            <span className="font-extrabold text-slate-700 flex items-center gap-1">
              <PhotoIcon className="w-3.5 h-3.5 text-slate-400" />
              {imagesAnalyzed} Image{imagesAnalyzed !== 1 && 's'}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={onViewReport}
        className="w-full bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 text-slate-600 group-hover:text-white py-2.5 px-4 rounded-2xl text-xs font-extrabold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-indigo-100/50 cursor-pointer"
      >
        Detailed Report
        <ArrowLongRightIcon className="w-4 h-4 transition duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}