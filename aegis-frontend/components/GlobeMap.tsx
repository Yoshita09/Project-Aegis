"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SatellitePoint {
  name: string;
  r: number;
  phi: number;
  theta: number;
  color: number;
  status: string;
  risk: number;
}

const SAT_DATA: SatellitePoint[] = [
  { name: "Aditya-L1",     r: 1.9,  phi: 0.3, theta: 0.5,   color: 0xf87171, status: "CRITICAL", risk: 88 },
  { name: "INSAT-3D",      r: 1.55, phi: 1.1, theta: 0.8,   color: 0xfbbf24, status: "WARNING",  risk: 78 },
  { name: "GOES-18",       r: 1.55, phi: 2.4, theta: -0.15, color: 0xfbbf24, status: "WARNING",  risk: 76 },
  { name: "GSAT-30",       r: 1.55, phi: 4.2, theta: 0.1,   color: 0xfbbf24, status: "WARNING",  risk: 72 },
  { name: "Cartosat-3",    r: 1.32, phi: 0.8, theta: 1.0,   color: 0xfacc15, status: "ELEVATED", risk: 59 },
  { name: "Starlink-5422", r: 1.28, phi: 2.0, theta: -0.8,  color: 0xfacc15, status: "ELEVATED", risk: 57 },
  { name: "Hubble",        r: 1.35, phi: 3.5, theta: 0.7,   color: 0xfacc15, status: "ELEVATED", risk: 55 },
  { name: "ISS",           r: 1.30, phi: 5.2, theta: -0.45, color: 0xfacc15, status: "ELEVATED", risk: 52 },
  { name: "Chandrayaan-3", r: 2.2,  phi: 1.6, theta: 0.2,   color: 0x34d399, status: "NOMINAL",  risk: 38 },
];

export default function GlobeMap() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const tooltipRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const tooltip   = tooltipRef.current;
    const container = containerRef.current;
    if (!canvas || !tooltip || !container) return;

    const W = container.clientWidth;
    const H = 360;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    camera.lookAt(0, 0, 0);

    /* ── Lighting ── */
    // Soft ambient so the dark side isn't pitch black
    scene.add(new THREE.AmbientLight(0x1a2a4a, 3.0));

    // Main light from top-right-front (mimics sun)
    const sun = new THREE.DirectionalLight(0x4488cc, 2.5);
    sun.position.set(4, 3, 4);
    scene.add(sun);

    // Rim light from the left to create edge glow
    const rim = new THREE.DirectionalLight(0x0055aa, 1.2);
    rim.position.set(-5, 1, -2);
    scene.add(rim);

    /* ── Earth wireframe globe ── */
    const RADIUS = 1.0;
    const globeGeo = new THREE.SphereGeometry(RADIUS, 36, 18);

    // Solid dark base so you can see depth
    const baseMat = new THREE.MeshPhongMaterial({
      color:             0x061428,
      emissive:          new THREE.Color(0x071830),
      emissiveIntensity: 0.6,
      shininess:         12,
      transparent:       false,
    });
    const baseSphere = new THREE.Mesh(globeGeo, baseMat);
    scene.add(baseSphere);

    // Wireframe lines on top — cyan-blue tint
    const wireGeo = new THREE.SphereGeometry(RADIUS + 0.002, 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color:       0x1e7abb,
      wireframe:   true,
      transparent: true,
      opacity:     0.55,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireSphere);

    /* ── Atmosphere glow (multiple shells) ── */
    const atmConfigs = [
      { r: 1.04, op: 0.10, color: 0x1a6fcc },
      { r: 1.09, op: 0.05, color: 0x0d4fa0 },
      { r: 1.16, op: 0.03, color: 0x083880 },
    ];
    atmConfigs.forEach(({ r, op, color }) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(r, 32, 32),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: op,
          side: THREE.BackSide,
          depthWrite: false,
        })
      );
      scene.add(m);
    });

    /* ── Equatorial orbit ring (the golden ellipse in the screenshot) ── */
    const buildRing = (
      radius: number,
      tiltX: number,
      tiltZ: number,
      color: number,
      opacity: number,
      segments = 180
    ) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const line = new THREE.Line(geo, mat);
      line.rotation.x = tiltX;
      line.rotation.z = tiltZ;
      scene.add(line);
      return line;
    };

    // Main equatorial ring — slight tilt for 3-D perspective feel
    buildRing(1.58, Math.PI * 0.08,  0,             0xc8922a, 0.70, 256);
    // Secondary orbit rings (faint)
    buildRing(1.35, -Math.PI * 0.15, Math.PI * 0.05, 0x2a4a7a, 0.30, 180);
    buildRing(1.80, Math.PI * 0.20,  0,              0x2a4a7a, 0.20, 180);

    /* ── Satellites ── */
    const satMeshes: THREE.Mesh[] = [];

    SAT_DATA.forEach((s) => {
      // Main dot
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.042, 16, 16),
        new THREE.MeshBasicMaterial({ color: s.color })
      );
      dot.userData = s;
      scene.add(dot);
      satMeshes.push(dot);

      // Soft glow halo
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 16, 16),
        new THREE.MeshBasicMaterial({
          color: s.color,
          transparent: true,
          opacity: 0.20,
          depthWrite: false,
        })
      );
      dot.add(halo);
    });

    /* ── Mouse / tooltip ── */
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2(-9999, -9999);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    const onMouseLeave = () => {
      mouse.set(-9999, -9999);
      tooltip.style.display = "none";
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    /* ── Animation loop ── */
    let t = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.005;

      // Rotate Earth (and wireframe together)
      baseSphere.rotation.y = t * 0.25;
      wireSphere.rotation.y = t * 0.25;

      // Orbit satellites
      satMeshes.forEach((mesh, i) => {
        const s     = SAT_DATA[i];
        const speed = s.r > 1.8 ? 0.10 : s.r > 1.5 ? 0.16 : 0.26;
        const angle = s.phi + t * speed;
        mesh.position.set(
          Math.cos(angle) * s.r,
          Math.sin(s.theta) * s.r * 0.3,
          Math.sin(angle) * s.r
        );
      });

      // Tooltip via raycasting
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(satMeshes);
      if (hits.length > 0) {
        const sat = hits[0].object as THREE.Mesh;
        const d   = sat.userData as SatellitePoint;
        const proj = sat.position.clone().project(camera);
        const rect = canvas.getBoundingClientRect();
        const px   = ((proj.x + 1) / 2) * rect.width;
        const py   = ((-proj.y + 1) / 2) * rect.height;

        const colHex =
          d.color === 0xf87171 ? "#f87171"
          : d.color === 0xfbbf24 || d.color === 0xfacc15 ? "#fbbf24"
          : "#34d399";

        tooltip.style.display = "block";
        tooltip.style.left    = `${px + 12}px`;
        tooltip.style.top     = `${py - 40}px`;
        tooltip.innerHTML = `<span style="color:${colHex};font-weight:600;">${d.name}</span><br/><span style="color:#64748b;font-size:10px;">Risk ${d.risk}% — ${d.status}</span>`;
      } else {
        tooltip.style.display = "none";
      }

      renderer.render(scene, camera);
    };

    animate();

    /* ── Resize ── */
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      renderer.setSize(w, H);
      camera.aspect = w / H;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      ro.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: 360 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        style={{
          position:    "absolute",
          display:     "none",
          pointerEvents: "none",
          zIndex:      10,
          background:  "rgba(4,10,22,0.93)",
          border:      "0.5px solid rgba(100,160,220,0.3)",
          borderRadius: 6,
          padding:     "6px 12px",
          color:       "#e2e8f0",
          fontSize:    12,
          lineHeight:  1.6,
          whiteSpace:  "nowrap",
        }}
      />
    </div>
  );
}