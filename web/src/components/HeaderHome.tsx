export default function HeaderHome() {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2.5">
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-reuse-text">Re</span>
        <span className="text-reuse-green">Use</span>
        <span className="text-reuse-green-dark">!</span>
      </span>

      <div className="rounded-full border border-reuse-green bg-[#EEF7DC] px-2.5 py-1">
        <span className="text-xs font-bold text-reuse-green">★ 1.240 XP</span>
      </div>
    </div>
  );
}
