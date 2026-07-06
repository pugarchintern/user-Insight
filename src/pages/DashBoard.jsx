import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import CleanerCard from "../components/CleanerCard";

export default function DashBoard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [apiLocations, setApiLocations] = useState([]);
  const [apiCompanies, setApiCompanies] = useState([]);
  const [apiCleaners, setApiCleaners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCleaner, setSelectedCleaner] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("https://daily-dash-backend-development.vercel.app/api/ai-insights/context").then((res) => res.json()),
      fetch("https://daily-dash-backend-development.vercel.app/api/ai-insights/locations").then((res) => res.json()),
      fetch("https://daily-dash-backend-development.vercel.app/api/ai-insights/companies").then((res) => res.json()),
      fetch("https://daily-dash-backend-development.vercel.app/api/ai-insights/cleaners").then((res) => res.json())
    ])
      .then(([contextData, locationsData, companiesData, cleanersData]) => {
        setDashboardData(contextData);
        setApiLocations(Array.isArray(locationsData) ? locationsData : locationsData?.locations || []);
        setApiCompanies(Array.isArray(companiesData) ? companiesData : companiesData?.companies || []);
        setApiCleaners(Array.isArray(cleanersData) ? cleanersData : cleanersData?.cleaners || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 font-mono">
            Loading Dashboard Context...
          </p>
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  const activities = dashboardData?.activities || [];

  // 1. Company options are populated from the original activity dataset
  const companyOptions = [
    "All",
    ...new Set(activities.map((a) => String(a.company_id)).filter(Boolean)),
  ];

  // Helper function to map Company ID to Name
  const getCompanyName = (companyId) => {
    if (companyId === "All") return "All Companies";
    const found = apiCompanies.find((c) => String(c.id || c.company_id) === String(companyId));
    return found ? found.name : `Company ${companyId}`;
  };

  // 2. Cascading: Location options dynamically filter based on Selected Company from API source
  const locationOptions = [
    "All",
    ...new Set(
      apiLocations
        .filter((loc) => selectedCompany === "All" || String(loc.company_id) === selectedCompany)
        .map((loc) => loc.name || loc)
        .filter(Boolean)
    ),
  ];

  // 3. Cascading: Cleaner options dynamically filter based on Selected Company AND Selected Location from API source
  const cleanerOptions = [
    "All",
    ...new Set(
      apiCleaners
        .filter((cleaner) => {
          // Filter cleaners down if they have associated company/location matching keys
          const matchesCompany = selectedCompany === "All" || String(cleaner.company_id) === selectedCompany;
          const matchesLocation = selectedLocation === "All" || cleaner.location?.name === selectedLocation || cleaner.location_name === selectedLocation;
          return matchesCompany && matchesLocation;
        })
        .map((cleaner) => cleaner.name || cleaner)
        .filter(Boolean)
    ),
  ];

  // 4. Combined Filtering: Applies Company, Location, Cleaner, and Start/End Date constraints
  const filteredActivities = activities.filter((activity) => {
    const matchesCompany =
      selectedCompany === "All" || String(activity.company_id) === selectedCompany;
    const matchesCleaner =
      selectedCleaner === "All" || activity.cleaner?.name === selectedCleaner;
    const matchesLocation =
      selectedLocation === "All" || activity.location?.name === selectedLocation;

    // Filter by start and end dates (inclusive of entire day bounds)
    let matchesDate = true;
    if (activity.created_at) {
      const activityTime = new Date(activity.created_at).getTime();
      if (startDate) {
        const startTime = new Date(startDate).setHours(0, 0, 0, 0);
        if (activityTime < startTime) matchesDate = false;
      }
      if (endDate) {
        const endTime = new Date(endDate).setHours(23, 59, 59, 999);
        if (activityTime > endTime) matchesDate = false;
      }
    } else {
      // Exclude records without date if a date filter is actively set
      if (startDate || endDate) matchesDate = false;
    }

    return matchesCompany && matchesCleaner && matchesLocation && matchesDate;
  });

  // 5. Reset All Filters
  const handleResetFilters = () => {
    setSelectedCompany("All");
    setSelectedCleaner("All");
    setSelectedLocation("All");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-6 md:p-8">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            <SparklesIcon className="w-8 h-8 text-indigo-600 shrink-0" />
            Washroom AI Insights
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Operational inspection intelligence overview
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-xs font-semibold text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Range:{" "}
          {summary.dateRange?.from
            ? new Date(summary.dateRange.from).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
            : "N/A"}{" "}
          -{" "}
          {summary.dateRange?.to
            ? new Date(summary.dateRange.to).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
            : "N/A"}
        </div>
      </header>

      <section className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
          <FunnelIcon className="w-4 h-4 text-slate-400" />
          Filter Options
        </div>

        <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
          
          {/* 1. Company Select Option (Displays names while handling ID mapping internally) */}
          <div className="flex flex-col min-w-[160px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setSelectedLocation("All"); // Cascades reset
                setSelectedCleaner("All");  // Cascades reset
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2 font-medium focus:outline-none focus:border-indigo-500 transition"
            >
              {companyOptions.map((opt, index) => (
                <option key={index} value={opt}>
                  {getCompanyName(opt)}
                </option>
              ))}
            </select>
          </div>
          
          {/* 2. Location Select Option (Resets cleaner on change) */}
          <div className="flex flex-col min-w-[180px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setSelectedCleaner("All"); // Cascades reset
              }}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2 font-medium focus:outline-none focus:border-indigo-500 transition"
            >
              {locationOptions.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt === "All" ? "All Locations" : opt}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Cleaner Select Option */}
          <div className="flex flex-col min-w-[160px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Cleaner
            </label>
            <select
              value={selectedCleaner}
              onChange={(e) => setSelectedCleaner(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2 font-medium focus:outline-none focus:border-indigo-500 transition"
            >
              {cleanerOptions.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt === "All" ? "All Cleaners" : opt}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Start Date Input */}
          <div className="flex flex-col min-w-[130px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-1.5 font-medium focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* 5. End Date Input */}
          <div className="flex flex-col min-w-[130px]">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-1.5 font-medium focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* 6. Dynamic Clear Filters Trigger */}
          {(selectedCompany !== "All" ||
            selectedCleaner !== "All" ||
            selectedLocation !== "All" ||
            startDate !== "" ||
            endDate !== "") && (
            <button
              onClick={handleResetFilters}
              className="self-end p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition border border-slate-200 border-dashed flex items-center justify-center h-[34px] w-[34px] cursor-pointer"
              title="Clear Filters"
            >
              <ArrowPathIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase">
            Inspection Entries ({filteredActivities.length})
          </h2>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 font-medium">
            No matching cleaner inspections found for your selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((item) => (
              <CleanerCard
                key={item.review_id}
                item={item}
                onViewReport={() =>
                  navigate(`/report/${item.review_id}`, {
                    state: { activity: item },
                  })
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

































