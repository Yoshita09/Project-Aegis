"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Loader2, FileArchive, Zap } from "lucide-react";
import { useAnalysis } from "../../context/AnalysisContext";
import Topbar from "@/components/Topbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadCardProps {
  label: string;
  tag: string;
  required?: boolean;
  uploaded: boolean;
  filename: string | null;
  onUpload: (file: File) => void;
  accept?: string;
  fileLabel?: string;
  children?: React.ReactNode;
}

interface VelcOutputProps {
  data: {
    coronal_loop_expansion: number;
    flux_rope_deformation_risk: number;
    pre_eruption_signal_strength: number;
  } | null;
}

interface SwisOutputProps {
  data: {
    plasma_instability: number;
    wind_anomaly: number;
  } | null;
}

interface MagOutputProps {
  data: {
    magnetic_stress: number;
    reconnection_probability: number;
  } | null;
}

// ─── Reusable Upload Card ─────────────────────────────────────────────────────

function UploadCard({
  label,
  tag,
  required = false,
  uploaded,
  filename,
  onUpload,
  accept = "*",
fileLabel = "FILE",
  children,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];

  if (!file) return;

  const acceptedFormats = accept
    .split(",")
    .map((f) => f.trim().toLowerCase());

  const valid = acceptedFormats.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!valid) {
    alert(`Invalid format. Accepted: ${accept}`);
    return;
  }

  onUpload(file);
  e.target.value = "";
}

  return (
    <div
      className={`rounded-xl border p-5 bg-slate-950/60 transition-all backdrop-blur-md ${
        uploaded ? "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "border-slate-800/80"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              uploaded ? "text-cyan-400 bg-cyan-400/10" : "text-slate-400 bg-slate-800"
            }`}>
              {tag}
            </span>
            {required && (
              <span className="text-xs text-red-400/90 font-semibold tracking-wider">
                REQUIRED
              </span>
            )}
          </div>
          <h3 className="text-white/90 font-medium mt-1.5 text-sm sm:text-base">{label}</h3>
        </div>

        {uploaded ? (
          <CheckCircle size={20} className="text-cyan-400 flex-shrink-0" />
        ) : (
          <FileArchive size={20} className="text-slate-500 flex-shrink-0" />
        )}
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all border ${
          uploaded
            ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.05)]"
            : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
        }`}
      >
        <Upload size={15} />
        {uploaded ? `Replace ${fileLabel}` : `Upload ${fileLabel}`}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />

      {filename && (
        <p className="text-xs text-slate-500 mt-2 truncate font-mono">
          📦 {filename}
        </p>
      )}

      {uploaded && children && (
        <div className="mt-4 border-t border-slate-800/80 pt-4 animate-in fade-in duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Dynamic Output Panel Components ─────────────────────────────────────────

function VelcOutput({ data }: VelcOutputProps) {
  const expansion = data?.coronal_loop_expansion ?? 0.00;
  const risk = data?.flux_rope_deformation_risk ?? 0.00;
  const strength = data?.pre_eruption_signal_strength ?? 0.00;

  return (
    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-3">
      <p className="text-xs font-mono font-bold text-cyan-400 mb-3 tracking-wider">
        VELC ANALYSIS OUTPUT
      </p>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Coronal Loop Expansion Rate</span>
          <span className="font-mono font-bold text-cyan-300">{expansion}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Flux Rope Deformation Risk</span>
          <span className="font-mono font-bold text-cyan-300">{risk}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Pre-Eruption Signal Strength</span>
          <span className="font-mono font-bold text-cyan-300">{strength}%</span>
        </div>
      </div>
    </div>
  );
}

function SwisOutput({ data }: SwisOutputProps) {
  const plasma = data
  ? (data.plasma_instability * 100).toFixed(2)
  : "0.00";

const wind = data
  ? (data.wind_anomaly * 100).toFixed(2)
  : "0.00";

  return (
    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-3">
      <p className="text-xs font-mono font-bold text-cyan-400 mb-3 tracking-wider">
        SWIS / ASPEX ANALYSIS OUTPUT
      </p>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Plasma Instability</span>
            <span className="font-mono font-bold text-cyan-300">{plasma}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${plasma}%` }} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Wind Anomaly</span>
            <span className="font-mono font-bold text-cyan-300">{wind}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${wind}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MagOutput({ data }: MagOutputProps) {
  const stress = data
    ? (data.magnetic_stress * 100).toFixed(2)
    : "0.00";

  const recon = data
    ? (data.reconnection_probability * 100).toFixed(2)
    : "0.00";
  return (
    <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-3">
      <p className="text-xs font-mono font-bold text-cyan-400 mb-3 tracking-wider">
        MAG ANALYSIS OUTPUT
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-900/50 border border-slate-800/40 rounded p-2 text-center">
          <span className="text-[10px] text-slate-500 block uppercase tracking-tight">Magnetic Stress</span>
          <span className="font-mono font-bold text-cyan-300 text-lg block mt-0.5">{stress}%</span>
        </div>
        <div className="bg-slate-900/50 border border-slate-800/40 rounded p-2 text-center">
          <span className="text-[10px] text-slate-500 block uppercase tracking-tight">Reconnection Prob.</span>
          <span className="font-mono font-bold text-cyan-300 text-lg block mt-0.5">{recon}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Data Input Page Component ───────────────────────────────────────────

export default function DataInputPage() {
  const router = useRouter();
  const {
    velcUploaded,
    swisUploaded,
    magUploaded,
    setVelcUploaded,
    setSwisUploaded,
    setMagUploaded,
    setAnalysisComplete,
    setAnalysisResults,
  } = useAnalysis();

  // Active state repositories to capture API response sets
  const [velcData, setVelcData] = useState<any>(null);
  const [swisData, setSwisData] = useState<any>(null);
  const [magData, setMagData] = useState<any>(null);

  const [velcName, setVelcName] = useState<string | null>(null);
  const [swisName, setSwisName] = useState<string | null>(null);
  const [magName, setMagName] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const isReadyToAnalyze = velcUploaded && swisUploaded && magUploaded;
  const [progress, setProgress] = useState(0);
const [activeAgent, setActiveAgent] = useState("VELC");
const [completedAgents, setCompletedAgents] = useState<string[]>([]);
const [status, setStatus] = useState("Initializing AI Pipeline...");

  async function uploadToBackend(file: File, agentType: "velc" | "swis" | "mag") {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
  `http://localhost:8000/api/v1/upload/${agentType}`,
  {
    method: "POST",
    body: formData,
  }
);
      if (!response.ok) throw new Error(`Server error code: ${response.status}`);
      const data = await response.json();

      if (agentType === "velc") { 
        setVelcUploaded(true); 
        setVelcName(data.file); 
        setVelcData(data.analysis_metrics); 
      }
      if (agentType === "swis") { 
        setSwisUploaded(true); 
        setSwisName(data.file); 
        setSwisData(data.analysis_metrics); 
      }
      if (agentType === "mag") { 
        setMagUploaded(true); 
        setMagName(data.file); 
        setMagData(data.analysis_metrics); 
      }

    } catch (err) {
      console.error(`Upload error for ${agentType}:`, err);
      alert(`Backend failure for channel ${agentType.toUpperCase()}. Check server logs.`);
    }
  }

  async function triggerAnalysis() {
  if (!isReadyToAnalyze) return;

  setIsAnalyzing(true);
  setProgress(0);
  setCompletedAgents([]);

  const steps = [
  {
    agent: "VELC",
    progress: 20,
    status: "Loading FITS telemetry..."
  },
  {
    agent: "SWIS",
    progress: 40,
    status: "Evaluating plasma instability..."
  },
  {
    agent: "MAG",
    progress: 60,
    status: "Computing magnetic stress vectors..."
  },
  {
    agent: "FUSION",
    progress: 80,
    status: "Correlating agent outputs..."
  },
  {
    agent: "PREDICTION",
    progress: 100,
    status: "Generating CME prediction..."
  }
];
  

  steps.forEach((step, index) => {
    setTimeout(() => {

      setActiveAgent(step.agent);
      setProgress(step.progress);
      setStatus(step.status);

      if (step.agent !== "FUSION") {
  setCompletedAgents((prev) =>
    prev.includes(step.agent)
      ? prev
      : [...prev, step.agent]
  );
}

    }, index * 1800);
  });

  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/analyze",
      {
        method: "POST",
      }
    );

    const resultData = await response.json();

    setTimeout(() => {
      setAnalysisResults(resultData);
      setAnalysisComplete(true);
      router.push("/solar-monitor");
    }, 5000);

  } catch (err) {
    console.error(err);
    setIsAnalyzing(false);
  }
}
  return (
  <div>
    <Topbar
      title="DATA INPUT"
      badge="TELEMETRY UPLOAD"
      badgeColor="cyan"
      subtitle="Upload telemetry payloads from ADITYA-L1 instruments for AI analysis"
    />

    <div className="space-y-8 p-6 max-w-7xl mx-auto text-slate-100">
    
      

      <div>
        <p className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase mb-4">Required Payloads</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UploadCard
  label="Visible Emission Line Coronagraph"
  tag="VELC"
  required
  accept=".fits,.fit"
  fileLabel="FITS"
  uploaded={velcUploaded}
  filename={velcName}
  onUpload={(f) => uploadToBackend(f, "velc")}
>
  <VelcOutput data={velcData} />
</UploadCard>

          <UploadCard
  label="Solar Wind Ion Spectrometer / ASPEX"
  tag="SWIS"
  required
  accept=".cdf"
  fileLabel="CDF"
  uploaded={swisUploaded}
  filename={swisName}
  onUpload={(f) => uploadToBackend(f, "swis")}
>
  <SwisOutput data={swisData} />
</UploadCard>

          <UploadCard
  label="Magnetometer"
  tag="MAG"
  required
  accept=".nc"
  fileLabel="NETCDF"
  uploaded={magUploaded}
  filename={magName}
  onUpload={(f) => uploadToBackend(f, "mag")}
>
  <MagOutput data={magData} />
</UploadCard>
        </div>
      </div>

      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-white font-medium text-base">Run Analysis</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isReadyToAnalyze 
              ? "All core telemetry matrix arrays synchronized successfully. Core compute agents are ready for telemetry synthesis."
              : "Upload VELC, SWIS, and MAG payloads to unlock central platform diagnostic pipelines."
            }
          </p>
          <div className="flex gap-4 mt-3">
            <span className={`text-[10px] font-mono flex items-center gap-1.5 ${velcUploaded ? "text-cyan-400" : "text-slate-600"}`}>
              ● VELC
            </span>
            <span className={`text-[10px] font-mono flex items-center gap-1.5 ${swisUploaded ? "text-cyan-400" : "text-slate-600"}`}>
              ● SWIS
            </span>
            <span className={`text-[10px] font-mono flex items-center gap-1.5 ${magUploaded ? "text-cyan-400" : "text-slate-600"}`}>
              ● MAG
            </span>
          </div>
        </div>

        <button
          onClick={triggerAnalysis}
          disabled={!isReadyToAnalyze || isAnalyzing}
          className={`px-6 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 min-w-[200px] justify-center ${
            isReadyToAnalyze && !isAnalyzing
              ? "bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/30"
              : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50 border border-slate-700/50"
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin text-slate-950" size={16} />
              <span className="text-slate-950 font-semibold">{loadingText}</span>
            </>
          ) : (
            <>
              <Zap size={16} />
              <span>Run Analysis</span>
            </>
          )}
        </button>
      </div>
      {isAnalyzing && (
  <div className="border border-cyan-500/20 bg-slate-950/70 rounded-xl p-6 space-y-5 backdrop-blur-md">

    {/* Progress Header */}
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-cyan-400 font-mono text-sm tracking-wider">
          AI PIPELINE EXECUTION
        </h3>
        <p className="text-slate-400 text-xs mt-1">
          Multi-Agent Solar Event Analysis Running...
        </p>
      </div>

      
    </div>

    {/* Progress Bar */}
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-cyan-500 transition-all duration-700"
        style={{ width: `${progress}%` }}
      />
    </div>

    {/* Active Agent */}
    <div className="grid md:grid-cols-2 gap-4">

      <div className="border border-slate-800 rounded-lg p-4">
        <p className="text-xs text-slate-500 mb-2">
          ACTIVE AGENT
        </p>

        <div className="flex items-center gap-2">
          <Loader2
            className="animate-spin text-cyan-400"
            size={16}
          />
          <span className="font-mono text-cyan-300">
            {activeAgent}
          </span>
        </div>
      </div>

      <div className="border border-slate-800 rounded-lg p-4">
        <p className="text-xs text-slate-500 mb-2">
          COMPLETED
        </p>

        <div className="flex gap-2 flex-wrap">
          {completedAgents.map((agent, index) => (
  <span
    key={`${agent}-${index}`}
              className="px-2 py-1 text-xs rounded bg-cyan-500/10 text-cyan-400"
            >
              {agent}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Terminal Log */}
    <div className="border border-slate-800 rounded-lg p-4 bg-black/40">
      <p className="text-green-400 font-mono text-sm">
        {status}
      </p>
    </div>

  </div>
)}
    </div>
  </div>
  );
}