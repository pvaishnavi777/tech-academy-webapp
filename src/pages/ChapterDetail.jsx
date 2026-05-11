import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import TestCard from "../components/TestCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getChapter } from "../api/chapterApi";
import { getVideos } from "../api/videoApi";
import { getTests } from "../api/testApi";
import { markVideoComplete } from "../api/progressApi";
import { getProgress } from "../api/progressApi";
import { HiChevronLeft, HiChevronRight, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import { extractYouTubeId, toYouTubeEmbedUrl, toYouTubeWatchUrl } from "../utils/youtube";

const ChapterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tests, setTests] = useState([]);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [chRes, vRes, tRes, pRes] = await Promise.all([
          getChapter(id),
          getVideos(id),
          getTests(id),
          getProgress(),
        ]);
        setChapter(chRes.data.data);
        setVideos(vRes.data.data);
        setTests(tRes.data.data);
        setCompletedVideos(pRes.data.data.completedVideos?.map((v) => v._id || v) || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleMarkComplete = async (videoId) => {
    try {
      await markVideoComplete(videoId);
      setCompletedVideos((prev) => [...prev, videoId]);
      toast.success("Video marked as complete! +10 pts 🎉");
    } catch { toast.error("Could not update progress"); }
  };

  const currentVideo = videos[currentVideoIdx];
  const isCompleted = (id) => completedVideos.includes(id);

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (!chapter) return <Layout><p className="text-red-500">Chapter not found</p></Layout>;

  return (
    <Layout title={chapter.name}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <HiChevronLeft /> Back to Courses
        </button>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{chapter.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{chapter.description}</p>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {["videos", "notes", "tests"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="space-y-4">
            {videos.length === 0 ? (
              <p className="text-gray-400 text-sm">No videos available.</p>
            ) : (
              <>
                {/* Video player */}
                <motion.div key={currentVideoIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card p-0 overflow-hidden">
                  <div className="aspect-video w-full bg-black">
                    {(() => {
                      const videoId = extractYouTubeId(currentVideo?.youtubeUrl);
                      if (!videoId) {
                        return (
                          <div className="w-full h-full flex items-center justify-center text-center p-6">
                            <div className="max-w-md">
                              <p className="text-white font-semibold">This video link is invalid.</p>
                              <p className="text-white/70 text-sm mt-1">Please select another lesson.</p>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <iframe
                          src={`${toYouTubeEmbedUrl(videoId)}?autoplay=0`}
                          className="w-full h-full"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentVideo?.title}
                        />
                      );
                    })()}
                  </div>
                  <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{currentVideo?.title}</h3>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const videoId = extractYouTubeId(currentVideo?.youtubeUrl);
                        return videoId ? (
                          <a
                            href={toYouTubeWatchUrl(videoId)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary py-1.5 text-sm"
                          >
                            Open on YouTube
                          </a>
                        ) : null;
                      })()}
                      {!isCompleted(currentVideo?._id) ? (
                        <button onClick={() => handleMarkComplete(currentVideo._id)} className="btn-primary py-1.5 text-sm flex items-center gap-1">
                          <HiCheckCircle /> Mark Complete
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-500 text-sm font-semibold">
                          <HiCheckCircle /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between">
                  <button disabled={currentVideoIdx === 0} onClick={() => setCurrentVideoIdx((i) => i - 1)}
                    className="btn-secondary flex items-center gap-1 disabled:opacity-30">
                    <HiChevronLeft /> Previous
                  </button>
                  <span className="text-sm text-gray-500">{currentVideoIdx + 1} / {videos.length}</span>
                  <button disabled={currentVideoIdx === videos.length - 1}
                    onClick={() => setCurrentVideoIdx((i) => i + 1)}
                    className="btn-primary flex items-center gap-1 disabled:opacity-30">
                    Next <HiChevronRight />
                  </button>
                </div>

                {/* Video list */}
                <div className="grid gap-2">
                  {videos.map((v, i) => (
                    <button key={v._id} onClick={() => setCurrentVideoIdx(i)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        i === currentVideoIdx
                          ? "bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted(v._id) ? "bg-emerald-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}>
                        {isCompleted(v._id) ? "✓" : i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{v.title}</p>
                        {v.duration && <p className="text-xs text-gray-400">{v.duration}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">📝 Chapter Notes</h3>
            <div className="prose dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {chapter.notes || "No notes available for this chapter yet."}
            </div>
          </motion.div>
        )}

        {/* Tests Tab */}
        {activeTab === "tests" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {tests.length === 0 ? (
              <p className="text-gray-400 text-sm">No tests available.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {tests.map((t) => <TestCard key={t._id} test={t} />)}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default ChapterDetail;
