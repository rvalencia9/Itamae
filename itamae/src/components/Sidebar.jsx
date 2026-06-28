import { S, COLOR, FONT } from '../styles/tokens.js'
import { NAV_ITEMS } from '../data/constants.js'
import { computeDominio, computeLevel, getCurrentRank } from '../store/reducer.js'
import { RANKS } from '../data/constants.js'

export default function Sidebar({ state, currentPage, onNavigate }) {
  const dominio = computeDominio(state)
  const { level } = computeLevel(state.xp)
  const rank = getCurrentRank(dominio, state.xp, RANKS)

  return (
    <aside style={S.sidebar} className="sidebar">
      {/* LOGO */}
      <div style={S.sidebarLogo}>
        <div style={S.logoKanji}>板前道</div>
        <div style={S.logoName}>ITAMAE</div>
      </div>

      {/* PROFILE MINI */}
      <div style={S.sidebarProfile}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={S.profileAvatar}>
            {state.profile.photo
              ? <img src={state.profile.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
              : '👨‍🍳'
            }
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>
              {state.profile.name}
            </div>
            <div style={{ fontSize: 10, color: COLOR.gold }}>
              Nv. {level} — {rank.name}
            </div>
          </div>
        </div>

        {/* Mini dominio bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 9, color: '#404040', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Dominio
            </span>
            <span style={{ fontSize: 9, color: COLOR.gold }}>{dominio}%</span>
          </div>
          <div style={{ ...S.xpBar, height: 3 }}>
            <div style={S.xpFill(dominio / 100)} />
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV_ITEMS.map(n => (
          <div
            key={n.id}
            style={S.navItem(currentPage === n.id)}
            onClick={() => onNavigate(n.id)}
          >
            <span style={{ fontSize: 14, minWidth: 18 }}>{n.icon}</span>
            <span>{n.label}</span>
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div style={{ padding: '16px 20px', borderTop: `1px solid ${COLOR.borderSub}` }}>
        <div style={{ fontSize: 9, color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          板前道 · Itamae
        </div>
        <div style={{ fontSize: 9, color: '#2a2a2a', marginTop: 2 }}>
          v1.0 · {state.sessions.length} sesiones
        </div>
      </div>
    </aside>
  )
}
