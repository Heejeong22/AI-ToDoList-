import TodoList from './components/todo-list';

export default function App() {
  return (
    <div className="fixed top-0 right-0 h-screen w-1/4 min-w-[400px] shadow-2xl">
      <TodoList />
    </div>
  );
}