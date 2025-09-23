# Project-Food-Log
Capstone 1 Team-Project 

```markdown
# Project-Food-Log
Simple Food & Symptom logging web app (Express backend + static frontend).

## Run locally

- Install dependencies:

```powershell
npm install
```

- Start server (optional: set email env vars to enable notifications):

```powershell
$env:EMAIL_USER = 'your@gmail.com'; $env:EMAIL_PASS = 'app-password'; npm start
```

Server will serve the frontend at `http://localhost:3000`.

## Endpoints

- `GET /api/food-logs` - list food entries
- `POST /api/food-logs` - create food entry (json: `name, portion, date`)
- `GET /api/symptom-logs` - list symptom entries
- `POST /api/symptom-logs` - create symptom (json: `type, severity, notes, date`)

Data is stored in-memory for this demo.

```
