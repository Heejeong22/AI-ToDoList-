import { useState } from 'react';
import TextInput from './components/common/TextInput';

declare global {
  interface Window {
    api: typeof window.api;
  }
}

export default function App() {
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (value: string) => {
    console.log('입력받은 값:', value);

    const res = await window.api.ai.gptAnalyzeTodo(value);

    if (res.success) {
      setResult(res.data);
    } else {
      setResult({ error: res.error });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">AI TODO 앱</h1>
      <p className="text-gray-600 mb-6">할 일을 입력하고 AI가 자동으로 분류해드립니다!</p>

      {/* 기존 텍스트 입력 그대로 */}
      <TextInput
        placeholder="할 일을 자유롭게 입력하세요."
        maxLength={100}
        rows={3}
        onSubmit={handleSubmit}
      />

      {/* 🔥 최소한의 추가 — GPT 결과 표시 */}
      {result && (
        <pre className="mt-6 p-4 bg-white shadow rounded text-sm whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
