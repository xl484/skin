import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini API client
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured. Running in simulated fallback mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API Route: Analyze Skin (Invokes Gemini for a personalized, scientific skin scan)
app.post("/api/analyze", async (req, res) => {
  try {
    const ai = getAiClient();
    if (!ai) {
      // Return beautiful high-quality fallback data if API key is not yet set
      return res.json(getFallbackDiagnosis());
    }

    const prompt = `
      Perform a highly realistic, futuristic, cyberpunk-style dermatological scan of a hypothetical user.
      Provide a highly customized and clinically precise skin diagnosis report.
      Be sure to use biotechnology terms (e.g., lipid matrix, sebum regulation, bio-peptides, epidermal moisture barrier).
      Return the output strictly in JSON format matching the schema below. Do not include markdown formatting or quotes outside of the JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the core intelligence unit of the BIO-SCAN Kiosk v1.0, an ultra-advanced diagnostic skin-analysis system. You formulate precise biotechnology skincare prescriptions based on simulated diagnostic scans.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosisTitle: {
              type: Type.STRING,
              description: "A professional, clinical diagnosis title, e.g., 'T区重度皮脂溢出伴随两颊屏障局部微发炎'.",
            },
            diagnosisDesc: {
              type: Type.STRING,
              description: "A detailed biotechnology-focused clinical description explaining the results, oil status, moisture status, and recommended treatment route.",
            },
            metrics: {
              type: Type.OBJECT,
              properties: {
                oil: { type: Type.INTEGER, description: "Oil level percentage (0 to 100)" },
                hydration: { type: Type.INTEGER, description: "Hydration level percentage (0 to 100)" },
                sensitivity: { type: Type.INTEGER, description: "Sensitivity level percentage (0 to 100)" },
                acne: { type: Type.INTEGER, description: "Acne probability/index percentage (0 to 100)" },
                wrinkle: { type: Type.INTEGER, description: "Wrinkle/aging index percentage (0 to 100)" },
              },
              required: ["oil", "hydration", "sensitivity", "acne", "wrinkle"],
            },
            hotspots: {
              type: Type.ARRAY,
              description: "Exactly 2-3 visual markers on the face map corresponding to oiliness, inflammation or dryness",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Label, e.g., '油脂过溢 (T区)', '轻度发炎 (左颊)'" },
                  level: { type: Type.STRING, description: "Intensity: '极高', '高', '中', '低'" },
                  type: { type: Type.STRING, description: "Type: 'oil', 'inflammation', 'normal'" },
                  x: { type: Type.INTEGER, description: "X coordinate percentage on facial visualizer overlay, 20 to 80" },
                  y: { type: Type.INTEGER, description: "Y coordinate percentage on facial visualizer overlay, 20 to 80" },
                },
                required: ["name", "level", "type", "x", "y"],
              },
            },
            recommendedRecipe: {
              type: Type.OBJECT,
              properties: {
                base: { type: Type.STRING, description: "Suggested product base: 'water', 'essence', 'lotion', 'oil', or 'cleanser'" },
                efficacies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of 2-3 target efficacies, e.g., ['hydrating', 'soothing', 'oil-control']",
                },
                ingredients: {
                  type: Type.ARRAY,
                  description: "List of 3 customized biotechnology ingredients with exact ratios",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Ingredient name in Chinese and English, e.g. '积雪草提取物 (Centella)'" },
                      ratio: { type: Type.STRING, description: "Percentage concentration, e.g., '1.5%', '2.0%'" },
                      reason: { type: Type.STRING, description: "Brief scientific explanation for incorporating this ingredient" },
                    },
                    required: ["name", "ratio", "reason"],
                  },
                },
              },
              required: ["base", "efficacies", "ingredients"],
            },
          },
          required: ["diagnosisTitle", "diagnosisDesc", "metrics", "hotspots", "recommendedRecipe"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("AI analysis failed, falling back to simulated skin scan:", error);
    res.json(getFallbackDiagnosis());
  }
});

// 2. API Route: Skincare Chat (AI Biotechnologist Assistant)
app.post("/api/chat", async (req, res) => {
  const { message, history, currentDiagnosis, currentRecipe } = req.body;
  const getSimulatedResponse = () => ({
    text: `【智能配方助手】\n收到您的咨询：“${message}”\n\n为了给您定制最完美的配方，系统建议在“${currentRecipe?.base === "water" ? "爽肤水" : "精华液"}”中，加入 **3% 积雪草酸 (Centella Asiatic Acid)** 与 **2% 烟酰胺 (Niacinamide)**，协同作用对抗您当前诊出的 ${currentDiagnosis?.diagnosisTitle || "油脂过溢及轻度发炎"}，帮助强韧肌肤屏障、持久控油。建议加入月度计划以便按季调整。`,
  });

  try {
    const ai = getAiClient();

    if (!ai) {
      return res.json(getSimulatedResponse());
    }

    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Generate contextual chat prompt
    const systemPrompt = `
      You are the Master Skincare Biotechnologist at the BIO-SCAN Clinical Station.
      The user has just completed a clinical scan.
      Current Diagnosis: ${JSON.stringify(currentDiagnosis)}
      Current Formulation Selected: ${JSON.stringify(currentRecipe)}
      
      Respond to the user with clinical authority, high technological sophistication, and extreme care. Use friendly, clean formatting.
      Recommend specific molecular additives (e.g., Ectoin, Oligopeptides, Ceramides NP, BHA, Panthenol, Hyaluronic Acid of ultra-low molecular weight) and explain how they interact with their skin cells.
      If the user wants to adjust their formulation or base, explain the scientific consequence of doing so. Keep answers concise, under 200 words, formatted beautifully in Chinese.
    `;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({ message: message });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat failure, falling back to simulated chat response:", error);
    res.json(getSimulatedResponse());
  }
});

// Helper: Provide a beautiful default report when API key is missing
function getFallbackDiagnosis() {
  return {
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
}

// 3. Mount Vite server / Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BIO-SCAN SERVER] Systems operational at http://localhost:${PORT}`);
  });
}

startServer();
