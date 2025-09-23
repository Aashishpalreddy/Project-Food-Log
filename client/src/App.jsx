import React, { useEffect, useState } from 'react'

function App() {
  const [foodLogs, setFoodLogs] = useState([])
  const [symptomLogs, setSymptomLogs] = useState([])
  const [status, setStatus] = useState('Connecting to backend...')

  useEffect(() => {
    async function load() {
      try {
        const [fRes, sRes] = await Promise.all([
          fetch('/api/food-logs'),
          fetch('/api/symptom-logs')
        ])
        const [fData, sData] = await Promise.all([fRes.json(), sRes.json()])
        setFoodLogs(fData)
        setSymptomLogs(sData)
        setStatus('Connected to backend')
      } catch (err) {
        setStatus('Offline - backend not available')
        console.error(err)
      }
    }
    load()
  }, [])

  async function addFood(e) {
    e.preventDefault()
    const form = e.target
    const name = form.name.value
    const portion = form.portion.value
    const date = form.date.value
    try {
      const res = await fetch('/api/food-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, portion, date })
      })
      const saved = await res.json()
      setFoodLogs(prev => [...prev, saved])
      form.reset()
    } catch (err) {
      alert('Failed to save food')
    }
  }

  async function addSymptom(e) {
    e.preventDefault()
    const form = e.target
    const type = form.type.value
    const severity = form.severity.value
    const notes = form.notes.value
    const date = form.date.value
    try {
      const res = await fetch('/api/symptom-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, severity, notes, date })
      })
      const saved = await res.json()
      setSymptomLogs(prev => [...prev, saved])
      form.reset()
    } catch (err) {
      alert('Failed to save symptom')
    }
  }

  return (
    <div className="container">
      <h1>Food & Symptom Log</h1>
      <div className="status">{status}</div>

      <section>
        <h2>Log Food</h2>
        <form onSubmit={addFood} name="foodForm">
          <input name="name" placeholder="Food name" required />
          <input name="portion" placeholder="Portion size" required />
          <input name="date" type="datetime-local" required />
          <button type="submit">Add Food</button>
        </form>
        <table>
          <thead>
            <tr><th>Food</th><th>Portion</th><th>Date</th></tr>
          </thead>
          <tbody>
            {foodLogs.map(f => (
              <tr key={f.id}><td>{f.name}</td><td>{f.portion}</td><td>{f.date}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Log Symptom</h2>
        <form onSubmit={addSymptom} name="symptomForm">
          <input name="type" placeholder="Symptom (e.g., bloating)" required />
          <input name="severity" type="number" min="1" max="10" placeholder="Severity (1-10)" required />
          <textarea name="notes" placeholder="Notes" />
          <input name="date" type="datetime-local" required />
          <button type="submit">Add Symptom</button>
        </form>
        <table>
          <thead>
            <tr><th>Symptom</th><th>Severity</th><th>Notes</th><th>Date</th></tr>
          </thead>
          <tbody>
            {symptomLogs.map(s => (
              <tr key={s.id}><td>{s.type}</td><td>{s.severity}</td><td>{s.notes}</td><td>{s.date}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
