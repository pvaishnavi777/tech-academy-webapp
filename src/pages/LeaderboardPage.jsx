import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { getLeaderboard } from "../api/leaderboardApi";
import { useAuth } from "../context/AuthContext";

const medals = ["🥇", "🥈", "🥉"];

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard().then((r) => setLeaders(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Leaderboard"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Leaderboard">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold gradient-text">🏆 Top Learners</h2>
          <p className="text-gray-500 text-sm mt-1">Earn points by watching videos and passing tests</p>
        </div>

        {/* Top 3 podium */}
        {leaders.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-2">
            {[leaders[1], leaders[0], leaders[2]].map((l, i) => (
              <motion.div key={l._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`card text-center ${i === 1 ? "ring-2 ring-yellow-400 dark:ring-yellow-500" : ""}`}>
                <div className="text-3xl mb-2">{["🥈", "🥇", "🥉"][i]}</div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">
                  {l.name?.[0]}
                </div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{l.name}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 font-bold mt-1">⚡ {l.points}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Full list */}
        <div className="card divide-y divide-gray-100 dark:divide-gray-800 p-0 overflow-hidden">
          {leaders.map((l, i) => {
            const isMe = user?.id === l._id || user?._id === l._id;
            return (
              <motion.div key={l._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 px-5 py-4 ${isMe ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}>
                <span className="w-8 text-center font-bold text-gray-400 text-sm">
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </span>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {l.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">
                    {l.name} {isMe && <span className="text-primary-500 text-xs">(You)</span>}
                  </p>
                  <p className="text-xs text-gray-400">🔥 {l.streakDays || 0} streak</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-primary-600 dark:text-primary-400">⚡ {l.points}</p>
                  {l.badges?.length > 0 && <p className="text-xs text-gray-400">{l.badges.length} badges</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
