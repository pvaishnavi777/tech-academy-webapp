import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getClasses } from "../api/classApi";
import { getSubjects } from "../api/subjectApi";
import { getChapters } from "../api/chapterApi";
import { HiChevronRight, HiHome, HiSearch } from "react-icons/hi";

const Courses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getClasses().then((r) => {
      setClasses(r.data.data);
      const preSearch = searchParams.get("search");
      setSearch(preSearch ?? "");
      const preClassId = searchParams.get("classId");
      if (preClassId) {
        const cls = r.data.data.find((c) => c._id === preClassId);
        if (cls) handleSelectClass(cls);
      }
      setLoading(false);
    });
  }, [searchParams]);

  async function handleSelectClass(cls) {
    setSelectedClass(cls);
    setSelectedSubject(null);
    setChapters([]);
    const r = await getSubjects(cls._id);
    setSubjects(r.data.data);
  }

  const handleSelectSubject = async (sub) => {
    setSelectedSubject(sub);
    const r = await getChapters(sub._id);
    setChapters(r.data.data);
  };

  const filtered = (arr, key = "name") =>
    arr.filter((i) => i[key]?.toLowerCase().includes(search.toLowerCase()));

  const breadcrumbs = [
    { label: "All Classes", action: () => { setSelectedClass(null); setSelectedSubject(null); } },
    selectedClass && { label: selectedClass.name, action: () => { setSelectedSubject(null); setChapters([]); } },
    selectedSubject && { label: selectedSubject.name, action: null },
  ].filter(Boolean);

  if (loading) return <Layout title="Courses"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Courses">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-sm">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..." className="input pl-9 py-2 text-sm" />
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm flex-wrap">
          <HiHome className="text-gray-400" />
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <HiChevronRight className="text-gray-300" />}
              <button
                onClick={b.action}
                className={`font-medium ${b.action ? "text-primary-600 dark:text-primary-400 hover:underline" : "text-gray-800 dark:text-gray-100 cursor-default"}`}>
                {b.label}
              </button>
            </span>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {!selectedClass && (
            <motion.div key="classes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Select a Class</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {filtered(classes).map((cls) => (
                  <CourseCard key={cls._id} item={cls} type="class" onClick={() => handleSelectClass(cls)} />
                ))}
              </div>
            </motion.div>
          )}

          {selectedClass && !selectedSubject && (
            <motion.div key="subjects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Subjects in {selectedClass.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered(subjects).map((sub) => (
                  <CourseCard key={sub._id} item={sub} type="subject" onClick={() => handleSelectSubject(sub)} />
                ))}
              </div>
            </motion.div>
          )}

          {selectedSubject && (
            <motion.div key="chapters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Chapters in {selectedSubject.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered(chapters).map((ch) => (
                  <CourseCard key={ch._id} item={ch} type="chapter" onClick={() => navigate(`/chapters/${ch._id}`)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Courses;
