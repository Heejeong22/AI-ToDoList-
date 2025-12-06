import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, Check, CloudSun, Moon, Sunrise } from 'lucide-react';
import { formatDate, getToday } from '../utils/date-utils';

interface DateTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time?: string) => void;
  initialDate?: Date;
  initialTime?: string;
}

export default function DateTimePicker({
  isOpen,
  onClose,
  onConfirm,
  initialDate,
  initialTime
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || getToday());
  const [includeTime, setIncludeTime] = useState<boolean>(!!initialTime);

  // Time state
  const [hour, setHour] = useState<string>('09');
  const [minute, setMinute] = useState<string>('00');

  useEffect(() => {
    if (initialTime) {
      const [h, m] = initialTime.split(':');
      setHour(h);
      setMinute(m);
      setIncludeTime(true);
    } else {
      setHour('09');
      setMinute('00');
      setIncludeTime(false);
    }
  }, [initialTime, isOpen]);

  useEffect(() => {
    if (isOpen && initialDate) {
      setSelectedDate(initialDate);
    } else if (isOpen && !initialDate) {
      setSelectedDate(getToday());
    }
  }, [isOpen, initialDate]);

  const handleConfirm = () => {
    if (includeTime) {
      let h = parseInt(hour, 10);
      let m = parseInt(minute, 10);
      if (isNaN(h)) h = 0;
      if (isNaN(m)) m = 0;

      // Clamp
      h = Math.max(0, Math.min(23, h));
      m = Math.max(0, Math.min(59, m));

      const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      onConfirm(selectedDate, timeString);
    } else {
      onConfirm(selectedDate, undefined);
    }
    onClose();
  };

  const setRelativeDate = (daysToAdd: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };

  const setTimePreset = (h: string, m: string) => {
    setHour(h);
    setMinute(m);
    setIncludeTime(true);
  };

  // Helper chips
  const quickDates = [
    { label: '오늘', days: 0, icon: <CloudSun size={14} /> },
    { label: '내일', days: 1, icon: <Sunrise size={14} /> },
    { label: '다음 주', days: 7, icon: <Calendar size={14} /> },
  ];

  const quickTimes = [
    { label: '아침', h: '09', m: '00', icon: <Sunrise size={14} /> },
    { label: '오후', h: '14', m: '00', icon: <CloudSun size={14} /> },
    { label: '저녁', h: '19', m: '00', icon: <Moon size={14} /> },
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border-1.2 border-black dark:border-transparent overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-bg-secondary/30 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <div className="p-2 rounded-xl bg-black/5 text-black dark:bg-white/10 dark:text-white">
                  <Calendar size={18} />
                </div>
                날짜 및 시간 설정
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-text-tertiary hover:text-text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Date Section */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-text-secondary">날짜</label>
                <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar py-1">
                  {quickDates.map(q => (
                    <button
                      key={q.label}
                      onClick={() => setRelativeDate(q.days)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-bg-secondary text-text-secondary border border-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                    >
                      {q.icon} {q.label}
                    </button>
                  ))}
                </div>
                <div className="relative group">
                  <input
                    type="date"
                    value={formatDate(selectedDate)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border-1.2 border-border/50 bg-bg-secondary/30 text-text-primary hover:bg-black/5 dark:hover:bg-white/5 focus:border-black dark:focus:border-white focus:ring-0 outline-none transition-all font-medium cursor-pointer relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-0 [&::-webkit-calendar-picker-indicator]:m-0"
                  />
                  <Calendar
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none transition-colors"
                  />
                </div>
              </div>

              {/* Time Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                    <Clock size={16} /> 시간
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={includeTime}
                        onChange={(e) => setIncludeTime(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black dark:peer-checked:bg-zinc-500"></div>
                    </div>
                    <span className="text-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">시간 포함</span>
                  </label>
                </div>

                <AnimatePresence>
                  {includeTime && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
                        {quickTimes.map(q => (
                          <button
                            key={q.label}
                            onClick={() => setTimePreset(q.h, q.m)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-bg-secondary text-text-secondary border border-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                          >
                            {q.icon} {q.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-start justify-center gap-1 bg-bg-secondary/30 p-2 rounded-2xl border-1.2 border-border/50 focus-within:border-black dark:focus-within:border-white transition-all">
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                            className="w-full bg-transparent text-center text-2xl font-bold py-2 focus:outline-none text-text-primary placeholder:text-text-tertiary dark:[color-scheme:dark]"
                            placeholder="HH"
                            min={0}
                            max={23}
                          />
                          <span className="text-xs text-text-tertiary font-medium uppercase tracking-wider">시</span>
                        </div>
                        <div className="text-2xl font-bold text-text-tertiary py-2">:</div>
                        <div className="flex-1 text-center">
                          <input
                            type="number"
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            className="w-full bg-transparent text-center text-2xl font-bold py-2 focus:outline-none text-text-primary placeholder:text-text-tertiary dark:[color-scheme:dark]"
                            placeholder="MM"
                            min={0}
                            max={59}
                            step={10}
                          />
                          <span className="text-xs text-text-tertiary font-medium uppercase tracking-wider">분</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-bg-secondary/30 border-t border-border/50 flex justify-end gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 text-sm font-bold text-white bg-black dark:bg-zinc-700 dark:border dark:border-zinc-600 rounded-xl shadow-xl hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
              >
                <Check size={18} strokeWidth={2.5} /> 확인
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
