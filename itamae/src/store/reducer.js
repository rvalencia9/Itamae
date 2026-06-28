import { SKILL_TREE } from '../data/constants.js'

// ── DEFAULT STATE ─────────────────────────────────────────────────────────────
export const DEFAULT_STATE = {
  profile: {
    name: 'Roy',
    photo: null,
    joinDate: new Date().toISOString(),
  },
  xp: 0,
  skills: {},
  sessions: [],
  evaluations: [],
  achievements: [],
  completedMissions: {},
  streak: { current: 0, best: 0, lastDate: null },
  totalMinutes: 0,
}

// ── REDUCER ───────────────────────────────────────────────────────────────────
export function reducer(state, action) {
  switch (action.type) {

    case 'LOAD':
      return { ...DEFAULT_STATE, ...action.state }

    case 'ADD_XP':
      return { ...state, xp: state.xp + action.amount }

    case 'SET_SKILL':
      return {
        ...state,
        skills: { ...state.skills, [action.key]: action.value },
      }

    case 'ADD_SESSION': {
      const sessions = [...state.sessions, action.session]
      const totalMinutes = state.totalMinutes + action.session.duration

      // Streak logic
      const today = new Date().toDateString()
      const lastDate = state.streak.lastDate
      let current = state.streak.current
      let best = state.streak.best

      if (lastDate !== today) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        if (lastDate === yesterday.toDateString()) {
          current = current + 1
        } else {
          current = 1
        }
        best = Math.max(best, current)
      }

      return {
        ...state,
        sessions,
        totalMinutes,
        streak: { current, best, lastDate: today },
      }
    }

    case 'ADD_EVALUATION':
      return {
        ...state,
        evaluations: [...state.evaluations, action.evaluation],
      }

    case 'UNLOCK_ACHIEVEMENT':
      if (state.achievements.includes(action.id)) return state
      return {
        ...state,
        achievements: [...state.achievements, action.id],
      }

    case 'COMPLETE_MISSION': {
      const prev = state.completedMissions[action.date] || []
      if (prev.includes(action.missionId)) return state
      return {
        ...state,
        completedMissions: {
          ...state.completedMissions,
          [action.date]: [...prev, action.missionId],
        },
      }
    }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.profile },
      }

    default:
      return state
  }
}

// ── SELECTORS ─────────────────────────────────────────────────────────────────
export function computeDominio(state) {
  const allSkills = SKILL_TREE.flatMap(c =>
    c.skills.map(s => `${c.id}::${s}`)
  )
  const total = allSkills.length
  if (total === 0) return 0

  let score = 0
  allSkills.forEach(key => {
    const lvl = state.skills[key] ?? 0
    score += lvl / 5
  })

  const skillScore   = (score / total) * 60
  const sessionScore = Math.min(20, (state.sessions.length / 50) * 20)
  const evalScore    = Math.min(10, (state.evaluations.length / 30) * 10)
  const streakScore  = Math.min(10, (state.streak.current / 30) * 10)

  return Math.min(100, Math.round(skillScore + sessionScore + evalScore + streakScore))
}

export function computeLevel(xp) {
  const base = 200
  let level = 1
  let remaining = xp
  while (remaining >= base * level) {
    remaining -= base * level
    level++
  }
  const needed = base * level
  const progress = remaining / needed
  return { level, progress, currentXP: remaining, neededXP: needed }
}

export function getCurrentRank(dominio, xp, RANKS) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (dominio >= r.minDom && xp >= r.minXP) rank = r
  }
  return rank
}

export function getNextRank(dominio, xp, RANKS) {
  for (const r of RANKS) {
    if (dominio < r.minDom || xp < r.minXP) return r
  }
  return null
}
