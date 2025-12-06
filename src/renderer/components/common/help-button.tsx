import { CircleHelp } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
}

export default function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2.5 rounded-xl bg-transparent text-text-secondary hover:bg-white dark:hover:bg-white/10 hover:text-text-primary transition-all active:scale-95"
      title="사용법 보기"
    >
      <CircleHelp size={20} strokeWidth={2.5} />
    </button>
  );
}