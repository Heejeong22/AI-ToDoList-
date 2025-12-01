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
  rows = 2,
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
    // 시간은 초기화하지 않음 (다음 입력에도 동일한 시간 사용 가능)
  };

  const handleDateTimeConfirm = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  // 날짜/시간 표시 텍스트
  const getDateTimeDisplay = () => {
    const dateText = getDateDisplayText(selectedDate);
    if (selectedTime) {
      return `${dateText} ${getTimeDisplayText(selectedTime)}`;
    }
    return dateText;
  };

  return (
    <>
      <div className="bg-white rounded-lg">
        <textarea
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
        />
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            {/* 시간 설정 버튼 */}
            <button
              onClick={() => setIsPickerOpen(true)}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <span>📅</span>
              <span>{getDateTimeDisplay()}</span>
            </button>
            
            {/* 시간 제거 버튼 (시간이 설정된 경우만) */}
            {selectedTime && (
              <button
                onClick={() => setSelectedTime(undefined)}
                className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                title="시간 제거"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {inputValue.length}/{maxLength}
            </span>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
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