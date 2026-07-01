import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  Dna, 
  FileCheck, 
  CheckCircle, 
  Cpu, 
  Activity, 
  FlaskConical, 
  Flame, 
  User, 
  History, 
  Sliders, 
  Volume2, 
  Sparkles, 
  Fingerprint, 
  MapPin, 
  ArrowRight, 
  HelpCircle,
  Clock,
  Check,
  RotateCcw
} from "lucide-react";

import ParticleBackground from "./components/ParticleBackground";
import RadarChart from "./components/RadarChart";
import ChatConsultation from "./components/ChatConsultation";
import CostDonut from "./components/CostDonut";
import FreshnessTimeline from "./components/FreshnessTimeline";
import HolographicScanner from "./components/HolographicScanner";
import { SkinMetrics, Hotspot, SkincareIngredient, Recipe, DiagnosisReport, ScreenType } from "./types";

// Setup initial fallback report to show during initial state
const defaultDiagnosisReport: DiagnosisReport = {
  diagnosisTitle: "T区重度皮脂溢出伴随颊部屏障受损及局部微发炎",
  diagnosisDesc: "根据冷晶体感应雷达回馈，面部中轴线（额头、鼻翼T区）因皮脂腺高度活跃，溢出率达 baseline 峰值 +64.2%；与此同时，面部U区（双颊、下颌）的角质层脂质双分子层检测到结构疏松，导致锁水屏障功能减损（水分流失量升高），诱发微观炎症因子过度活跃，表现为弥漫性潮红与高度敏感。",
  metrics: {
    oil: 89,
    hydration: 32,
    sensitivity: 78,
    acne: 65,
    wrinkle: 24,
  },
  hotspots: [
    { name: "皮脂溢出过剩 (T区)", level: "极高", type: "oil", x: 50, y: 31 },
    { name: "脂质受损微发炎 (颊部)", level: "高", type: "inflammation", x: 38, y: 52 },
    { name: "屏障缺水干燥 (下颊)", level: "中", type: "inflammation", x: 64, y: 55 },
  ],
  recommendedRecipe: {
    base: "essence",
    efficacies: ["oil-control", "soothing", "hydrating"],
    ingredients: [
      { name: "2.0% 烟酰胺 (Niacinamide PC)", ratio: "2.0%", reason: "高纯度调节皮脂腺受体活性，显著抑制T区皮脂溢出，兼顾提亮与屏障修护。" },
      { name: "1.5% 积雪草苷 (Centella Glucoside)", ratio: "1.5%", reason: "高度靶向抗炎，促进真皮成纤维细胞合成，快速抚平U区红肿微炎症状。" },
      { name: "1.0% 三重神经酰胺复合体", ratio: "1.0%", reason: "密集补充双分子脂质间隙，快速封闭水分蒸发通道，强韧脆弱表皮屏障。" },
    ],
  },
};

const getBaseLabel = (base: string) => {
  switch (base) {
    case "water": return "水 (WATER)";
    case "essence": return "精华液 (Essence)";
    case "lotion": return "乳液 (LOTION)";
    case "oil": return "精华油 (OIL)";
    case "cleanser": return "洁面 (CLEANSER)";
    default: return base.toUpperCase();
  }
};

export default function App() {
  const [screen, setScreen] = useState<ScreenType>("START");
  const [report, setReport] = useState<DiagnosisReport>(defaultDiagnosisReport);
  const [recipe, setRecipe] = useState<Recipe>({
    base: "essence",
    efficacies: ["oil-control", "soothing", "hydrating"],
    ingredients: defaultDiagnosisReport.recommendedRecipe.ingredients,
    scent: "五月玫瑰",
    size: "30ml",
  });

  // Simulated Scanning state
  const [scanProgress, setScanProgress] = useState(0);
  const [poreSize, setPoreSize] = useState(0.24);
  const [hydrationMetric, setHydrationMetric] = useState(30.2);

  // Formulation Synthesis status
  const [isCompounding, setIsCompounding] = useState(false);
  const [compoundStep, setCompoundStep] = useState(0); // 0: Idle, 1: Mixing, 2: Complete

  // Address and delivery types
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("上海市浦东新区张江高科技园区博雅路45号3号楼研发中心");

  // Fetch AI Diagnosis report from server-side Gemini endpoint on start
  const triggerScan = async () => {
    setScreen("SCANNING");
    setScanProgress(0);
    setCompoundStep(0);

    // Fetch the customized Gemini analysis in the background
    try {
      const response = await fetch("/api/analyze", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        if (data && data.diagnosisTitle) {
          setReport(data);
          // Set recipe initially to recommended options
          setRecipe({
            base: data.recommendedRecipe.base,
            efficacies: data.recommendedRecipe.efficacies,
            ingredients: data.recommendedRecipe.ingredients,
            scent: "五月玫瑰",
            size: "30ml",
          });
        }
      }
    } catch (e) {
      console.error("AI scanning fetch failed, proceeding with high-fidelity local models:", e);
    }
  };

  // Ticker for scanning animation
  useEffect(() => {
    if (screen !== "SCANNING") return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScreen("DIAGNOSIS");
          }, 600);
          return 100;
        }
        // Random fluctuates for scanning numbers
        setPoreSize(Number((0.12 + Math.random() * 0.15).toFixed(2)));
        setHydrationMetric(Number((35 + Math.random() * 15).toFixed(1)));
        return prev + 1;
      });
    }, 45); // Ticks in ~4.5 seconds

    return () => clearInterval(interval);
  }, [screen]);

  // Scroll to top on screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);

  // Synthesis compound handler
  const handleCompound = () => {
    setIsCompounding(true);
    setCompoundStep(1);

    setTimeout(() => {
      setCompoundStep(2);
      setTimeout(() => {
        setIsCompounding(false);
        setCompoundStep(0);
        // Prompt custom success trigger
        alert(`【配方合成成功】已为您量身定做 ${recipe.size} 活性配方 [${getBaseLabel(recipe.base)}]，活性等级达 99.8% 峰值！`);
      }, 1500);
    }, 3000);
  };

  // Filter available target efficacies based on selected base
  const getEfficacyList = () => {
    const list = [
      { id: "hydrating", name: "保湿补水", icon: "💧" },
      { id: "firming", name: "紧致充盈", icon: "⚡" },
      { id: "soothing", name: "舒缓修护", icon: "🛡️" },
      { id: "oil-control", name: "控油净澈", icon: "✨" },
      { id: "acne", name: "控痘舒敏", icon: "🔥" },
      { id: "cleansing", name: "深层清洁", icon: "🧼" },
    ];

    if (recipe.base === "cleanser") {
      return list.filter((e) => e.id === "cleansing" || e.id === "oil-control");
    }
    if (recipe.base === "oil") {
      // Remove deep cleansing, acne soothing, and oil control
      return list.filter((e) => e.id !== "cleansing" && e.id !== "acne" && e.id !== "oil-control");
    }
    // water, essence, lotion: remove deep cleansing
    return list.filter((e) => e.id !== "cleansing");
  };

  const handleBaseChange = (base: Recipe["base"]) => {
    let baseEfficacies: string[] = ["hydrating"];
    if (base === "cleanser") baseEfficacies = ["cleansing"];
    else if (base === "essence") baseEfficacies = ["oil-control", "soothing"];

    // Update base and default ingredients
    setRecipe((prev) => ({
      ...prev,
      base,
      efficacies: baseEfficacies,
    }));
  };

  const handleEfficacyToggle = (effId: string) => {
    setRecipe((prev) => {
      const exist = prev.efficacies.includes(effId);
      let updated = [...prev.efficacies];
      if (exist) {
        if (updated.length > 1) {
          updated = updated.filter((id) => id !== effId);
        }
      } else {
        if (updated.length < 3) {
          updated.push(effId);
        } else {
          updated = [updated[1], updated[2], effId];
        }
      }
      return { ...prev, efficacies: updated };
    });
  };

  // Compute glowing color inside bottle depending on selected product base
  const getBottleLiquidColor = () => {
    switch (recipe.base) {
      case "water":
        return "from-cyan-400/50 to-blue-500/30";
      case "essence":
        return "from-[#00fbfb]/60 to-[#005f5f]/20";
      case "lotion":
        return "from-slate-100/40 to-cyan-100/10";
      case "oil":
        return "from-amber-400/50 to-yellow-600/20";
      case "cleanser":
        return "from-teal-300/40 to-emerald-500/20";
      default:
        return "from-[#00fbfb]/50 to-[#005f5f]/20";
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col no-scrollbar select-none pb-20 md:pb-6">
      {/* Immersive technical HUD canvas */}
      <ParticleBackground />

      {/* Header telemetry top-bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-primary-fixed/15 z-40 flex items-center justify-between px-6 shadow-[0_0_15px_rgba(0,251,251,0.08)]">
        <div 
          onClick={() => setScreen("START")}
          className="flex items-center gap-3 cursor-pointer active:scale-95 duration-150"
        >
          <FlaskConical className="text-primary-fixed w-6 h-6 animate-pulse" />
          <div>
            <span className="font-mono text-[9px] text-primary-fixed uppercase tracking-[0.25em] block leading-none mb-1">
              Phygital Biotech Laboratory
            </span>
            <h1 className="font-sans text-base font-bold text-primary tracking-wide">
              BIO-SCAN 系统 v1.0
            </h1>
          </div>
        </div>

        {/* Dynamic environmental conditions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
            <span className="font-mono text-[10px] text-on-surface-variant tracking-wider">
              BOOTH_04 ONLINE
            </span>
          </div>
          <div className="font-mono text-xs text-primary-fixed tracking-wider">
            24°C | 42% 相对湿度
          </div>
        </div>
      </header>

      {/* Main stage with responsive AnimatePresence */}
      <main className="flex-grow pt-24 px-4 sm:px-6 w-full max-w-7xl mx-auto flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* 1. START SCREEN */}
          {screen === "START" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="text-center mb-12">
                <span className="font-mono text-xs text-primary-fixed uppercase tracking-[0.3em] block mb-3 animate-pulse">
                  SYSTEM READY // DEVICE OPERATIONAL
                </span>
                <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-primary tracking-tight drop-shadow-[0_0_15px_rgba(0,251,251,0.25)]">
                  开启您的肌肤进化之旅
                </h2>
                <p className="font-sans text-sm text-on-surface-variant max-w-lg mx-auto mt-4 leading-relaxed">
                  本系统将通过AI提取分析面部数据，重构面部多维拓扑结构，靶向识别皮脂分泌率及脂质屏障受损度，为您调制高纯活性护肤配方。
                </p>
              </div>

              {/* Glowing Interactive Fingerprint Scanner */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Orbital Rotating HUD Rings */}
                <div className="absolute inset-0 border border-primary-fixed/10 rounded-full border-dashed hud-spin-slow" />
                <div className="absolute inset-4 border-2 border-primary-fixed/20 rounded-full border-dotted hud-spin-fast" />
                <div className="absolute inset-8 border border-primary-fixed/30 rounded-full border-dashed" style={{ borderLeftColor: "transparent", borderRightColor: "transparent" }} />
                
                {/* Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-full h-[0.5px] bg-primary-fixed" />
                  <div className="h-full w-[0.5px] bg-primary-fixed absolute" />
                </div>

                {/* Main Fingerprint Button */}
                <button
                  onClick={triggerScan}
                  className="w-48 h-48 rounded-full bg-surface-container-lowest/80 border border-primary-fixed/50 flex flex-col items-center justify-center gap-3 cursor-pointer relative group duration-300 shadow-[0_0_20px_rgba(0,251,251,0.1)] hover:border-primary-fixed hover:shadow-[0_0_40px_rgba(0,251,251,0.35)] pulse-glow"
                >
                  <Fingerprint className="w-16 h-16 text-primary-fixed group-hover:scale-110 duration-300" />
                  <span className="font-mono text-[10px] text-primary-fixed uppercase tracking-widest font-bold whitespace-nowrap">
                    [ 开始 AI 皮肤分析 ]
                  </span>
                </button>
              </div>

              <div className="mt-8 flex items-center gap-2 font-mono text-xs text-on-surface-variant tracking-wider">
                <Clock className="w-4 h-4 text-outline" />
                等待目标皮肤接触传感器
              </div>
            </motion.div>
          )}

          {/* 2. SCANNING SCREEN */}
          {screen === "SCANNING" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="relative w-full max-w-2xl h-[420px] flex items-center justify-center mb-8 border border-primary-fixed/10 bg-surface-container-lowest/40 rounded-lg overflow-hidden glass-panel">
                
                {/* Holographic Interactive Scanner */}
                <div className="w-80 h-96 relative z-10">
                  <HolographicScanner isScanning={true} showHotspots={false} progress={scanProgress} />
                </div>

                {/* Real-time fluctuating sidebar stats */}
                <div className="absolute left-6 top-8 flex flex-col gap-1 w-36 glass-panel p-3 rounded border-l-4 border-l-primary-fixed">
                  <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">毛孔状态 (PORE)</span>
                  <span className="font-mono text-lg font-bold text-primary-fixed tracking-wide">
                    {poreSize} <span className="text-xs font-normal">μm</span>
                  </span>
                  <div className="w-full bg-outline-variant/20 h-1 mt-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary-fixed h-full" 
                      style={{ width: `${Math.min(100, (poreSize / 0.5) * 100)}%` }} 
                    />
                  </div>
                </div>

                <div className="absolute right-6 bottom-8 flex flex-col gap-1 w-36 glass-panel p-3 rounded border-r-4 border-r-secondary-fixed">
                  <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">锁水量 (HYDRATION)</span>
                  <span className="font-mono text-lg font-bold text-secondary-fixed tracking-wide">
                    {hydrationMetric} <span className="text-xs font-normal">%</span>
                  </span>
                  <div className="w-full bg-outline-variant/20 h-1 mt-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-secondary-fixed h-full" 
                      style={{ width: `${hydrationMetric}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Progress Bar */}
              <div className="w-full max-w-md text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-full mb-3 alert-pulse-glow">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
                  <span className="font-mono text-[9px] text-secondary-fixed tracking-widest font-bold uppercase">
                    Scan Active
                  </span>
                </div>
                <h3 className="font-sans text-lg font-bold text-primary-fixed mb-1 tracking-wider">
                  正在进行微观多维拓扑分析...
                </h3>
                <span className="font-mono text-xs text-on-surface-variant tracking-wider">
                  PROGRESS: {scanProgress}% // BATCH: XF-9942
                </span>

                <div className="w-full h-1 bg-outline-variant/20 rounded-full overflow-hidden mt-4 border border-outline-variant/10">
                  <div 
                    className="h-full bg-primary-fixed duration-75 transition-all"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. DIAGNOSIS SCREEN */}
          {screen === "DIAGNOSIS" && (
            <motion.div
              key="diagnosis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="py-4 flex flex-col gap-6"
            >
              {/* Back breadcrumbs header */}
              <div className="flex flex-wrap justify-between items-center bg-surface-container-low border border-outline-variant/30 px-4 py-2.5 rounded gap-4">
                <div className="flex items-center gap-4 font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-secondary-fixed pulse-glow" />
                    系统在线
                  </span>
                  <span>/</span>
                  <span>诊断批次ID: 8842-AX</span>
                  <span>/</span>
                  <span className="text-primary-fixed">分析结果已就绪</span>
                </div>
                <button 
                  onClick={() => setScreen("START")}
                  className="font-mono text-xs text-primary-fixed border-b border-primary-fixed/30 hover:border-primary-fixed pb-0.5"
                >
                  重新扫描 RESET
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Area: Topological Face Heatmap */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="glass-panel corner-brackets rounded-lg p-4 flex flex-col min-h-[380px] overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-sans text-sm font-semibold text-primary">面部拓扑模型 (Thermal Mapping)</h3>
                      <span className="font-mono text-[9px] border border-primary-fixed/40 px-1.5 py-0.5 rounded text-primary-fixed uppercase tracking-wider">
                        HEATMAP
                      </span>
                    </div>

                    <div className="relative flex-grow flex items-center justify-center bg-surface-container-lowest/50 border border-outline-variant/20 rounded overflow-hidden min-h-[340px]">
                      {/* Holographic Interactive Diagnostic Scan */}
                      <div className="absolute inset-0 w-full h-full">
                        <HolographicScanner isScanning={false} showHotspots={true} hotspots={report.hotspots} progress={100} />
                      </div>
                      {/* Interactive Diagnostic hotspot bubbles */}
                      {report.hotspots.map((h, i) => (
                        <div
                          key={i}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-default group"
                          style={{ left: `${h.x}%`, top: `${h.y}%` }}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border-2 border-dashed relative flex items-center justify-center ${
                            h.type === "oil" 
                              ? "bg-tertiary-fixed-dim/20 border-tertiary-fixed-dim alert-pulse-glow" 
                              : "bg-error/20 border-error alert-pulse-glow"
                          }`}>
                            {/* Line connector */}
                            <div className={`absolute top-0 w-12 h-px transform origin-left opacity-60 ${
                              i % 2 === 0 ? "left-3 rotate-12" : "right-3 -rotate-12"
                            } ${h.type === "oil" ? "bg-tertiary-fixed-dim" : "bg-error"}`} />
                          </div>

                          {/* Hover/Pulsing detail box */}
                          <div className={`absolute top-[-10px] bg-surface/90 border rounded p-1.5 shadow-xl select-none z-30 transition-all ${
                            i % 2 === 0 ? "left-14" : "right-14"
                          } ${h.type === "oil" ? "border-tertiary-fixed-dim/45" : "border-error/45"}`}>
                            <span className={`text-[10px] block whitespace-nowrap font-medium ${
                              h.type === "oil" ? "text-tertiary-fixed-dim" : "text-error"
                            }`}>
                              {h.name}
                            </span>
                            <span className="font-mono text-[8px] opacity-65 block mt-0.5">
                              STATUS: {h.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Heatmap Legend */}
                    <div className="mt-4 flex flex-wrap justify-center gap-4 font-mono text-[10px] text-on-surface-variant">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim" />
                        油脂溢出 (T区)
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-error" />
                        屏障微发炎
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed/20 border border-primary-fixed" />
                        角质健康区
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Area: Radar Metrics Chart */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="glass-panel corner-brackets rounded-lg p-4 flex flex-col justify-center items-center min-h-[380px]">
                    <div className="w-full flex justify-between items-center mb-2">
                      <h3 className="font-sans text-sm font-semibold text-primary">生物识别雷达</h3>
                      <Activity className="text-primary-fixed w-4 h-4" />
                    </div>

                    <RadarChart metrics={report.metrics} />

                    <div className="w-full grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-3 mt-2 font-mono text-xs">
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant opacity-65">水分指数</span>
                        <span className="text-sm font-bold text-primary-fixed">{report.metrics.hydration}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant opacity-65">出油指数</span>
                        <span className="text-sm font-bold text-tertiary-fixed-dim">{report.metrics.oil}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Area: Diagnosis & Call To Action */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <div className="glass-panel rounded-lg p-5 border-l-4 border-l-error flex flex-col justify-between min-h-[380px]">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-error tracking-[0.2em] block mb-2 uppercase animate-pulse">
                        最终细胞诊断报告
                      </span>
                      <h3 className="font-sans text-xl font-bold text-primary mb-3 uppercase leading-tight tracking-tight">
                        {report.diagnosisTitle}
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant leading-relaxed text-justify mb-4">
                        {report.diagnosisDesc}
                      </p>
                    </div>

                    <button
                      onClick={() => setScreen("CUSTOMIZE")}
                      className="btn-cyber w-full py-3.5 rounded font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(0,251,251,0.1)]"
                    >
                      <span>定制专属配方 FORMULATE</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Consultation Module below */}
              <div className="grid grid-cols-1 gap-6">
                <ChatConsultation 
                  currentDiagnosis={report}
                  currentRecipe={recipe}
                  onUpdateIngredients={(newIngredients) => {
                    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* 4. CUSTOMIZATION SCREEN */}
          {screen === "CUSTOMIZE" && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="py-4 flex flex-col gap-6"
            >
              {/* Back breadcrumbs header */}
              <div className="flex justify-between items-center bg-surface-container-low border border-outline-variant/30 px-4 py-2.5 rounded">
                <div className="flex items-center gap-3 font-mono text-xs text-on-surface-variant tracking-wider">
                  <button onClick={() => setScreen("DIAGNOSIS")} className="hover:text-primary-fixed">
                    &larr; 返回报告
                  </button>
                  <span>/</span>
                  <span className="text-primary-fixed uppercase font-bold">配方精密调和面板</span>
                </div>
                <div className="font-mono text-xs text-on-surface-variant">
                  BATCH CODE: <span className="text-primary-fixed">XF-9942</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Column: Product Visualizer & Base config (lg:col-span-5) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Bottle Render Card */}
                  <div className="glass-panel corner-brackets rounded-lg p-6 flex flex-col items-center justify-center h-[340px] relative">
                    <div className="relative w-48 h-full flex items-center justify-center">
                      
                      {/* Interactive glowing serum bottle */}
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo5dlBPxEKC76Yx2Bbdh7l3TfI4nadHJRoqctaDcfDMPBCp5sxUeA8NoCpuRmB0sGSbcoSlq7yW5yLHpO8a0M96ICx2c-2yjOYg5EMgiPXVTLXgGD7SeK3HdNoWXCYt6XheyTv4gf9CklPEj1usBmNXWVX77CNLKNBdqwMQlpgNjqsDXg7LYqkRWkUliGgOAJVsJIeM1D1YKLKpUBFPXzqOpgpASP7HJYFNajxC2-9skljcx-kjWMAgNi5mRlCq4tISftaIOvM0HY"
                        alt="Glowing Customized Serum"
                        className="max-h-full max-w-full object-contain filter brightness-110 drop-shadow-[0_0_25px_rgba(0,251,251,0.55)] z-10 transition-transform duration-700 hover:scale-[1.03]"
                      />

                      {/* Dynamic glowing backdrop (changes color matching base) */}
                      <div className={`absolute w-36 h-36 rounded-full blur-3xl opacity-35 bg-gradient-to-tr ${getBottleLiquidColor()} z-0 animate-pulse`} />
                    </div>

                    {/* Quick Specs HUD Label overlay */}
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono text-[9px] text-on-surface-variant">
                      <span>TYPE 剂型: {getBaseLabel(recipe.base)}</span>
                      <span>VOL 容量: {recipe.size}</span>
                      <span>SCENT 气味: {recipe.scent}</span>
                    </div>
                  </div>

                  {/* Active Ingredients Lists */}
                  <div className="glass-panel rounded-lg p-5">
                    <h3 className="font-mono text-xs text-primary-fixed uppercase tracking-wider mb-4">
                      配方构成 (ACTIVE PRESCRIPTION)
                    </h3>
                    <div className="space-y-4">
                      {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} className="border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-sans text-xs font-bold text-primary">{ing.name}</span>
                            <span className="font-mono text-xs font-bold text-secondary-fixed">{ing.ratio}</span>
                          </div>
                          <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed">
                            {ing.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Controls (lg:col-span-7) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Detailed Settings Panel */}
                  <div className="glass-panel rounded-lg p-6 flex flex-col gap-6">
                    
                    {/* 1. Product Base */}
                    <div>
                      <h4 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-3">
                        1. 选择产品基底 (PRODUCT BASE)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {[
                          { id: "water", name: "水 (Water)", icon: "💧" },
                          { id: "essence", name: "精华液 (Essence)", icon: "🧪" },
                          { id: "lotion", name: "乳液 (Lotion)", icon: "🧴" },
                          { id: "oil", name: "精华油 (Oil)", icon: "🥥" },
                          { id: "cleanser", name: "洁面 (Cleanser)", icon: "🧼" },
                        ].map((b) => (
                          <button
                            key={b.id}
                            onClick={() => handleBaseChange(b.id as any)}
                            className={`py-3 px-1.5 rounded font-mono text-[11px] flex flex-col items-center justify-center gap-1.5 transition-all ${
                              recipe.base === b.id
                                ? "bg-primary-fixed/20 border border-primary-fixed text-primary-fixed shadow-[inset_0_0_10px_rgba(0,251,251,0.15)]"
                                : "bg-surface-container-lowest/50 border border-outline-variant/30 text-on-surface hover:border-primary-fixed/50"
                            }`}
                          >
                            <span className="text-sm">{b.icon}</span>
                            <span className="text-[10px] truncate w-full text-center">{b.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Target Efficacy */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                          2. 目标功效配置 (TARGET EFFICACY)
                        </h4>
                        <span className="font-mono text-[9px] text-primary-fixed opacity-75">
                          最多可选3项 (MAX 3)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {getEfficacyList().map((e) => {
                          const isSelected = recipe.efficacies.includes(e.id);
                          return (
                            <button
                              key={e.id}
                              onClick={() => handleEfficacyToggle(e.id)}
                              className={`py-2.5 px-3 rounded font-sans text-xs flex items-center justify-center gap-2 transition-all ${
                                isSelected
                                  ? "bg-primary-fixed text-on-primary-fixed font-bold shadow-[0_0_12px_rgba(0,251,251,0.3)]"
                                  : "bg-surface-container-lowest/50 border border-outline-variant/30 text-on-surface hover:border-primary-fixed/40"
                              }`}
                            >
                              <span>{e.icon}</span>
                              <span>{e.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Specs: Volume & Scent */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div>
                        <h4 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-3">
                          3. 容量选择 (VOLUME)
                        </h4>
                        <div className="flex gap-3">
                          {["30ml", "60ml"].map((size) => (
                            <button
                              key={size}
                              onClick={() => setRecipe((prev) => ({ ...prev, size: size as any }))}
                              className={`flex-1 py-2.5 rounded font-mono text-xs transition-all ${
                                recipe.size === size
                                  ? "bg-primary-fixed/20 border border-primary-fixed text-primary-fixed"
                                  : "bg-surface-container-lowest/50 border border-outline-variant/30 text-on-surface hover:opacity-100 opacity-60"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-3">
                          4. 气味偏好 (SCENT)
                        </h4>
                        <select
                          value={recipe.scent}
                          onChange={(e) => setRecipe((prev) => ({ ...prev, scent: e.target.value }))}
                          className="w-full py-2.5 px-3 rounded bg-surface-container-lowest/80 border border-outline-variant/30 text-xs font-sans text-on-surface focus:outline-none focus:border-primary-fixed transition-all"
                        >
                          {["五月玫瑰", "雪顶樱桃", "云绒荔枝", "奶盖乌龙", "晨雾铃兰"].map((sc) => (
                            <option key={sc} value={sc}>
                              🌸 {sc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Cost breakdown & Timeline (Transparency section) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <div className="glass-panel rounded-lg p-5">
                      <CostDonut />
                    </div>
                    <div className="glass-panel rounded-lg p-5">
                      <FreshnessTimeline />
                    </div>
                  </div>

                  {/* Delivery & compound CTA panel */}
                  <div className="glass-panel rounded-lg p-5 border-l-4 border-l-secondary-fixed flex flex-col gap-4">
                    <h3 className="font-mono text-xs text-secondary-fixed uppercase tracking-wider">
                      取货方式 (DELIVERY / PICKUP INTERFACE)
                    </h3>
                    
                    {/* Toggle Pickup vs Delivery */}
                    <div className="flex bg-surface-container-lowest/60 rounded p-1 w-full relative border border-outline-variant/30">
                      <button
                        onClick={() => setDeliveryType("pickup")}
                        className={`flex-1 py-2 text-center font-mono text-xs transition-all rounded ${
                          deliveryType === "pickup"
                            ? "bg-primary-fixed/25 border border-primary-fixed/50 text-primary-fixed font-bold"
                            : "text-on-surface-variant hover:text-white"
                        }`}
                      >
                        立即取货 (IN-BOOTH PICKUP)
                      </button>
                      <button
                        onClick={() => setDeliveryType("delivery")}
                        className={`flex-1 py-2 text-center font-mono text-xs transition-all rounded ${
                          deliveryType === "delivery"
                            ? "bg-primary-fixed/25 border border-primary-fixed/50 text-primary-fixed font-bold"
                            : "text-on-surface-variant hover:text-white"
                        }`}
                      >
                        冷链配送 (COLD DELIVERY)
                      </button>
                    </div>

                    {deliveryType === "delivery" ? (
                      <div className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                          收货地址
                        </span>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="cyber-input w-full pl-9 pr-3 py-2 text-xs rounded bg-surface-container-lowest"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        配方将在AI制作舱中现配，约需 <strong>3分钟</strong>。合成后可直接在窗口取走鲜配。
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant/30 pt-3 mt-1">
                      <div className="font-sans text-xs text-on-surface-variant">
                        {deliveryType === "delivery" ? "冷链直达：预计24小时内送达" : "舱内制作：预计3分钟后在窗口取货"}
                      </div>
                      
                      <button
                        onClick={handleCompound}
                        disabled={isCompounding}
                        className="btn-cyber px-6 py-2.5 rounded font-mono text-xs font-bold tracking-widest flex items-center gap-2"
                      >
                        <span>{isCompounding ? "配方合成中..." : "启动合成协议 START"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Secondary Link to Subscriptions */}
                  <div className="text-center mt-2">
                    <button
                      onClick={() => setScreen("SUBSCRIBE")}
                      className="font-mono text-xs text-outline hover:text-primary-fixed hover:border-b hover:border-primary-fixed/40 transition-all uppercase tracking-widest"
                    >
                      [ 开启您的肌肤进化计划 / 订阅 PRO AI ]
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. SUBSCRIBE SCREEN */}
          {screen === "SUBSCRIBE" && (
            <motion.div
              key="subscribe"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <div className="text-center mb-8">
                <h2 className="font-sans text-3xl font-extrabold text-primary tracking-tight">开启您的肌肤进化之旅</h2>
                <p className="font-mono text-xs text-primary-fixed uppercase tracking-widest mt-2 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-secondary-fixed rounded-full mr-2 animate-pulse" />
                  A.I. 诊断路径已激活 // PRESCRIPTION GRANTED
                </p>
              </div>

              {/* Premium Membership Card styled exactly like mockup */}
              <section className="glass-card holographic-border rounded-xl p-6 sm:p-8 w-full max-w-lg flex flex-col items-center shadow-[0_0_35px_rgba(0,251,251,0.08)] mb-6 relative">
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-primary-fixed/80 rounded-tl" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-primary-fixed/80 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-primary-fixed/80 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-primary-fixed/80 rounded-br" />

                <div className="mb-6 flex items-center justify-center w-full">
                  <div className="bg-primary-fixed/10 border border-primary-fixed/40 rounded-full px-5 py-1.5 flex items-center shadow-[0_0_15px_rgba(0,251,251,0.15)]">
                    <Cpu className="text-primary-fixed mr-2 w-4 h-4 animate-spin" style={{ animationDuration: "10s" }} />
                    <h3 className="font-mono text-xs text-primary-fixed tracking-widest uppercase font-bold">
                      PRO AI 核心进化计划
                    </h3>
                  </div>
                </div>

                <div className="text-center mb-6 w-full pb-6 border-b border-primary-fixed/15">
                  <div className="font-sans text-5xl font-extrabold text-primary mb-2 flex items-baseline justify-center">
                    <span className="text-2xl mr-1 text-primary-fixed font-mono font-normal">¥</span>
                    399
                    <span className="font-mono text-xs text-on-surface-variant ml-2 uppercase tracking-widest">/ 月</span>
                  </div>
                  <div className="font-mono text-[10px] text-secondary-fixed flex items-center justify-center gap-2 tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
                    核心配方数据库无限访问权限
                  </div>
                </div>

                <ul className="space-y-4 w-full mb-8">
                  <li className="flex items-start text-primary">
                    <CheckCircle className="text-primary-fixed mr-3 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-sans text-sm font-semibold text-primary">每月 AI 动态量化调整</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">根据您的生活环境（温湿度、紫外线）与肌肤变化，按季自动微调配方比例。</div>
                    </div>
                  </li>
                  <li className="flex items-start text-primary">
                    <CheckCircle className="text-primary-fixed mr-3 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-sans text-sm font-semibold text-primary">实验室鲜配冷链配送</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">主厨级实验室无菌全自动现调现配，专业冷链24小时送达，保证活性成分最高能。</div>
                    </div>
                  </li>
                  <li className="flex items-start text-primary">
                    <CheckCircle className="text-primary-fixed mr-3 w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-sans text-sm font-semibold text-primary">模块化配方升级路径</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">随附抗衰老、抗氧化、细胞新生等高级生物功能模组，按需即插即用升级。</div>
                    </div>
                  </li>
                </ul>

                <button 
                  onClick={() => alert("【月度计划激活成功】欢迎加入 PRO AI 核心计划。系统已成功绑定您的肌肤数据，首期进化鲜配已生成。")}
                  className="btn-cyber w-full py-4 px-6 rounded font-mono text-xs font-bold tracking-[0.2em] uppercase bg-surface-container-lowest/50"
                >
                  [ 激活月度进化计划 ]
                </button>
              </section>

              {/* Loyalty Upgrades privilege boxes */}
              <section className="w-full max-w-lg mb-8">
                <h4 className="font-mono text-xs text-outline tracking-widest uppercase mb-4 pl-2 border-l-2 border-primary-fixed/50">
                  进化特权 // EXCLUSIVE PRIVILEGES
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low border border-outline-variant/30 rounded p-4 flex flex-col items-center text-center">
                    <Sparkles className="text-secondary-fixed mb-2 w-6 h-6" />
                    <span className="font-sans text-xs font-semibold text-primary mb-1">积分倍增</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">1.5X 皮肤数据积分</span>
                  </div>
                  <div className="bg-surface-container-low border border-outline-variant/30 rounded p-4 flex flex-col items-center text-center">
                    <Dna className="text-tertiary-fixed mb-2 w-6 h-6" />
                    <span className="font-sans text-xs font-semibold text-primary mb-1">分子内测资格</span>
                    <span className="font-mono text-[9px] text-on-surface-variant">抢先优先体验新研制分子</span>
                  </div>
                </div>
              </section>

              <button
                onClick={() => setScreen("START")}
                className="font-mono text-xs text-outline hover:text-primary-fixed transition-colors uppercase tracking-widest border-b border-transparent hover:border-primary-fixed pb-0.5 whitespace-nowrap"
              >
                暂不升级，返回开始测试
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Synthesis compiling modal / high-pressure compounding overlay */}
      <AnimatePresence>
        {isCompounding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#080c22]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              {/* Compounding Orbital animations */}
              <div className="absolute inset-0 border-2 border-dashed border-primary-fixed/30 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-4 border border-dotted border-secondary-fixed/50 rounded-full animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
              <FlaskConical className="w-16 h-16 text-primary-fixed animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed/10 border border-primary-fixed/30 rounded-full mb-3 alert-pulse-glow">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-fixed" />
              <span className="font-mono text-[9px] text-primary-fixed tracking-widest font-bold uppercase">
                COMPOUNDING IN PROGRESS
              </span>
            </div>

            <h3 className="font-sans text-lg font-bold text-primary mb-2">
              {compoundStep === 1 ? "配方无菌全自动制作中..." : "合成指令完全激活！"}
            </h3>
            <p className="font-mono text-xs text-on-surface-variant max-w-sm tracking-wide">
              {compoundStep === 1 
                ? `[99.8% 活性融合] 正在根据本次多维分析结果，将活性烟酰胺与积雪草多肽注入 [${getBaseLabel(recipe.base)}] 脂质基底。`
                : "配方纯度检验完成。活性成分稳定闭锁。正在注入封装包材..."
              }
            </p>

            <div className="w-64 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden mt-6 border border-outline-variant/10">
              <div 
                className={`h-full bg-primary-fixed transition-all ease-out duration-1000 ${
                  compoundStep === 2 ? "w-full" : "w-[65%]"
                }`} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Kiosk Navigation Tabs (Desktop Floating Rail or Mobile Dock) */}
      <nav className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bg-surface/90 sm:bg-surface/80 backdrop-blur-xl border-t sm:border border-primary-fixed/15 z-40 flex items-center justify-around sm:justify-center gap-2 sm:gap-6 px-4 py-3 sm:py-2.5 sm:rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setScreen("START")}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-1.5 rounded-full text-center transition-all cursor-pointer ${
            screen === "START" || screen === "SCANNING"
              ? "text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/40 shadow-[0_0_10px_rgba(0,251,251,0.2)]"
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          <Cpu className="w-4 h-4 shrink-0" />
          <span className="font-mono text-[9px] sm:text-xs tracking-wider whitespace-nowrap">开始测试 START</span>
        </button>

        <button
          onClick={() => {
            if (screen === "START") {
              triggerScan();
            } else {
              setScreen("DIAGNOSIS");
            }
          }}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-1.5 rounded-full text-center transition-all cursor-pointer ${
            screen === "DIAGNOSIS"
              ? "text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/40 shadow-[0_0_10px_rgba(0,251,251,0.2)]"
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" />
          <span className="font-mono text-[9px] sm:text-xs tracking-wider whitespace-nowrap">皮肤分析 REPORT</span>
        </button>

        <button
          onClick={() => {
            setScreen("CUSTOMIZE");
          }}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-1.5 rounded-full text-center transition-all cursor-pointer ${
            screen === "CUSTOMIZE"
              ? "text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/40 shadow-[0_0_10px_rgba(0,251,251,0.2)]"
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4 shrink-0" />
          <span className="font-mono text-[9px] sm:text-xs tracking-wider whitespace-nowrap">配方设计 PRESCRIPTION</span>
        </button>

        <button
          onClick={() => setScreen("SUBSCRIBE")}
          className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-1.5 rounded-full text-center transition-all cursor-pointer ${
            screen === "SUBSCRIBE"
              ? "text-primary-fixed bg-primary-fixed/10 border border-primary-fixed/40 shadow-[0_0_10px_rgba(0,251,251,0.2)]"
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          <Dna className="w-4 h-4 shrink-0" />
          <span className="font-mono text-[9px] sm:text-xs tracking-wider whitespace-nowrap">系统进化 EVOLUTION</span>
        </button>
      </nav>
    </div>
  );
}
