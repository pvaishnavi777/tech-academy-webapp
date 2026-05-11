import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getTest, submitTest } from "../api/testApi";
import { HiClock, HiChevronLeft, HiChevronRight, HiCheck } from "react-icons/hi";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const TestRunner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const startTime = useRef(null);

  useEffect(() => {
    getTest(id).then((r) => {
      setTest(r.data.data);
      setQuestions(r.data.data.questions || []);
      setTimeLeft(r.data.data.timeLimit || 600);
      startTime.current = Date.now();
      setLoading(false);
    });
  }, [id]);

  // Countdown timer
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (loading) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); void handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [loading]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const handleSelect = (qId, optIdx) => setAnswers((a) => ({ ...a, [qId]: optIdx }));

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const startedAt = startTime.current ?? Date.now();
    const timeTaken = Math.round((Date.now() - startedAt) / 1000);
    const payload = {
      timeTaken,
      answers: questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] ?? -1,
      })),
    };
    try {
      const res = await submitTest(id, payload);
      const resultId = res.data.data._id;
      toast.success(`Submitted! Score: ${res.data.score}% ${res.data.passed ? "✅ Passed!" : "❌"}`);
      navigate(`/results/${resultId}`);
    } catch {
      toast.error("Submission failed");
      setSubmitting(false);
    }
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const timerColor = timeLeft < 60 ? "text-red-500" : timeLeft < 180 ? "text-yellow-500" : "text-emerald-500";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400">No questions found.</p>
    </div>
  );

  const q = questions[current];
  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">{test?.title}</h1>
            <p className="text-sm text-gray-500">{answered}/{questions.length} answered</p>
          </div>
          <div className={`flex items-center gap-2 text-2xl font-bold font-mono ${timerColor}`}>
            <HiClock />
            {mins}:{secs}
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mt-2">
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
              <p className="text-xs font-semibold text-primary-500 mb-3">Question {current + 1} of {questions.length}</p>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{q.questionText}</h2>

              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <motion.button key={i} whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(q._id, i)}
                    className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${
                      answers[q._id] === i
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-300"
                    }`}>
                    <span className="inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold mr-3
                      bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between mt-6">
            <button disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}
              className="btn-secondary flex items-center gap-1 disabled:opacity-30">
              <HiChevronLeft /> Previous
            </button>

            {/* Question dots */}
            <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                    i === current ? "bg-primary-500 text-white"
                    : answers[questions[i]._id] !== undefined ? "bg-emerald-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}>
                  {i + 1}
                </button>
              ))}
            </div>

            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent((c) => c + 1)} className="btn-primary flex items-center gap-1">
                Next <HiChevronRight />
              </button>
            ) : (
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleSubmit} disabled={submitting}
                className="btn-primary flex items-center gap-1">
                <HiCheck /> {submitting ? "Submitting..." : "Submit"}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRunner;
