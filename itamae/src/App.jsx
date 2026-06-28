import { useReducer, useState, useEffect, useRef } from 'react'
import { S, COLOR, FONT } from './styles/tokens.js'
import { reducer, DEFAULT_STATE } from './store/reducer.js'
import { loadState, saveState } from './store/storage.js'

import Sidebar      from './components/Sidebar.jsx'
import Toast        from './components/Toast.jsx'

import Dashboard    from './pages/Dashboard.jsx'
import SkillTree    from './pages/SkillTree.jsx'
import PracticeLog  from './pages/PracticeLog.jsx'
import Evaluations  from './pages/Evaluations.jsx'
import Stats        from './pages/Stats.jsx'
import Achievements from './pages/Achievements.jsx'
import RanksPage    from './pages/Ranks.jsx'
import Profile      from './pages/Profile.jsx'

export default function App() {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)
  const [page, setPage]   = useState('dashboard')
  const [loaded, setLoaded] = useState(false)
  const [toast, setToast]   = useState({ visible: false, message: '' })
  const toastTimer = useRef(null)

  // Load persisted state on mount
  useEffect(() => {
    const saved = loadState()
    if (saved) dispatch({ type: 'LOAD', state: saved })
    setLoaded(true)
  }, [])

  // Persist on every state change (after initial load)
  useEffect(() => {
    if (loaded) saveState(state)
  }, [state, loaded])

  function addXP(amount) {
    dispatch({ type: 'ADD_XP', amount })
  }

  function showToast(message) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ visible: true, message })
    toastTimer.current = setTimeout(
      () => setToast(t => ({ ...t, visible: false })),
      2800
    )
  }

  function navigate(pageId) {
    setPage(pageId)
  }

  // ── LOADING SCREEN ───────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div style={{
        ...S.app,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          fontSize: 40, color: COLOR.gold, fontFamily: FONT.display,
        }}>
          板前
        </div>
        <div style={{
          fontSize: 11, color: '#444',
          letterSpacing: '0.25em', textTransform: 'uppercase',
        }}>
          Cargando...
        </div>
      </div>
    )
  }

  // ── SHARED PAGE PROPS ────────────────────────────────────────────────────
  const pageProps = { state, dispatch, addXP, showToast }

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      <Sidebar
        state={state}
        currentPage={page}
        onNavigate={navigate}
      />

      <main style={S.main} className="main-content">
        {page === 'dashboard'    && <Dashboard    {...pageProps} />}
        {page === 'skills'       && <SkillTree    {...pageProps} />}
        {page === 'practice'     && <PracticeLog  {...pageProps} />}
        {page === 'evaluations'  && <Evaluations  {...pageProps} />}
        {page === 'stats'        && <Stats        state={state} />}
        {page === 'achievements' && <Achievements state={state} />}
        {page === 'ranks'        && <RanksPage    state={state} />}
        {page === 'profile'      && <Profile      {...pageProps} />}
      </main>

      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
