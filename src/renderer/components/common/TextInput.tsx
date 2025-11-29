import { useState, KeyboardEvent, ChangeEvent } from 'react';

interface TextInputProps {
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  onSubmit: (value: string) => void;
}

const TextInput = ({
  placeholder = '입력하세요',
  maxLength = 100,
  rows = 3,
  onSubmit,
}: TextInputProps) => {
  const [inputValue, setInputValue] = useState('');

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

    onSubmit(trimmedValue);
    setInputValue('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <textarea
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">
          {inputValue.length}/{maxLength}
        </span>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
        >
          추가
        </button>
      </div>
    </div>
  );
};

export default TextInput;