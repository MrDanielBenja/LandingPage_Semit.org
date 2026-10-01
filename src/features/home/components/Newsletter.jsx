import { useState } from 'react'
import { useLang } from '../../../app/providers/LangProvider'
import { useContent } from '../../../core/cms/contentStore'
import { DEFAULT_INICIO } from '../../../core/cms/defaultInicio'
import { fmtCssKey } from '../../../core/cms/fmt'

export function Newsletter({ preview }) {
  const { lang, t } = useLang()
  const { data: saved } = useContent('inicio', DEFAULT_INICIO)
  const cms = preview || saved
  const news = cms.news || DEFAULT_INICIO.news
  const H = (lang === 'en' ? news.h_en : news.h_es) || t('home.news.h3')
  const P = (lang === 'en' ? news.p_en : news.p_es) || t('home.news.p')
  const PH = (lang === 'en' ? news.ph_en : news.ph_es) || t('home.news.ph')
  const BT = (lang === 'en' ? news.btn_en : news.btn_es) || t('home.news.btn')
  const [mail, setMail] = useState('')
  const [ok, setOk] = useState(false)
  return (
    <div className="container home-sec rv">
      <div className="news-card" style={news.bg ? { background: news.bg } : undefined}>
        <h3 style={fmtCssKey(cms, 'news.h')}>{H}</h3>
        <p style={fmtCssKey(cms, 'news.p')}>{P}</p>
        {!ok ? (
          <form className="news-form" onSubmit={e => { e.preventDefault(); if (mail.includes('@')) setOk(true) }}>
            <input type="email" required value={mail} onChange={e => setMail(e.target.value)} placeholder={PH} />
            <button className="btn btn-blue" type="submit">{BT}</button>
          </form>
        ) : (
          <div className="note" style={{ textAlign: 'center' }}>{t('home.news.ok', { m: mail })}</div>
        )}
      </div>
    </div>
  )
}
