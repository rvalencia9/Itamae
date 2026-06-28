import { S, COLOR } from '../styles/tokens.js'
import { ACHIEVEMENTS, RANKS } from '../data/constants.js'
import { computeDominio, getCurrentRank } from '../store/reducer.js'

function checkUnlocked(achievement, state) {
  const dominio = computeDominio(state)
  switch (achievement.id) {
    case 'first_session':   return state.sessions.length >= 1
    case 'sessions_10':     return state.sessions.length >= 10
    case 'sessions_50':     return state.sessions.length >= 50
    case 'streak_7':        return state.streak.best >= 7
    case 'streak_30':       return state.streak.best >= 30
    case 'skill_first':     return Object.values(state.skills).some(v => v === 5)
    case 'skills_10':       return Object.values(state.skills).filter(v => v === 5).length >= 10
    case 'rank_2':          return dominio >= 16 && state.xp >= 1500
    case 'rank_5':          return dominio >= 48 && state.xp >= 9000
    case 'xp_1000':         return state.xp >= 1000
    case 'xp_10000':        return state.xp >= 10000
    case 'hours_10':        return state.totalMinutes >= 600
    case 'hours_100':       return state.totalMinutes >= 6000
    case 'eval_perfect':    return state.evaluations.some(e => e.score === 5)
    case 'eval_10_perfect': return state.evaluations.filter(e => e.score === 5).length >= 10
    default:                return false
  }
}

export default function Achievements({ state }) {
  const unlocked = ACHIEVEMENTS.filter(a =>  checkUnlocked(a, state))
  const locked   = ACHIEVEMENTS.filter(a => !checkUnlocked(a, state))

  return (
    <div className="page-enter">
      <div style={S.pageTitle}>Logros</div>
      <div style={S.pageSubtitle}>
        {unlocked.length} de {ACHIEVEMENTS.length} desbloqueados
      </div>

      {/* UNLOCKED */}
      {unlocked.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.15em',
            color: COLOR.gold, textTransform: 'uppercase', marginBottom: 16,
          }}>
            Desbloqueados
          </div>
          <div style={S.grid(3)}>
            {unlocked.map(a => (
              <div key={a.id} style={{
                ...S.card,
                background: '#0f0f0a',
                borderColor: `${COLOR.gold}33`,
                textAlign: 'center',
                padding: '24px 16px',
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: COLOR.gold, marginBottom: 6,
                }}>
                  {a.name}
                </div>
                <div style={{
                  fontSize: 11, color: '#555',
                  marginBottom: 10, lineHeight: 1.5,
                }}>
                  {a.desc}
                </div>
                <span style={S.badge(COLOR.gold)}>+{a.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOCKED */}
      {locked.length > 0 && (
        <div>
          <div style={{
            fontSize: 11, letterSpacing: '0.15em',
            color: '#333', textTransform: 'uppercase', marginBottom: 16,
          }}>
            Por desbloquear
          </div>
          <div style={S.grid(3)}>
            {locked.map(a => (
              <div key={a.id} style={{
                ...S.card,
                textAlign: 'center',
                padding: '24px 16px',
                opacity: 0.45,
              }}>
                <div style={{ fontSize: 32, marginBottom: 10, filter: 'grayscale(1)' }}>
                  {a.icon}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                  {a.name}
                </div>
                <div style={{ fontSize: 11, color: '#3a3a3a', lineHeight: 1.5 }}>
                  {a.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
