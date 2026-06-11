interface PlaceholderPanelProps {
  title: string
  description: string
}

export function PlaceholderPanel({ title, description }: PlaceholderPanelProps) {
  return (
    <div className="placeholder-panel">
      <h2 className="placeholder-panel__title">{title}</h2>
      <p>{description}</p>
    </div>
  )
}
