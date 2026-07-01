export default function FreshnessTimeline() {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-mono text-xs uppercase text-on-surface-variant tracking-wider">成分新鲜度 (FRESHNESS LOG)</h4>
      <div className="relative pl-5 border-l border-primary-fixed/20 space-y-4 py-1">
        {/* Node 1 */}
        <div className="relative">
          <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 bg-secondary-fixed rounded-full shadow-[0_0_8px_#72ff70] animate-pulse" />
          <p className="font-mono text-xs text-secondary-fixed font-bold">一个月内植物提取 不含防腐剂</p>
          <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">
            采用一个月内新鲜鲜萃植物提取工艺，全配方不添加任何化学防腐剂，保留最天然的高纯度活性。
          </p>
        </div>
        {/* Node 2 */}
        <div className="relative">
          <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 bg-primary-fixed rounded-full shadow-[0_0_8px_#00fbfb] animate-pulse" />
          <p className="font-mono text-xs text-primary-fixed font-bold">一天前送达 原料新鲜由工厂冷链直达</p>
          <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">
            采用工厂冷链专线直达，24小时内极速配送，保障原料全程在最适温湿度环境下锁鲜。
          </p>
        </div>
      </div>
    </div>
  );
}
