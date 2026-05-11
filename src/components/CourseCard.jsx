import { motion } from "framer-motion";
import { HiPlay, HiDocumentText } from "react-icons/hi";

const CourseCard = ({ item, type = "class", onClick }) => {
  if (type === "class") {
    return (
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="card cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-100 dark:hover:border-primary-900"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${item.color}22` }}>
            {item.icon}
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-gray-100">{item.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "subject") {
    return (
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="card cursor-pointer hover:shadow-lg transition-shadow group"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${item.color}22` }}>
            {item.icon}
          </div>
          <p className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {item.name}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description || "Explore chapters and videos"}</p>
      </motion.div>
    );
  }

  if (type === "chapter") {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="card hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                Ch {item.order || "—"}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-500">
              <HiPlay />
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500">
              <HiDocumentText />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default CourseCard;