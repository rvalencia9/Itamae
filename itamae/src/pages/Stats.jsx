import { S, COLOR, FONT } from '../styles/tokens.js'
import { SKILL_TREE } from '../data/constants.js'
import { computeDominio, computeLevel } from '../store/reducer.js'
import StatBox from '../components/StatBox.jsx'

export default function Stats({ state }) {
  const dominio      = computeDominio(state)
  const { level }    = computeLevel(state.xp)
  const totalHours   = Math.floor(state.totalMinutes / 60)

  // Last 7 days
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d  = new Date()
    d.setDate(d.getDate() - i)
    const ds = d.toDateString()
    const daySessions = state.sessions.filter(
      s => new Date(s.date).toDateString() === ds
    )
    const mins = daySessions.reduce((a, s) => a + s.duration, 0)
    last7.push({
      label: d.toLocaleDateString('es-MX', { weekday: 'short' }),
      mins,
      count: daySessions.length,
    })
  }
  const maxMins = Math.max(...last7.map(d => d.mins), 1)

  // Category strength sorted desc
  const catStats = SKILL_TREE.map(cat => {
    const keys = cat.skills.map(s => `${cat.id}::${s}`)
    const sum  = keys.reduce((acc, k) => acc + (state.skills[k] ?? 0), 0)
    const pct  = sum / (keys.length * 5)
    return { ...cat, pct }
  }).sort((a, b) => b.pct - a.pct)

  return (
    <div className="page-enter">
      <div style={S.pageTitle}>Estadísticas</div>
      <div style={S.pageSubtitle}>
        La evidencia de tu evolución. Los números no mienten.
      </div>

      {/* OVERVIEW */}
      <div style={{ ...S.grid(4), marginBottom: 24 }}>
        <StatBox label="Nivel"    value={level}                    sub="itamae" />
        <StatBox label="Dominio"  value={`${dominio}%`}            sub="general" />
        <StatBox label="XP"       value={state.xp.toLocaleString()} sub="total" />
        <StatBox label="Sesiones" value={state.sessions.length}    sub="registradas" accent="#a8c4c9" />
      </div>

      {/* WEEKLY CHART */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={S.cardTitle}>Actividad — Últimos 7 días</div>
        <div style={{
          display: 'flex', gap: 8,
          alignItems: 'flex-end', height: 140, paddingTop: 8,
        }}>
          {last7.map((d, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', height: '100%',
            }}>
              <div style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>
                {d.mins > 0 ? `${d.mins}m` : ''}
              </div>
              <div style={{
                flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end',
              }}>
                <div style={{
                  width: '100%',
                  height: `${(d.mins / maxMins) * 100}%`,
                  minHeight: d.mins > 0 ? 4 : 0,
                  background: d.mins > 0
                    ? `linear-gradient(180deg, ${COLOR.gold}, #7a5a1a)`
                    : '#1a1a1a',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
                  opacity: 0.9,
                }} />
              </div>
              <div style={{ fontSize: 10, color: '#555', marginTop: 6 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TIME BREAKDOWN */}
      <div style={{ ...S.grid(3), marginBottom: 20 }}>
        <StatBox
          label="Horas totales"
          value={`${totalHours}h`}
          sub={`${state.totalMinutes % 60} min adicionales`}
          accent="#a8c4c9"
        />
        <StatBox
          label="Racha actual"
          value={`${state.streak.current}d`}
          sub={`Mejor racha: ${state.streak.best} días`}
          accent={COLOR.gold}
        />
        <StatBox
          label="Sesión promedio"
          value={state.sessions.length
            ? `${Math.round(state.totalMinutes / state.sessions.length)} min`
            : '—'
          }
          sub="por sesión registrada"
          accent="#7a9e8a"
        />
      </div>

      {/* CATEGORY STRENGTH */}
      <div style={S.card}>
        <div style={S.cardTitle}>Fortaleza por categoría</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {catStats.map(cat => (
            <div key={cat.id}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 6,
              }}>
                <span style={{ fontSize: 13, color: '#ccc' }}>
                  {cat.icon} {cat.label}
                </span>
                <span style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>
                  {Math.round(cat.pct * 100)}%
                </span>
              </div>
              <div style={{ ...S.xpBar, height: 5 }}>
                <div style={{
                  height: '100%',
                  width: `${cat.pct * 100}%`,
                  background: cat.color,
                  borderRadius: 2,
                  transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
