// Fetch and display logs from backend
async function fetchLogs() {
  try {
    const [foodRes, symptomRes] = await Promise.all([
      fetch('/api/food-logs'),
      fetch('/api/symptom-logs')
    ]);
    const [foodData, symptomData] = await Promise.all([foodRes.json(), symptomRes.json()]);
    renderFoodTable(foodData);
    renderSymptomTable(symptomData);
  } catch (err) {
    console.error('Error fetching logs', err);
  }
}

// Handle food form
document.getElementById("foodForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("foodName").value;
  const portion = document.getElementById("portion").value;
  const date = document.getElementById("foodDate").value;

  try {
    const res = await fetch('/api/food-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, portion, date })
    });
    if (!res.ok) throw new Error('Failed to save food');
    const saved = await res.json();
    // append to table
    prependFoodRow(saved);
    this.reset();
  } catch (err) {
    console.error(err);
    alert('Could not save food.');
  }
});

function renderFoodTable(logs) {
  const table = document.getElementById("foodTable");
  table.innerHTML = "<tr><th>Food</th><th>Portion</th><th>Date</th></tr>";
  logs.forEach(log => {
    table.innerHTML += `<tr><td>${escapeHtml(log.name)}</td><td>${escapeHtml(log.portion)}</td><td>${escapeHtml(log.date)}</td></tr>`;
  });
}

function prependFoodRow(log) {
  const table = document.getElementById("foodTable");
  const row = `<tr><td>${escapeHtml(log.name)}</td><td>${escapeHtml(log.portion)}</td><td>${escapeHtml(log.date)}</td></tr>`;
  table.innerHTML += row;
}

// Handle symptom form
document.getElementById("symptomForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const type = document.getElementById("symptomType").value;
  const severity = document.getElementById("severity").value;
  const notes = document.getElementById("notes").value;
  const date = document.getElementById("symptomDate").value;

  try {
    const res = await fetch('/api/symptom-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, severity, notes, date })
    });
    if (!res.ok) throw new Error('Failed to save symptom');
    const saved = await res.json();
    prependSymptomRow(saved);
    this.reset();
  } catch (err) {
    console.error(err);
    alert('Could not save symptom.');
  }
});

function renderSymptomTable(logs) {
  const table = document.getElementById("symptomTable");
  table.innerHTML = "<tr><th>Symptom</th><th>Severity</th><th>Notes</th><th>Date</th></tr>";
  logs.forEach(log => {
    table.innerHTML += `<tr><td>${escapeHtml(log.type)}</td><td>${escapeHtml(log.severity)}</td><td>${escapeHtml(log.notes || '')}</td><td>${escapeHtml(log.date)}</td></tr>`;
  });
}

function prependSymptomRow(log) {
  const table = document.getElementById("symptomTable");
  const row = `<tr><td>${escapeHtml(log.type)}</td><td>${escapeHtml(log.severity)}</td><td>${escapeHtml(log.notes || '')}</td><td>${escapeHtml(log.date)}</td></tr>`;
  table.innerHTML += row;
}

// small utility to avoid XSS when inserting user content
function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// initial load
fetchLogs();
