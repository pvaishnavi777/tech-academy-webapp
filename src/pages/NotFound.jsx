import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome } from "react-icons/hi";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-8xl mb-4">🎓</div>
        <h1 className="text-5xl font-bold gradient-text mb-2">404</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Oops! This page doesn't exist.</p>
        <button onClick={() => navigate("/")} className="btn-primary flex items-center gap-2 mx-auto">
          <HiHome /> Go Home
        </button>
      </motion.div>
    </div>
  );
};
export default NotFound;
