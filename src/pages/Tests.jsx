import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TestCard from "../components/TestCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getTests } from "../api/testApi";
import { getProgress } from "../api/progressApi";
import { HiSearch } from "react-icons/hi";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [completedTestIds, setCompletedTestIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    Promise.all([getTests(), getProgress()]).then(([tRes, pRes]) => {
      setTests(tRes.data.data);
      setCompletedTestIds(pRes.data.data.completedTests?.map((t) => t._id || t) || []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = tests.filter((t) => {
    const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty ? t.difficulty === difficulty : true;
    return matchSearch && matchDiff;
  });

  if (loading) return <Layout title="Tests"><LoadingSpinner /></Layout>;

  return (
    <Layout title="Tests">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 max-w-sm">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests..." className="input pl-9 py-2 text-sm" />
          </div>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input w-40">
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800 dark:text-gray-100">{filtered.length} Tests Available</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TestCard key={t._id} test={t} completed={completedTestIds.includes(t._id)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">No tests found.</p>
        )}
      </div>
    </Layout>
  );
};

export default Tests;
