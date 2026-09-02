# ImmaginAI — Stato del Progetto
> Aggiorna ogni sessione con REGISTRA. Se supera 150 righe, snellire prima.

---

## Stato Attuale

| Campo | Valore |
|-------|--------|
| Ultimo aggiornamento | 2 Settembre 2026 — S22 |
| Versione app | v4.4 |
| Stato | ✅ Pollinations primario (gratis, illimitato) — CF come backup qualità (steps:4), Together.ai disattivato via gate esplicito. CLAUDE.md allineato al template APP (U-039→U-052 recepiti S21). Sessione A del backlog S21 chiusa in S22: `generate.js` validato/con timeout, HuggingFace morto rimosso, Together gated |
| Prossima task | Sessione B — Flusso di generazione e UX visibile (download/CTA Designer, galleria, ciclo Modifica) — vedi "Backlog per sessioni future" sotto |
| Admin | ✅ Long press 3s logo → apre `immaginai_admin.html` in nuova scheda |
| Netlify | ✅ https://wonderspit-ai.netlify.app/ |
| GitHub | ✅ Repo attivo — https://github.com/Mondor89/ImmaginAI |

---

## Backlog per sessioni future — organizzato per argomento e priorità (S21)

> Tabella di marcia di default, non un contratto rigido: ogni sessione futura riverifica lo stato reale del codice prima di eseguire alla lettera quanto scritto qui — un item può essersi rivelato diverso, o già risolto altrove, nel frattempo. Contiene tutto quanto emerso dall'audit completo S21 (2 sotto-agenti Opus 5, frontend+backend) più i task storici ancora aperti, raggruppati per poter risolvere "una sessione, un argomento" (vedi `CLAUDE.md` → Limite di complessità per sessione). Riferimenti file:riga verificati dai sotto-agenti, alcuni spot-check fatti a mano in chiusura S21.

### Sessione A — Backend/sicurezza `generate.js` [alta] — ✅ chiusa S22 (resta 1 item, vedi sotto)
- [x] Validazione input: `prompt` obbligatorio (non vuoto, max 800 char), `width`/`height` clampati [256,1024] con fallback 512 su valori non numerici (S22)
- [x] Timeout esplicito 8s per chiamata provider (`AbortSignal.timeout()`) (S22)
- [x] Verificato con `curl` reale: `api-inference.huggingface.co` non risolve più via DNS (dominio dismesso, non un errore HTTP) — step HuggingFace rimosso da `generate.js`. Il sostituto `router.huggingface.co` usa un formato di risposta diverso: **non riscritto**, richiede una ricerca dedicata prima di reintrodurre il provider (nuovo item sotto) (S22)
- [x] `Together.ai`: aggiunto gate esplicito `TOGETHER_ENABLED` (env var, default assente = disattivato) oltre alla key (S22)
- [x] `netlify.toml`: pin `NODE_VERSION = "20"` (S22)
- [ ] Valutare Netlify Blobs (o store equivalente) per un rate limit persistente cross-cold-start su `generate.js`, in sostituzione dell'attuale rate limit in-memory (si azzera ad ogni cold start) — aggiungerebbe una dipendenza, da valutare con calma; risolverebbe insieme anche un contatore di uso giornaliero CF (oggi assente: nessun modo di sapere quando ci si avvicina al tetto 10k neuroni/giorno)
- [ ] **Nuovo (da S22)**: valutare se reintrodurre HuggingFace su `router.huggingface.co` — verificare il nuovo formato di risposta (probabilmente diverso da `api-inference`, possibile necessità del campo `provider` o permessi gated sul modello) prima di riscrivere lo step. Priorità bassa: la cascata resta funzionante con Pollinations (client) + CF (proxy)

### Sessione B — Flusso di generazione e UX visibile [media]
- [ ] Scarica/CTA Designer inaffidabili sulle immagini Pollinations (primario): niente upscale 2x (`downloadFrom` lo fa solo sui data-URL), `fetch()` cross-origin che può far fallire il download in silenzio — stessa trappola CORS dell'errore storico #1, applicata al download invece che al caricamento
- [ ] URL Designer sbagliato: `myspreadshop.it` in `goToDesigner()` vs `myspreadshop.net` in `CLAUDE.md` — verificare a mano se redirige o è un dominio morto
- [ ] Galleria: con Stable Horde/proxy (data-URL 200-500KB) si supera facilmente la quota `localStorage` (~5MB/12 immagini) → `QuotaExceededError` inghiottito in silenzio, immagini sparite dopo reload senza avviso
- [ ] Rendere esplicito il limite di 12 immagini in galleria (oggi scarta la più vecchia senza dirlo — la FAQ promette "ogni immagine generata viene salvata")
- [ ] Decidere destino `#statusBar`: alimentata da 12 chiamate `setStatus()` ma nascosta con `display:none!important` in `immaginai_light.css` — nessun messaggio è mai visibile. Riattivarla (e usarla anche per l'avviso di galleria piena sopra) o rimuovere `setStatus`
- [ ] Chiudere il ciclo Modifica: `discardModifica` non pulisce `#modificaInput` né `ST._pendingModifica`
- [ ] `detectLayout()` su resize riporta la vista a "output non attivo" anche su mobile quando si apre la tastiera virtuale (nessun debounce sul resize) — nasconde l'immagine generata mentre si scrive nel campo Modifica
- [ ] Suggerimento: mostrare quale provider ha generato l'immagine (Pollinations vs Stable Horde hanno qualità molto diversa, oggi l'utente non sa perché)
- [ ] Test funzionali mai fatti (da S16): `immaginai_admin.html` (login, tab, salvataggio), flusso Modifica (compare overlay, keep/discard), click CTA "Usa nel Designer" (download + apertura Spreadshop)

### Sessione C — Sicurezza minore e coerenza dati admin [media]
- [ ] Sanare escape mancante su `it.prompt` in `renderGallery()` — gap noto da S16, vedi `immaginai_sicurezza.md`
- [ ] Altri punti `innerHTML`/attributi non escapati nell'admin: `value="${cat.icon}"`/`value="${cat.label}"` non escapati mentre righe vicine con lo stesso pattern lo sono — un nome con una virgoletta corrompe silenziosamente il dato salvato
- [ ] Admin → Tema → Dark rompe visivamente l'app (CSS pensato solo per light) — rimuovere l'opzione o sistemare il dark
- [ ] Tab API dell'admin descrive la cascata sbagliata (ordine invertito, dice "HuggingFace FLUX" invece di Cloudflare) — allineare al reale (Pollinations→CF→Together→HF→Horde)
- [ ] Campo "Timeout (secondi)" nell'admin non fa nulla (`ST.timeout` letto ma mai consumato, il timeout reale è hardcoded 30000 in `tryPollinations`) — decidere: farlo funzionare o rimuoverlo
- [ ] `netlify.toml`: aggiungere un blocco `[[headers]]` base (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/CSP) — impatto basso (nessun dato sensibile, nessun cookie) ma ~6 righe

### Sessione D — Pulizia tecnica: dead code + CSS [bassa, zero rischio, sessione dedicata a parte]
- [ ] Rimuovere `index.html` + i 2 loghi duplicati in root (`git rm` — verificato non serviti da Netlify, `index.html` è la fotocopia pre-S11 e contiene le stesse credenziali admin in chiaro)
- [ ] Dead code JS in `Immaginai.html`: `applyUiRatioColor`, `liveUiAccordion`, `toggleAccordion`, `removeBackground`, `copyPromptText`, `getImgExt`, `CAT_ID_ATTIVI`, `BRAND_PALETTES` (diversa da quella dell'admin, ma comunque mai usata qui), `ST.enhance`/`ST.safe`/`ST.activeApi`, `updateApiInfo`
- [ ] `tryPollinations`/`generateAuto` accettano ancora `width`/`height` senza usarli (rimossi dall'URL per il bug storico #10/#14) — la firma sopravvive al parametro rimosso: rimuoverli o commentare il motivo, altrimenti una sessione futura può "ricollegarli" pensando siano stati dimenticati e reintrodurre il 402
- [ ] 6 funzioni no-op nell'admin (`loadSavedApiKeys`, `setActiveApi`, `saveApiKey`, `toggleKey`, `saveHfToken`, `updateApiCards` — puntano a elementi rimossi dal markup)
- [ ] `HF_TOKEN` (variabile app) è in realtà la chiave di Stable Horde, non un token HuggingFace — nome fuorviante da chiarire (rinominare o commentare), rischia confusione col secret server-side vero
- [ ] CSS morto: ~46 regole (99 `!important`) in `immaginai_light.css`, 19 selettori morti nell'inline dell'app — inclusi due blocchi interi di un vecchio pannello admin pre-S11 e un accordion "Opzioni avanzate" rimosso; selettori duplicati non conflittuali (`#controls-scroll`, `#preview-col`, ecc.) da consolidare
- [ ] Pannello admin: 5 colori diversi nella stessa schermata (navy/teal dello `<style>` inline dell'admin vs viola di `immaginai_light.css`, che vince solo sui selettori ancora vivi) — uniformare
- [ ] Collisione di significato sui colori attivi: `immaginai_light.css` appiattisce su viola sia i controlli "Dettagli visivi" (cyan nel tema originale) sia "Stile/Formato" — la distinzione si perde nel tema effettivamente in uso. Minore: dado e `.neg-toggle.open` condividono lo stesso pink nella stessa vista
- [ ] Unificare i 3 blocchi quasi identici `generateImage`/`generateModifica`/`regenImage` (~90 righe duplicate: messaggio d'errore, salvataggio in galleria)
- [ ] Leak di listener su scroll tab (`buildDvTabs`), `generateModifica` non disabilita i bottoni Genera durante l'attesa, guardia NaN su `ig_cooldown` applicata solo nell'app non nell'admin

### Sessione E — Roadmap prodotto [bassa, esplorativa]
- [ ] Valutare provider gratuito realmente illimitato con qualità migliore di Pollinations (Together.ai scartato — richiede deposito)

### Idee prodotto (backlog libero, non dall'audit)
- [ ] (post P.IVA) Immagini di riferimento con analisi Claude API
- [ ] Login Google Firebase (storico cloud)
- [ ] Bilingue IT/EN
- [ ] Mockup prodotto in anteprima
- [ ] Upscaler immagine
- [ ] Rimuovi sfondo vero (Remove.bg o REMBG)

---

## Task Completate S22

- [x] Sessione A del backlog S21 (Backend/sicurezza `generate.js`), Sonnet 5 impegno medio — bug già diagnosticati dall'audit S21, nessuna escalation necessaria:
  1. **Validazione input**: `prompt` obbligatorio (stringa non vuota dopo trim, max 800 char) → `400 INVALID_PROMPT` se non rispettato; `width`/`height` passati da una funzione `clampDim()` che scarta valori non numerici (fallback 512) e clampa il risultato a [256,1024] — prima un valore malformato produceva `NaN` inoltrato ai provider a pagamento
  2. **Timeout provider**: `AbortSignal.timeout(8000)` su CF e Together — prima una chiamata appesa consumava tutto il budget della function senza che il provider successivo venisse mai provato. Verificato via `curl` che `google.com` risolve normalmente (nessun problema di rete generale), isolando il problema al solo dominio HuggingFace
  3. **HuggingFace rimosso**: confermato via `curl` che `api-inference.huggingface.co` non risolve più via DNS (`Could not resolve host`, non un errore 4xx/5xx — dominio dismesso). Il sostituto `router.huggingface.co` risponde (401 senza auth, atteso) ma con un formato di risposta diverso, non verificato in questa sessione — segnalato come nuovo item backlog invece di riscrivere alla cieca
  4. **Together.ai**: aggiunto gate esplicito `TOGETHER_ENABLED === 'true'` oltre alla presenza di `TOGETHER_KEY` — prima bastava che la key fosse impostata per errore (es. test, variabile dimenticata) per riattivare un provider scartato in S16 senza alcun segnale
  5. **`netlify.toml`**: pin `NODE_VERSION = "20"` in `[build.environment]`
- [x] Sintassi verificata (`node --check`), logica di `clampDim()` testata a mano su 6 casi (numero normale, stringa non numerica, undefined, valore assurdo, negativo, `NaN` letterale) — tutti i fallback/clamp corretti
- [x] **Non verificabile in Browser pane**: codice server-side Netlify Function con secret reali (`CF_API_TOKEN` ecc.), non riproducibile con `npx serve`. Skip esplicito della verifica visuale per questo motivo, non per omissione
- [x] `immaginai_sicurezza.md` aggiornato: riga cascata `generate.js` (CF→Together, HF rimosso), nota sulla nuova validazione/timeout, nuova riga nel Registro Decisioni
- [x] Backlog Sessione A marcato chiuso in `immaginai_stato.md`, con 1 item lasciato aperto (rate limit persistente su Netlify Blobs — decisione esplicitamente rimandata, introduce una dipendenza) e 1 nuovo item aggiunto (riscrittura HF su `router.huggingface.co`, priorità bassa)
- [x] REGISTRA eseguito a metà sessione (non a fine sessione) su richiesta di Fabio, per chiudere la Sessione A con un commit separato prima di aprire la Sessione B — coerente con "una sessione risolve una cosa sola" (`CLAUDE.md` → Limite di complessità)

## Task Completate S21

- [x] `RECEPISCI` eseguito: 14 travasi in sospeso dal registro (`U-039`→`U-052`) applicati a `CLAUDE.md` — grep su percorso vecchio quando si corregge un path stale, coerenza dei nomi rivolti a chi legge, collisione di etichette testuali (gemella del colore badge), budget di sessione dei sotto-agenti in parallelo, "sola lettura" non enforced sui sotto-agenti + invariante "scrive il chiamante", preferenza per `Explore` su esplorazioni ampie, `NaN` non escluso da `typeof`, countdown/ETA calcolato una volta per fase, ricostruire un vincolo di piattaforma non documentato per analogia, misurare via DOM nel Browser pane per aggiustamenti visivi fini, output letterale da tool AI generativo con tetto 2 tentativi, dev server locale (`preview_stop`) da fermare a fine sessione
- [x] 4 travasi segnalati non pertinenti con nota in `Travasi recepiti`: `U-043` (nessuno strumento CLI esterno nel codice), `U-048` (nessuna richiesta di rete lato server da URL utente — il logo custom è un `<img src>` lato client), `U-049` (la sezione vale solo per un coordinatore Archetipo C, ImmaginAI è il satellite)
- [x] Audit indipendente (sotto-agente Opus 5) **prima** di scrivere, su richiesta esplicita a Fabio (2 travasi toccavano Gestione modello, sezione condivisa, e 14 patch venivano applicate insieme): trovata e corretta una riclassificazione sbagliata (`U-045` dichiarato "non pertinente" ma `.claude/launch.json` avvia davvero un dev server a porta fissa per il Browser pane — applicato), una lista di file di config imprecisa in `U-039` (citava un `.claude/settings.json` inesistente, ometteva `netlify.toml`/`.claude/launch.json` reali), un caso mancante in `U-051` (pagina di terzi — `wonderspit_spreadshop.css` posiziona un bottone fisso su una pagina Spreadshop non controllata), una clausola mancante nel countdown/ETA (il dato reale può sempre sovrascrivere la stima anche verso l'alto), e una motivazione da precisare su `U-048`
- [x] Trovati durante l'audit (non ancora bug osservati) e **risolti nella stessa sessione** su richiesta di Fabio: `loadSaved()` non valida `ig_cooldown`/`ig_timeout` da `localStorage` prima di `parseInt` (un valore corrotto produce `NaN`) — ora entrambi validati con `Number.isNaN()`; percorso stale pre-riorganizzazione in `.claude/settings.local.json` — aggiornato a `WS-Cruscotto`, nessun'altra occorrenza trovata col grep
- [x] Su richiesta esplicita di Fabio ("audit approfondito su tutto il progetto"), lanciati 2 sotto-agenti in parallelo su Opus 5 (sola lettura, budget dichiarato prima del lancio) per un audit completo: **Agente A** frontend (`Immaginai.html`, `immaginai_admin.html`, CSS, dead code, drift dati admin/app), **Agente B** backend+sicurezza (`generate.js`, `netlify.toml`, coerenza con `immaginai_sicurezza.md`). Findings completi organizzati per sessione futura in cima a questo file
- [x] Applicati i 4 fix a priorità più alta scelti da Fabio dall'elenco dell'audit (Sonnet 5, nessun secondo audit Opus — bug già diagnosticati con file:riga esatti, non serviva nuova esplorazione):
  1. **Cooldown unificato**: nuova funzione `attendiCooldown()` in `Immaginai.html`, usata da `generateImage`/`generateModifica`/`regenImage` (prima solo `generateImage` lo rispettava — `regenImage`/`generateModifica`/`resetAndRetry` azzeravano `ST.lastGenTime` bypassandolo). Default portato da 5000 a 16000ms (violava la regola ferrea "16s obbligatorio" per ogni utente nuovo)
  2. **`DEFAULT_FAQ_DATA` riallineato**: l'admin aveva 8 domande troncate contro le 13 complete dell'app (mancava anche l'avviso legale sull'uso commerciale) — un "Salva tutto" sulla tab FAQ avrebbe cancellato quel contenuto in produzione. Copiato il blocco completo dall'app
  3. **`applyUiSettings()` implementata**: la funzione non esisteva, `loadUiSettings()` la chiamava in `ReferenceError` ogni volta che `ig_ui` esisteva in `localStorage` — e l'errore avveniva **prima** della registrazione del listener `resize`, rompendo l'adattamento del layout a resize/rotazione. Ora applica label/icone di Prompt/Dettagli visivi/Stile/Formato/Genera e i colori del bottone Genera (`--gen-btn-bg`/`--gen-btn-color`); **non** applica `tabActiveBg`/`chipActiveBg`/`ratioActiveBg` perché le regole CSS di `.dv-tab.active`/`.dv-chip.active`/`.ratio-btn.active` usano colori fissi, non quelle custom property — richiederebbe anche riscrivere il CSS, fuori scope di questo fix (in backlog)
  4. **`generate.js`**: `num_steps` → `steps` (il parametro Cloudflare corretto — prima non aveva mai avuto effetto) + `console.error` nei 3 rami provider (CF/Together/HF) su fallimento — prima tutti i `catch` erano vuoti, rendendo `ALL_MODELS_FAILED` (già visto in S18) undiagnosticabile. Valore riportato a `steps: 4` su richiesta di Fabio dopo aver segnalato che 8 step raddoppia il consumo di neuroni/immagine e dimezza le immagini/giorno disponibili su CF backup — preferito il volume alla qualità leggermente superiore
- [x] Verificato in Browser pane (server locale S21): sintassi JS valida (`node --check` su tutti e 3 i file), nessun errore console al caricamento, `applyUiSettings` applica correttamente label/colori con `ig_ui` impostato (scenario che prima crashava), il listener `resize` ora funziona (layout passa a mobile dal vivo), `ST.cooldown` conferma 16000
- [x] `immaginai_sicurezza.md` aggiornato con 2 dettagli emersi dall'audit: le credenziali admin restano in chiaro anche dentro `localStorage` (`ig_admin_session`, non solo nel codice sorgente); Stable Horde interpola `wait_time`/`queue_position` in `innerHTML` da una risposta JSON esterna non fidata (non "solo messaggi statici" come descritto prima)
- [x] `steps: 8` riportato a `steps: 4` in `generate.js` su richiesta di Fabio (preferito il volume di immagini/giorno su CF backup alla qualità leggermente superiore)
- [x] Riorganizzato tutto il backlog emerso dall'audit in "Backlog per sessioni future" (sostituisce "Focus — DA FARE" e "Backlog audit completo — S21", ora rimosse): 5 sessioni per argomento — A Backend/sicurezza `generate.js`, B Flusso di generazione/UX, C Sicurezza minore e dati admin, D Pulizia tecnica dead code/CSS, E Roadmap prodotto. Ricontrollati entrambi i report dell'audit riga per riga per non perdere nulla: aggiunti 8 item non ancora tracciati (header di sicurezza e pin runtime Node mancanti in `netlify.toml`, resize senza debounce durante tastiera virtuale mobile, naming fuorviante di `HF_TOKEN`, campo Timeout admin non funzionante, 5 colori diversi nel pannello admin, parametri `width`/`height` morti in `tryPollinations`/`generateAuto` — trappola per una sessione futura, suggerimento di mostrare quale provider ha generato l'immagine)

## Task Completate S20

- [x] Fix riferimento rotto in CLAUDE.md: `@../_Condivisi/wonderspit_brand_kit.md` → `.html` (il file `.md` non è mai esistito, stesso refuso già corretto in 1WS mesi fa ma mai propagato qui) — trovato durante un controllo di coerenza cross-progetto lanciato da 1WS, che ha anche aggiornato il documento ecosistema condiviso da "3 progetti" a "4 progetti" (1WS-Wonderspit mancava)

## Task Completate S19

- [x] Audit indipendente (Template Claude, Sessione 21) su fix S18: segnalati 2 presunti difetti, verificati uno per uno prima di correggere
- [x] **Reale**: `immaginai_sicurezza.md` descriveva `generate.js` con la cascata completa "Pollinations→CF→Together→HF→Horde", ma `generate.js` implementa solo CF→Together→HF — Pollinations e Stable Horde sono chiamate dirette dal client in `generateAuto()` (`Immaginai.html`), non passano dal proxy. Corretta la riga nella tabella "Superficie di Attacco"
- [x] **Falso positivo, non applicato**: l'audit segnalava un off-by-one nel rate limit (`> RATE_LIMIT_MAX` invece di `>= RATE_LIMIT_MAX`, presunte 7 richieste passanti invece di 6). Verificato con test diretto della funzione `isRateLimited()`: con `RATE_LIMIT_MAX=6` passano esattamente 6 richieste, la 7ª è bloccata — coerente con "6 richieste/60s" già documentato. Nessuna modifica al codice né alla cifra in `immaginai_sicurezza.md`

## Task Completate S18

- [x] `RECEPISCI` eseguito: 5 travasi in sospeso dal registro (`U-034`→`U-038`) applicati a `CLAUDE.md` — badge/pill palette limitata (pattern-trappola), Glob+`.gitignore` (Principi di debug), WebFetch→Browser pane (Principi di debug), ordine PATCH/audit indipendente in chiusura (REGISTRA). `U-038` verificato già recepito (nato da questo stesso progetto in S17, forma equivalente)
- [x] Riga `Travasi recepiti` aggiornata con i 5 nuovi ID
- [x] Audit indipendente (sotto-agente Opus 5) sul lavoro appena fatto: trovati e corretti 3 errori reali (token cyan sbagliato in U-034 — `--c-accent` è viola, non cyan; rimando rotto "criteri già descritti sopra" in U-036 — i criteri stanno sotto, nel comando PATCH; caso "colore assegnato a runtime" mancante in U-034, pertinente perché `immaginai_admin.html` scrive `ig_ui`/`ig_colors` a runtime) + 1 refuso (heading stato.md ancora "Focus S17")
- [x] Chiuso gap sicurezza reale segnalato da Fabio: `generate.js` era un proxy pubblico verso 3 API a pagamento senza controllo Origin/rate limit — aggiunta allowlist `Origin` esplicita + rate limit in-memory per IP. Corretta annotazione errata su `U-025` in `CLAUDE.md` (era "non pertinente", ora recepito) e aggiunta la regola durevole (non solo il codice) in "Regole JavaScript/Web — pattern-trappola"
- [x] Audit indipendente (sotto-agente Opus 5), fuori dal flusso REGISTRA su richiesta di Fabio: trovati e corretti 3 problemi reali — fallback `x-forwarded-for` falsificabile dal client (rate limit aggirabile), `requestLog.clear()` a 500 chiavi azzerava il conteggio di TUTTI gli IP invece di potare solo le entry scadute, dicitura "✅ Chiuso in S18" in `immaginai_sicurezza.md` esagerata (l'allowlist Origin blocca solo il browser di siti terzi, non un chiamante deliberato con `curl` — il freno reale resta il rate limit). Verificato dal sito live che il gate Origin non rompe l'uso reale (fetch same-origin passa, arriva a `ALL_MODELS_FAILED` per motivi indipendenti dal fix)

## Task Completate S17

- [x] Prima riconciliazione di `CLAUDE.md` col template APP (`CLAUDE_APP_TEMPLATE.md`) — progetto nato prima del sistema dei template, nessuna baseline storica. Confrontato l'intero registro travasi (U-001→U-033) contro il file, riga per riga
- [x] Aggiunti 6 blocchi al `CLAUDE.md`: comando `PATCH` (campo AMBITO, deposito `_inbox`, anti-accumulo, audit pre-scrittura), comando `REGISTRA` (de-escalation, audit chiusura, rimandi interni), `Gestione modello` (controllo apertura, de-escalation, review post-escalation, vincolo piano sui sotto-agenti, hook PostToolUse), `Principi di debug` (verifica rimandi), pattern-trappola cleanup asincrono, nuova sezione `Allineamento al template`
- [x] Audit indipendente (sotto-agente Opus) sul lavoro appena fatto: trovati e corretti 2 errori reali (U-033 dichiarato recepito ma contenuto mai scritto — confuso col testo del template appena letto; U-024 elencato ma paragrafo esplicativo mancante) + 4 refusi/imprecisioni minori
- [x] PATCH depositata in `patch/_inbox` di Template Claude (`AMBITO: da portare nel template`): verificare un contenuto col grep prima di dichiararlo "già presente", non fidarsi della memoria di averlo appena letto altrove
- [ ] **Resta aperto**: 4WS-ImmaginAI non è ancora in tabella "Il perimetro" di `registro_travasi.md` — va segnalato in una sessione su Template Claude (non modificabile da qui)

## Task Completate S16

- [x] Cascata `generate.js`: Pollinations promosso a primario (gratis, illimitato), CF come backup qualità, timeout Pollinations 20s→30s
- [x] Together.ai valutato e scartato: richiede deposito iniziale su Together.ai (non è gratuito come creduto), codice proxy lasciato pronto ma non attivato
- [x] Processo di sviluppo strutturato adottato da template esterno: fast-path vs approvazione, comandi REVISIONA/VERIFICA-SICUREZZA/PATCH, Principi Prodotto (bozza, da confermare con Fabio)
- [x] Creato `docs/immaginai_sicurezza.md` — invarianti, superficie di attacco, 2 gap noti registrati (credenziali admin in chiaro, XSS non sanificato in galleria)
- [x] Test funzionale: flusso Crea (prompt→genera, Pollinations OK), Galleria (salvataggio+riusa OK), FAQ (13 domande, accordion OK), mobile (tab switching, bottom-nav, nessun overflow orizzontale — tutto OK)
- [x] Chiarito: `#genBtnMobile` sempre nascosto su mobile è intenzionale (light.css lo disabilita dopo rimozione dark theme), non un bug — vedi Errori Storici #16

## Task Completate S15

- [x] UI: allineamento footer sinistro (controls-footer grigio) con footer destro (preview-actions bianco) — math esatta 144px entrambi
- [x] UI: ctaB-btn font-weight 800 + text-transform uppercase → "USA NEL DESIGNER →" visivamente = "GENERA IMMAGINE"
- [x] Fix: Cloudflare limite scoperto — 10.000 neuroni/giorno ≈ 20 immagini (non 100k come creduto)
- [x] Fix: Pollinations API cambiata — qualsiasi param extra (seed, width, height, nologo) → 402. Ora URL bare: `?model=flux`
- [x] Diagnostica: aggiunta log dettagliato a generate.js per identificare errore CF_HTTP_429, poi ripulito
- [x] CSS: ?v=5 cache-bust

---

## Decisioni Prese

| Data | Decisione | Motivazione |
|------|-----------|-------------|
| Giu 2026 | Dark theme eliminato | Allineamento al Product Designer |
| Giu 2026 | Inter sostituisce Space Grotesk | Stesso font del Designer |
| Giu 2026 | Navy #1a237e come primario | Stesso colore Designer Admin |
| Giu 2026 | CSS separato immaginai_light.css | Non tocca l'HTML |
| Giu 2026 | Admin separato in immaginai_admin.html | Come il Product Designer |
| Giu 2026 | Long press → nuova scheda | Identico al Designer |
| Giu 2026 | Comunicazione via localStorage | Nessun coupling tra i due file |
| Giu 2026 | Claude applica + pusha subito | Netlify aggiorna solo da GitHub |
| Giu 2026 | Footer controls grigio #d8dce6 | Zona azione visivamente distinta dal form |
| Giu 2026 | Together.ai come nuovo primario | CF troppo limitato (20 img/giorno), Together FLUX gratis illimitato |
| Lug 2026 | **Revocata**: Together.ai scartato, Pollinations promosso a primario | Together.ai richiede deposito iniziale — non è gratuito come creduto in Giu 2026. Pollinations resta l'unico provider gratis+illimitato reale |
| Lug 2026 | Adottato processo REVISIONA/VERIFICA-SICUREZZA/PATCH da template esterno | Fabio vuole meno revisioni future su feature critiche, ora che l'app è pubblica con clienti reali e gestisce chiavi API |
| Ago 2026 | Baseline "Allineamento al template" fissata al 27/08/2026 (prima riconciliazione, non un `RECEPISCI` standard) | Il progetto è nato prima del sistema dei template e non aveva mai avuto questa sezione — richiedeva ricostruire i travasi recepiti sull'intero intervallo esistente (U-001→U-033), non solo sui futuri |

---

## Architettura Tecnica

```
app/
├── Immaginai.html          ← App principale v4.4 (~1310 righe)
├── immaginai_admin.html    ← Admin panel separato
├── immaginai_light.css     ← Override light theme (linkato in entrambi)
docs/
├── immaginai_stato.md      ← Questo file
├── immaginai_sicurezza.md  ← Invarianti sicurezza, superficie attacco, gap noti
└── immaginai_memoria_progetto.md ← ⚠ obsoleto (v2.6/S10), non aggiornare
```

### Cascata generazione (client, `generateAuto()` in Immaginai.html)
1. **Pollinations AI** — `?model=flux` solo, gratis, illimitato, primario dal S16
2. **generate.js** (Netlify Function) — prova in ordine, ciascuna con timeout 8s (S22):
   a. **Cloudflare Workers AI** — FLUX.1-schnell, 10k neuroni/giorno ≈ 20 img, 3-8s (Env: `CF_ACCOUNT_ID`+`CF_API_TOKEN`)
   b. **Together.ai** — FLUX.1-schnell-Free — **scartato S16, richiede deposito**, non attivare. Gate esplicito `TOGETHER_ENABLED=true` oltre a `TOGETHER_KEY` (S22)
   c. ~~HuggingFace~~ — **rimosso S22**: `api-inference.huggingface.co` non risolve più via DNS (dominio dismesso). Sostituto `router.huggingface.co` non ancora verificato/riscritto, vedi backlog
3. **Stable Horde** — ultimo fallback, lento, coda

### Note critiche
- Pollinations: SOLO `?model=flux` funziona gratis. Qualsiasi altro param → 402
- Cloudflare: limite 10k neuroni/giorno, NON 100k (errore storico)
- `_imgCache = new Set()` — NON rimuovere (GC fix)
- Caricamento immagini: `new Image()` + onload/onerror — MAI fetch()

---

## Errori Storici — Non Ripetere

| # | Errore | Causa |
|---|--------|-------|
| 1 | Immagine non carica | fetch() bloccato da CORS — usare new Image() |
| 2 | Cooldown ignorato | Timer non resettato — ST.lastGenTime=Date.now() dopo ogni gen |
| 3 | Admin non si apre | Long press non registrato su mobile — usare touchstart |
| 4 | Modifica non recepita | enhance:true riscrive prompt — usare enhance:false |
| 5 | Negative prompt ignorato | Pollinations ignora ?negative — incorporare nel testo |
| 6 | Accordion tagliato | overflow:hidden nel parent |
| 7 | JS script Spreadshop bloccato | Non usare script nel footer/header Spreadshop |
| 8 | Contorno bianco stampa | sticker style nel prompt trasparenza — rimosso |
| 9 | Double-retry scartava risultati | Inner try non settava ok=true — rimosso in S12 |
| 10 | model=flux causava 402 (vecchio) | Era paid in passato — ora è gratis, usare ?model=flux |
| 11 | Generazione "operazione annullata" 0 bytes | new Image() GC'd in Promise — aggiunto _imgCache Set |
| 12 | Tab tagliata desktop | overflow:hidden + space-evenly — usare overflow-y:auto |
| 13 | Immagine bianca Cloudflare | REST API JSON (result.image), non binario — usare res.json() |
| 14 | Pollinations 402 con parametri | width/height/seed/nologo/enhance → 402. Solo ?model=flux |
| 15 | display:flex su img-btn rompe altezza | Cambia rendering button → disallineamento footer. Non usare |
| 16 | `#genBtnMobile` sembra sempre nascosto su mobile (NON è un bug) | Intenzionale: `immaginai_light.css` ha `#genBtnMobile{display:none!important}` nella sezione mobile — disabilita il vecchio bottone flottante dell'era dark theme. Su mobile si usa `#genBtn` in-flow dentro `#controls-footer`. Non "correggere" pensando sia rotto |

---

## Log Sessioni

| Sessione | Attività |
|----------|----------|
| S22 | Sessione A del backlog (Backend/sicurezza `generate.js`), Sonnet 5 impegno medio: validazione input (`prompt` obbligatorio max 800, `width`/`height` clampati [256,1024]), timeout 8s per provider, rimosso HuggingFace (`api-inference.huggingface.co` non risolve più via `curl`), gate `TOGETHER_ENABLED` esplicito, pin `NODE_VERSION=20`. Non verificabile in Browser pane (secret server-side reali) — verificato con `node --check` + test manuale di `clampDim()`. `immaginai_sicurezza.md`/`immaginai_stato.md` aggiornati, REGISTRA a metà sessione su richiesta di Fabio per chiudere la Sessione A prima di aprire la B |
| S21 | `RECEPISCI` di 14 travasi (`U-039`→`U-052`, 3 non pertinenti con nota), audit pre-scrittura Opus 5 ha corretto 4 errori. Fix immediati: NaN su `ig_cooldown`/`ig_timeout`, percorso stale in `settings.local.json`. Su richiesta di Fabio, audit completo del progetto (2 sotto-agenti Opus 5, frontend+backend): applicati i 4 fix a priorità più alta (cooldown unificato+16s, `DEFAULT_FAQ_DATA` riallineato, `applyUiSettings` implementata — mancava, rompeva il resize —, `generate.js` num_steps→steps+logging, poi riportato a steps:4 su richiesta). Tutto verificato in Browser pane. Resto del backlog riorganizzato in 5 sessioni per argomento/priorità in `immaginai_stato.md` |
| S20 | Fix riferimento rotto `wonderspit_brand_kit.md`→`.html` in CLAUDE.md, trovato durante un controllo di coerenza tra i 4 progetti condotto da 1WS. Nessuna modifica all'app, nessuna nuova regola — solo fix riferimento. |
| S18 | `RECEPISCI` di 5 travasi in sospeso (`U-034`→`U-038`): badge/palette limitata, Glob+`.gitignore`, WebFetch→Browser pane, ordine PATCH/audit di chiusura in REGISTRA. `U-038` già presente da S17, marcato recepito |
| S17 | Prima riconciliazione col template APP: `CLAUDE.md` allineato (6 blocchi aggiunti/modificati, sezione "Allineamento al template" creata, baseline 27/08/2026). Audit indipendente ha trovato 2 errori reali + 4 refusi, tutti corretti. 1 PATCH depositata in `_inbox` di Template Claude. Resta aperto: 4WS non ancora nella tabella "Il perimetro" del registro travasi (da fare su Template Claude) |
| S16 | Cascata: Pollinations promosso a primario, Together.ai valutato e scartato (deposito richiesto). Adottato processo REVISIONA/VERIFICA-SICUREZZA/PATCH da template esterno, creato `immaginai_sicurezza.md`. Test funzionale completo: Crea/Galleria/FAQ/mobile tutti OK, chiarito che `#genBtnMobile` nascosto è intenzionale |
| S15 | Fix UI footer allineamento (144px math), ctaB-btn uppercase+800, fix Pollinations API (solo ?model=flux), diagnostica CF 10k neuroni/giorno |
| S14 | Nuovo provider: Cloudflare Workers AI FLUX.1-schnell (gratis, 3-8s) |
| S13 | Fix GC generazione (_imgCache), fix "tab tagliata" (overflow-y:auto), footer grigio ripristinato |
| S12 | GitHub, auto-push, fix UI (spazi, DV tab, mobile footer), fix generazione parziale |
| S11 | Light theme CSS, separazione admin, CLAUDE.md aggiornato. App: 1855→1303 righe. |
| S10 | v2.7→v4.4: DV azzurri, SELECTED_TAGS, badge Attivi, stili, pill footer, Senza sfondo, FAQ |
| S1-S9 | Architettura base, fix generazione, brand, admin panel, layout, Spreadshop, mobile |

---

## Spreadshop — Codice Definitivo (S8 FINALE)

```html
<a id="ws-immaginai-btn2" href="https://wonderspit-ai.netlify.app/" target="_blank" style="position:fixed;top:70px;right:150px;z-index:999999;background:#ff00c8;color:#ffffff;text-decoration:none;font-family:Space Grotesk,Arial,sans-serif;font-size:13px;font-weight:700;padding:8px 14px;border-radius:20px;box-shadow:0 2px 12px rgba(255,0,200,0.4);letter-spacing:.5px;">🎨 Immagini AI ✨</a>
```
