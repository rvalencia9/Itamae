import { S, COLOR, FONT } from '../styles/tokens.js'
import { RANKS } from '../data/constants.js'
import { computeDominio, getCurrentRank } from '../store/reducer.js'

export default function RanksPage({ state }) {
  const dominio     = computeDominio(state)
  const currentRank = getCurrentRank(dominio, state.xp, RANKS)

  return (
    <div className="page-enter">
      <div style={S.pageTitle}>Escalafón del Itamae</div>
      <div style={S.pageSubtitle}>
        El camino del agua a la perfección. Diez etapas de maestría.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {RANKS.map(rank => {
          const unlocked  = dominio >= rank.minDom && state.xp >= rank.minXP
          const isCurrent = rank.id === currentRank.id

          return (
            <div
              key={rank.id}
              style={{
                ...S.card,
                borderColor: isCurrent
                  ? `${COLOR.gold}66`
                  : unlocked ? '#2a2a1a' : '#1a1a1a',
                background: isCurrent
                  ? '#0f0f0a'
                  : unlocked ? '#0d0d0a' : '#0d0d0d',
                opacity: unlocked ? 1 : 0.5,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: 24, minWidth: 40, textAlign: 'center',
                color: isCurrent ? COLOR.gold : unlocked ? '#5a4a1a' : '#333',
              }}>
                {isCurrent ? '◆' : unlocked ? '◇' : '○'}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  flexWrap: 'wrap', marginBottom: 4,
                }}>
                  <span style={{
                    fontSize: 15, fontWeight: 700,
                    color: isCurrent ? COLOR.gold : unlocked ? '#ddd' : '#444',
                    fontFamily: FONT.display,
                  }}>
                    {rank.name}
                  </span>
                  <span style={{ fontSize: 13, color: '#404040', fontFamily: FONT.display }}>
                    {rank.kanji}
                  </span>
                  {isCurrent && (
                    <span style={S.badge(COLOR.gold)}>Tu rango actual</span>
                  )}
                </div>
                <div style={{
                  fontSize: 12,
                  color: isCurrent ? '#7a6030' : '#444',
                  fontStyle: 'italic',
                }}>
                  &ldquo;{rank.desc}&rdquo;
                </div>
              </div>

              {/* Requirements */}
              <div style={{
                textAlign: 'right', fontSize: 11,
                color: '#404040', flexShrink: 0,
              }}>
                <div>Dom. {rank.minDom}%</div>
                <div>{rank.minXP.toLocaleString()} XP</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
