import { useState } from 'react'
import { S, COLOR, FONT } from '../styles/tokens.js'
import { SKILL_TREE, DAILY_MISSIONS, RANKS } from '../data/constants.js'
import { computeDominio, computeLevel, getCurrentRank, getNextRank } from '../store/reducer.js'
import StatBox from '../components/StatBox.jsx'
import XPParticles from '../components/XPParticles.jsx'

export default function Dashboard({ state, dispatch, addXP, showToast }) {
  const dominio = computeDominio(state)
  const { level, progress, currentXP, neededXP } = computeLevel(state.xp)
  const rank = getCurrentRank(dominio, state.xp, RANKS)
  const nextRank = getNextRank(dominio, state.xp, RANKS)
  const [xpAnimTrigger, setXpAnimTrigger] = useState(0)

  const totalHours = Math.floor(state.totalMinutes / 60)
  const totalMins  = state.totalMinutes % 60
  const dominatedSkills = Object.values(state.skills).filter(v => v === 5).length
  const allSkillCount   = SKILL_TREE.flatMap(c => c.skills).length

  const today = new Date().toDateString()
  const completedToday = state.completedMissions[today] || []

  function completeMission(m) {
    if (completedToday.includes(m.id)) return
    dispatch({ type: 'COMPLETE_MISSION', missionId: m.id, date: today })
    addXP(m.xp)
    showToast(`+${m.xp} XP — Misión completada`)
    setXpAnimTrigger(v => v + 1)
  }

  return (
    <div className="page-enter">
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 32 }}>
        <div style={S.pageTitle}>命 — Itamae</div>
        <div style={S.pageSubtitle}>
          Bienvenido de vuelta, {state.profile.name}. Tu camino continúa.
        </div>
      </div>

      {/* HERO CARD */}
      <div style={{
        ...S.card,
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #141410 100%)',
      }}>
        {/* Background kanji */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          fontSize: 120, color: '#c9a84c08',
          fontFamily: FONT.display,
          lineHeight: 1, padding: '0 20px',
          pointerEvents: 'none', userSelect: 'none',
        }}>
          {rank.kanji}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', flexWrap: 'wrap', gap: 20,
          position: 'relative',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.2em',
              color: COLOR.gold, marginBottom: 6, textTransform: 'uppercase',
            }}>
              Nivel {level} · {rank.name}
            </div>

            <div style={{
              fontSize: 42, fontWeight: 700, color: '#f0f0f0',
              letterSpacing: '-0.04em', fontFamily: FONT.display,
              lineHeight: 1.1, marginBottom: 8,
            }}>
              {dominio}%{' '}
              <span style={{ fontSize: 16, color: '#555', fontFamily: FONT.body }}>
                Dominio
              </span>
            </div>

            <div style={{
              fontSize: 12, color: '#666', marginBottom: 16, fontStyle: 'italic',
            }}>
              &ldquo;{rank.desc}&rdquo;
            </div>

            {/* XP Progress bar */}
            <div style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#555' }}>XP al siguiente nivel</span>
                <span style={{ fontSize: 11, color: COLOR.gold }}>
                  {currentXP.toLocaleString()} / {neededXP.toLocaleString()}
                </span>
              </div>
              <div style={{ ...S.xpBar, position: 'relative' }}>
                <div style={S.xpFill(progress)} />
                <XPParticles trigger={xpAnimTrigger} />
              </div>
            </div>

            {nextRank && (
              <div style={{ fontSize: 11, color: '#444', marginTop: 8 }}>
                Próximo rango:{' '}
                <span style={{ color: '#7a6030' }}>{nextRank.name}</span>
                {' '}— Dom. {nextRank.minDom}% · {nextRank.minXP.toLocaleString()} XP
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 10, color: '#404040', marginBottom: 2,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              XP Total
            </div>
            <div style={{
              fontSize: 28, fontWeight: 700,
              color: COLOR.gold, fontFamily: FONT.display,
            }}>
              {state.xp.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ ...S.grid(4), marginBottom: 20 }}>
        <StatBox
          label="Racha actual"
          value={`${state.streak.current}d`}
          sub={`Mejor: ${state.streak.best} días`}
          accent={COLOR.gold}
        />
        <StatBox
          label="Horas totales"
          value={`${totalHours}h ${totalMins}m`}
          sub={`${state.sessions.length} sesiones`}
          accent="#a8c4c9"
        />
        <StatBox
          label="Habilidades"
          value={`${dominatedSkills}/${allSkillCount}`}
          sub="dominadas"
          accent="#7a9e8a"
        />
        <StatBox
          label="Evaluaciones"
          value={state.evaluations.length}
          sub="registradas"
          accent="#9a8fc9"
        />
      </div>

      {/* MISIONES DIARIAS */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={S.cardTitle}>Misiones de hoy</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {DAILY_MISSIONS.map(m => {
            const done = completedToday.includes(m.id)
            return (
              <div
                key={m.id}
                onClick={() => completeMission(m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px',
                  background: done ? '#0d1a0a' : '#0d0d0d',
                  border: `1px solid ${done ? '#2a4a2a' : '#1e1e1e'}`,
                  borderRadius: 6,
                  cursor: done ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  userSelect: 'none',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: `1.5px solid ${done ? '#4a8a4a' : '#333'}`,
                  background: done ? '#4a8a4a' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 10,
                  color: done ? '#fff' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  {done ? '✓' : ''}
                </div>
                <div style={{
                  flex: 1, fontSize: 13,
                  color: done ? '#4a6a4a' : '#ccc',
                  textDecoration: done ? 'line-through' : 'none',
                }}>
                  {m.label}
                </div>
                <span style={S.badge(COLOR.gold)}>+{m.xp} XP</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* CATEGORY PROGRESS */}
      <div style={S.card}>
        <div style={S.cardTitle}>Progreso por categoría</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SKILL_TREE.slice(0, 6).map(cat => {
            const keys = cat.skills.map(s => `${cat.id}::${s}`)
            const total = keys.length
            const sum = keys.reduce((acc, k) => acc + (state.skills[k] ?? 0), 0)
            const pct = sum / (total * 5)
            return (
              <div key={cat.id}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: 5,
                }}>
                  <span style={{ fontSize: 12, color: '#bbb' }}>
                    {cat.icon} {cat.label}{' '}
                    <span style={{ fontSize: 10, color: '#444' }}>{cat.kanji}</span>
                  </span>
                  <span style={{ fontSize: 11, color: cat.color }}>
                    {Math.round(pct * 100)}%
                  </span>
                </div>
                <div style={{ ...S.xpBar, height: 4 }}>
                  <div style={{
                    height: '100%',
                    width: `${pct * 100}%`,
                    background: cat.color,
                    borderRadius: 2,
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                    opacity: 0.85,
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
