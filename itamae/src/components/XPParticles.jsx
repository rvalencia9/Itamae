import { useState, useEffect } from 'react'

export default function XPParticles({ trigger }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!trigger) return
    const newP = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: -(Math.random() * 60 + 20),
    }))
    setParticles(newP)
    const t = setTimeout(() => setParticles([]), 1000)
    return () => clearTimeout(t)
  }, [trigger])

  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            width: 4, height: 4,
            borderRadius: '50%',
            background: '#c9a84c',
            boxShadow: '0 0 6px #c9a84c',
            animation: 'particle-float 1s ease-out forwards',
          }}
        />
      ))}
    </div>
  )
}
