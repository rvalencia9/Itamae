import { useState } from 'react'
import { S, COLOR, FONT } from '../styles/tokens.js'
import { SKILL_TREE, SKILL_LEVELS, LEVEL_COLORS } from '../data/constants.js'

export default function SkillTree({ state, dispatch, addXP, showToast }) {
  const [selected, setSelected] = useState(SKILL_TREE[0].id)
  const cat = SKILL_TREE.find(c => c.id === selected)

  function upgradeSkill(category, skill) {
    const key = `${category.id}::${skill}`
    const current = state.skills[key] ?? 0
    if (current >= 5) return
    const next = current + 1
    dispatch({ type: 'SET_SKILL', key, value: next })
    const xpGain =
      next === 5 ? 120 :
      next === 4 ? 60  :
      next === 3 ? 40  :
      next === 2 ? 20  : 10
    addXP(xpGain)
    showToast(`+${xpGain} XP — ${skill} → ${SKILL_LEVELS[next]}`)
  }

  function downgradeSkill(category, skill) {
    const key = `${category.id}::${skill}`
    const current = state.skills[key] ?? 0
    if (current <= 0) return
    dispatch({ type: 'SET_SKILL', key, value: current - 1 })
  }

  return (
    <div className="page-enter">
      <div style={S.pageTitle}>Árbol de Habilidades</div>
      <div style={S.pageSubtitle}>
        Evoluciona cada técnica. Del desconocimiento al dominio absoluto.
      </div>

      {/* CATEGORY TABS */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {SKILL_TREE.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            style={{
              ...S.btn,
              color: selected === c.id ? COLOR.gold : '#555',
              borderColor: selected === c.id ? `${COLOR.gold}44` : '#1e1e1e',
              background: selected === c.id ? '#1a1a12' : '#111',
            }}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* SKILLS GRID */}
      {cat && (
        <div>
          {/* Category header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 32 }}>{cat.icon}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0', fontFamily: FONT.display }}>
                {cat.label}
              </div>
              <div style={{ fontSize: 12, color: '#444' }}>{cat.kanji}</div>
            </div>
          </div>

          <div style={S.grid(2)}>
            {cat.skills.map(skill => {
              const key  = `${cat.id}::${skill}`
              const lvl  = state.skills[key] ?? 0
              const dominated = lvl === 5

              return (
                <div
                  key={skill}
                  style={{
                    ...S.card,
                    borderColor: dominated ? `${COLOR.gold}33` : '#1e1e1e',
                    transition: 'border-color 0.3s',
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 10,
                  }}>
                    <div>
                      <div style={{
                        fontSize: 13, fontWeight: 500,
                        color: dominated ? COLOR.gold : '#ddd',
                        marginBottom: 4,
                        transition: 'color 0.3s',
                      }}>
                        {skill}
                      </div>
                      <span style={S.badge(LEVEL_COLORS[lvl])}>
                        {SKILL_LEVELS[lvl]}
                      </span>
                    </div>
                    {dominated && (
                      <div style={{ fontSize: 16, color: COLOR.gold }}>✦</div>
                    )}
                  </div>

                  {/* Level pips */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: 4, borderRadius: 2,
                          background: i <= lvl ? cat.color : '#1e1e1e',
                          transition: 'background 0.3s',
                        }}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!dominated && (
                      <button
                        onClick={() => upgradeSkill(cat, skill)}
                        style={{ ...S.btnPrimary, flex: 1, fontSize: 12 }}
                      >
                        → {SKILL_LEVELS[lvl + 1]}
                      </button>
                    )}
                    {lvl > 0 && (
                      <button
                        onClick={() => downgradeSkill(cat, skill)}
                        style={{ ...S.btn, fontSize: 12, color: '#555', padding: '9px 12px' }}
                        title="Corregir nivel"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
