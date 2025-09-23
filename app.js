// Store logs in memory
let foodLogs = [];
let symptomLogs = [];

// Handle food form
document.getElementById("foodForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("foodName").value;
  const portion = document.getElementById("portion").value;
  const date = document.getElementById("foodDate").value;

  foodLogs.push({ name, portion, date });
  renderFoodTable();

  this.reset();
});

function renderFoodTable() {
  const table = document.getElementById("foodTable");
  table.innerHTML = "<tr><th>Food</th><th>Portion</th><th>Date</th></tr>";
  foodLogs.forEach(log => {
    table.innerHTML += `<tr><td>${log.name}</td><td>${log.portion}</td><td>${log.date}</td></tr>`;
  });
}

// Handle symptom form
document.getElementById("symptomForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const type = document.getElementById("symptomType").value;
  const severity = document.getElementById("severity").value;
  const notes = document.getElementById("notes").value;
  const date = document.getElementById("symptomDate").value;

  symptomLogs.push({ type, severity, notes, date });
  renderSymptomTable();

  this.reset();
});

function renderSymptomTable() {
  const table = document.getElementById("symptomTable");
  table.innerHTML = "<tr><th>Symptom</th><th>Severity</th><th>Notes</th><th>Date</th></tr>";
  symptomLogs.forEach(log => {
    table.innerHTML += `<tr><td>${log.type}</td><td>${log.severity}</td><td>${log.notes}</td><td>${log.date}</td></tr>`;
  });
}
