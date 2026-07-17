interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "strong"
  as?: "div" | "section" | "article" | "aside"
}

export function GlassPanel({
  children,
  variant = "default",
  className = "",
  as: Tag = "div",
  ...props
}: GlassPanelProps) {
  const base = variant === "strong" ? "glass-panel-strong" : "glass-panel"

  return (
    <Tag className={`rounded-2xl ${base} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
