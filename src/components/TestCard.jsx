import { motion } from "framer-motion";
import { HiClock, HiLightningBolt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const difficultyColors = {
  easy: "badge-easy",
  medium: "badge-medium",
  hard: "badge-hard",
};

const TestCard = ({ test, completed }) => {
  const navigate = useNavigate();
  const mins = Math.floor((test.timeLimit || 600) / 60);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="card hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">{test.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{test.description}</p>
        </div>
        {completed && (
          <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex-shrink-0">✓ Done</span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className={`badge ${difficultyColors[test.difficulty] || "badge-medium"}`}>
          <HiLightningBolt className="mr-1" />
          {test.difficulty}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <HiClock />
          {mins} min
        </span>
      </div>

      <button
        onClick={() => navigate(`/tests/${test._id}/run`)}
        className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
          completed
            ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600"
            : "btn-primary"
        }`}
      >
        {completed ? "Retake Test" : "Start Test"}
      </button>
    </motion.div>
  );
};

export default TestCard;
