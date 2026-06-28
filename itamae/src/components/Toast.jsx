import { S } from '../styles/tokens.js'

export default function Toast({ message, visible }) {
  return (
    <div style={S.toast(visible)}>
      <span style={{ fontSize: 16 }}>✦</span>
      <span style={{ fontSize: 13, color: '#e0e0e0' }}>{message}</span>
    </div>
  )
}
