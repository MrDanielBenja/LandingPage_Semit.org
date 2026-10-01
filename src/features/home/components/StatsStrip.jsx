import { Stat } from '../../../shared/ui/Stat'
import { useLang } from '../../../app/providers/LangProvider'

export function StatsStrip() {
  const { t } = useLang()
  return (
    <div className="strip rv">
      <Stat v={475} label={t('home.portada.est')} />
      <Stat v={275} label={t('home.portada.mis')} />
      <Stat v={60} label={t('home.portada.doc')} />
      <div><b>4.9★</b>rating</div>
    </div>
  )
}
