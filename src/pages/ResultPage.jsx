import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getResult } from "../api/resultApi";
import { HiCheckCircle, HiXCircle, HiArrowLeft, HiRefresh } from "react-icons/hi";
import LoadingSpinner from "../components/LoadingSpinner";

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResult(id).then((r) => { setResult(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!result) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-400">Result not found</p></div>;

  const passed = result.passed;
  const circleColor = passed ? "#10b981" : "#ef4444";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => navigate("/tests")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
          <HiArrowLeft /> Back to Tests
        </button>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="card p-8 text-center">
          <div className="w-28 h-28 rounded-full border-8 mx-auto flex items-center justify-center"
            style={{ borderColor: circleColor }}>
            <span className="text-3xl font-bold" style={{ color: circleColor }}>{result.score}%</span>
          </div>
          <h2 className={`text-2xl font-bold mt-4 ${passed ? "text-emerald-500" : "text-red-500"}`}>
            {passed ? "🎉 Passed!" : "😔 Not Passed"}
          </h2>
          <p className="text-gray-500 mt-1">{result.correctAnswers} / {result.totalQuestions} correct</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
            <div><p className="font-bold text-gray-800 dark:text-gray-200">{result.timeTaken}s</p><p>Time</p></div>
            <div><p className="font-bold text-gray-800 dark:text-gray-200">{result.correctAnswers}</p><p>Correct</p></div>
            <div><p className="font-bold text-gray-800 dark:text-gray-200">{result.totalQuestions - result.correctAnswers}</p><p>Wrong</p></div>
          </div>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => navigate("/tests")} className="btn-secondary flex items-center gap-1"><HiArrowLeft /> Tests</button>
            <button onClick={() => navigate(`/tests/${result.testId?._id}/run`)} className="btn-primary flex items-center gap-1"><HiRefresh /> Retry</button>
          </div>
        </motion.div>

        {result.answers?.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 dark:text-gray-100">Answer Breakdown</h3>
            {result.answers.map((ans, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                  ans.isCorrect ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"}`}>
                {ans.isCorrect ? <HiCheckCircle className="text-emerald-500 text-xl flex-shrink-0 mt-0.5" />
                  : <HiXCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />}
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {ans.questionId?.questionText || `Question ${i + 1}`}
                  </p>
                  {ans.questionId?.explanation && (
                    <p className="text-xs text-gray-500 mt-1">💡 {ans.questionId.explanation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ResultPage;
