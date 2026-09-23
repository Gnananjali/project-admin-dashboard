export default function EmptyState({ title = "Nothing here yet", hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-ink-100 py-16 text-center">
      <p className="font-medium text-ink-900">{title}</p>
      {hint && <p className="text-sm text-ink-500">{hint}</p>}
    </div>
  );
}
