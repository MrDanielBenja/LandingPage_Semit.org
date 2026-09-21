export function Pill({ children }) {
  return <span className="pill">{children}</span>
}

export function SectionHead({ pill, title, sub }) {
  return (
    <div className="hsec rv">
      {pill && <Pill>{pill}</Pill>}
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  )
}
