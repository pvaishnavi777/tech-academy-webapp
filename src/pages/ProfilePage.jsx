import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { getMyResults } from "../api/resultApi";
import { getStats } from "../api/progressApi";
import { updateProfile } from "../api/authApi";
import toast from "react-hot-toast";
import { HiPencil, HiSave, HiX } from "react-icons/hi";

const badgeEmojis = { "Top Learner": "🏆", "Perfect Score": "💯", "Consistency Star": "⭐", "Early Bird": "🌅", "Founder": "👑" };

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getStats(), getMyResults()]).then(([s, r]) => {
      setStats(s.data.data);
      setResults(r.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      await refreshUser();
      setEditing(false);
      toast.success("Profile updated!");
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <Layout title="Profile"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input text-lg font-bold" placeholder="Your name" />
                  <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input text-sm resize-none h-20" placeholder="Short bio..." />
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="btn-primary py-1.5 text-sm flex items-center gap-1"><HiSave />{saving ? "Saving..." : "Save"}</button>
                    <button onClick={() => setEditing(false)} className="btn-secondary py-1.5 text-sm flex items-center gap-1"><HiX />Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                    <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-primary-500 transition-colors"><HiPencil /></button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                  {user?.bio && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{user.bio}</p>}
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="font-semibold text-primary-600 dark:text-primary-400">⚡ {user?.points || 0} pts</span>
                    <span className="font-semibold text-orange-500">🔥 {user?.streakDays || 0} streak</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Videos", value: stats?.videosWatched || 0 },
            { label: "Tests", value: stats?.testsCompleted || 0 },
            { label: "Avg Score", value: results.length ? Math.round(results.reduce((a, c) => a + c.score, 0) / results.length) + "%" : "N/A" },
          ].map((s, i) => (
            <div key={i} className="card text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">🏅 Badges</h3>
          {(user?.badges?.length || 0) === 0 ? (
            <p className="text-sm text-gray-400">No badges yet. Complete tests to earn them!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {user.badges.map((b, i) => (
                <motion.div key={i} whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-full px-4 py-2">
                  <span>{badgeEmojis[b] || "🎖️"}</span>
                  <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">{b}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent results */}
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">📊 Recent Results</h3>
          {results.length === 0 ? <p className="text-sm text-gray-400">No test results yet.</p> : (
            <div className="space-y-2">
              {results.slice(0, 5).map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{r.testId?.title || "Test"}</p>
                  <span className={`text-sm font-bold ${r.passed ? "text-emerald-500" : "text-red-500"}`}>{r.score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
