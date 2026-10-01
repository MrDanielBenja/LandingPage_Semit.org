const RAW = [
  ['PE', 'PER', 'Perú', 'Peru'],
  ['AR', 'ARG', 'Argentina', 'Argentina'],
  ['BO', 'BOL', 'Bolivia', 'Bolivia'],
  ['BR', 'BRA', 'Brasil', 'Brazil'],
  ['CL', 'CHL', 'Chile', 'Chile'],
  ['CO', 'COL', 'Colombia', 'Colombia'],
  ['EC', 'ECU', 'Ecuador', 'Ecuador'],
  ['UY', 'URY', 'Uruguay', 'Uruguay'],
  ['PY', 'PRY', 'Paraguay', 'Paraguay'],
  ['VE', 'VEN', 'Venezuela', 'Venezuela'],
  ['MX', 'MEX', 'México', 'Mexico'],
  ['GT', 'GTM', 'Guatemala', 'Guatemala'],
  ['HN', 'HND', 'Honduras', 'Honduras'],
  ['SV', 'SLV', 'El Salvador', 'El Salvador'],
  ['NI', 'NIC', 'Nicaragua', 'Nicaragua'],
  ['CR', 'CRI', 'Costa Rica', 'Costa Rica'],
  ['PA', 'PAN', 'Panamá', 'Panama'],
  ['DO', 'DOM', 'República Dominicana', 'Dominican Republic'],
  ['CU', 'CUB', 'Cuba', 'Cuba'],
  ['HT', 'HTI', 'Haití', 'Haiti'],
  ['JM', 'JAM', 'Jamaica', 'Jamaica'],
  ['TT', 'TTO', 'Trinidad y Tobago', 'Trinidad and Tobago'],
  ['US', 'USA', 'Estados Unidos', 'United States'],
  ['CA', 'CAN', 'Canadá', 'Canada'],
  ['BZ', 'BLZ', 'Belice', 'Belize'],
  ['GY', 'GUY', 'Guyana', 'Guyana'],
  ['SR', 'SUR', 'Surinam', 'Suriname'],
  ['PR', 'PRI', 'Puerto Rico', 'Puerto Rico'],
  ['BS', 'BHS', 'Bahamas', 'Bahamas'],
  ['BB', 'BRB', 'Barbados', 'Barbados'],
  ['GD', 'GRD', 'Granada', 'Grenada'],
  ['LC', 'LCA', 'Santa Lucía', 'Saint Lucia'],
  ['VC', 'VCT', 'San Vicente y las Granadinas', 'Saint Vincent and the Grenadines'],
  ['AG', 'ATG', 'Antigua y Barbuda', 'Antigua and Barbuda'],
  ['DM', 'DMA', 'Dominica', 'Dominica'],
  ['KN', 'KNA', 'San Cristóbal y Nieves', 'Saint Kitts and Nevis'],
  ['ES', 'ESP', 'España', 'Spain'],
  ['FR', 'FRA', 'Francia', 'France'],
  ['IT', 'ITA', 'Italia', 'Italy'],
  ['DE', 'DEU', 'Alemania', 'Germany'],
  ['GB', 'GBR', 'Reino Unido', 'United Kingdom'],
  ['PT', 'PRT', 'Portugal', 'Portugal'],
  ['NL', 'NLD', 'Países Bajos', 'Netherlands'],
  ['BE', 'BEL', 'Bélgica', 'Belgium'],
  ['CH', 'CHE', 'Suiza', 'Switzerland'],
  ['AT', 'AUT', 'Austria', 'Austria'],
  ['IE', 'IRL', 'Irlanda', 'Ireland'],
  ['SE', 'SWE', 'Suecia', 'Sweden'],
  ['NO', 'NOR', 'Noruega', 'Norway'],
  ['DK', 'DNK', 'Dinamarca', 'Denmark'],
  ['FI', 'FIN', 'Finlandia', 'Finland'],
  ['PL', 'POL', 'Polonia', 'Poland'],
  ['CZ', 'CZE', 'Chequia', 'Czechia'],
  ['SK', 'SVK', 'Eslovaquia', 'Slovakia'],
  ['HU', 'HUN', 'Hungría', 'Hungary'],
  ['RO', 'ROU', 'Rumanía', 'Romania'],
  ['BG', 'BGR', 'Bulgaria', 'Bulgaria'],
  ['GR', 'GRC', 'Grecia', 'Greece'],
  ['HR', 'HRV', 'Croacia', 'Croatia'],
  ['SI', 'SVN', 'Eslovenia', 'Slovenia'],
  ['BA', 'BIH', 'Bosnia y Herzegovina', 'Bosnia and Herzegovina'],
  ['RS', 'SRB', 'Serbia', 'Serbia'],
  ['ME', 'MNE', 'Montenegro', 'Montenegro'],
  ['MK', 'MKD', 'Macedonia del Norte', 'North Macedonia'],
  ['AL', 'ALB', 'Albania', 'Albania'],
  ['UA', 'UKR', 'Ucrania', 'Ukraine'],
  ['LT', 'LTU', 'Lituania', 'Lithuania'],
  ['LV', 'LVA', 'Letonia', 'Latvia'],
  ['EE', 'EST', 'Estonia', 'Estonia'],
  ['IS', 'ISL', 'Islandia', 'Iceland'],
  ['LU', 'LUX', 'Luxemburgo', 'Luxembourg'],
  ['MT', 'MLT', 'Malta', 'Malta'],
  ['CY', 'CYP', 'Chipre', 'Cyprus'],
  ['CN', 'CHN', 'China', 'China'],
  ['JP', 'JPN', 'Japón', 'Japan'],
  ['KR', 'KOR', 'Corea del Sur', 'South Korea'],
  ['IN', 'IND', 'India', 'India'],
  ['PK', 'PAK', 'Pakistán', 'Pakistan'],
  ['BD', 'BGD', 'Bangladés', 'Bangladesh'],
  ['LK', 'LKA', 'Sri Lanka', 'Sri Lanka'],
  ['NP', 'NPL', 'Nepal', 'Nepal'],
  ['AF', 'AFG', 'Afganistán', 'Afghanistan'],
  ['IR', 'IRN', 'Irán', 'Iran'],
  ['IQ', 'IRQ', 'Irak', 'Iraq'],
  ['SA', 'SAU', 'Arabia Saudita', 'Saudi Arabia'],
  ['AE', 'ARE', 'Emiratos Árabes Unidos', 'United Arab Emirates'],
  ['QA', 'QAT', 'Catar', 'Qatar'],
  ['KW', 'KWT', 'Kuwait', 'Kuwait'],
  ['JO', 'JOR', 'Jordania', 'Jordan'],
  ['LB', 'LBN', 'Líbano', 'Lebanon'],
  ['IL', 'ISR', 'Israel', 'Israel'],
  ['TR', 'TUR', 'Turquía', 'Türkiye'],
  ['KZ', 'KAZ', 'Kazajistán', 'Kazakhstan'],
  ['TH', 'THA', 'Tailandia', 'Thailand'],
  ['VN', 'VNM', 'Vietnam', 'Vietnam'],
  ['MY', 'MYS', 'Malasia', 'Malaysia'],
  ['SG', 'SGP', 'Singapur', 'Singapore'],
  ['ID', 'IDN', 'Indonesia', 'Indonesia'],
  ['PH', 'PHL', 'Filipinas', 'Philippines'],
  ['EG', 'EGY', 'Egipto', 'Egypt'],
  ['MA', 'MAR', 'Marruecos', 'Morocco'],
  ['DZ', 'DZA', 'Argelia', 'Algeria'],
  ['TN', 'TUN', 'Túnez', 'Tunisia'],
  ['ET', 'ETH', 'Etiopía', 'Ethiopia'],
  ['KE', 'KEN', 'Kenia', 'Kenya'],
  ['NG', 'NGA', 'Nigeria', 'Nigeria'],
  ['GH', 'GHA', 'Ghana', 'Ghana'],
  ['SN', 'SEN', 'Senegal', 'Senegal'],
  ['CM', 'CMR', 'Camerún', 'Cameroon'],
  ['ZA', 'ZAF', 'Sudáfrica', 'South Africa'],
  ['AO', 'AGO', 'Angola', 'Angola'],
  ['MZ', 'MOZ', 'Mozambique', 'Mozambique'],
  ['AU', 'AUS', 'Australia', 'Australia'],
  ['NZ', 'NZL', 'Nueva Zelanda', 'New Zealand'],
  ['FJ', 'FJI', 'Fiyi', 'Fiji'],
]

export function flagOf(iso2) {
  const s = String(iso2 || '').toUpperCase()
  if (!/^[A-Z]{2}$/.test(s)) return ''
  return String.fromCodePoint(...[...s].map((c) => 0x1F1E6 + c.charCodeAt(0) - 65))
}

export const PAISES_CATALOG = RAW.map(([iso2, id, name_es, name_en]) => ({
  id, iso2, name_es, name_en, flag: flagOf(iso2),
}))

export const PAIS_ALIAS = {
  'REP DOM': 'DOM', 'R DOM': 'DOM', 'RD': 'DOM', 'REP. DOM.': 'DOM',
  EEUU: 'USA', EUA: 'USA', US: 'USA', 'EE.UU.': 'USA',
  PE: 'PER', AR: 'ARG', 'R DOM': 'DOM',
}

export function aliasPaisId(id) {
  const k = String(id || '').trim().toUpperCase()
  if (!k) return ''
  return PAIS_ALIAS[k] || k
}

export function catalogById(id) {
  const k = aliasPaisId(id)
  return PAISES_CATALOG.find((p) => p.id === k) || null
}

export function searchPaises(q, lang = 'es', limit = 8) {
  const needle = String(q || '').trim().toLowerCase()
  const pick = (p) => (lang === 'en' ? p.name_en : p.name_es)
  if (!needle) return PAISES_CATALOG.slice(0, limit)
  const out = []
  for (const p of PAISES_CATALOG) {
    if (
      p.name_es.toLowerCase().includes(needle) ||
      p.name_en.toLowerCase().includes(needle) ||
      p.id.toLowerCase().includes(needle) ||
      p.iso2.toLowerCase() === needle
    ) {
      out.push(p)
      if (out.length >= limit) break
    }
  }
  return out.map((p) => ({ ...p, label: pick(p) }))
}

export function normalizePaises(v, fb) {
  const src = Array.isArray(v) && v.length ? v : Array.isArray(fb) ? fb : []
  const seen = new Set()
  const out = []
  for (const item of src) {
    const id = aliasPaisId(typeof item === 'string' ? item : item?.id)
    if (!id || seen.has(id)) continue
    seen.add(id)
    const cat = catalogById(id)
    const iso2 = (typeof item === 'object' && item?.iso2) || cat?.iso2 || ''
    out.push({
      id,
      iso2,
      name_es: (typeof item === 'object' && item?.name_es) || cat?.name_es || id,
      name_en: (typeof item === 'object' && item?.name_en) || cat?.name_en || id,
    })
  }
  return out
}

export function defaultPaises(ids = ['PER', 'USA', 'ARG', 'DOM']) {
  return normalizePaises(ids, [])
}

export function paisName(paises, id, lang = 'es') {
  const pid = aliasPaisId(id)
  const hit = (Array.isArray(paises) ? paises : []).find((p) => aliasPaisId(p?.id) === pid)
  if (hit) return lang === 'en' ? hit.name_en || hit.name_es : hit.name_es || hit.name_en
  return catalogById(pid)?.[lang === 'en' ? 'name_en' : 'name_es'] || pid
}

export function flagFor(paises, id) {
  const pid = aliasPaisId(id)
  const hit = (Array.isArray(paises) ? paises : []).find((p) => aliasPaisId(p?.id) === pid)
  if (hit?.iso2) return flagOf(hit.iso2)
  return catalogById(pid)?.flag || ''
}
