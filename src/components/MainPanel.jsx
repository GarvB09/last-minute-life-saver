import { useState } from 'react'
import Spinner from './Spinner.jsx'

const TABS = [
  { id: 'priorities', label: 'Priorities' },
  { id: 'plan', label: "Today's plan" },
  { id: 'breakdown', label: 'Breakdown' },
  { id: 'nudge', label: 'Nudge' },
]

function Stage({ kicker, title, lead, action, children }) {
  return (
    <section className="rise">
      <p className="smallcaps text-[11px] text-ember mb-2">{kicker}</p>
      <div className="flex items-start justify-between gap-6 mb-1">
        <h2 className="font-display text-3xl md:text-4xl text-bone leading-tight">{title}</h2>
        {action}
      </div>
      {lead && <p className="text-sm text-dust max-w-md mb-6">{lead}</p>}
      <div className={lead ? '' : 'mt-6'}>{children}</div>
    </section>
  )
}

function ActionButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-ember flex-shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap"
    >
      {children}
    </button>
  )
}

function Empty({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-dust/20 px-5 py-8">
      <p className="font-display italic text-lg text-bone/80">{children}</p>
    </div>
  )
}

export default function MainPanel({
  tasks,
  selectedTask,
  priorities,
  dailyPlan,
  nudge,
  breakdown,
  loading,
  error,
  onRunPrioritize,
  onRunDailyPlan,
  onRunNudge,
  onRunBreakdown,
}) {
  const [activeTab, setActiveTab] = useState('priorities')
  const hasTasks = tasks.length > 0

  return (
    <main className="flex-1 h-full md:h-screen overflow-y-auto bg-ink">
      {/* Editorial tab rail */}
      <div className="sticky top-0 z-10 bg-ink/95 backdrop-blur-sm border-b border-dust/12 px-6 md:px-10">
        <div className="max-w-3xl mx-auto flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              data-active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-underline py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-bone' : 'text-dust hover:text-bone/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-10 py-8 max-w-3xl mx-auto" key={activeTab}>
        {error && (
          <div className="mb-6 rounded-xl border-l-2 border-ember bg-ember/8 px-4 py-3 rise">
            <p className="smallcaps text-[11px] text-ember mb-0.5">That didn't work</p>
            <p className="text-sm text-bone/90">{error}</p>
          </div>
        )}

        {activeTab === 'priorities' && (
          <Stage
            kicker="What matters first"
            title="Priorities"
            lead="I'll read every task — deadlines, weight, the lot — and tell you the order to actually do them in."
            action={<ActionButton onClick={onRunPrioritize} disabled={loading.priorities || !hasTasks}>Prioritize my tasks</ActionButton>}
          >
            {loading.priorities ? (
              <Spinner label="Reading your tasks and weighing them up…" />
            ) : priorities.length === 0 ? (
              <Empty>{hasTasks ? "Hit prioritize. I'll sort the noise from the now." : 'Add a few tasks first — then I can rank them.'}</Empty>
            ) : (
              <ol className="space-y-3">
                {priorities.map((p, i) => {
                  const task = tasks.find((t) => t.id === p.id)
                  return (
                    <li key={p.id} className="rise flex gap-4 border-b border-dust/10 pb-3" style={{ animationDelay: `${i * 55}ms` }}>
                      <span className="font-display text-3xl text-ember/90 leading-none w-8 flex-shrink-0">{p.rank}</span>
                      <div className="min-w-0">
                        <p className="text-[15px] text-bone leading-snug">{task ? task.title : p.id}</p>
                        <p className="text-sm text-dust mt-1 leading-relaxed">{p.reasoning}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}
          </Stage>
        )}

        {activeTab === 'plan' && (
          <Stage
            kicker="Blocks, not vibes"
            title="Today's plan"
            lead="A real time-blocked schedule for the hours you've got left today — built from what's still open."
            action={<ActionButton onClick={onRunDailyPlan} disabled={loading.plan || !hasTasks}>Plan my day</ActionButton>}
          >
            {loading.plan ? (
              <Spinner label="Laying your day out in blocks…" />
            ) : dailyPlan.length === 0 ? (
              <Empty>{hasTasks ? "Plan my day, and I'll carve the hours into blocks." : "Nothing to schedule yet. Add tasks and I'll build the day."}</Empty>
            ) : (
              <ul className="space-y-0">
                {dailyPlan.map((block, i) => (
                  <li key={i} className="rise grid grid-cols-[5.5rem_1fr] gap-4 py-3 border-b border-dust/10" style={{ animationDelay: `${i * 60}ms` }}>
                    <span className="font-display text-sm text-ember leading-snug pt-0.5">{block.time}</span>
                    <span className="text-[15px] text-bone leading-snug">{block.activity}</span>
                  </li>
                ))}
              </ul>
            )}
          </Stage>
        )}

        {activeTab === 'breakdown' && (
          <Stage
            kicker="From dread to moves"
            title="Break it down"
            lead={selectedTask ? `Selected: "${selectedTask.title}"` : 'Pick a task on the left and I’ll cut it into 3–5 moves you can actually start.'}
            action={<ActionButton onClick={onRunBreakdown} disabled={!selectedTask || loading.breakdown}>Break this down</ActionButton>}
          >
            {!selectedTask ? (
              <Empty>Nothing selected. Click a task in the rail — even the scary one.</Empty>
            ) : loading.breakdown ? (
              <Spinner label={`Cutting "${selectedTask.title}" into moves…`} />
            ) : breakdown.length === 0 ? (
              <Empty>Hit break it down. I’ll turn it into 3–5 concrete steps.</Empty>
            ) : (
              <ol className="space-y-3">
                {breakdown.map((sub, i) => (
                  <li key={i} className="rise flex gap-4 items-baseline border-b border-dust/10 pb-3" style={{ animationDelay: `${i * 55}ms` }}>
                    <span className="font-display text-2xl text-mint leading-none w-7 flex-shrink-0">{i + 1}</span>
                    <span className="text-[15px] text-bone leading-snug">{sub}</span>
                  </li>
                ))}
              </ol>
            )}
          </Stage>
        )}

        {activeTab === 'nudge' && (
          <Stage
            kicker="The unvarnished version"
            title="Nudge"
            lead="No pep talk. Just where you stand and where to start, based on what's overdue versus what's coming."
            action={<ActionButton onClick={onRunNudge} disabled={loading.nudge || !hasTasks}>Give me a nudge</ActionButton>}
          >
            {loading.nudge ? (
              <Spinner label="Working out what to tell you…" />
            ) : nudge ? (
              <blockquote className="border-l-2 border-ember pl-5 py-1">
                <p className="font-display text-2xl md:text-[28px] text-bone leading-snug">{nudge}</p>
              </blockquote>
            ) : (
              <Empty>{hasTasks ? 'Ask for the nudge. I won’t sugar-coat it.' : 'Add tasks first — I can’t nudge you about nothing.'}</Empty>
            )}
          </Stage>
        )}
      </div>
    </main>
  )
}
