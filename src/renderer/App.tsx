import TextInput from './components/common/TextInput';

export default function App() {
  const handleSubmit = (value: string) => {
    console.log('입력받은 값:', value);
    alert(`입력한 내용: ${value}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">AI TODO 앱</h1>
      <p className="text-gray-600 mb-6">할 일을 입력하고 AI가 자동으로 분류해드립니다!</p>
      
      <TextInput
        placeholder="할 일을 자유롭게 입력하세요."
        maxLength={100}
        rows={3}
        onSubmit={handleSubmit}
      />
    </div>
  );
}