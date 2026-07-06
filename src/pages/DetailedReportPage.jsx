import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { formatData } from '../utils/formatData';
import AIInsights from '../components/AIInsights';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function DetailedReportPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeModel, setActiveModel] = useState('gemini'); // State hook tracker for active model
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simplifying, setSimplifying] = useState(false);
  const [rawActivity, setRawActivity] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDataAndSimplify() {
      try {
        setLoading(true);
        let rawActivityObj = location.state?.activity;

        // Pull core data structure appending active model parameter context tags
        if (!rawActivityObj && id) {
          const res = await fetch(`${API_BASE_URL}/api/report/context/${id}?model=${activeModel}`);
          if (res.ok) {
            rawActivityObj = await res.json();
          }
        }

        if (!rawActivityObj) {
          throw new Error("Could not resolve activity context payload");
        }

        if (isMounted) {
          setRawActivity(rawActivityObj); 
          const formattedReport = formatData(rawActivityObj);
          setReport(formattedReport);
          setLoading(false);

          // Triggering background AI translation tasks matching chosen engine metrics
          setSimplifying(true);
          const aiRes = await fetch(`${API_BASE_URL}/api/report/simplify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              explainability: formattedReport.explanations,
              model: activeModel // Send selected model configuration to the backend translator
            })
          });

          if (aiRes.ok && isMounted) {
            const simplifiedTextObj = await aiRes.json();
            setReport(prev => ({
              ...prev,
              explanations: simplifiedTextObj
            }));
          }
        }
      } catch (err) {
        console.error("❌ Error running report processing chain:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setSimplifying(false);
        }
      }
    }

    loadDataAndSimplify();

    return () => { isMounted = false; };
  }, [id, activeModel]); // Triggers reload sequence whenever activeModel flips

  if (loading && !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 text-slate-800 font-sans">
      
      {/* HEADER BAR */}
      <header className="max-w-7xl mx-auto flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-650 cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Cleanliness Inspection Report</h1>
            <p className="text-xs text-slate-400 mt-0.5">{report.locationName}</p>
          </div>
        </div>
      </header>

      {/* RENDER THE CONSOLIDATED INSIGHTS WITH RUNTIME HOOK TOGGLES */}
      <main className="max-w-7xl mx-auto">
        <AIInsights 
          report={report} 
          rawActivity={rawActivity} 
          simplifying={simplifying}
          activeModel={activeModel}
          onModelChange={setActiveModel}
        />
      </main>

    </div>
  );
}