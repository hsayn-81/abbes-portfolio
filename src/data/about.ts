// src/data/about.ts

export const aboutData = {
  portraitImage: "/images/me.png", 
  email: "abbes.engineering@gmail.com",
  
  headlineMain: "SYSTEM",
  headlineAccent: "ARCHITECT.",
  bio: "With a seasoned eye for electrical precision, I transform complex engineering challenges into robust, intelligent energy systems and hardware prototypes.",
  
  buttons: {
    primary: "CHAT WITH ME",
    secondary: "PROJECTS" // 👈 Baddalna "START A PROJECT" b "PROJECTS"
  },

  stats: [
    { id: "stat_1", label: "SYSTEM RELIABILITY", value: 100, suffix: "%" },
    { id: "stat_2", label: "YEARS EXPERIENCE", value: 4, suffix: "+" },
  ],

  capabilities: [
    {
      id: "cap_1",
      title: "Power Systems Analysis",
      desc: "Short circuit analysis, relay coordination & ETAP load-flow modeling.",
    },
    {
      id: "cap_2",
      title: "Embedded Hardware",
      desc: "Multi-layer PCB routing, schematic capture & ARM Cortex firmware.",
    },
    {
      id: "cap_3",
      title: "Industrial Automation",
      desc: "Siemens S7 PLC programming, Ladder Logic, HMI & Modbus protocols.",
    },
    {
      id: "cap_4",
      title: "Renewable Integration",
      desc: "Solar PV inverter control, BESS algorithms & microgrid sizing.",
    }
  ]
};