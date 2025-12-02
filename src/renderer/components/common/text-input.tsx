import { useState, KeyboardEvent, ChangeEvent } from 'react';
import DateTimePicker from './date-time-picker';
import { getDateDisplayText, getTimeDisplayText } from '../utils/date-utils';

interface TextInputProps {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  onSubmit: (value: string, dueDate: Date, dueTime?: string) => void;
  defaultDate: Date;
}

export default function TextInput({
  placeholder = '입력하세요',
  maxLength = 100,
  rows = 1,
  onSubmit,
  defaultDate,
}: TextInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmedValue = inputValue.trim();
    
    if (trimmedValue === '') {
      alert('내용을 입력해주세요!');
      return;
    }

    onSubmit(trimmedValue, selectedDate, selectedTime);
    setInputValue('');
  };

  const handleDateTimeConfirm = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const getDateTimeDisplay = () => {
    if (selectedTime) {
      const dateText = getDateDisplayText(selectedDate);
      return `${dateText} ${getTimeDisplayText(selectedTime)}`;
    }
    return '시간 추가';
  };

  return (
    <>
      <div className="bg-bg-card rounded-lg border-2 border-border">
        <textarea
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="w-full p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent transition-all text-base bg-bg-card text-text-primary font-medium border-0"
        />
        
        <div className="flex justify-between items-center px-3 pb-3">
          <div className="flex items-center gap-2">
            {/* 시간 설정 버튼 */}
            <button
              onClick={() => setIsPickerOpen(true)}
              className="px-3 py-2 text-sm bg-bg-hover text-text-primary rounded hover:bg-bg-secondary transition-colors flex items-center gap-1.5 font-medium border border-border"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{getDateTimeDisplay()}</span>
            </button>
            
            {/* 시간 제거 버튼 */}
            {selectedTime && (
              <button
                onClick={() => setSelectedTime(undefined)}
                className="px-2 py-2 text-sm text-accent hover:text-text-primary transition-colors"
                title="시간 제거"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary font-medium">
              {inputValue.length}/{maxLength}
            </span>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-accent text-bg-card text-base rounded-lg hover:bg-text-secondary transition-colors font-bold"
            >
              추가
            </button>
          </div>
        </div>
      </div>

      {/* 날짜/시간 선택 모달 */}
      <DateTimePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onConfirm={handleDateTimeConfirm}
        initialDate={selectedDate}
        initialTime={selectedTime}
      />
    </>
  );
}