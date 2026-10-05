// src/data/projects.ts

export const projects = [
  {
    _id: "proj_01",
    index: "01",
    title: "High-Voltage Grid Substation",
    category: "Power Systems",
    year: "2024",
    client: "National Grid",
    image: "/images/power-grid.png", 
    description: "Complete load-flow analysis and digital twin simulation for a 220kV automated distribution substation featuring redundant protection relays.",
    fullDescription: "A comprehensive project involving the design, simulation, and implementation of a 220kV automated distribution substation. The primary objective was to ensure grid stability under varying load conditions while integrating redundant protection relays to prevent cascaded failures. The project required deep integration with SCADA systems for real-time telemetry.",
    gallery: [
      "/images/power-grid.png",
      "/frames/ezgif-frame-015.jpg",
      "/frames/ezgif-frame-030.jpg"
    ]
  },
  {
    _id: "proj_02",
    index: "02",
    title: "Embedded Microcontroller & PCB",
    category: "Hardware Engineering",
    year: "2023",
    client: "Industrial Tech",
    image: "/images/circuit.png",
    description: "Custom multi-layer PCB layout with ARM Cortex core for high-frequency telemetry and energy monitoring in severe environments.",
    fullDescription: "Designed and routed a 4-layer PCB for industrial IoT telemetry. The board features an ARM Cortex-M4 microcontroller, isolated analog inputs, and a robust power supply unit designed to withstand high electromagnetic interference (EMI) in heavy factory settings.",
    gallery: [
      "/images/circuit.png",
      "/frames/ezgif-frame-060.jpg"
    ]
  },
  {
    _id: "proj_03",
    index: "03",
    title: "Hybrid Solar-Wind Microgrid",
    category: "Renewable Energy",
    year: "2023",
    client: "Eco Systems",
    image: "/images/renewable.png",
    description: "Inverter control algorithm optimization and Battery Energy Storage System (BESS) sizing for off-grid industrial plants.",
    fullDescription: "Developed the core inverter control algorithms for a hybrid microgrid combining solar PV, wind turbines, and Li-ion BESS. The system was designed to autonomously manage load shedding, peak shaving, and seamless islanding transitions without power interruption.",
    gallery: [
      "/images/renewable.png",
      "/frames/ezgif-frame-110.jpg",
      "/frames/ezgif-frame-120.jpg"
    ]
  }
];