import TaskInput from './TaskInput.jsx'
import TaskItem from './TaskItem.jsx'
import { nearestDeadline, formatCountdown } from '../lib/urgency.js'

function CountdownHeader({ tasks, now }) {
  const next = nearestDeadline(tasks, now)

  return (
    <div className="px-5 pt-5 pb-4 border-b border-dust/12">
      <div className="flex items-baseline gap-2">
        <span className="text-ember text-lg">⚡</span>
        <h1 className="text-bone">
          <span className="smallcaps text-xs text-dust block leading-none mb-0.5">Last-Minute</span>
          <span className="font-display text-xl font-600 italic leading-none">Life Saver</span>
        </h1>
      </div>

      <div className="mt-5">
        {next ? (
          <>
            <p className="smallcaps text-[11px] text-dust mb-1">
              {next.overdue ? 'Past due' : 'Next deadline in'}
            </p>
            <p className={`font-display text-4xl leading-none ${next.overdue ? 'text-ember' : 'text-bone'}`}>
              {next.overdue ? `−${formatCountdown(next.diff)}` : formatCountdown(next.diff)}
            </p>
            <p className="text-xs text-dust mt-1.5 truncate">{next.task.title}</p>
          </>
        ) : (
          <>
            <p className="smallcaps text-[11px] text-dust mb-1">Deadlines</p>
            <p className="font-display text-3xl leading-none text-mint">All clear</p>
            <p className="text-xs text-dust mt-1.5">Nothing's on fire. For now.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ tasks, selectedTaskId, now, onAdd, onSelect, onToggleDone, onDelete }) {
  const sorted = [...tasks].sort((a, b) => Number(a.done) - Number(b.done))
  const active = tasks.filter((t) => !t.done).length

  return (
    <aside className="w-full md:w-[23rem] flex-shrink-0 flex flex-col h-full md:h-screen bg-ink md:border-r border-dust/12">
      <CountdownHeader tasks={tasks} now={now} />

      <div className="px-5 py-4 border-b border-dust/12">
        <TaskInput onAdd={onAdd} />
      </div>

      <div className="px-5 py-3 flex items-center justify-between">
        <span className="smallcaps text-[11px] text-dust">Your tasks</span>
        <span className="smallcaps text-[11px] text-dust">{active} active</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
        {tasks.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-dust/20 px-4 py-8 text-center">
            <p className="font-display italic text-lg text-bone/80">Nothing captured yet.</p>
            <p className="text-xs text-dust mt-1.5">Add the thing you've been putting off. I'll handle the rest.</p>
          </div>
        ) : (
          sorted.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              now={now}
              isSelected={task.id === selectedTaskId}
              onSelect={onSelect}
              onToggleDone={onToggleDone}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </aside>
  )
}
