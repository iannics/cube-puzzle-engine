interface PlaceholderPanelProps {
  title: string
  description: string
}

export function PlaceholderPanel({ title, description }: PlaceholderPanelProps) {
  return (
    <div className="text-[0.85rem] leading-relaxed text-text-muted">
      <h2 className="mb-2 text-[0.9rem] font-semibold text-text-primary">{title}</h2>
      <p>{description}</p>
    </div>
  )
}
