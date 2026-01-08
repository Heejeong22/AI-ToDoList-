import { ChevronsDown, ChevronsUp } from 'lucide-react';

interface ExpandCollapseButtonProps {
  expandedCategories: Set<string>;
  totalCategories: number;
  onToggleAll: () => void;
}

export default function ExpandCollapseButton({
  expandedCategories,
  onToggleAll
}: ExpandCollapseButtonProps) {
  const hasAnyExpanded = expandedCategories.size > 0;

  return (
    <button
      onClick={onToggleAll}
      className="p-2.5 rounded-xl bg-transparent text-text-secondary hover:bg-white dark:hover:bg-white/10 hover:text-text-primary transition-all active:scale-95"
      title={hasAnyExpanded ? 'Collapse All' : 'Expand All'}
    >
      {hasAnyExpanded ? (
        <ChevronsUp size={20} strokeWidth={2.5} />
      ) : (
        <ChevronsDown size={20} strokeWidth={2.5} />
      )}
    </button>
  );
}