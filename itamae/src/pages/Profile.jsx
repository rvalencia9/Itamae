import { useState } from 'react'
import { S, COLOR, FONT } from '../styles/tokens.js'
import { RANKS } from '../data/constants.js'
import { computeDominio, computeLevel, getCurrentRank } from '../store/reducer.js'
import StatBox from '../components/StatBox.jsx'

export default function Profile({ state, dispatch, showToast }) {
  const dominio  = computeDominio(state)
  const { level, progress, currentXP, neededXP } = computeLevel(state.xp)
  const rank     = getCurrentRank(dominio, state.xp, RANKS)

  const [editing, setEditing] = useState(false)
  const [name, setName]       = useState(state.profile.name)

  const totalHours      = Math.floor(state.totalMinutes / 60)
  const totalMins       = state.totalMinutes % 60
  const joinDate        = new Date(state.profile.joinDate)
  const daysSince       = Math.floor((Date.now() - joinDate.getTime()) / 86400000)
  const avgMinPerSess   = state.sessions.length
    ? Math.round(state.totalMinutes / state.sessions.length)
    : 0

  function saveProfile() {
    if (!name.trim()) return
    dispatch({ type: 'UPDATE_PROFILE', profile: { name: name.trim() } })
    setEditing(false)
    showToast('Perfil actualizado')
  }

  function cancelEdit() {
    setName(state.profile.name)
    setEditing(false)
  }

  return (
    <div className="page-enter">
      <div style={S.pageTitle}>Perfil</div>
      <div style={S.pageSubtitle}>
        Tu identidad como itamae en construcción.
      </div>

      {/* PROFILE HERO */}
      <div style={{
        ...S.card,
        marginBottom: 20,
        background: 'linear-gradient(135deg, #0f0f0f, #141410)',
      }}>
        <div style={{
          display: 'flex', gap: 24,
          alignItems: 'center', flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{
            ...S.profileAvatar,
            width: 72, height: 72, fontSize: 28,
            flexShrink: 0,
            border: `2px solid ${COLOR.gold}44`,
          }}>
            {state.profile.photo
              ? <img
                  src={state.profile.photo}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt="avatar"
                />
              : '👨‍🍳'
            }
          </div>

          {/* Name & rank */}
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveProfile()}
                  style={{ ...S.input, width: 200, fontSize: 18 }}
                  autoFocus
                />
                <button onClick={saveProfile} style={S.btnPrimary}>Guardar</button>
                <button onClick={cancelEdit}  style={S.btn}>Cancelar</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                  fontSize: 24, fontWeight: 700,
                  color: '#f0f0f0', fontFamily: FONT.display,
                }}>
                  {state.profile.name}
                </div>
                <button
                  onClick={() => { setName(state.profile.name); setEditing(true) }}
                  style={{ ...S.btn, padding: '4px 10px', fontSize: 11 }}
                >
                  Editar
                </button>
              </div>
            )}
            <div style={{ fontSize: 12, color: COLOR.gold, marginTop: 4 }}>
              {rank.name} · {rank.kanji}
            </div>
            <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>
              En entrenamiento desde{' '}
              {joinDate.toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
          </div>

          {/* Level display */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 10, color: '#444', marginBottom: 2,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              Nivel
            </div>
            <div style={{
              fontSize: 40, fontWeight: 700,
              color: COLOR.gold, fontFamily: FONT.display,
            }}>
              {level}
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#555' }}>Progreso de nivel</span>
            <span style={{ fontSize: 11, color: COLOR.gold }}>
              {currentXP.toLocaleString()} / {neededXP.toLocaleString()} XP
            </span>
          </div>
          <div style={S.xpBar}>
            <div style={S.xpFill(progress)} />
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{ ...S.grid(3), marginBottom: 20 }}>
        <StatBox
          label="XP Total"
          value={state.xp.toLocaleString()}
          sub="experiencia acumulada"
        />
        <StatBox
          label="Dominio General"
          value={`${dominio}%`}
          sub="progreso compuesto"
        />
        <StatBox
          label="Racha actual"
          value={`${state.streak.current} días`}
          sub={`Mejor: ${state.streak.best} días`}
        />
        <StatBox
          label="Tiempo total"
          value={`${totalHours}h`}
          sub={`${totalMins} min · ${state.sessions.length} sesiones`}
          accent="#a8c4c9"
        />
        <StatBox
          label="Promedio"
          value={`${avgMinPerSess} min`}
          sub="por sesión"
          accent="#7a9e8a"
        />
        <StatBox
          label="Días activos"
          value={daysSince}
          sub="desde que empezaste"
          accent="#9a8fc9"
        />
      </div>

      {/* RANK TIMELINE */}
      <div style={S.card}>
        <div style={S.cardTitle}>Camino de rangos</div>
        <div style={{ position: 'relative', paddingTop: 12 }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {RANKS.map((r, i) => {
              const unlocked  = dominio >= r.minDom && state.xp >= r.minXP
              const isCurrent = r.id === getCurrentRank(dominio, state.xp, RANKS).id
              return (
                <div key={r.id} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', position: 'relative',
                }}>
                  {/* Connector line */}
                  {i < RANKS.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 9,
                      left: '50%', right: '-50%', height: 2,
                      background: unlocked ? COLOR.gold : '#1e1e1e',
                      zIndex: 0,
                    }} />
                  )}
                  {/* Dot */}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: isCurrent ? COLOR.gold
                      : unlocked ? '#5a4a1a' : '#1a1a1a',
                    border: `2px solid ${
                      isCurrent ? COLOR.gold
                        : unlocked ? '#7a6030' : '#2a2a2a'
                    }`,
                    zIndex: 1, flexShrink: 0,
                    transition: 'all 0.3s',
                  }} />
                  {/* Label */}
                  <div style={{
                    fontSize: 7,
                    color: isCurrent ? COLOR.gold
                      : unlocked ? '#7a6030' : '#2a2a2a',
                    marginTop: 6, textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {r.name.split(' ').slice(-1)[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
