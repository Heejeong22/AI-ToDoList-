import { useState, useRef, KeyboardEvent, ChangeEvent, useEffect } from 'react';
import { Clock, X, ArrowUp } from 'lucide-react';
import DateTimePicker from './date-time-picker';
import AlertModal from './alert-modal';
import { getDateDisplayText, getTimeDisplayText, isSameDay } from '../utils/date-utils';

interface TextInputProps {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  onSubmit: (value: string, dueDate: Date, dueTime?: string) => void;
  defaultDate: Date;
}

export default function TextInput({
  placeholder = 'Add a new task...',
  maxLength = 100,
  rows = 1,
  onSubmit,
  defaultDate,
}: TextInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isSameDay(selectedDate, defaultDate)) {
      setSelectedDate(defaultDate);
    }
  }, [defaultDate, selectedDate]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const trimmedValue = inputValue.trim();

    if (trimmedValue === '') {
      setShowAlert(true);
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(trimmedValue, selectedDate, selectedTime);
      setInputValue('');
      textareaRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    textareaRef.current?.focus();
  };

  const handleDateTimeConfirm = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const getDateTimeDisplay = () => {
    const dateText = getDateDisplayText(selectedDate);
    if (selectedTime) {
      return `${dateText} ${getTimeDisplayText(selectedTime)}`;
    }
    return dateText;
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-800 border-1.2 border-black dark:border-zinc-700 focus-within:shadow-xl focus-within:-translate-y-[1px] transition-all duration-200 rounded-2xl shadow-sm p-1">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="w-full bg-transparent text-text-primary placeholder:text-text-tertiary text-base font-medium resize-none focus:outline-none py-2.5 px-3"
        />

        <div className="flex justify-between items-center px-2 pb-2 mt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPickerOpen(true)}
              className={`group p-2 rounded-xl flex items-center gap-2 transition-all border border-transparent ${selectedTime
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'text-text-tertiary hover:bg-black/5 hover:text-text-primary dark:hover:bg-white/10'
                }`}
              title="Set date & time"
            >
              <Clock size={20} strokeWidth={2.5} className="transition-transform group-hover:scale-110" />
              {(selectedTime || !isSameDay(selectedDate, defaultDate)) && (
                <span className="text-xs font-semibold">{getDateTimeDisplay()}</span>
              )}
            </button>

            {selectedTime && (
              <button
                onClick={() => setSelectedTime(undefined)}
                className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Remove time"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium transition-colors ${inputValue.length >= maxLength ? 'text-red-500' : 'text-text-tertiary'
              }`}>
              {inputValue.length}/{maxLength}
            </span>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !inputValue.trim()}
              className={`p-2 rounded-xl transition-all duration-200 ${inputValue.trim()
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm hover:opacity-90 active:scale-95'
                : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed opacity-50'
                }`}
            >
              <ArrowUp size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <DateTimePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onConfirm={handleDateTimeConfirm}
        initialDate={selectedDate}
        initialTime={selectedTime}
      />

      <AlertModal
        isOpen={showAlert}
        title="Empty Task"
        message="Please enter a task description!"
        confirmText="Got it"
        onConfirm={handleAlertClose}
      />
    </>
  );
}
