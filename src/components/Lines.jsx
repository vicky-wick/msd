// Renders each line inside an overflow mask so it can slide up into view (see data-lines in useScrollFx).
export default function Lines({ as: Tag = 'h2', lines, className = '', reveal = true, ...rest }) {
  return (
    <Tag className={className} {...(reveal ? { 'data-lines': '' } : {})} {...rest}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  )
}
