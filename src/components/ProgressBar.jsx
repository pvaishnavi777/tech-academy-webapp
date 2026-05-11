import { motion } from "framer-motion";

const ProgressBar = ({ value = 0, max = 100, label, color = "primary", showPercent = true }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const colorMap = {
    primary: "bg-primary-500",
    green: "bg-emerald-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    blue: "bg-blue-500",
  };

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>}
          {showPercent && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{pct}%</span>}
        </div>
      )}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorMap[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
