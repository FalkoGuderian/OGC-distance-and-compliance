# 🔒 Sicherheitshinweise

## API-Schlüssel und sensible Daten

### ⚠️ Wichtige Sicherheitshinweise

Dieses Projekt verwendet **externe API-Dienste**, die API-Schlüssel erfordern. **Gebote der Sicherheit:**

- **🔑 API-Schlüssel niemals im Code committen!**
- **🚫 Nie Schlüssel in Konfigurationsdateien speichern**
- **🔐 Immer nur zur Laufzeit über die Benutzeroberfläche eingeben**

### Betroffene Dienste

#### OpenRouter API (KI-Funktionen)
- **Zweck**: Natürlichsprachliche Parameter-Extraktion und Compliance-Prüfung
- **Schlüssel-Eingabe**: Im Browser über das Input-Feld "OpenRouter API Key (Mistral)"
- **Speicherung**: NUR im Browser-Speicher für die aktuelle Session
- **URL**: `https://openrouter.ai/api/v1/chat/completions`
- **Modell**: `x-ai/grok-4-fast:free`

### Anwendbare Sicherheitspraktiken

#### 1. Git-Repository-Sicherheit
- Alle .env-, .secret-, und Konfigurationsdateien sind in `.gitignore` eingetragen
- **Nie** sensible Daten committen - auch nicht vorübergehend
- Bei versehentlichem Commit: Sofort Schlüssel rotieren

#### 2. API-Schlüssel-Management
```javascript
// ❌ SCHLECHT - Schlüssel im Code
const apiKey = "sk-1234567890abcdef";

// ✅ GUT - Schlüssel zur Laufzeit eingegeben
const apiKey = document.getElementById('mistral-api-key').value.trim();
```

#### 3. HTTPS-Kommunikation
- Alle API-Calls erfolgen über HTTPS
- Browser validiert Zertifikate automatisch

#### 4. CORS-Sicherheit
- Der Server muss CORS für diesen Origin erlauben
- CORS-Konfiguration im Build-Prozess für Produktion beachten

### Bei Sicherheitsvorfällen

1. **Sofortige Schlüsselrotation**: Neue API-Schlüssel generieren
2. **Git-Commit rückgängig machen**: Falls Schlüssel committet wurden
3. **Repository archivieren**: Bei schwerwiegenden Vorfällen
4. **Issue erstellen**: Für Sicherheitsprobleme im Code

### Entwicklungsumgebung

#### Lokale Entwicklung
- Verwenden Sie `.env.local` (in `.gitignore`)
- Beispiel `.env.local`:
```bash
# API KEYS - NEVER COMMIT!
# VITE_OPENROUTER_API_KEY=your_key_here  # FOR DEVELOPMENT ONLY
```

#### Production Build
- Keine sensiblen Daten im build
- Alle Schlüssel werden zur Laufzeit eingegeben
- Build ist sicher zum öffentlichen Hosting geeignet

### Drittanbieter-Abhängigkeiten

Scannen Sie regelmäßig auf Sicherheitslücken in:
- `package.json` Dependencies
- CDN-Ressourcen (Leaflet, Tailwind CSS)
- API-Endpunkte

### Kontakt

Bei Sicherheitsbedenken oder -vorfällen:
1. Keine Details in öffentlichen Issues posten
2. E-Mail-Kontakt für sensible Diskussionen
3. Sofortige Schlüsselrotation einleiten
