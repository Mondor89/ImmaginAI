# Regole di Sicurezza — ImmaginAI
*Documento operativo. Ogni nuova funzionalità che tocca dati/secret va verificata qui PRIMA dell'implementazione (comando VERIFICA-SICUREZZA).*

## Invarianti di Sicurezza — Non violare mai

| # | Invariante | Perché è sacra |
|---|-----------|----------------|
| 1 | Nessun secret/API key hardcoded nel codice frontend | `CF_API_TOKEN`, `TOGETHER_KEY`, `HF_TOKEN` vivono SOLO in Netlify env vars, letti server-side da `netlify/functions/generate.js`. Mai spostarli in `Immaginai.html` o `immaginai_admin.html`. |
| 2 | Pattern proxy backend, non BYOK | L'utente finale non inserisce mai una propria chiave. `generate.js` fa da proxy verso CF/Together/HF e non deve mai loggare né restituire le chiavi al client. |
| 3 | Ogni input utente che finisce in `innerHTML` va sanificato | Previene self-XSS. **Gap noto aperto**: vedi tabella sotto. |
| 4 | I dati persistenti restano locali | `localStorage` (galleria, impostazioni) non lascia mai il browser dell'utente. Nessun server proprio salva dati utente → nessun problema di isolamento multi-utente per ora. |
| 5 | Credenziali admin — eccezione nota, non conforme | `DEFAULT_USERS` (username/password in chiaro) è hardcoded dentro `Immaginai.html` e `immaginai_admin.html`, leggibile da chiunque apra il sorgente. **La password resta in chiaro anche dopo il login**: `immaginai_admin.html` la scrive in `localStorage` (`ig_admin_session`) senza scadenza, riletta a ogni apertura — non solo nel codice sorgente. Accettato come rischio basso finché l'admin gestisce solo config UI — **non estendere con funzionalità più sensibili finché non risolto** (vedi registro decisioni). |

## Superficie di Attacco per Funzionalità

| Funzionalità | Tocca secret? | Tocca dati utente? | Input esterno non fidato? | Note |
|---|---|---|---|---|
| `generate.js` (proxy server-side: CF→Together — Together disattivato di default via `TOGETHER_ENABLED`; HuggingFace rimosso in S22, dominio dismesso; Pollinations e Stable Horde sono chiamate dirette dal client in `Immaginai.html`, non passano da qui) | Sì — token in env vars | No | Sì — prompt utente inoltrato ai provider | Chiavi solo server-side. ⚠ **Mitigato in S18, non chiuso**: allowlist `Origin` esplicita ([generate.js](../netlify/functions/generate.js)) + rate limit in-memory (6 richieste/60s per IP, via `x-nf-client-connection-ip`, mai `x-forwarded-for` — falsificabile dal client). Prima di S18 l'endpoint era un proxy pubblico senza alcun controllo. **L'allowlist Origin blocca solo il browser di siti terzi** (un browser non lascia falsificare `Origin` da JS) — **non blocca un chiamante deliberato** che imposta l'header a mano (`curl`, uno script): contro quello l'unico freno reale è il rate limit. **Limite noto e accettato sul rate limit**: è per-container, si azzera ad ogni cold start Netlify — mitiga l'abuso rapido da un singolo IP, non lo elimina; non protegge da un attaccante distribuito su molti IP. Nessuno store esterno (Netlify Blobs/Redis) per restare senza dipendenze aggiuntive, coerente con lo stack vanilla del progetto — vedi backlog in `immaginai_stato.md` per valutarlo. **S22**: aggiunta validazione input (`prompt` non vuoto/max 800 char, `width`/`height` clampati a [256,1024]) e timeout esplicito 8s per chiamata provider — prima un valore non numerico produceva `NaN` inoltrato ai provider, e una chiamata appesa consumava tutto il budget della function senza fallback. |
| Login admin (`immaginai_admin.html`) | Sì — credenziali hardcoded in frontend | No | No | ⚠ Violazione nota, vedi invariante 5 |
| Galleria (`localStorage`, `ig_gallery`) | No | Solo locale al browser dell'utente | No | Nessun rischio multi-utente — i dati non lasciano il device |
| `renderGallery()` → `gallery-caption` con `it.prompt` | No | No | Sì — testo libero digitato dall'utente | ⚠ **Gap aperto**: `it.prompt` va in `innerHTML` senza escape ([Immaginai.html:1321](../app/Immaginai.html)). Self-XSS possibile. Basso rischio pratico (colpisce solo il proprio browser), ma va sanato prima di aggiungere sync/condivisione della galleria. |
| Prompt/negativePrompt in `spinnerMsg`/errori | No | No | Sì — `generateHorde()` interpola `chk.queue_position`/`chk.wait_time` in `innerHTML` ([Immaginai.html:1169](../app/Immaginai.html)) presi dalla risposta JSON di Stable Horde, un servizio di terze parti | Non è il prompt utente (quello resta pulito), ma è comunque dato esterno non fidato in `innerHTML` — richiede che stablehorde.net sia compromesso o malevolo, rischio pratico molto basso. Non "solo messaggi statici" come descritto prima (trovato dall'audit S21) |

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
| S18 | `generate.js`: aggiunta allowlist `Origin` + rate limit in-memory (recepimento di `U-025`, segnalato non pertinente per errore in S17 — vedi `CLAUDE.md` → Allineamento al template) | Gap reale non tracciato: proxy pubblico verso 3 API a pagamento senza alcun controllo su chi lo chiama, segnalato esplicitamente da Fabio |
| S18 | Audit indipendente sul fix sopra (fuori dal flusso REGISTRA, su richiesta di Fabio): corretti fallback `x-forwarded-for` falsificabile, azzeramento totale del rate limit oltre 500 chiavi, dicitura "chiuso" ammorbidita in "mitigato, non chiuso" — l'allowlist Origin non ferma un chiamante deliberato (`curl`), solo il browser di terzi | Un secondo controllo indipendente su un fix di sicurezza appena scritto ha trovato problemi reali che il primo giro (scrittura + test manuale) non aveva notato — coerente con la pratica già in uso per le patch di `CLAUDE.md` |
| S21 | Audit completo del progetto (2 sotto-agenti Opus 5, sola lettura): tutte le invarianti di sicurezza confermate rispettate nel codice attuale, cascata reale = documentata. Aggiornate invariante 5 (password admin anche in `localStorage`, non solo nel sorgente) e la riga su `spinnerMsg`/errori (Stable Horde interpola dati esterni non fidati in `innerHTML`, non solo messaggi statici) | Due dettagli reali non tracciati prima, nessuno dei due cambia la valutazione di rischio esistente (basso in entrambi i casi) ma il documento va tenuto accurato |
| S22 | `generate.js` (Sessione A del backlog S21): validazione input (`prompt` non vuoto/max 800, `width`/`height` clampati [256,1024]), timeout 8s per chiamata provider, rimosso step HuggingFace (dominio `api-inference.huggingface.co` non risolve più — confermato via `curl`), gate `TOGETHER_ENABLED` esplicito oltre alla key, pin `NODE_VERSION=20` in `netlify.toml` | Bug diagnosticati dall'audit S21: input non validato poteva produrre `NaN` inoltrato ai provider a pagamento; senza timeout una chiamata appesa impediva il fallback al provider successivo |
