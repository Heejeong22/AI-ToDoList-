import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import TodoList from './components/todo-list';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system preference or local storage (if implemented)
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Floating notification for shortcuts
  const [showShortcutHint, setShowShortcutHint] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowShortcutHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-bg-secondary flex items-center justify-center py-10 relative transition-colors duration-300 font-sans selection:bg-primary/20">

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl bg-bg-primary rounded-3xl shadow-xl overflow-hidden relative z-10 flex flex-col border-1.2 border-black dark:border-transparent"
        style={{ height: '85vh', maxHeight: '900px' }}
      >
        <TodoList isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </motion.div>

      {/* Floating Hint */}
      <AnimatePresence>
        {showShortcutHint && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 text-sm font-medium text-text-secondary bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-border shadow-lg pointer-events-none z-50"
          >
            팁: <span className="font-bold text-primary">Ctrl+Shift+T</span> 로 창을 열고 닫을 수 있습니다
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
