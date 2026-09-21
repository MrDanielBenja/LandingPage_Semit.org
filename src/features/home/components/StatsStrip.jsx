import { Stat } from '../../../shared/ui/Stat'

export function StatsStrip() {
  return (
    <div className="strip rv">
      <Stat v={475} label="estudiantes" />
      <Stat v={275} label="misioneros" />
      <Stat v={60} label="docentes" />
      <div><b>4.9★</b>rating</div>
    </div>
  )
}
