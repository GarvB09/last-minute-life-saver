import { useState } from 'react'

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' },
]

export default function TaskInput({ onAdd }) {
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priorityHint, setPriorityHint] = useState('medium')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), deadline, priorityHint })
    setTitle('')
    setDeadline('')
    setPriorityHint('medium')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        type="text"
        placeholder="The thing you're avoiding…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent border-b border-dust/25 px-1 py-2 text-[15px] text-bone placeholder-dust/50 focus:outline-none focus:border-ember transition-colors"
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full bg-surface/60 border border-dust/15 rounded-lg px-3 py-2 text-xs text-bone/90 focus:outline-none focus:border-ember/60 transition-colors"
      />
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-dust/15 overflow-hidden">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriorityHint(p.value)}
              className={`px-3 py-1.5 text-xs font-medium smallcaps transition-colors ${
                priorityHint === p.value ? 'bg-bone text-ink' : 'text-dust hover:text-bone'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="btn-ember flex-1 rounded-lg py-2 text-sm font-semibold"
        >
          Capture task
        </button>
      </div>
    </form>
  )
}
