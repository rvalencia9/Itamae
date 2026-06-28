import { S, FONT } from '../styles/tokens.js'

export default function StatBox({ label, value, sub, accent = '#c9a84c' }) {
  return (
    <div style={{ ...S.card, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={S.cardTitle}>{label}</div>
      <div style={{
        fontSize: 32, fontWeight: 700, color: accent,
        letterSpacing: '-0.03em', fontFamily: FONT.display,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: '#444' }}>{sub}</div>
      )}
    </div>
  )
}
