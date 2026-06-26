interface FollowUpChipsProps { questions: string[]; onSelect: (q: string) => void }

export function FollowUpChips({ questions, onSelect }: FollowUpChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {questions.map(q => (
        <button key={q} onClick={() => onSelect(q)}
          className="text-xs bg-muted hover:bg-muted/80 border rounded-full px-3 py-1.5 transition-colors text-muted-foreground hover:text-foreground">
          {q}
        </button>
      ))}
    </div>
  )
}
