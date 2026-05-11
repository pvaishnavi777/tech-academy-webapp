import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { getStats } from "../api/progressApi";
import { getMyResults } from "../api/resultApi";
import { getClasses } from "../api/classApi";
import {
  HiPlay, HiClipboardList, HiLightningBolt,
  HiFire, HiTrendingUp, HiStar, HiBookOpen
} from "react-icons/hi";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, rRes, cRes] = await Promise.all([
          getStats(), getMyResults(), getClasses()
        ]);
        setStats(sRes.data.data);
        setResults(rRes.data.data.slice(0, 3));
        setClasses(cRes.data.data.slice(0, 6));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Layout title="Dashboard"><LoadingSpinner /></Layout>;

  const avgScore = results.length
    ? Math.round(results.reduce((a, c) => a + c.score, 0) / results.length)
    : 0;

  const badgeEmojis = { "Top Learner": "🏆", "Perfect Score": "💯", "Consistency Star": "⭐", "Early Bird": "🌅", "Founder": "👑" };

  return (
    <Layout title="Dashboard">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

        {/* Welcome */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
          <h2 className="text-xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h2>
          <p className="text-primary-100 text-sm mt-1">Ready to continue your learning journey?</p>
          <div className="flex items-center gap-4 mt-4">
            {(user?.streakDays || 0) > 0 && (
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm">
                <span>🔥</span> {user.streakDays} day streak
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm">
              <HiStar /> {user?.points || 0} points
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<HiPlay />} label="Videos Watched" value={stats?.videosWatched || 0} color="primary" />
          <StatCard icon={<HiClipboardList />} label="Tests Completed" value={stats?.testsCompleted || 0} color="green" />
          <StatCard icon={<HiLightningBolt />} label="Total Points" value={stats?.points || 0} color="orange" />
          <StatCard icon={<HiFire />} label="Day Streak" value={`${stats?.streak || 0} 🔥`} color="purple" />
        </div>

        {/* Progress + Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress */}
          <div className="lg:col-span-2 card">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <HiTrendingUp className="text-primary-500" /> Learning Progress
            </h3>
            <div className="space-y-4">
              <ProgressBar label="Videos Watched" value={stats?.videosWatched || 0} max={80} color="primary" />
              <ProgressBar label="Tests Completed" value={stats?.testsCompleted || 0} max={40} color="green" />
              <ProgressBar label="Average Score" value={avgScore} max={100} color="orange" />
            </div>
          </div>

          {/* Badges */}
          <div className="card">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <HiStar className="text-yellow-500" /> Your Badges
            </h3>
            {(user?.badges?.length || 0) === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">Complete tests to earn badges!</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {user.badges.map((b, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-1 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-3 text-center">
                    <span className="text-2xl">{badgeEmojis[b] || "🎖️"}</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{b}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Test Results</h3>
            <div className="space-y-3">
              {results.map((r) => (
                <motion.div key={r._id} whileHover={{ x: 4 }}
                  onClick={() => navigate(`/results/${r._id}`)}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer">
                  <div>
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{r.testId?.title || "Test"}</p>
                    <p className="text-xs text-gray-500">{r.correctAnswers}/{r.totalQuestions} correct</p>
                  </div>
                  <div className={`text-lg font-bold ${r.passed ? "text-emerald-500" : "text-red-500"}`}>
                    {r.score}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick access classes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <HiBookOpen className="text-primary-500" /> Browse by Class
            </h3>
            <button onClick={() => navigate("/courses")} className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {classes.map((cls) => (
              <motion.button key={cls._id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/courses?classId=${cls._id}`)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${cls.color}22` }}>
                  {cls.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{cls.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Dashboard;