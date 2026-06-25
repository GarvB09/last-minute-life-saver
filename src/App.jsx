import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import MainPanel from './components/MainPanel.jsx'
import { loadTasks, saveTasks } from './lib/storage.js'
import { prioritizeTasks, generateDailyPlan, generateNudge, breakdownTask } from './lib/gemini.js'
import { useNow } from './lib/useNow.js'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks())
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [priorities, setPriorities] = useState([])
  const [dailyPlan, setDailyPlan] = useState([])
  const [nudge, setNudge] = useState('')
  const [breakdown, setBreakdown] = useState([])
  const [loading, setLoading] = useState({ priorities: false, plan: false, nudge: false, breakdown: false })
  const [error, setError] = useState('')
  const now = useNow()

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function addTask({ title, deadline, priorityHint }) {
    setTasks((prev) => [...prev, { id: makeId(), title, deadline, priorityHint, done: false }])
  }

  function toggleDone(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (selectedTaskId === id) setSelectedTaskId(null)
  }

  async function runPrioritize() {
    setError('')
    setLoading((l) => ({ ...l, priorities: true }))
    try {
      const pending = tasks.filter((t) => !t.done)
      const result = await prioritizeTasks(pending)
      const sorted = [...result].sort((a, b) => a.rank - b.rank)
      setPriorities(sorted)
      const rankMap = new Map(sorted.map((p) => [p.id, p.rank]))
      setTasks((prev) => prev.map((t) => ({ ...t, aiRank: rankMap.get(t.id) })))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading((l) => ({ ...l, priorities: false }))
    }
  }

  async function runDailyPlan() {
    setError('')
    setLoading((l) => ({ ...l, plan: true }))
    try {
      const pending = tasks.filter((t) => !t.done)
      const result = await generateDailyPlan(pending)
      setDailyPlan(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading((l) => ({ ...l, plan: false }))
    }
  }

  async function runNudge() {
    setError('')
    setLoading((l) => ({ ...l, nudge: true }))
    try {
      const pending = tasks.filter((t) => !t.done)
      const result = await generateNudge(pending)
      setNudge(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading((l) => ({ ...l, nudge: false }))
    }
  }

  async function runBreakdown() {
    const task = tasks.find((t) => t.id === selectedTaskId)
    if (!task) return
    setError('')
    setLoading((l) => ({ ...l, breakdown: true }))
    try {
      const result = await breakdownTask(task)
      setBreakdown(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading((l) => ({ ...l, breakdown: false }))
    }
  }

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen bg-ink">
      <Sidebar
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        now={now}
        onAdd={addTask}
        onSelect={setSelectedTaskId}
        onToggleDone={toggleDone}
        onDelete={deleteTask}
      />
      <MainPanel
        tasks={tasks}
        selectedTask={selectedTask}
        priorities={priorities}
        dailyPlan={dailyPlan}
        nudge={nudge}
        breakdown={breakdown}
        loading={loading}
        error={error}
        onRunPrioritize={runPrioritize}
        onRunDailyPlan={runDailyPlan}
        onRunNudge={runNudge}
        onRunBreakdown={runBreakdown}
      />
    </div>
  )
}
