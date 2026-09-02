# ImmaginAI — Stato del Progetto
> Aggiorna ogni sessione con REGISTRA. Se supera 150 righe, snellire prima.

---

## Stato Attuale

| Campo | Valore |
|-------|--------|
| Ultimo aggiornamento | 2 Settembre 2026 — S23 |
| Versione app | v4.4 |
| Stato | ✅ Pollinations primario (gratis, illimitato) — CF come backup qualità (steps:4), Together.ai disattivato via gate esplicito. Sessione C del backlog S21 chiusa in S23: escape XSS sanato in galleria+admin, tab API admin allineata alla cascata reale, campo Timeout rimosso, tema Dark rimosso dall'admin, header di sicurezza base in netlify.toml |
| Prossima task | Sessione D — Pulizia tecnica: dead code + CSS (bassa priorità) — vedi "Backlog per sessioni future" sotto |
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

### Sessione B — Flusso di generazione e UX visibile [media] — ✅ chiusa S22 (2 item non fatti, vedi sotto)
- [x] Scarica/CTA Designer: `upscaleCanvas` ora imposta `img.crossOrigin='anonymous'` e avvolge `toDataURL()` in try/catch — prima andava in **hang infinito** (mai resolve né reject) su qualunque immagine cross-origin senza CORS esplicito, bug reale confermato dal vivo in questa sessione, non solo ipotizzato. `downloadFrom` ora tenta l'upscale anche su URL Pollinations (verificato che Pollinations onora CORS su richiesta esplicita) e usa `window.open` con avviso esplicito come fallback se il fetch cross-origin fallisce, invece di un click su anchor che il browser ignora silenziosamente su URL cross-origin (S22)
- [x] URL Designer: verificato via `fetch` che sia `myspreadshop.it` sia `myspreadshop.net` rispondono 200 — **non un dominio morto**, solo un'inconsistenza col dominio documentato in `CLAUDE.md`. Allineato `goToDesigner()` a `.net` (S22)
- [x] Galleria: nuova funzione `saveGallery()` che, su `QuotaExceededError`, scarta le immagini più vecchie e riprova invece di fallire silenziosamente — ora mostra un avviso esplicito (`statusBar`) quando succede (S22)
- [x] Limite di 12 immagini reso esplicito: contatore galleria ("X / 12 immagini — le più vecchie vengono rimosse automaticamente") + FAQ aggiornata in **entrambi** `Immaginai.html` e `immaginai_admin.html` (S22)
- [x] `#statusBar` riattivato su decisione esplicita di Fabio: rimossa la regola `display:none!important` in `immaginai_light.css` che lo teneva sempre nascosto indipendentemente dalla classe `.show` — verificato dal vivo che compare correttamente senza rompere il layout (S22)
- [x] Ciclo Modifica chiuso: sia `discardModifica` che `keepModifica` ora puliscono `#modificaInput` e `ST._pendingModifica` (S22)
- [x] `detectLayout()`: gating su `_lastIsMobile` (il branch mobile che richiama `switchTab()` — distruttivo per `output-active` — scatta solo al passaggio desktop→mobile, non su ogni resize) + debounce via `requestAnimationFrame`. Verificato dal vivo su viewport mobile: un resize di sola altezza (simula tastiera virtuale) non rimuove più `output-active` (prima lo rimuoveva sempre) (S22)
- [ ] Provider label (Pollinations vs Stable Horde) — **saltato su richiesta esplicita di Fabio**, resta in backlog come item facoltativo
- [x] Test funzionali (parziale): login admin + tab FAQ verificati dal vivo nel Browser pane (nessun errore console, FAQ coerente tra app/admin), flusso download verificato dal vivo con immagine Pollinations reale (548ms, nessun hang/errore). **Non verificato in questa sessione**: overlay compare (keep/discard) end-to-end, click reale su CTA "Usa nel Designer" (solo l'URL è stato verificato raggiungibile via fetch, non il click+apertura tab) — restano in backlog se serve coprirli

### Sessione C — Sicurezza minore e coerenza dati admin [media] — ✅ chiusa S23
- [x] `escapeHtml()` aggiunta e applicata a `it.prompt` in `renderGallery()` (`Immaginai.html`) — gap noto da S16, verificato dal vivo con payload `<img onerror>` renderizzato come testo, non eseguito
- [x] `escapeHtml()` aggiunta in `immaginai_admin.html` e applicata a tutti i punti `innerHTML`/attributi non escapati trovati (non solo `cat.icon`/`cat.label` come segnalato originariamente): tag visivi (`cat.icon`, `cat.label`, `t.icon`, `t.label`, `t.prompt`), FAQ (`cat.cat`, `item.q`, `item.a` — quest'ultimo dentro un `<textarea>`, dove un `</textarea>` non escapato avrebbe rotto il markup), stili AI (`s.emoji`, `s.label`, `s.id`), utenti (`u.username`), nav (`b.icon`, `b.label`). Verificato dal vivo: un `"><img onerror>` nel nome categoria non esegue nulla e l'attributo `value` resta integro
- [x] Admin → Tema: rimossa l'opzione Dark dal `<select>` (resta solo Light) — decisione di Fabio, coerente con `immaginai_light.css` che presuppone sempre il tema chiaro. Aggiunto self-heal: se `ig_theme` in localStorage contiene ancora `'dark'` da prima di questo fix, viene silenziosamente riportato a `'light'` al prossimo accesso admin invece di rompere la select
- [x] Tab API admin riscritta per riflettere la cascata reale (Pollinations primario client-side → CF via Netlify Function → Together.ai disattivato con nota sul gate `TOGETHER_ENABLED` → Stable Horde), sostituendo la vecchia scheda "Netlify Function + HuggingFace FLUX" (HF rimosso da S22, mai aggiornato qui)
- [x] Campo "Timeout (secondi)" rimosso dall'admin (mai consumato da nessun timeout reale) — decisione di Fabio dopo aver chiesto un consiglio: rimuovere costava meno che collegarlo a due timeout hardcoded (30s client, 8s `generate.js`) per una manopola che nessuno aveva mai chiesto di girare. `ig_timeout` lasciato nella lista di reset dell'admin per ripulire chiavi residue
- [x] `netlify.toml`: aggiunto blocco `[[headers]]` base (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`) su `/*`
- [x] Verificato dal vivo in Browser pane: nessun errore console su app e admin, login admin OK, tab Tema/API/Tag visivi ispezionate via JS, due prove di XSS (galleria + admin tag) confermano l'escaping efficace

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

## Task Completate S23

- [x] Sessione C del backlog S21 (Sicurezza minore e coerenza dati admin), Sonnet 5 impegno base — bug già diagnosticati con file preciso, nessuna escalation necessaria. Stato del codice riverificato prima di agire (come richiesto dal backlog): tutti gli item risultavano ancora presenti così come descritti
- [x] Due punti del backlog erano segnalati come "da decidere", non semplici bugfix — presentati a Fabio prima di scrivere codice: campo Timeout admin (rimosso, su consiglio richiesto esplicitamente) e tema Dark admin (rimosso, scelta diretta di Fabio)
- [x] Scope allargato oltre la segnalazione originale durante l'implementazione: il gap di escape non era limitato a `cat.icon`/`cat.label` come scritto nel backlog — verificato che lo stesso pattern (interpolazione diretta in `innerHTML`/`value` senza escape) ricorreva in stili AI, FAQ, utenti e nav dell'admin. Corretti tutti nello stesso giro, stessa causa e stesso file
- [x] Verifica dal vivo in Browser pane, non solo lettura: 2 prove di XSS reali (payload `<img src=x onerror=...>` in un prompt di galleria e in un nome di categoria admin) confermano che l'escaping impedisce l'esecuzione, non solo che il codice "sembra corretto"
- [x] `docs/immaginai_stato.md` aggiornato (Sessione C chiusa, prossima è Sessione D)

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
- [x] Sessione B del backlog S21 (Flusso di generazione e UX visibile), stesso impegno medio, subito dopo la A nella stessa sessione di lavoro:
  1. **Bug reale confermato dal vivo, non solo ipotizzato**: `upscaleCanvas()` andava in **hang infinito** (mai `resolve()` né `reject()`) su qualunque immagine cross-origin senza `crossOrigin` esplicito — `toDataURL()` lancia un `SecurityError` sincrono dentro l'`onload`, non avvolto in try/catch, che interrompe l'handler prima di chiamare `resolve()`. Riprodotto live in console sull'immagine Pollinations appena generata. Fix: `img.crossOrigin='anonymous'` prima di `img.src` + try/catch con fallback a `resolve(dataUrl)` originale
  2. Verificato dal vivo (fetch diretto in console) che **Pollinations onora CORS** se richiesto esplicitamente (`crossOrigin='anonymous'` → canvas non tainted, `toDataURL` riesce) — `downloadFrom()` ora tenta l'upscale anche sulle URL Pollinations (prima solo su `data:`), non solo su Stable Horde/proxy
  3. `downloadFrom()`: fallback su fetch fallito cambiato da un click su anchor (che il browser ignora silenziosamente per `download` cross-origin) a `window.open()` + avviso esplicito via `statusBar`
  4. `goToDesigner()`: verificato via `fetch` che **né `.it` né `.net` sono domini morti** (entrambi 200) — allineato a `.net` per coerenza col dominio documentato in `CLAUDE.md`, non perché l'altro fosse rotto
  5. Nuova `saveGallery()`: su `QuotaExceededError` scarta le immagini più vecchie e riprova invece di fallire silenziosamente (comportamento precedente), con avviso esplicito all'utente
  6. Limite 12 immagini reso esplicito nel contatore galleria e nella FAQ di **entrambi** `Immaginai.html`/`immaginai_admin.html` (drift admin/app già notato in S21 — tenuti sincronizzati stavolta)
  7. **`#statusBar` riattivato** (decisione di Fabio): rimossa la regola `display:none!important` in `immaginai_light.css`, verificato dal vivo che compare correttamente (screenshot) senza rompere il layout
  8. Ciclo Modifica chiuso: `discardModifica`/`keepModifica` ora puliscono `#modificaInput` e `ST._pendingModifica`
  9. `detectLayout()`: gating su `_lastIsMobile` (il ramo mobile che richiama `switchTab()`, distruttivo per `output-active`, scatta solo al passaggio desktop↔mobile) + debounce `requestAnimationFrame`. **Verificato dal vivo** su viewport mobile emulata: un resize di sola altezza (`window.dispatchEvent(new Event('resize'))` a larghezza invariata, simula tastiera virtuale) non rimuove più `output-active` — prima lo rimuoveva sempre
  10. Provider label — **saltato su richiesta esplicita di Fabio** (chiesto prima di implementare, non assunto)
- [x] Verifica dal vivo in Browser pane (non solo `node --check`): generata un'immagine Pollinations reale, testato `downloadFrom()` sull'URL reale (548ms, nessun hang, nessun nuovo errore console), login admin + tab FAQ (nessun errore, testo FAQ coerente tra app e admin), screenshot statusBar attivo, test resize/gating su viewport mobile. **Non verificato in questa sessione**: overlay compare (keep/discard) end-to-end, click reale su CTA Designer (solo l'URL verificato raggiungibile) — annotato in backlog, non nascosto
- [x] `immaginai_stato.md` aggiornato (backlog Sessione B chiuso con 1 item lasciato per scelta di Fabio, non per omissione)
- [x] **PATCH + audit indipendente su tutta la sessione (A+B+patch) prima di chiudere**, su richiesta di Fabio: individuato un pattern-trappola JS candidato a PATCH (Promise che resta pending per sempre se un callback DOM lancia senza try/catch — scoperto col bug reale di `upscaleCanvas` in Sessione B), poi lanciato un solo audit Opus 5 (sotto-agente `Explore`, sola lettura enforced dal tool — non solo per istruzione) su: `generate.js`+`netlify.toml` (Sessione A), `Immaginai.html`+`immaginai_admin.html`+`immaginai_light.css` (Sessione B), e il testo della patch proposta, tutti insieme prima di scrivere/applicare qualunque cosa
- [x] **Trovati e fixati problemi reali dall'audit** (nessun falso positivo accettato senza verifica):
  1. 🔴 **`saveGallery()` — il più grave**: il ciclo non distingueva il tipo di errore e lavorava direttamente su `ST.gallery` — un errore *non* di quota (localStorage disabilitato/bloccato) svuotava comunque la galleria in RAM elemento per elemento fino a `[]`, e il caso "una sola immagine troppo grande per la quota" finiva con `ST.gallery` vuoto e **nessun avviso** (il messaggio stava solo nel ramo di successo). Riscritta: lavora su una copia, sposta lo stato reale solo a salvataggio riuscito, scarta solo su errori di quota riconosciuti (`QuotaExceededError`/`NS_ERROR_DOM_QUOTA_REACHED`/code 22/1014), e avvisa sempre — anche quando non riesce a salvare nulla. **Verificato dal vivo** con 3 scenari simulati (monkey-patch di `Storage.prototype.setItem`): errore non di quota → galleria intatta; quota con più immagini → scarta le vecchie e avvisa; quota con 1 sola immagine → non svuota, avvisa "impossibile salvare"
  2. **`detectLayout()` asimmetrico**: il fix di Sessione B aveva messo la guardia anti-resize-spurio solo sul ramo mobile — il ramo desktop, incondizionato, rimetteva sempre in vista `#controls`/`#preview-col` ad ogni resize anche con Galleria/FAQ attive. Riscritto in modo simmetrico: `detectLayout()` ora esce subito se `isMobile()` non è cambiato rispetto all'ultima volta, altrimenti richiama `switchTab()` sulla tab attiva (che già gestisce correttamente `controls`/`preview-col`/`screen-*` per lo stato mobile/desktop corrente) — più semplice del codice precedente, non solo più corretto. **Verificato dal vivo**: Galleria attiva su desktop + resize → resta attiva (prima sarebbe riapparso il pannello Crea accanto)
  3. **`downloadFrom()` — doppia richiesta di rete su Pollinations + estensione file sbagliata**: la chiamata incondizionata a `upscaleCanvas` con `img.crossOrigin='anonymous'` triggerava una SECONDA richiesta a Pollinations (servizio generativo, non statico — rischio di rigenerazione lenta) oltre al fetch per il download, e il nome file era sempre `.png` anche quando l'upscale falliva e restava un WebP/JPEG originale. Riscritto: un solo `fetch()`, riusato sia per il download che per l'upscale via un `blob:` URL locale (sempre "same-origin" per il canvas, niente più bisogno del trucco CORS su richieste esterne), estensione dedotta dal tipo MIME reale del blob. **Verificato dal vivo**: 557ms, un solo fetch, upscale riuscito, estensione `.png` corretta quando l'upscale va a buon fine
  4. **Messaggi di stato che si cancellavano a vicenda**: `setStatus(...);setTimeout(()=>setStatus(''),N)` sparsi in più punti potevano cancellare un messaggio più recente impostato nel frattempo (es. l'avviso di quota della nuova `saveGallery()` cancellato in anticipo dal timer del precedente "✓ Immagine generata!"). Nuova `flashStatus()` con token di validità — un timer vecchio cancella solo se è ancora l'ultimo messaggio mostrato
  5. **`#statusBar` invisibile su mobile proprio quando serve**: sta dentro `#controls-scroll`, che durante una generazione finisce sotto l'overlay `#preview-col.output-active` (`position:fixed`, z-index 40) — cioè esattamente quando un avviso di quota/download è più probabile. Aggiunta regola CSS mobile-only che porta `#statusBar.show` fuori flusso con z-index più alto. **Verificato dal vivo** con screenshot
  6. **Minori**: pin `AWS_LAMBDA_JS_RUNTIME="nodejs20.x"` in `netlify.toml` (il solo `NODE_VERSION` governa la build, non il runtime delle Functions — ipotesi di lavoro dichiarata come tale, non confermata sulla documentazione Netlify), cascata provider in `CLAUDE.md` disallineata (citava ancora HuggingFace, non menzionava il gate `TOGETHER_ENABLED`) corretta, `delItem()` allineato con un avviso di fallimento invece di un `catch(e){}` muto
- [x] **Falso positivo evitato**: l'audit segnalava che l'hang di `upscaleCanvas` fosse "un bug pre-esistente in produzione" nel testo della patch proposta — verificato sul commit prima di S22 (`c39414b`) che `upscaleCanvas` veniva chiamata **solo** sui `data:` URL (che non taintano mai un canvas): l'hang era raggiungibile solo dopo aver reso incondizionata quella chiamata **nella stessa sessione S22**. Corretta l'attribuzione nel testo della patch prima di scriverla in `CLAUDE.md`, invece di lasciare una ricostruzione sbagliata nella memoria permanente del progetto
- [x] Patch scritta in `CLAUDE.md` → "Regole JavaScript / Web — pattern-trappola": nuova voce "Promise + callback (DOM, timer, reader)", con le 3 correzioni dell'audit (attribuzione accurata, chiarito che `crossOrigin` da solo non basta e forza una richiesta separata, generalizzata oltre i callback DOM e collegata esplicitamente al principio già esistente "un'attesa senza limite non fallisce, si pianta")
- [x] Tutti i fix ri-verificati con `node --check` (sintassi) e dal vivo in Browser pane (nessuna verifica solo "a lettura")
- [x] Su richiesta esplicita di Fabio, in coda alla sessione (dopo la chiusura formale di cui sopra): depositata in `patch/_inbox` di Template Claude la patch "Promise + callback (DOM, timer, reader)" — `2026-09-02_immaginai_promise-callback-hang.md`
- [x] **Gap di processo segnalato da Fabio** (osservato proprio in questa sessione, non ipotetico): dopo l'audit A+B+patch, tutti i fix sono stati applicati in un solo blocco senza fermarsi a comunicare un piano/priorità né a rivalutare se modello/impegno fossero ancora adeguati coi findings reali in mano. Proposto un nuovo paragrafo per `CLAUDE.md` → "Gestione modello": **Punto di controllo dopo un audit o un'esplorazione** — rileggere i criteri di escalation (modello *e* impegno) coi findings in mano, poi presentare sempre findings+gravità+piano prima di scrivere codice (attesa della conferma solo se un finding esce dal fast-path o è una decisione architetturale)
- [x] Audit indipendente Opus 5 (`Explore`, sola lettura) sulla proposta **prima** di scriverla (tocca una sezione condivisa): trovati problemi reali — ambiguità "modello" vs "modello e impegno" (la proposta iniziale nominava solo il modello, escludendo proprio la leva sotto-usata nel caso che l'ha generata), contraddizione interna fra "fast-path per fix isolati" e "mai saltare da audit a codice scritto" sul caso di un singolo finding minore, trigger troppo stretto (escludeva un audit ereditato da una sessione precedente), caso limite non coperto (l'audit di chiusura in REGISTRA), e un rimando (`vedi "Fast-path vs approvazione"`) che si sarebbe rotto depositandolo nel template (quella sezione non esiste lì). Le due proposte originali (erano due paragrafi separati) unificate in uno solo su suggerimento dell'audit — più difficile da eseguire a metà
- [x] Patch corretta scritta in `CLAUDE.md` → "Gestione modello", subito dopo "Controllo all'apertura della sessione"; aggiunto un rimando dall'invariante già esistente sui sotto-agenti (riga 216, "scrive il chiamante solo dopo la conferma di Fabio") verso il nuovo paragrafo, per non lasciare due formulazioni della stessa regola che potrebbero divergere nel tempo
- [x] **AMBITO: da portare nel template**, confermato da Fabio — depositata versione generalizzata (rimando a "Fast-path vs approvazione" reso generico, non specifico di ImmaginAI) in `patch/_inbox` di Template Claude — `2026-09-02_immaginai_checkpoint-post-audit.md`

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
| S23 | Sonnet 5 impegno base, Sessione C del backlog S21 (Sicurezza minore e coerenza dati admin). Escape XSS su `it.prompt` (galleria) e su tutti i punti scoperti nell'admin (tag visivi, FAQ, stili, utenti, nav) — scope allargato oltre la segnalazione originale dopo aver trovato lo stesso pattern altrove. Tema Dark rimosso dall'admin (con self-heal per chi aveva già `ig_theme='dark'` salvato), campo Timeout rimosso, tab API riallineata alla cascata reale, header di sicurezza base in `netlify.toml`. Verificato dal vivo con 2 prove di XSS reali, nessuna eseguita |
| S22 | Sonnet 5 impegno medio, Sessioni A+B del backlog S21 (REGISTRA a metà per chiuderle separatamente), poi audit indipendente Opus 5 + PATCH su tutto insieme prima della chiusura finale. **A**: validazione input `generate.js`, timeout 8s, HuggingFace rimosso (dominio morto), gate `TOGETHER_ENABLED`, pin Node. **B**: hang infinito in `upscaleCanvas` fixato, download più affidabile, `saveGallery()` con gestione quota, limite 12 immagini esplicito, `#statusBar` riattivato, ciclo Modifica chiuso, resize mobile senza rompere l'output. **Audit A+B+patch** (1 sotto-agente Opus 5, sola lettura enforced): trovato 🔴 un bug serio in `saveGallery()` (poteva svuotare la galleria in RAM su errori non di quota, o restare silenziosa se una sola immagine superava la quota) + `detectLayout()` asimmetrico (guardia solo sul ramo mobile, il desktop rompeva Galleria/FAQ su resize) + doppia richiesta di rete nel download + messaggi di stato che si cancellavano a vicenda + statusBar invisibile su mobile dietro l'overlay + 2 fix minori. Tutti fixati e riverificati dal vivo (incluso simulare 3 scenari di errore su `saveGallery` con monkey-patch di `localStorage`). Corretta anche un'attribuzione imprecisa nel testo della patch (l'hang non era un bug pre-esistente, ma raggiungibile solo dopo la modifica fatta nella stessa sessione) prima di scriverla in CLAUDE.md → Regole JavaScript/Web. **Addendum dopo la chiusura formale**: depositata la patch sopra nel template; Fabio ha segnalato un gap di processo osservato nella sessione stessa (fix applicati in blocco senza comunicare piano/priorità né rivalutare modello/impegno coi findings reali in mano) — proposto, fatto auditare (Opus 5, trovate 5 imprecisioni reali fra cui una contraddizione interna e un rimando che si sarebbe rotto nel template), corretto e scritto un nuovo paragrafo "Punto di controllo dopo un audit o un'esplorazione" in CLAUDE.md → Gestione modello, poi depositato anche questo nel template |
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
