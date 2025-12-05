import { useState, useEffect } from 'react';
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
  
  // 시간을 AM/PM과 시:분으로 분리
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');

  // initialTime이 있으면 파싱
  useEffect(() => {
    if (initialTime) {
      const [h, m] = initialTime.split(':').map(Number);
      setPeriod(h >= 12 ? 'PM' : 'AM');
      setHour(String(h % 12 || 12));
      setMinute(String(m).padStart(2, '0'));
    } else {
      setHour('');
      setMinute('');
    }
  }, [initialTime]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (includeTime) {
      // AM/PM과 시:분을 24시간 형식으로 변환
      let hourValue = parseInt(hour, 10);
      if (Number.isNaN(hourValue) || hourValue < 1 || hourValue > 12) {
        hourValue = 9;
      }
      let hour24 = hourValue;
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      let minuteValue = parseInt(minute, 10);
      if (Number.isNaN(minuteValue) || minuteValue < 0 || minuteValue > 59) {
        minuteValue = 0;
      }
      const timeString = `${String(hour24).padStart(2, '0')}:${String(minuteValue).padStart(2, '0')}`;
      onConfirm(selectedDate, timeString);
    } else {
      onConfirm(selectedDate, undefined);
    }
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

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    if (value === '') {
      setHour('');
      return;
    }
    const num = parseInt(value, 10);
    if (num >= 1 && num <= 12) {
      setHour(value);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    if (value === '') {
      setMinute('');
      return;
    }
    const num = parseInt(value, 10);
    if (num >= 0 && num <= 59) {
      setMinute(value);
    }
  };

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
              onChange={(e) => setIncludeTime(e.target.checked)}
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

          {/* 시간 선택 - AM/PM + 직접 입력 */}
          {includeTime && (
            <div>
              <label className="text-xs font-bold mb-2 block" style={{ color: '#010D00' }}>
                시간
              </label>
              <div className="flex items-center gap-2">
                {/* AM/PM 선택 */}
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as 'AM' | 'PM')}
                  className="px-3 py-2 rounded focus:outline-none text-sm font-medium"
                  style={{
                    border: '2px solid #E5DCC8',
                    backgroundColor: '#F2E8D5',
                    color: '#010D00',
                    width: '80px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
                >
                  <option value="AM">오전</option>
                  <option value="PM">오후</option>
                </select>

                {/* 시 입력 */}
                <input
                  type="text"
                  value={hour}
                  onChange={handleHourChange}
                  placeholder="9"
                  maxLength={2}
                  className="px-3 py-2 rounded focus:outline-none text-sm font-medium text-center"
                  style={{
                    border: '2px solid #E5DCC8',
                    backgroundColor: '#F2E8D5',
                    color: '#010D00',
                    width: '60px'
                  }}
                  onFocus={(e) => e.currentTarget.select()}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
                />
                
                <span className="text-sm font-bold" style={{ color: '#010D00' }}>:</span>

                {/* 분 입력 */}
                <input
                  type="text"
                  value={minute}
                  onChange={handleMinuteChange}
                  placeholder="00"
                  maxLength={2}
                  className="px-3 py-2 rounded focus:outline-none text-sm font-medium text-center"
                  style={{
                    border: '2px solid #E5DCC8',
                    backgroundColor: '#F2E8D5',
                    color: '#010D00',
                    width: '60px'
                  }}
                  onFocus={(e) => e.currentTarget.select()}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5DCC8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F2E8D5'}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: '#8C8270' }}>
                시: 1-12, 분: 0-59
              </p>
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
