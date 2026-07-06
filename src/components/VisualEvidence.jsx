// import { useState } from "react";
// // import PhotoBox from @heroicons/react";
// // // import {PhotoBox} from "@heroicons/react/24/solid";
// // import { PhotoBox } from '@heroicons/react/24/outline'
// export default function VisualEvidence({ item, optimizedExplanations }) {
//   const [expandedImage, setExpandedImage] = useState(null);
//   const imagePairings = item?.hygiene_ai?.details?.ai_response?.images || [];
//   const classScores = item?.hygiene_ai?.details?.ai_response?.class_scores || {};
//   const explainability = optimizedExplanations || item?.hygiene_ai?.details?.ai_response?.explainability || {};
//   const beforePhotos = item?.before_photo || [];
//   const afterPhotos = item?.after_photo || [];

//   return (
//     <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">

//       {/* HEADER SECTION */}
//       <div className="flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <h2 className="text-sm font-bold text-[#1E1B4B] uppercase tracking-wider">Visual Evidence</h2>
//           <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">
//             Before & After
//           </span>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition">
//             View all {imagePairings.length} photos
//           </button>
//           <div className="flex gap-1">
//             <button className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-xs hover:bg-slate-100 transition">
//               ‹
//             </button>
//             <button className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-xs hover:bg-slate-100 transition">
//               ›
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* HORIZONTAL CARDS TRACK ROW */}
//       <div className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
//         {imagePairings.map((viewMetadata, index) => {
//           const cameraViewLower = viewMetadata.camera_view?.toLowerCase() || "";

//           // Pair by index. Filename matching between the AI metadata and the
//           // storage URLs is unreliable since upload filenames are auto-generated
//           // and don't correspond to the filenames the AI model saw.
//           const beforeUrl = beforePhotos[index] || null;
//           const afterUrl = afterPhotos[index] || null;

//           let score = item.score;
//           let description = "AI evaluation processed successfully.";

//           if (cameraViewLower.includes("western")) {
//             score = classScores.western_toilet ?? score;
//             description = explainability.western_toilet || description;
//           } else if (cameraViewLower.includes("indian")) {
//             score = classScores.indian_toilet ?? score;
//             description = explainability.indian_toilet || description;
//           } else if (cameraViewLower.includes("floor")) {
//             score = classScores.floor ?? score;
//             description = explainability.floor || description;
//           } else if (cameraViewLower.includes("basin")) {
//             score = classScores.basin ?? score;
//             description = explainability.basin || description;
//           } else {
//             description = explainability.overall || description;
//           }

//           const isLowScore = score < 7.5;
//           const tagLabel = isLowScore ? "Safety Issue" : "Hygiene Issue";
//           const tagClass = isLowScore
//             ? "bg-red-50 text-red-600 border border-red-100"
//             : "bg-amber-50 text-amber-600 border border-amber-100";

//           return (
//             <div
//               key={index}
//               className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col justify-between w-72 shrink-0"
//             >
//               {/* Plain before/after images, side by side, no slider */}
//               <div className="flex gap-2">
//                 <PhotoBox 
//                   url={beforeUrl} 
//                   label="BEFORE" 
//                   labelClass="bg-red-600" 
//                   onClick={() => setExpandedImage({ url: beforeUrl, label: "BEFORE", viewName: viewMetadata.camera_view || `View ${index + 1}` })}
//                 />
//                 <PhotoBox 
//                   url={afterUrl} 
//                   label="AFTER" 
//                   labelClass="bg-emerald-600" 
//                   onClick={() => setExpandedImage({ url: afterUrl, label: "AFTER", viewName: viewMetadata.camera_view || `View ${index + 1}` })}
//                 />
//               </div>
              

//               {/* Title Info Header */}
//               <div className="flex justify-between items-center mt-3">
//                 <div className="flex items-center gap-2">
//                   <span className="w-5 h-5 flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-[10px] rounded border border-indigo-100">
//                     {index + 1}
//                   </span>
//                   <h3 className="font-bold text-slate-800 text-xs truncate max-w-[160px]">
//                     {viewMetadata.camera_view || `View ${index + 1}`}
//                   </h3>
//                 </div>
//                 <div className="text-xs font-black text-slate-900">
//                   <span className={score < 7.5 ? "text-amber-500" : "text-emerald-600"}>
//                     {score !== null && score !== undefined ? score.toFixed(1) : "N/A"}
//                   </span>
//                   <span className="text-slate-400 font-normal text-[10px]">/10</span>
//                 </div>
//               </div>

//               {/* Subdescription */}
//               <p className="text-[11px] text-slate-400 mt-1.5 min-h-[2rem] font-medium leading-normal">
//                 <TextExpander text={description} maxLength={80} />
//               </p>

//               {/* Issue Status Pill */}
//               <div className="mt-2.5">
//                 <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${tagClass}`}>
//                   {tagLabel}
//                 </span>
//               </div>

//             </div>
//           );
//         })}
//       </div>

//       {/* Expanded Image Overlay */}
//       {expandedImage && (
//         <div 
//           className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 transition-all duration-300"
//           onClick={() => setExpandedImage(null)}
//         >
//           {/* Top Control Bar */}
//           <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10" onClick={(e) => e.stopPropagation()}>
//             <button 
//               onClick={() => setExpandedImage(null)}
//               className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md font-bold text-sm transition border border-white/10 cursor-pointer shadow-lg"
//             >
//               ← Back
//             </button>
//             <div className="flex items-center gap-3">
//               <span className="text-white/80 font-bold text-sm bg-white/5 px-3 py-1 rounded-xl border border-white/5">
//                 {expandedImage.viewName}
//               </span>
//               <span className={`text-[10px] font-black px-2.5 py-1 rounded shadow text-white tracking-wider uppercase ${expandedImage.label === 'BEFORE' ? 'bg-red-600' : 'bg-emerald-600'}`}>
//                 {expandedImage.label}
//               </span>
//             </div>
//           </div>

//           {/* Large Image Wrapper */}
//           <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
//             <img 
//               src={expandedImage.url} 
//               alt={`${expandedImage.viewName} - ${expandedImage.label}`} 
//               className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/10 animate-fade-in"
//             />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// //     </div>
// //   );
// // }





// function PhotoBox({ url, label, labelClass, onClick }) {
//   return (
//     <div 
//       className={`relative flex-1 h-32 rounded-xl overflow-hidden bg-slate-100 select-none ${
//         url ? 'cursor-pointer hover:opacity-90 active:scale-[0.98] transition duration-200' : ''
//       }`}
//       onClick={url ? onClick : undefined}
//     >
//       {url ? (
//         <img
//           src={url}
//           alt={label}
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//       ) : (
//         <div className="absolute inset-0 w-full h-full flex items-center justify-center">
//           <span className="text-[10px] text-slate-400 font-semibold">No image</span>
//         </div>
//       )}
//       <span
//         className={`absolute top-1.5 left-1.5 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow z-10 tracking-wider ${labelClass}`}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }

// function TextExpander({ text, maxLength = 100 }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   if (!text) return null;
//   if (text.length <= maxLength) {
//     return <span className="inline">{text}</span>;
//   }

//   return (
//     <span className="inline">
//       {isExpanded ? text : `${text.slice(0, maxLength)}... `}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           setIsExpanded(!isExpanded);
//         }}
//         className="text-indigo-600 font-bold hover:text-indigo-800 transition duration-150 inline-block focus:outline-none cursor-pointer"
//       >
//         {isExpanded ? "Show less" : "View more"}
//       </button>
//     </span>
//   );
// }






















import { useState, useRef } from "react";
// import PhotoBox from @heroicons/react";
// // import {PhotoBox} from "@heroicons/react/24/solid";
// import { PhotoBox } from '@heroicons/react/24/outline'

export default function VisualEvidence({ item, optimizedExplanations }) {
  const [expandedImage, setExpandedImage] = useState(null);
  const scrollContainerRef = useRef(null);

  const imagePairings = item?.hygiene_ai?.details?.ai_response?.images || [];
  const classScores = item?.hygiene_ai?.details?.ai_response?.class_scores || {};
  const explainability = optimizedExplanations || item?.hygiene_ai?.details?.ai_response?.explainability || {};
  const beforePhotos = item?.before_photo || [];
  const afterPhotos = item?.after_photo || [];

  // Smooth scroll handler function
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Scrolls by roughly one card width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-[#1E1B4B] uppercase tracking-wider">Visual Evidence</h2>
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">
            Before & After
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition">
            View all {imagePairings.length} photos
          </button>
          <div className="flex gap-1">
            {/* Left Nav Arrow Button */}
            <button 
              onClick={() => handleScroll("left")}
              className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-xs hover:bg-slate-100 active:scale-95 transition cursor-pointer select-none"
            >
              ‹
            </button>
            {/* Right Nav Arrow Button */}
            <button 
              onClick={() => handleScroll("right")}
              className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-xs hover:bg-slate-100 active:scale-95 transition cursor-pointer select-none"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL CARDS TRACK ROW */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent scroll-smooth"
      >
        {imagePairings.map((viewMetadata, index) => {
          const cameraViewLower = viewMetadata.camera_view?.toLowerCase() || "";

          const beforeUrl = beforePhotos[index] || null;
          const afterUrl = afterPhotos[index] || null;

          let score = item.score;
          let description = "AI evaluation processed successfully.";

          if (cameraViewLower.includes("western")) {
            score = classScores.western_toilet ?? score;
            description = explainability.western_toilet || description;
          } else if (cameraViewLower.includes("indian")) {
            score = classScores.indian_toilet ?? score;
            description = explainability.indian_toilet || description;
          } else if (cameraViewLower.includes("floor")) {
            score = classScores.floor ?? score;
            description = explainability.floor || description;
          } else if (cameraViewLower.includes("basin")) {
            score = classScores.basin ?? score;
            description = explainability.basin || description;
          } else {
            description = explainability.overall || description;
          }

          const isLowScore = score < 7.5;
          const tagLabel = isLowScore ? "Safety Issue" : "Hygiene Issue";
          const tagClass = isLowScore
            ? "bg-red-50 text-red-600 border border-red-100"
            : "bg-amber-50 text-amber-600 border border-amber-100";

          return (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col justify-between w-72 shrink-0"
            >
              {/* Plain before/after images, side by side */}
              <div className="flex gap-2">
                <PhotoBox 
                  url={beforeUrl} 
                  label="BEFORE" 
                  labelClass="bg-red-600" 
                  onClick={() => setExpandedImage({ url: beforeUrl, label: "BEFORE", viewName: viewMetadata.camera_view || `View ${index + 1}` })}
                />
                <PhotoBox 
                  url={afterUrl} 
                  label="AFTER" 
                  labelClass="bg-emerald-600" 
                  onClick={() => setExpandedImage({ url: afterUrl, label: "AFTER", viewName: viewMetadata.camera_view || `View ${index + 1}` })}
                />
              </div>

              {/* Title Info Header */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-[10px] rounded border border-indigo-100">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-slate-800 text-xs truncate max-w-[160px]">
                    {viewMetadata.camera_view || `View ${index + 1}`}
                  </h3>
                </div>
                <div className="text-xs font-black text-slate-900">
                  <span className={score < 7.5 ? "text-amber-500" : "text-emerald-600"}>
                    {score !== null && score !== undefined ? score.toFixed(1) : "N/A"}
                  </span>
                  <span className="text-slate-400 font-normal text-[10px]">/10</span>
                </div>
              </div>

              {/* Subdescription */}
              <p className="text-[11px] text-slate-400 mt-1.5 min-h-[2rem] font-medium leading-normal">
                <TextExpander text={description} maxLength={80} />
              </p>

              {/* Issue Status Pill */}
              <div className="mt-2.5">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${tagClass}`}>
                  {tagLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Image Overlay Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 transition-all duration-300"
          onClick={() => setExpandedImage(null)}
        >
          {/* Top Control Bar */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setExpandedImage(null)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md font-bold text-sm transition border border-white/10 cursor-pointer shadow-lg"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <span className="text-white/80 font-bold text-sm bg-white/5 px-3 py-1 rounded-xl border border-white/5">
                {expandedImage.viewName}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded shadow text-white tracking-wider uppercase ${expandedImage.label === 'BEFORE' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                {expandedImage.label}
              </span>
            </div>
          </div>

          {/* Large Image Wrapper */}
          <div className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={expandedImage.url} 
              alt={`${expandedImage.viewName} - ${expandedImage.label}`} 
              className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/10 animate-fade-in"
            />
          </div>
        </div>
      )}

    </div>
  );
}

function PhotoBox({ url, label, labelClass, onClick }) {
  return (
    <div 
      className={`relative flex-1 h-32 rounded-xl overflow-hidden bg-slate-100 select-none ${
        url ? 'cursor-pointer hover:opacity-90 active:scale-[0.98] transition duration-200' : ''
      }`}
      onClick={url ? onClick : undefined}
    >
      {url ? (
        <img
          src={url}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <span className="text-[10px] text-slate-400 font-semibold">No image</span>
        </div>
      )}
      <span
        className={`absolute top-1.5 left-1.5 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow z-10 tracking-wider ${labelClass}`}
      >
        {label}
      </span>
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