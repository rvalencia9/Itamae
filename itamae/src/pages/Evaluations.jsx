import { useState, useEffect } from 'react'
import { S, COLOR, FONT } from '../styles/tokens.js'
import { SKILL_TREE } from '../data/constants.js'

const STAR_COLORS = ['', '#555', '#7a6030', '#9a7020', '#b89030', '#c9a84c']
const XP_BY_SCORE = { 5: 80, 4: 50, 3: 30, 2: 20, 1: 15 }

const EMPTY_FORM = {
  category: SKILL_TREE[0].id,
  skill:    SKILL_TREE[0].skills[0],
  score:    3,
  errors:   '',
  improvements: '',
  notes:    '',
}

export default function Evaluations({ state, dispatch, addXP, showToast }) {
  const [form, setForm]         = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  const catSkills = SKILL_TREE.find(c => c.id === form.category)?.skills || []

  // When category changes, reset skill to first of new category
  useEffect(() => {
    const firstSkill = SKILL_TREE.find(c => c.id === form.category)?.skills[0] || ''
    setForm(f => ({ ...f, skill: firstSkill }))
  }, [form.category])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function submit() {
    if (!form.skill) return
    const ev = { id: Date.now(), date: new Date().toISOString(), ...form }
    dispatch({ type: 'ADD_EVALUATION', evaluation: ev })
    const xp = XP_BY_SCORE[form.score] || 30
    addXP(xp)
    showToast(`+${xp} XP — Evaluación ${form.score}/5 registrada`)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const evals = [...state.evaluations].reverse().slice(0, 30)

  return (
    <div className="page-enter">
      {/* HEADER */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 28,
      }}>
        <div>
          <div style={S.pageTitle}>Evaluaciones</div>
          <div style={S.pageSubtitle}>
            La mirada honesta sobre tu técnica. Sin autoengaño.
          </div>
        </div>
        <button onClick={() => setShowForm(true)} style={S.btnPrimary}>
          + Nueva evaluación
        </button>
      </div>

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {evals.length === 0 && (
          <div style={{
            ...S.card, textAlign: 'center',
            padding: '48px 24px', color: '#444',
          }}>
            Ninguna evaluación registrada. Evalúa tu técnica con honestidad.
          </div>
        )}

        {evals.map(ev => {
          const cat = SKILL_TREE.find(c => c.id === ev.category)
          const d   = new Date(ev.date)
          return (
            <div key={ev.id} style={{
              ...S.card,
              borderLeft: `2px solid ${STAR_COLORS[ev.score] || '#444'}`,
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', flexWrap: 'wrap', gap: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', gap: 8, alignItems: 'center',
                    marginBottom: 8, flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#ddd' }}>
                      {ev.skill}
                    </span>
                    {cat && (
                      <span style={S.badge(cat.color)}>
                        {cat.icon} {cat.label}
                      </span>
                    )}
                    <span style={{ fontSize: 14, color: STAR_COLORS[ev.score] }}>
                      {'★'.repeat(ev.score)}{'☆'.repeat(5 - ev.score)}
                    </span>
                  </div>
                  {ev.errors && (
                    <div style={{ fontSize: 12, color: '#7a4a4a', marginBottom: 3 }}>
                      Errores: {ev.errors}
                    </div>
                  )}
                  {ev.improvements && (
                    <div style={{ fontSize: 12, color: '#4a7a9a', marginBottom: 3 }}>
                      Mejorar: {ev.improvements}
                    </div>
                  )}
                  {ev.notes && (
                    <div style={{ fontSize: 12, color: '#555' }}>{ev.notes}</div>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#404040', flexShrink: 0 }}>
                  {d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
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
            <div style={{
              fontSize: 18, fontWeight: 700,
              color: '#f0f0f0', fontFamily: FONT.display, marginBottom: 24,
            }}>
              Nueva Evaluación
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

              <div>
                <label style={S.label}>Habilidad evaluada</label>
                <select
                  value={form.skill}
                  onChange={e => set('skill', e.target.value)}
                  style={S.select}
                >
                  {catSkills.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Star rating */}
              <div>
                <label style={S.label}>Calificación</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => set('score', n)}
                      style={{
                        flex: 1, padding: '10px',
                        borderRadius: 6,
                        border: `1.5px solid ${form.score >= n ? STAR_COLORS[n] : '#222'}`,
                        background: form.score >= n ? `${STAR_COLORS[n]}22` : '#0d0d0d',
                        cursor: 'pointer',
                        fontSize: 18,
                        transition: 'all 0.15s',
                        color: form.score >= n ? STAR_COLORS[n] : '#333',
                      }}
                    >
                      {form.score >= n ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={S.label}>Errores detectados</label>
                <textarea
                  value={form.errors}
                  onChange={e => set('errors', e.target.value)}
                  style={S.textarea}
                  placeholder="El nori se abrió en el corte..."
                />
              </div>

              <div>
                <label style={S.label}>¿Qué debo mejorar?</label>
                <textarea
                  value={form.improvements}
                  onChange={e => set('improvements', e.target.value)}
                  style={S.textarea}
                  placeholder="Menos presión al enrollar..."
                />
              </div>

              <div>
                <label style={S.label}>Notas</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  style={S.textarea}
                  placeholder="..."
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowForm(false)} style={S.btn}>
                  Cancelar
                </button>
                <button onClick={submit} style={S.btnPrimary}>
                  Guardar evaluación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
