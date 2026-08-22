# 🛰️ AEGIS — AI Space Weather Threat Intelligence

<p align="center">
  <strong>Predict. Analyze. Protect.</strong><br/>
  An AI-powered command center for detecting and analyzing space-weather threats from solar and in-situ observations.
</p>

<p align="center">
  <a href="https://project-aegis-chi.vercel.app/">Live Demo</a> ·
  <a href="https://github.com/Yoshita09/Project-Aegis">Source Code</a>
</p>

---

## Overview

**AEGIS** is a full-stack space-weather intelligence platform built to turn heterogeneous solar observations into an operational threat picture.

The system combines three active inference agents — **VELC**, **SWIS**, and **MAG** — behind a FastAPI orchestration layer and presents the results through a Next.js mission-control interface. The backend exposes structured health, upload, and analysis APIs, while the frontend provides an interactive solar-monitoring experience with 3D visualization and dedicated intelligence views.

> **Important:** AEGIS is an experimental research/engineering system, not an operational space-weather warning service. Model outputs should be treated as decision-support signals and independently validated before any real-world use.

## Why AEGIS?

Space-weather observations arrive in different formats and capture different parts of the solar environment. AEGIS is designed around a **multi-agent approach**, allowing specialized models to analyze different evidence streams before their outputs are surfaced together.

The current implementation focuses on:

- **Solar imagery intelligence** from VELC observations
- **Solar-wind intelligence** from SWIS/ASPEX-style telemetry
- **Magnetic-field intelligence** from magnetometer observations
- Structured agent health and inference APIs
- An interactive web command center for monitoring and analysis

## System Architecture

```text
                         ┌─────────────────────────┐
                         │       AEGIS WEB UI      │
                         │ Next.js + TypeScript    │
                         │ Three.js / R3F / Charts │
                         └────────────┬────────────┘
                                      │ HTTP / JSON
                                      ▼
                         ┌─────────────────────────┐
                         │      FASTAPI CORE       │
                         │ Routing • CORS • Health │
                         │ Lifecycle • Errors      │
                         └────────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                ┌─────────────────┐      ┌─────────────────┐
                │  AGENT REGISTRY │      │ Payload / API   │
                │ Shared instances│      │ processing      │
                └────────┬────────┘      └─────────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           ┌──────┐   ┌──────┐   ┌──────┐
           │ VELC │   │ SWIS │   │ MAG  │
           │ ViT  │   │Temporal│  │Mag. │
           │      │   │ model │   │model│
           └──┬───┘   └──┬───┘   └──┬───┘
              └──────────┼──────────┘
                         ▼
                 Structured outputs
                 + confidence signals
                         │
                         ▼
              Dashboard / Intelligence Views
```

The backend maintains a central `AgentRegistry` so active agent instances are loaded once and reused by API routes rather than repeatedly loading model resources.

## Active AI Agents

### 1. VELC — Solar Vision Agent

The VELC agent processes FITS solar imagery using a customized **Vision Transformer (ViT-B/16)** pipeline.

The implementation normalizes the incoming image, converts it to three channels, resizes it to `224×224`, applies ImageNet normalization, and returns three interpretable signals:

- Coronal loop expansion
- Flux-rope deformation risk
- Pre-eruption signal strength

The model is loaded from a `.pth` state dictionary and runs in evaluation mode on the backend.

### 2. SWIS — Solar Wind Agent

The SWIS agent is responsible for extracting signal from solar-wind telemetry, providing a specialized view of plasma and solar-wind conditions within the AEGIS pipeline.

### 3. MAG — Magnetic Agent

The MAG agent analyzes magnetic-field observations to surface signatures relevant to magnetic stress, complexity, and possible solar eruptive activity.

### Agent Contract

All active agents follow a common abstraction through `BaseAgent`, which standardizes model lifecycle, prediction, loaded-state checks, health reporting, and inference error handling.

## Frontend

The web application is built with **Next.js, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Framer Motion, and Recharts**.

The public landing experience is designed as a mission-control entry point with:

- AEGIS command branding
- Interactive 3D solar visualization
- Mission/navigation links
- System-status indicator
- Dashboard launch flow
- Monitoring and agent-reasoning sections

### Live deployment

**https://project-aegis-chi.vercel.app/**

## Backend

The backend uses **FastAPI** with a lifespan hook that configures logging and loads all registered agents during application startup. It also includes CORS middleware and structured exception handling for both expected AEGIS errors and unexpected server failures.

### Backend stack

- Python
- FastAPI
- Pydantic
- PyTorch
- TorchVision
- NumPy
- Astropy
- FITS / scientific-data tooling
- Pandas / NetCDF / CDF tooling
- Loguru

The current dependency set is captured in `aegis-backend/requirements.txt`.

## Repository Structure

```text
Project-Aegis/
├── aegis-frontend/          # Next.js web application
│   ├── app/                 # App Router pages and layouts
│   ├── components/         # Reusable UI + 3D components
│   ├── lib/                # Frontend utilities
│   ├── hooks/              # React hooks
│   └── public/              # Static assets
│
├── aegis-backend/           # FastAPI inference service
│   ├── app/
│   │   ├── agents/          # VELC, SWIS, MAG + shared agent layer
│   │   ├── api/             # Versioned API routes
│   │   ├── core/             # Settings, logging, exceptions
│   │   └── schemas/          # Typed API / agent outputs
│   ├── requirements.txt
│   └── ...
│
├── .gitattributes
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- Python 3.10+
- Git

### 1. Clone

```bash
git clone https://github.com/Yoshita09/Project-Aegis.git
cd Project-Aegis
```

### 2. Start the backend

```bash
cd aegis-backend
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows
# .venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The FastAPI application exposes a root liveness endpoint and the versioned API router configured by the backend settings.

### 3. Start the frontend

```bash
cd aegis-frontend
npm install
npm run dev
```

The frontend provides `dev`, `build`, `start`, and `lint` scripts through Next.js.

Then open:

```text
http://localhost:3000
```

## API / Inference Flow

At a high level, an analysis request follows this pattern:

```text
Observation / Payload
        │
        ▼
   FastAPI endpoint
        │
        ▼
   Agent Registry
        │
        ├──► VELC inference
        ├──► SWIS inference
        └──► MAG inference
        │
        ▼
 Typed Pydantic outputs
        │
        ▼
 Frontend intelligence views
```

The shared agent abstraction requires concrete implementations to provide `load()`, `predict()`, and health reporting, keeping API-facing inference contracts consistent across agents.

## Design Principles

**Modular inference** — each data source gets a specialized agent rather than forcing every signal into one model.

**Typed outputs** — Pydantic schemas provide an explicit contract between model code and the API layer.

**Single agent lifecycle** — the registry owns active agent instances and loads them during application startup.

**Explainability-first UI** — surface individual evidence streams instead of presenting only one opaque score.

**Scientific humility** — predictions are probabilistic signals and should expose uncertainty, validation status, and provenance wherever possible.

## Current State

AEGIS currently has a working full-stack foundation with:

- A production-style Next.js frontend structure
- FastAPI backend with versioned routing
- Centralized active-agent registry
- Real VELC ViT inference implementation
- SWIS and MAG agent modules
- Typed schemas and structured error handling
- Interactive 3D / data-visualization UI

The codebase also contains forward-looking architecture for additional intelligence layers, but these should only be described as production capabilities once they are fully wired into the active runtime.

## Roadmap

### Near term

- [ ] Add explicit uncertainty intervals to every agent output
- [ ] Standardize confidence calibration across agents
- [ ] Add model/version metadata to inference responses
- [ ] Add automated backend + frontend tests
- [ ] Add API documentation examples for each analysis route
- [ ] Improve observability for model load/inference latency

### Intelligence layer

- [ ] Fuse VELC, SWIS, and MAG outputs into a calibrated threat score
- [ ] Add historical event retrieval with provenance
- [ ] Add CME arrival-time estimation
- [ ] Add infrastructure / satellite impact scoring
- [ ] Add event timeline and alert generation

### Data

- [ ] Integrate live Aditya-L1 feeds where licensing and availability permit
- [ ] Add robust scientific-data validation and schema versioning
- [ ] Build reproducible benchmark datasets and evaluation notebooks

## Limitations

AEGIS should not be interpreted as an operational forecasting authority. Space-weather prediction is inherently uncertain, and a model output without calibrated uncertainty, ground truth, and provenance can be misleading.

Before presenting AEGIS as an operational system, the project should establish:

1. Reproducible evaluation datasets
2. Clear train/validation/test separation
3. Calibration and uncertainty metrics
4. Baselines against established forecasting methods
5. Monitoring for data drift and model degradation
6. Versioned model artifacts and experiment tracking

## Contributing

Contributions are welcome, especially around model evaluation, scientific-data handling, UI/UX, testing, and observability.

```bash
git checkout -b feature/your-feature
# make changes
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Then open a pull request with a concise explanation of what changed, why it changed, how it was tested, and any model/data assumptions.

## Citation & Acknowledgement

AEGIS is an engineering/research platform exploring how multimodal AI systems can help interpret space-weather observations, with particular emphasis on the Aditya-L1 ecosystem and scientific telemetry workflows.

## License

Add the project's chosen license here before publishing AEGIS as an open-source project.

---

<p align="center">
  <strong>AEGIS</strong><br/>
  <sub>AI-powered space weather intelligence</sub>
</p>
