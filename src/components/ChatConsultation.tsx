import { useState, useRef, useEffect, FormEvent } from "react";
import { Send, Sparkles, BrainCircuit } from "lucide-react";
import { ChatMessage, DiagnosisReport, Recipe } from "../types";

interface ChatConsultationProps {
  currentDiagnosis: DiagnosisReport | null;
  currentRecipe: Recipe | null;
  onUpdateIngredients: (updatedIngredients: any[]) => void;
}

export default function ChatConsultation({
  currentDiagnosis,
  currentRecipe,
  onUpdateIngredients,
}: ChatConsultationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "assistant",
      text: "您好！我是 BIO-SCAN 智能配方专家。分析结果显示您的T区皮脂溢出率偏高，且颊部局部微发炎。我已为您定制了针对性的活性添加剂组合。您想就当前皮肤状况进行更深入的细胞层析咨询，或者需要我帮您微调配方浓度吗？",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isLoading]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          currentDiagnosis,
          currentRecipe,
        }),
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        // Try to parse the response if it specifies dynamic ingredient modifications
        // E.g. if the AI returns JSON tags or if we want to extract new percentage values
        // We can optionally support beautiful updates, or keep it conversational.
      } else {
        throw new Error(data.error || "Communication link offline.");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          text: `【通讯中断】主控台信号微弱，无法连线至中央AI实验室。您可以尝试重新发送。`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel corner-brackets rounded-lg p-4 flex flex-col h-[480px] w-full border border-primary-fixed/20">
      {/* Header Info */}
      <div className="flex justify-between items-center border-b border-primary-fixed/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-primary-fixed w-5 h-5 animate-pulse" />
          <div>
            <span className="font-mono text-xs text-primary-fixed uppercase tracking-wider block">AI BIO-SPECS</span>
            <span className="text-sm font-semibold text-primary">配方学专家咨询</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
          <span className="font-mono text-[9px] text-secondary-fixed tracking-wider">ACTIVE LINK</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-grow overflow-y-auto pr-1 space-y-3 mb-3 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 opacity-60">
              <span className="font-mono text-[9px] uppercase">
                {msg.role === "user" ? "MEMBER_USER" : "AI_LAB_SPEC"}
              </span>
              <span className="font-mono text-[8px]">{msg.timestamp}</span>
            </div>
            <div
              className={`rounded px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary-fixed/15 border border-primary-fixed/30 text-primary-fixed"
                  : "bg-surface-container-low/80 border border-outline-variant/30 text-on-surface"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col max-w-[80%] mr-auto items-start">
            <div className="flex items-center gap-1.5 mb-1 opacity-60">
              <span className="font-mono text-[9px] uppercase">AI_LAB_SPEC</span>
              <span className="font-mono text-[8px]">计算中...</span>
            </div>
            <div className="rounded px-3 py-2 text-sm bg-surface-container-low/80 border border-outline-variant/30 text-on-surface flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Submit Form */}
      <form onSubmit={handleSend} className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="向配方专家咨询您的皮肤问题..."
          disabled={isLoading}
          className="cyber-input w-full pl-3 pr-10 py-3 text-sm rounded bg-surface-container-lowest border-primary-fixed/20 focus:border-primary-fixed transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-fixed hover:text-white disabled:text-outline-variant disabled:hover:text-outline-variant transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
