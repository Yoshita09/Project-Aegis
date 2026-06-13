"use client";

import React, { createContext, useContext, useState } from "react";

// Structure matching the FastAPI /api/v1/analyze JSON response
interface AnalysisResults {
  status: string;
  agents: {
    velc: {
      coronal_loop_expansion: number;
      flux_rope_deformation_risk: number;
      pre_eruption_signal_strength: number;
    };
    swis: {
      plasma_instability: number;
      wind_anomaly: number;
    };
    mag: {
      magnetic_stress: number;
      reconnection_probability: number;
    };
  };
  derived_metrics: {
    cme_probability: number;
    reasoning: {
      velc: string;
      swis: string;
      mag: string;
    };
  };
}

interface AnalysisContextType {
  velcUploaded: boolean;
  swisUploaded: boolean;
  magUploaded: boolean;
  analysisComplete: boolean;
  analysisResults: AnalysisResults | null; // Added to store backend outputs
  setVelcUploaded: (v: boolean) => void;
  setSwisUploaded: (v: boolean) => void;
  setMagUploaded: (v: boolean) => void;
  setAnalysisComplete: (v: boolean) => void;
  setAnalysisResults: (results: AnalysisResults | null) => void; // Added modifier
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [velcUploaded, setVelcUploaded] = useState(false);
  const [swisUploaded, setSwisUploaded] = useState(false);
  const [magUploaded, setMagUploaded] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  return (
    <AnalysisContext.Provider
      value={{
        velcUploaded,
        swisUploaded,
        magUploaded,
        analysisComplete,
        analysisResults,
        setVelcUploaded,
        setSwisUploaded,
        setMagUploaded,
        setAnalysisComplete,
        setAnalysisResults,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
}