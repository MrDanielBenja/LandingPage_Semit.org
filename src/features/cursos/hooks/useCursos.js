import { useEffect, useState } from 'react'
import { CURSOS } from '../data/cursos.data'
import { fetchCursos } from '../services/cursos.service'
import { apiBase } from '../../../core/cms/apiBase'

export function useCursos(params = {}) {
  const [data, setData] = useState(CURSOS)
  const [meta, setMeta] = useState(null)
  const [source, setSource] = useState('local')
  const [loading, setLoading] = useState(apiBase() != null)
  const [error, setError] = useState(null)
  const key = JSON.stringify(params)

  useEffect(() => {
    if (apiBase() == null) return
    let alive = true
    setLoading(true)
    setError(null)
    fetchCursos(JSON.parse(key))
      .then(r => {
        if (!alive) return
        setData(r.data.length ? r.data : CURSOS)
        setMeta(r.meta)
        setSource(r.data.length ? r.source : 'local')
      })
      .catch(e => { if (alive) { setError(e); setData(CURSOS); setSource('local') } })
      .finally(() => { if (alive) setLoading(false) })
  }, [key])

  return { data, meta, source, loading, error }
}
