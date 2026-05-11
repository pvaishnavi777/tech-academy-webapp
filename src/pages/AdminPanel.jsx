import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { getAdminStats, getAllUsers, deleteUser } from "../api/adminApi";
import { getClasses, createClass, deleteClass } from "../api/classApi";
import { getSubjects, createSubject } from "../api/subjectApi";
import { createChapter } from "../api/chapterApi";
import toast from "react-hot-toast";
import { HiTrash, HiPlus, HiUsers } from "react-icons/hi";

const StatBox = ({ label, value, icon }) => (
  <div className="card flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 text-xl">{icon}</div>
    <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
  </div>
);

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("stats");
  const [classForm, setClassForm] = useState({ name: "", grade: "", description: "", icon: "📚", color: "#6366f1" });
  const [subjectForm, setSubjectForm] = useState({ name: "", classId: "", icon: "📗", color: "#10b981" });
  const [chapterForm, setChapterForm] = useState({ name: "", subjectId: "", description: "" });
  const [subjects, setSubjects] = useState([]);

  const load = async () => {
    try {
      const [sRes, uRes, cRes] = await Promise.all([getAdminStats(), getAllUsers(), getClasses()]);
      setStats(sRes.data.data);
      setUsers(uRes.data.data);
      setClasses(cRes.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const run = async () => { await load(); };
    run();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try { await deleteUser(id); setUsers((u) => u.filter((x) => x._id !== id)); toast.success("User deleted"); }
    catch { toast.error("Failed"); }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await createClass({ ...classForm, grade: Number(classForm.grade) });
      toast.success("Class created!"); load();
      setClassForm({ name: "", grade: "", description: "", icon: "📚", color: "#6366f1" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleClassChange = async (classId) => {
    setSubjectForm((f) => ({ ...f, classId }));
    if (classId) { const r = await getSubjects(classId); setSubjects(r.data.data); }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try { await createSubject(subjectForm); toast.success("Subject created!"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    try { await createChapter(chapterForm); toast.success("Chapter created!"); load(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const sections = ["stats", "users", "classes", "subjects", "chapters"];

  if (loading) return <Layout title="Admin Panel"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Admin Panel">
      <div className="space-y-6">
        {/* Section tabs */}
        <div className="flex gap-2 flex-wrap">
          {sections.map((s) => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeSection === s ? "bg-primary-500 text-white" : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}>{s}</button>
          ))}
        </div>

        {/* Stats */}
        {activeSection === "stats" && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <StatBox label="Users" value={stats.users} icon={<HiUsers />} />
              <StatBox label="Classes" value={stats.classes} icon="🎓" />
              <StatBox label="Subjects" value={stats.subjects} icon="📗" />
              <StatBox label="Chapters" value={stats.chapters} icon="📖" />
              <StatBox label="Videos" value={stats.videos} icon="🎬" />
              <StatBox label="Tests" value={stats.tests} icon="📝" />
              <StatBox label="Results" value={stats.results} icon="📊" />
            </div>
          </motion.div>
        )}

        {/* Users */}
        {activeSection === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Points</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><span className={`badge ${u.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>{u.role}</span></td>
                    <td className="px-4 py-3 font-semibold text-primary-600">{u.points}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-600 p-1 rounded"><HiTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Create Class */}
        {activeSection === "classes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><HiPlus /> Create Class</h3>
              <form onSubmit={handleCreateClass} className="space-y-3">
                <input required value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} placeholder="Class Name (e.g. Class 11)" className="input" />
                <input required type="number" min="1" max="12" value={classForm.grade} onChange={(e) => setClassForm({ ...classForm, grade: e.target.value })} placeholder="Grade (1-12)" className="input" />
                <input value={classForm.description} onChange={(e) => setClassForm({ ...classForm, description: e.target.value })} placeholder="Description" className="input" />
                <div className="flex gap-3">
                  <input value={classForm.icon} onChange={(e) => setClassForm({ ...classForm, icon: e.target.value })} placeholder="Icon emoji" className="input flex-1" />
                  <input type="color" value={classForm.color} onChange={(e) => setClassForm({ ...classForm, color: e.target.value })} className="h-11 w-16 rounded-xl border border-gray-200 cursor-pointer" />
                </div>
                <button type="submit" className="btn-primary w-full">Create Class</button>
              </form>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Existing Classes ({classes.length})</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {classes.map((c) => (
                  <div key={c._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <span>{c.icon} {c.name} <span className="text-xs text-gray-400">(Grade {c.grade})</span></span>
                    <button onClick={async () => { await deleteClass(c._id); load(); toast.success("Deleted"); }} className="text-red-400 hover:text-red-600"><HiTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Create Subject */}
        {activeSection === "subjects" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card max-w-lg">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><HiPlus /> Create Subject</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3">
              <select required value={subjectForm.classId} onChange={(e) => handleClassChange(e.target.value)} className="input">
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input required value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} placeholder="Subject Name" className="input" />
              <div className="flex gap-3">
                <input value={subjectForm.icon} onChange={(e) => setSubjectForm({ ...subjectForm, icon: e.target.value })} placeholder="Icon" className="input flex-1" />
                <input type="color" value={subjectForm.color} onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })} className="h-11 w-16 rounded-xl border border-gray-200 cursor-pointer" />
              </div>
              <button type="submit" className="btn-primary w-full">Create Subject</button>
            </form>
          </motion.div>
        )}

        {/* Create Chapter */}
        {activeSection === "chapters" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card max-w-lg">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><HiPlus /> Create Chapter</h3>
            <form onSubmit={handleCreateChapter} className="space-y-3">
              <select required value={chapterForm.classId || ""} onChange={async (e) => {
                setChapterForm((f) => ({ ...f, classId: e.target.value, subjectId: "" }));
                const r = await getSubjects(e.target.value); setSubjects(r.data.data);
              }} className="input">
                <option value="">Select Class</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select required value={chapterForm.subjectId} onChange={(e) => setChapterForm({ ...chapterForm, subjectId: e.target.value })} className="input">
                <option value="">Select Subject</option>
                {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input required value={chapterForm.name} onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })} placeholder="Chapter Name" className="input" />
              <textarea value={chapterForm.description} onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })} placeholder="Description" className="input h-20 resize-none" />
              <button type="submit" className="btn-primary w-full">Create Chapter</button>
            </form>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPanel;
