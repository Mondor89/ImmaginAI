# Regole di Sicurezza — ImmaginAI
*Documento operativo. Ogni nuova funzionalità che tocca dati/secret va verificata qui PRIMA dell'implementazione (comando VERIFICA-SICUREZZA).*

## Invarianti di Sicurezza — Non violare mai

| # | Invariante | Perché è sacra |
|---|-----------|----------------|
| 1 | Nessun secret/API key hardcoded nel codice frontend | `CF_API_TOKEN`, `TOGETHER_KEY`, `HF_TOKEN` vivono SOLO in Netlify env vars, letti server-side da `netlify/functions/generate.js`. Mai spostarli in `Immaginai.html` o `immaginai_admin.html`. |
| 2 | Pattern proxy backend, non BYOK | L'utente finale non inserisce mai una propria chiave. `generate.js` fa da proxy verso CF/Together/HF e non deve mai loggare né restituire le chiavi al client. |
| 3 | Ogni input utente che finisce in `innerHTML` va sanificato | Previene self-XSS. **Gap noto aperto**: vedi tabella sotto. |
| 4 | I dati persistenti restano locali | `localStorage` (galleria, impostazioni) non lascia mai il browser dell'utente. Nessun server proprio salva dati utente → nessun problema di isolamento multi-utente per ora. |
| 5 | Credenziali admin — eccezione nota, non conforme | `DEFAULT_USERS` (username/password in chiaro) è hardcoded dentro `Immaginai.html` e `immaginai_admin.html`, leggibile da chiunque apra il sorgente. Accettato come rischio basso finché l'admin gestisce solo config UI — **non estendere con funzionalità più sensibili finché non risolto** (vedi registro decisioni). |

## Superficie di Attacco per Funzionalità

| Funzionalità | Tocca secret? | Tocca dati utente? | Input esterno non fidato? | Note |
|---|---|---|---|---|
| `generate.js` (cascata AI: Pollinations→CF→Together→HF→Horde) | Sì — 3 token in env vars | No | Sì — prompt utente inoltrato ai provider | Chiavi solo server-side. OK. |
| Login admin (`immaginai_admin.html`) | Sì — credenziali hardcoded in frontend | No | No | ⚠ Violazione nota, vedi invariante 5 |
| Galleria (`localStorage`, `ig_gallery`) | No | Solo locale al browser dell'utente | No | Nessun rischio multi-utente — i dati non lasciano il device |
| `renderGallery()` → `gallery-caption` con `it.prompt` | No | No | Sì — testo libero digitato dall'utente | ⚠ **Gap aperto**: `it.prompt` va in `innerHTML` senza escape ([Immaginai.html:1321](../app/Immaginai.html)). Self-XSS possibile. Basso rischio pratico (colpisce solo il proprio browser), ma va sanato prima di aggiungere sync/condivisione della galleria. |
| Prompt/negativePrompt in `spinnerMsg`/errori | No | No | Parziale — solo messaggi statici, non l'input diretto dell'utente | OK, non risultano interpolazioni dirette del prompt utente in questi punti |

## Checklist VERIFICA-SICUREZZA

- [ ] Viola un'invariante di sicurezza?
- [ ] Nuovo secret/API key — gestito come gli altri (proxy server-side, mai nel frontend)?
- [ ] Nuovo punto di input utente — sanificato prima di finire nel DOM?
- [ ] Nuovo dato persistito — resta locale o richiede isolamento multi-utente?
- [ ] Nuova chiamata a API esterna — gestita se fallisce/va in timeout (vedi cascata in `generate.js`)?

## Registro Decisioni di Sicurezza

| Sessione | Decisione | Motivazione |
|----------|-----------|--------------|
| S16 | File creato, invarianti e superficie d'attacco compilate da analisi del codice esistente | Setup del processo REVISIONA/VERIFICA-SICUREZZA richiesto da Fabio per ridurre revisioni future |
| S16 | Credenziali admin in chiaro accettate come rischio noto, non bloccante | Basso valore del bersaglio (solo configurazione UI, nessun dato di terzi) — da rivedere se l'admin arriverà a gestire dati più sensibili |
| S16 | Escape mancante su `it.prompt` in galleria registrato come gap aperto, non risolto in questa sessione | Fuori scope della sessione (setup processo, non bugfix) — da pianificare come task dedicato |
