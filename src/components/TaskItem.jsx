import { fuseState } from '../lib/urgency.js'

function formatDeadline(deadline) {
  if (!deadline) return 'No deadline'
  const d = new Date(deadline)
  if (Number.isNaN(d.getTime())) return 'No deadline'
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const priorityLabel = {
  low: 'text-mint',
  medium: 'text-bone/70',
  high: 'text-ember',
}

export default function TaskItem({ task, isSelected, onSelect, onToggleDone, onDelete, now }) {
  const fuse = fuseState(task, now)
  const overdue = fuse.state === 'overdue'

  return (
    <div
      onClick={() => onSelect(task.id)}
      className={`group rise cursor-pointer rounded-xl border px-3.5 pt-3 pb-2.5 transition-colors ${
        isSelected
          ? 'border-ember/70 bg-surface'
          : 'border-dust/12 bg-surface/45 hover:border-dust/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleDone(task.id)
          }}
          className={`mt-0.5 h-[18px] w-[18px] flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.done ? 'bg-mint border-mint' : 'border-dust/50 hover:border-mint'
          }`}
          aria-label={task.done ? 'Mark not done' : 'Mark done'}
        >
          {task.done && (
            <svg viewBox="0 0 20 20" fill="#1F1A2E" className="h-3 w-3">
              <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 011.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className={`text-[14px] leading-snug ${task.done ? 'line-through text-dust' : 'text-bone'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[11px]">
            <span className={overdue ? 'text-ember font-semibold' : 'text-dust'}>
              {overdue ? `Overdue · ${formatDeadline(task.deadline)}` : formatDeadline(task.deadline)}
            </span>
            <span className="text-dust/40">·</span>
            <span className={`smallcaps font-semibold ${priorityLabel[task.priorityHint] || priorityLabel.medium}`}>
              {task.priorityHint || 'medium'}
            </span>
            {task.aiRank ? (
              <>
                <span className="text-dust/40">·</span>
                <span className="font-display italic text-bone/80">#{task.aiRank}</span>
              </>
            ) : null}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          className="opacity-0 group-hover:opacity-100 text-dust hover:text-ember transition-all flex-shrink-0 -mt-0.5"
          aria-label="Delete task"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.9.6L7.4 4H4a1 1 0 000 2h12a1 1 0 100-2h-3.4l-.7-1.4A1 1 0 0011 2H9zM6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* The Fuse */}
      {!task.done && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="fuse-track flex-1">
            <div
              className="fuse-fill"
              style={{ width: `${fuse.remainingPct}%`, background: fuse.color }}
            />
          </div>
          {fuse.state === 'live' && fuse.burn > 0.55 && (
            <span className="fuse-spark h-1.5 w-1.5 rounded-full" style={{ background: fuse.color }} />
          )}
          {overdue && (
            <span className="ember-pulse h-1.5 w-1.5 rounded-full bg-ember" />
          )}
        </div>
      )}
    </div>
  )
}
