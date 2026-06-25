// The Fuse engine — turns a deadline into how much fuse is left and what color it burns.

const MINT = [116, 211, 174]
const AMBER = [240, 180, 70]
const EMBER = [251, 90, 60]
const HORIZON_MS = 1000 * 60 * 60 * 48 // fuse starts burning inside 48h

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t)
}

function lerpColor(c1, c2, t) {
  return `rgb(${lerp(c1[0], c2[0], t)}, ${lerp(c1[1], c2[1], t)}, ${lerp(c1[2], c2[2], t)})`
}

// t = burn progress: 0 = lots of time (full fuse, mint), 1 = due/overdue (spent fuse, ember)
export function fuseState(task, now = Date.now()) {
  if (task.done) return { state: 'done', burn: 0, remainingPct: 100, color: 'rgb(116,211,174)' }
  if (!task.deadline) return { state: 'none', burn: 0, remainingPct: 100, color: 'rgba(154,143,176,0.5)' }

  const dl = new Date(task.deadline).getTime()
  if (Number.isNaN(dl)) return { state: 'none', burn: 0, remainingPct: 100, color: 'rgba(154,143,176,0.5)' }

  if (dl <= now) return { state: 'overdue', burn: 1, remainingPct: 0, color: 'rgb(251,90,60)' }

  const remaining = dl - now
  const burn = Math.max(0, Math.min(1, 1 - remaining / HORIZON_MS))
  const color = burn < 0.5 ? lerpColor(MINT, AMBER, burn * 2) : lerpColor(AMBER, EMBER, (burn - 0.5) * 2)
  return { state: 'live', burn, remainingPct: Math.round((1 - burn) * 100), color }
}

// Human countdown to the nearest pending deadline, for the rail header.
export function nearestDeadline(tasks, now = Date.now()) {
  const upcoming = tasks
    .filter((t) => !t.done && t.deadline && !Number.isNaN(new Date(t.deadline).getTime()))
    .map((t) => ({ task: t, dl: new Date(t.deadline).getTime() }))
    .sort((a, b) => a.dl - b.dl)

  if (upcoming.length === 0) return null

  const next = upcoming[0]
  const diff = next.dl - now
  return { task: next.task, diff, overdue: diff <= 0 }
}

export function formatCountdown(diff) {
  const abs = Math.abs(diff)
  const m = Math.floor(abs / 60000) % 60
  const h = Math.floor(abs / 3600000) % 24
  const d = Math.floor(abs / 86400000)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}
