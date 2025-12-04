interface ExpandCollapseButtonProps {
  expandedCategories: Set<string>;
  totalCategories: number;
  onToggleAll: () => void;
}

export default function ExpandCollapseButton({
  expandedCategories,
  totalCategories,
  onToggleAll
}: ExpandCollapseButtonProps) {
  const hasAnyExpanded = expandedCategories.size > 0;

  return (
    <button
      onClick={onToggleAll}
      className="p-2 hover:bg-bg-hover rounded transition-colors text-text-primary border border-border"
      title={hasAnyExpanded ? '모두 축소' : '모두 확장'}
    >
      {hasAnyExpanded ? (
        // 축소 아이콘
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" transform="rotate(90 12 12)" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19l7-7-7-7" transform="rotate(90 12 12)" />
        </svg>
      ) : (
        // 확장 아이콘
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7" />
        </svg>
      )}
    </button>
  );
}