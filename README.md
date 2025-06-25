# Wissensplattform – V5

## Schnellstart

### Voraussetzungen
- MongoDB Atlas oder lokal laufende MongoDB
- Node.js 18+

---

### Projektstruktur

- `backend/` – Express + Mongoose API
- `frontend/` – React + Zustand App

---

### 1. Repository klonen & Codespace starten

1. Repository auf GitHub anlegen (z.B. `V5`).
2. Codespace starten (grüner Button → Codespaces).

---

### 2. Backend konfigurieren & starten

- Lege im Ordner `backend/` eine `.env` an (siehe `.env.example`):

```
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=dein_geheimnis
```

- Installiere Dependencies & starte das Backend:
```bash
cd backend
npm install
npm run dev
```

---

### 3. Frontend starten

```bash
cd frontend
npm install
npm run dev
```

Frontend läuft auf [http://localhost:5173](http://localhost:5173)  
Backend auf Port 4000

---

### 4. Anmeldung & Rollen

- Registriere einen User.
- Um Admin/Editor zu werden, ändere die Rolle in der Datenbank oder via Admin-Panel (sofern schon Admin).

---

### 5. Features

- Karten CRUD, Favoriten, Kommentare, Benachrichtigungen (im UI, kein Mail)
- Suche & Filter, Tagging, PDF-Export (mehrere Karten)
- Rollen: User, Editor, Admin (Zugriffsrechte beachten!)
- Admin-Dashboard mit Statistiken

---

### 6. Codespaces & MongoDB

- Standardmäßig ist **keine MongoDB** in Codespaces installiert.
- Nutze MongoDB Atlas und trage die Cloud-URI in `.env` ein:
  ```
  MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/wissensplattform
  ```

---

### 7. Devcontainer Support (optional)

Der Ordner `.devcontainer/` enthält eine Beispielkonfiguration für Codespaces mit Node.js + MongoDB.

---

Viel Erfolg!  
