"use client";

import CMEProbabilityCard from "./cards/CMEProbabilityCard";
import SolarVisualizationCard from "./cards/SolarVisualizationCard";
import ArrivalPredictionCard from "./cards/ArrivalPredictionCard";
import AlertTimelineCard from "./cards/AlertTimelineCard";
import AgentCard from "./cards/AgentCard";
import MiniChart from "./charts/MiniChart";

import {
  agents,
  solarWindData,
  bzData,
  protonData,
} from "./data/mockData";

export default function MissionControl() {
  return (
    <div className="p-6 space-y-5">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Mission Control
        </h1>

        <p className="text-[#6a8aa8] text-sm mt-1">
          Real-time CME prediction & satellite protection — Aditya-L1 data stream
        </p>
      </div>

      {/* TOP ROW */}

      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-3">
          <CMEProbabilityCard />
        </div>

        <div className="col-span-4">
          <SolarVisualizationCard />
        </div>

        <div className="col-span-3">
          <ArrivalPredictionCard />
        </div>

        <div className="col-span-2 row-span-2">
          <AlertTimelineCard />
        </div>

      </div>

      {/* SECOND ROW */}

      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-4">
          <MiniChart
            label="Solar Wind Speed"
            unit="km/s"
            color="#38bdf8"
            data={solarWindData}
          />
        </div>

        <div className="col-span-4">
          <MiniChart
            label="Bz Component"
            unit="nT"
            color="#8b5cf6"
            data={bzData}
          />
        </div>

        <div className="col-span-4">
          <MiniChart
            label="Proton Density"
            unit="p/cm³"
            color="#f59e0b"
            data={protonData}
          />
        </div>

      </div>

      {/* AGENTS */}

      <div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-cyan-400 rounded-full" />

          <h2 className="text-white font-bold tracking-wider uppercase">
            Agent Status
          </h2>

          <span className="text-[#4a6f8f] text-xs">
            7 agents active
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
            />
          ))}
        </div>

      </div>

    </div>
  );
}