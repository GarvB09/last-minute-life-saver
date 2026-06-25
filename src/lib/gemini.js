import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

function getModel() {
  if (!genAI) {
    throw new Error('Missing VITE_GEMINI_API_KEY. Add it to your .env file.')
  }
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
  if (!match) throw new Error('Could not parse AI response as JSON')
  return JSON.parse(match[0])
}

function summarizeTasks(tasks) {
  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    deadline: t.deadline,
    priorityHint: t.priorityHint,
  }))
}

export async function prioritizeTasks(tasks) {
  const model = getModel()
  const prompt = `You are a productivity assistant. Given this list of tasks (JSON), rank them by urgency and importance.
Tasks: ${JSON.stringify(summarizeTasks(tasks))}

Respond with ONLY a JSON array, no markdown, in this exact shape:
[{"id": "<task id>", "rank": 1, "reasoning": "short reason"}]`

  const result = await model.generateContent(prompt)
  return extractJson(result.response.text())
}

export async function generateDailyPlan(tasks) {
  const model = getModel()
  const now = new Date().toLocaleString()
  const prompt = `You are a productivity assistant. The current date/time is ${now}. Given these pending tasks (JSON), create a realistic time-blocked schedule for today.
Tasks: ${JSON.stringify(summarizeTasks(tasks))}

Respond with ONLY a JSON array, no markdown, in this exact shape:
[{"time": "9:00 AM - 10:00 AM", "activity": "short description"}]`

  const result = await model.generateContent(prompt)
  return extractJson(result.response.text())
}

export async function generateNudge(tasks) {
  const model = getModel()
  const now = new Date().toLocaleString()
  const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date())
  const upcoming = tasks.filter((t) => !t.deadline || new Date(t.deadline) >= new Date())
  const prompt = `You are a sharp, dry friend who is very good at their work — not a motivational poster. The current date/time is ${now}.
Overdue tasks: ${JSON.stringify(summarizeTasks(overdue))}
Upcoming tasks: ${JSON.stringify(summarizeTasks(upcoming))}

Write a 1-2 sentence nudge that names what actually matters right now and tells them where to start. Be direct and a little dry. No emojis, no exclamation marks, no "you've got this", no clichés. Plain text only, no JSON, no markdown.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function breakdownTask(task) {
  const model = getModel()
  const prompt = `You are a productivity assistant. Break this task into 3 to 5 concrete, actionable subtasks ordered by what to do first.
Task title: ${task.title}
Deadline: ${task.deadline || 'none'}
Priority hint: ${task.priorityHint || 'none'}

Each subtask is a short imperative phrase. Respond with ONLY a JSON array of 3-5 strings, no markdown, in this exact shape:
["subtask 1", "subtask 2"]`

  const result = await model.generateContent(prompt)
  return extractJson(result.response.text())
}
