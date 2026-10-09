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
  ['AD', 'AND', 'Andorra', 'Andorra'],
  ['AM', 'ARM', 'Armenia', 'Armenia'],
  ['AZ', 'AZE', 'Azerbaiyán', 'Azerbaijan'],
  ['BH', 'BHR', 'Baréin', 'Bahrain'],
  ['BY', 'BLR', 'Bielorrusia', 'Belarus'],
  ['BJ', 'BEN', 'Benín', 'Benin'],
  ['BM', 'BMU', 'Bermudas', 'Bermuda'],
  ['BT', 'BTN', 'Bután', 'Bhutan'],
  ['BW', 'BWA', 'Botsuana', 'Botswana'],
  ['BN', 'BRN', 'Brunéi', 'Brunei'],
  ['BF', 'BFA', 'Burkina Faso', 'Burkina Faso'],
  ['BI', 'BDI', 'Burundi', 'Burundi'],
  ['CV', 'CPV', 'Cabo Verde', 'Cabo Verde'],
  ['KH', 'KHM', 'Camboya', 'Cambodia'],
  ['KY', 'CYM', 'Islas Caimán', 'Cayman Islands'],
  ['CF', 'CAF', 'República Centroafricana', 'Central African Republic'],
  ['TD', 'TCD', 'Chad', 'Chad'],
  ['KM', 'COM', 'Comoras', 'Comoros'],
  ['CG', 'COG', 'República del Congo', 'Republic of the Congo'],
  ['CD', 'COD', 'República Democrática del Congo', 'Democratic Republic of the Congo'],
  ['CK', 'COK', 'Islas Cook', 'Cook Islands'],
  ['CI', 'CIV', 'Costa de Marfil', 'Ivory Coast'],
  ['CW', 'CUW', 'Curazao', 'Curacao'],
  ['DJ', 'DJI', 'Yibuti', 'Djibouti'],
  ['GQ', 'GNQ', 'Guinea Ecuatorial', 'Equatorial Guinea'],
  ['ER', 'ERI', 'Eritrea', 'Eritrea'],
  ['SZ', 'SWZ', 'Esuatini', 'Eswatini'],
  ['FK', 'FLK', 'Islas Malvinas', 'Falkland Islands'],
  ['FO', 'FRO', 'Islas Feroe', 'Faroe Islands'],
  ['GF', 'GUF', 'Guayana Francesa', 'French Guiana'],
  ['PF', 'PYF', 'Polinesia Francesa', 'French Polynesia'],
  ['TF', 'ATF', 'Territorios Australes Franceses', 'French Southern Territories'],
  ['GA', 'GAB', 'Gabón', 'Gabon'],
  ['GM', 'GMB', 'Gambia', 'Gambia'],
  ['GE', 'GEO', 'Georgia', 'Georgia'],
  ['GI', 'GIB', 'Gibraltar', 'Gibraltar'],
  ['GL', 'GRL', 'Groenlandia', 'Greenland'],
  ['GP', 'GLP', 'Guadalupe', 'Guadeloupe'],
  ['GU', 'GUM', 'Guam', 'Guam'],
  ['GG', 'GGY', 'Guernsey', 'Guernsey'],
  ['GN', 'GIN', 'Guinea', 'Guinea'],
  ['GW', 'GNB', 'Guinea-Bisáu', 'Guinea-Bissau'],
  ['HM', 'HMD', 'Islas Heard y McDonald', 'Heard and McDonald Islands'],
  ['VA', 'VAT', 'Vaticano', 'Vatican City'],
  ['HK', 'HKG', 'Hong Kong', 'Hong Kong'],
  ['IM', 'IMN', 'Isla de Man', 'Isle of Man'],
  ['JE', 'JEY', 'Jersey', 'Jersey'],
  ['KI', 'KIR', 'Kiribati', 'Kiribati'],
  ['KP', 'PRK', 'Corea del Norte', 'North Korea'],
  ['KG', 'KGZ', 'Kirguistán', 'Kyrgyzstan'],
  ['LA', 'LAO', 'Laos', 'Laos'],
  ['LS', 'LSO', 'Lesoto', 'Lesotho'],
  ['LR', 'LBR', 'Liberia', 'Liberia'],
  ['LY', 'LBY', 'Libia', 'Libya'],
  ['LI', 'LIE', 'Liechtenstein', 'Liechtenstein'],
  ['MO', 'MAC', 'Macao', 'Macao'],
  ['MG', 'MDG', 'Madagascar', 'Madagascar'],
  ['MW', 'MWI', 'Malaui', 'Malawi'],
  ['MV', 'MDV', 'Maldivas', 'Maldives'],
  ['ML', 'MLI', 'Malí', 'Mali'],
  ['MH', 'MHL', 'Islas Marshall', 'Marshall Islands'],
  ['MQ', 'MTQ', 'Martinica', 'Martinique'],
  ['MR', 'MRT', 'Mauritania', 'Mauritania'],
  ['MU', 'MUS', 'Mauricio', 'Mauritius'],
  ['YT', 'MYT', 'Mayotte', 'Mayotte'],
  ['FM', 'FSM', 'Micronesia', 'Micronesia'],
  ['MD', 'MDA', 'Moldavia', 'Moldova'],
  ['MC', 'MCO', 'Mónaco', 'Monaco'],
  ['MN', 'MNG', 'Mongolia', 'Mongolia'],
  ['MS', 'MSR', 'Montserrat', 'Montserrat'],
  ['MM', 'MMR', 'Birmania', 'Myanmar'],
  ['NA', 'NAM', 'Namibia', 'Namibia'],
  ['NR', 'NRU', 'Nauru', 'Nauru'],
  ['NC', 'NCL', 'Nueva Caledonia', 'New Caledonia'],
  ['NE', 'NER', 'Níger', 'Niger'],
  ['NU', 'NIU', 'Niue', 'Niue'],
  ['NF', 'NFK', 'Isla Norfolk', 'Norfolk Island'],
  ['MP', 'MNP', 'Islas Marianas del Norte', 'Northern Mariana Islands'],
  ['OM', 'OMN', 'Omán', 'Oman'],
  ['PW', 'PLW', 'Palaos', 'Palau'],
  ['PS', 'PSE', 'Palestina', 'Palestine'],
  ['PG', 'PNG', 'Papúa Nueva Guinea', 'Papua New Guinea'],
  ['PN', 'PCN', 'Islas Pitcairn', 'Pitcairn Islands'],
  ['RE', 'REU', 'Reunión', 'Reunion'],
  ['RU', 'RUS', 'Rusia', 'Russia'],
  ['RW', 'RWA', 'Ruanda', 'Rwanda'],
  ['BL', 'BLM', 'San Bartolomé', 'Saint Barthelemy'],
  ['SH', 'SHN', 'Santa Elena', 'Saint Helena'],
  ['MF', 'MAF', 'San Martín (Francia)', 'Saint Martin'],
  ['PM', 'SPM', 'San Pedro y Miquelón', 'Saint Pierre and Miquelon'],
  ['WS', 'WSM', 'Samoa', 'Samoa'],
  ['SM', 'SMR', 'San Marino', 'San Marino'],
  ['ST', 'STP', 'Santo Tomé y Príncipe', 'Sao Tome and Principe'],
  ['SL', 'SLE', 'Sierra Leona', 'Sierra Leone'],
  ['SX', 'SXM', 'San Martín (Países Bajos)', 'Sint Maarten'],
  ['SB', 'SLB', 'Islas Salomón', 'Solomon Islands'],
  ['SO', 'SOM', 'Somalia', 'Somalia'],
  ['GS', 'SGS', 'Georgias del Sur', 'South Georgia'],
  ['SS', 'SSD', 'Sudán del Sur', 'South Sudan'],
  ['SD', 'SDN', 'Sudán', 'Sudan'],
  ['SJ', 'SJM', 'Svalbard y Jan Mayen', 'Svalbard and Jan Mayen'],
  ['SY', 'SYR', 'Siria', 'Syria'],
  ['TW', 'TWN', 'Taiwán', 'Taiwan'],
  ['TJ', 'TJK', 'Tayikistán', 'Tajikistan'],
  ['TZ', 'TZA', 'Tanzania', 'Tanzania'],
  ['TL', 'TLS', 'Timor Oriental', 'Timor-Leste'],
  ['TG', 'TGO', 'Togo', 'Togo'],
  ['TK', 'TKL', 'Tokelau', 'Tokelau'],
  ['TO', 'TON', 'Tonga', 'Tonga'],
  ['TM', 'TKM', 'Turkmenistán', 'Turkmenistan'],
  ['TC', 'TCA', 'Islas Turcas y Caicos', 'Turks and Caicos Islands'],
  ['TV', 'TUV', 'Tuvalu', 'Tuvalu'],
  ['UG', 'UGA', 'Uganda', 'Uganda'],
  ['UM', 'UMI', 'Islas Ultramarinas de EE. UU.', 'US Minor Outlying Islands'],
  ['UZ', 'UZB', 'Uzbekistán', 'Uzbekistan'],
  ['VU', 'VUT', 'Vanuatu', 'Vanuatu'],
  ['VG', 'VGB', 'Islas Vírgenes Británicas', 'British Virgin Islands'],
  ['VI', 'VIR', 'Islas Vírgenes de EE. UU.', 'US Virgin Islands'],
  ['WF', 'WLF', 'Wallis y Futuna', 'Wallis and Futuna'],
  ['EH', 'ESH', 'Sáhara Occidental', 'Western Sahara'],
  ['YE', 'YEM', 'Yemen', 'Yemen'],
  ['ZM', 'ZMB', 'Zambia', 'Zambia'],
  ['ZW', 'ZWE', 'Zimbabue', 'Zimbabwe'],
  ['AX', 'ALA', 'Islas Åland', 'Aland Islands'],
  ['AQ', 'ATA', 'Antártida', 'Antarctica'],
  ['AS', 'ASM', 'Samoa Americana', 'American Samoa'],
  ['AW', 'ABW', 'Aruba', 'Aruba'],
  ['BQ', 'BES', 'Caribe Neerlandés', 'Caribbean Netherlands'],
  ['BV', 'BVT', 'Isla Bouvet', 'Bouvet Island'],
  ['IO', 'IOT', 'Territorio Británico del Índico', 'British Indian Ocean Territory'],
  ['CX', 'CXR', 'Isla de Navidad', 'Christmas Island'],
  ['CC', 'CCK', 'Islas Cocos', 'Cocos Islands'],
  ['AI', 'AIA', 'Anguila', 'Anguilla'],
  ['XK', 'XKX', 'Kosovo', 'Kosovo'],
]

export function flagOf(iso2) {
  const s = String(iso2 || '').toUpperCase()
  if (!/^[A-Z]{2}$/.test(s)) return ''
  return String.fromCodePoint(...[...s].map((c) => 0x1F1E6 + c.charCodeAt(0) - 65))
}

const RAW_BY_ISO2 = Object.fromEntries(RAW.map(([iso2, id, name_es, name_en]) => [iso2, { id, name_es, name_en }]))
const RAW_ORDER = RAW.map(([iso2]) => iso2)

let _dnEs = null
let _dnEn = null
let _dnInit = false
function dnInit() {
  if (_dnInit) return
  _dnInit = true
  try { _dnEs = new Intl.DisplayNames(['es'], { type: 'region' }) } catch { _dnEs = null }
  try { _dnEn = new Intl.DisplayNames(['en'], { type: 'region' }) } catch { _dnEn = null }
}

function dispName(dn, iso2, fb) {
  if (dn) {
    try {
      const v = dn.of(iso2)
      if (v && v !== iso2) return v
    } catch {}
  }
  return fb
}

function allIso2() {
  let extra = []
  try {
    const r = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('region') : null
    if (Array.isArray(r) && r.length > 100) {
      extra = r.filter((c) => /^[A-Z]{2}$/.test(c) && c !== 'EU' && c !== 'EZ')
    }
  } catch {}
  const seen = new Set()
  const out = []
  for (const c of [...RAW_ORDER, ...extra]) {
    if (!seen.has(c)) { seen.add(c); out.push(c) }
  }
  return out
}

function buildCatalog() {
  dnInit()
  return allIso2().map((iso2) => {
    const fb = RAW_BY_ISO2[iso2] || {}
    return {
      id: fb.id || iso2,
      iso2,
      name_es: dispName(_dnEs, iso2, fb.name_es || iso2),
      name_en: dispName(_dnEn, iso2, fb.name_en || iso2),
      flag: flagOf(iso2),
    }
  })
}

export const PAISES_CATALOG = buildCatalog()

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

export function memberPaises(m) {
  const raw = Array.isArray(m?.paises) && m.paises.length ? m.paises : (m?.p ? [m.p] : [])
  const seen = new Set()
  const out = []
  for (const item of raw) {
    const id = aliasPaisId(typeof item === 'string' ? item : item?.id)
    if (!id || seen.has(id)) continue
    seen.add(id)
    out.push(id)
    if (out.length >= 5) break
  }
  return out.length ? out : [aliasPaisId('PER')]
}

export function memberHasPais(m, filtroId) {
  if (filtroId === 'Todos') return true
  const f = aliasPaisId(filtroId)
  return memberPaises(m).some((id) => id === f)
}

export function flagNameList(paises, ids, lang = 'es') {
  return (Array.isArray(ids) ? ids : []).map((id) => `${flagFor(paises, id)} ${paisName(paises, id, lang)}`.trim()).join(' · ')
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
