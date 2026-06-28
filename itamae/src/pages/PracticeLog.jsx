import { useState } from 'react'
import { S, COLOR, FONT } from '../styles/tokens.js'
import { SKILL_TREE } from '../data/constants.js'

const EMPTY_FORM = {
  duration:      '',
  category:      SKILL_TREE[0].id,
  whatWorked:    '',
  whatFailed:    '',
  notes:         '',
  concentration: 3,
  difficulty:    3,
}

export default function PracticeLog({ state, dispatch, addXP, showToast }) {
  const [form, setForm]         = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function submit() {
    if (!form.duration) {
      showToast('Ingresa la duración de la sesión')
      return
    }
    const mins = parseInt(form.duration, 10)
    if (isNaN(mins) || mins <= 0) {
      showToast('Duración inválida')
      return
    }
    const session = {
      id:   Date.now(),
      date: new Date().toISOString(),
      ...form,
      duration: mins,
    }
    dispatch({ type: 'ADD_SESSION', session })
    const xp = 30 + Math.floor(mins / 10) * 5
    addXP(xp)
    showToast(`+${xp} XP — Sesión registrada (${mins} min)`)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const sessions = [...state.sessions].reverse().slice(0, 30)

  return (
    <div className="page-enter">
      {/* PAGE HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 28,
      }}>
        <div>
          <div style={S.pageTitle}>Registro de Prácticas</div>
          <div style={S.pageSubtitle}>
            Cada minuto documentado construye al maestro.
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={S.btnPrimary}>
          + Nueva sesión
        </button>
      </div>

      {/* SESSION LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sessions.length === 0 && (
          <div style={{
            ...S.card, textAlign: 'center',
            padding: '48px 24px', color: '#444',
          }}>
            Ninguna sesión registrada aún. El camino comienza con el primer paso.
          </div>
        )}

        {sessions.map(s => {
          const cat = SKILL_TREE.find(c => c.id === s.category)
          const d   = new Date(s.date)
          return (
            <div key={s.id} style={{ ...S.card, borderColor: '#1a1a1a' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', flexWrap: 'wrap', gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'center',
                    marginBottom: 8, flexWrap: 'wrap',
                  }}>
                    {cat && <span style={S.badge(cat.color)}>{cat.icon} {cat.label}</span>}
                    <span style={S.tag}>{s.duration} min</span>
                    <span style={{ ...S.tag, color: '#555' }}>Concentración {s.concentration}/5</span>
                    <span style={{ ...S.tag, color: '#555' }}>Dificultad {s.difficulty}/5</span>
                  </div>
                  {s.whatWorked && (
                    <div style={{ fontSize: 13, color: '#4a8a4a', marginBottom: 4 }}>
                      ✓ {s.whatWorked}
                    </div>
                  )}
                  {s.whatFailed && (
                    <div style={{ fontSize: 13, color: '#8a4a4a', marginBottom: 4 }}>
                      ✗ {s.whatFailed}
                    </div>
                  )}
                  {s.notes && (
                    <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
                      {s.notes}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#404040', textAlign: 'right', flexShrink: 0 }}>
                  {d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                  <br />
                  {d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL */}
      {showForm && (
        <div
          style={S.modal}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}
        >
          <div style={S.modalBox}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f0f0', fontFamily: FONT.display, marginBottom: 6 }}>
              Nueva Sesión
            </div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 24 }}>
              {new Date().toLocaleDateString('es-MX', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={S.label}>Duración (minutos)</label>
                <input
                  type="number" min="1"
                  value={form.duration}
                  onChange={e => set('duration', e.target.value)}
                  style={S.input}
                  placeholder="45"
                />
              </div>

              <div>
                <label style={S.label}>Categoría</label>
                <select
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  style={S.select}
                >
                  {SKILL_TREE.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                  ))}
                </select>
              </div>

              <div style={S.grid(2)}>
                <div>
                  <label style={S.label}>Concentración</label>
                  <select
                    value={form.concentration}
                    onChange={e => set('concentration', parseInt(e.target.value, 10))}
                    style={S.select}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}/5</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Dificultad</label>
                  <select
                    value={form.difficulty}
                    onChange={e => set('difficulty', parseInt(e.target.value, 10))}
                    style={S.select}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}/5</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={S.label}>¿Qué salió bien?</label>
                <textarea
                  value={form.whatWorked}
                  onChange={e => set('whatWorked', e.target.value)}
                  style={S.textarea}
                  placeholder="Nigiri con mejor forma..."
                />
              </div>

              <div>
                <label style={S.label}>¿Qué falló?</label>
                <textarea
                  value={form.whatFailed}
                  onChange={e => set('whatFailed', e.target.value)}
                  style={S.textarea}
                  placeholder="Tensión del nori inconsistente..."
                />
              </div>

              <div>
                <label style={S.label}>Notas adicionales</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  style={S.textarea}
                  placeholder="..."
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button onClick={() => setShowForm(false)} style={S.btn}>
                  Cancelar
                </button>
                <button onClick={submit} style={S.btnPrimary}>
                  Registrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
