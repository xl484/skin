export default function CostDonut() {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-mono text-xs uppercase text-on-surface-variant tracking-wider">成本构成 (TRANSPARENT METRICS)</h4>
      <div className="flex items-center gap-6">
        {/* Vector SVG Donut Chart */}
        <div className="relative w-24 h-24 flex items-center justify-center group">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background Circle */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="rgba(0, 251, 251, 0.05)"
              strokeWidth="3.5"
            />
            {/* Segment 1: Raw Materials (65%) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#00fbfb"
              strokeWidth="3.5"
              strokeDasharray="65 100"
              strokeDashoffset="0"
              className="transition-all duration-1000 group-hover:stroke-width-[4.2]"
            />
            {/* Segment 2: Research & Development (20%) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#72ff70"
              strokeWidth="3.5"
              strokeDasharray="20 100"
              strokeDashoffset="-65"
              className="transition-all duration-1000 group-hover:stroke-width-[4.2]"
            />
            {/* Segment 3: Lab Overhead & Profit (15%) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="rgba(0, 251, 251, 0.25)"
              strokeWidth="3.5"
              strokeDasharray="15 100"
              strokeDashoffset="-85"
              className="transition-all duration-1000 group-hover:stroke-width-[4.2]"
            />
          </svg>
          {/* Centered Total */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono text-[14px] font-bold text-primary-fixed">¥138</span>
            <span className="font-sans text-[8px] opacity-60">成本</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1.5 font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-primary-fixed rounded-sm" />
            <span className="text-on-surface">活性原材料 (65%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-secondary-fixed rounded-sm" />
            <span className="text-on-surface">研发 / 实验室 (20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-primary-fixed/25 rounded-sm" />
            <span className="text-on-surface-variant">运营及包材 (15%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
