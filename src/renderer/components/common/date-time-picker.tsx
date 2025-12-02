import { useState } from 'react';
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
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '');
  const [includeTime, setIncludeTime] = useState<boolean>(!!initialTime);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedDate, includeTime ? selectedTime : undefined);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const quickOptions = [
    { label: '오늘', getDays: () => 0 },
    { label: '내일', getDays: () => 1 },
    { label: '모레', getDays: () => 2 },
    { label: '다음주', getDays: () => 7 }
  ];

  const setQuickDate = (days: number) => {
    const newDate = new Date(getToday());
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const timeOptions: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const h = String(hour).padStart(2, '0');
      const m = String(minute).padStart(2, '0');
      timeOptions.push(`${h}:${m}`);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div 
        className="rounded-lg shadow-2xl w-80 max-h-[80vh] overflow-hidden"
        style={{ 
          backgroundColor: '#FEFDFB',
          border: '2px solid #E5DCC8'
        }}
      >
        {/* header */}
        <div 
          className="px-4 py-3"
          style={{ 
            borderBottom: '2px solid #E5DCC8',
            backgroundColor: '#F2E8D5'
          }}
        >
          <h3 className="text-base font-bold" style={{ color: '#010D00' }}>
            날짜 및 시간 설정
          </h3>
        </div>

        {/* 내용 */}
        <div 
          className="p-4 space-y-4 max-h-[60vh] overflow-y-auto"
          style={{ backgroundColor: '#FEFDFB' }}
        >
          {/* 빠른 선택 */}
          <div>
            <label className="text-xs font-bold mb-2 block" style={{ color: '#010D00' }}>
              빠른 선택
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickOptions.map(option => (
                <button
                  key={option.label}
                  onClick={() => setQuickDate(option.getDays())}
                  className="px-3 py-2 text-xs rounded transition-colors font-semibold"
                  style={{
                    border: '2px solid #E5DCC8',
                    backgroundColor: '#F2E8D5',
                    color: '#010D00'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 날짜 선택 */}
          <div>
            <label className="text-xs font-bold mb-2 block" style={{ color: '#010D00' }}>
              날짜
            </label>
            <input
              type="date"
              value={formatDate(selectedDate)}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-3 py-2 rounded focus:outline-none text-sm font-medium"
              style={{
                border: '2px solid #E5DCC8',
                backgroundColor: '#F2E8D5',
                color: '#010D00'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
            />
          </div>

          {/* 시간 포함 토글 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeTime"
              checked={includeTime}
              onChange={(e) => {
                setIncludeTime(e.target.checked);
                if (e.target.checked && !selectedTime) {
                  setSelectedTime('09:00');
                }
              }}
              className="w-4 h-4 rounded focus:ring-2"
              style={{ accentColor: '#5D4E3E' }}
            />
            <label 
              htmlFor="includeTime" 
              className="text-sm cursor-pointer font-medium"
              style={{ color: '#010D00' }}
            >
              시간 포함
            </label>
          </div>

          {/* 시간 선택 */}
          {includeTime && (
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: '#010D00' }}>
                시간
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 rounded focus:outline-none text-sm font-medium"
                style={{
                  border: '2px solid #E5DCC8',
                  backgroundColor: '#F2E8D5',
                  color: '#010D00'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
              >
                {timeOptions.map(time => {
                  const [hour, minute] = time.split(':').map(Number);
                  const period = hour < 12 ? '오전' : '오후';
                  const displayHour = hour % 12 || 12;
                  const displayText = minute === 0 
                    ? `${period} ${displayHour}시`
                    : `${period} ${displayHour}시 ${minute}분`;
                  
                  return (
                    <option key={time} value={time}>
                      {displayText}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>

        {/* footer */}
        <div 
          className="px-4 py-3 flex justify-end gap-2"
          style={{
            borderTop: '2px solid #E5DCC8',
            backgroundColor: '#F2E8D5'
          }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded transition-colors font-semibold"
            style={{
              backgroundColor: '#E5DCC8',
              color: '#010D00',
              border: '1px solid #E5DCC8'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5D4E3E'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm rounded transition-colors font-bold"
            style={{
              backgroundColor: '#5D4E3E',
              color: '#FEFDFB'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4A3F35'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5D4E3E'}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}