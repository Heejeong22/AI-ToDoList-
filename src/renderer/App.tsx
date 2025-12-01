
import TodoList from './components/todo-list';


declare global {
  interface Window {
    api: typeof window.api;
  }
}

export default function App() {

  return (
    <div className="fixed top-0 right-0 h-screen w-1/4 min-w-[400px] shadow-2xl">
      <TodoList />

    </div>
  );
}
