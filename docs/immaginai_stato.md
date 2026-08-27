# ImmaginAI — Stato del Progetto
> Aggiorna ogni sessione con REGISTRA. Se supera 150 righe, snellire prima.

---

## Stato Attuale

| Campo | Valore |
|-------|--------|
| Ultimo aggiornamento | Agosto 2026 — S17 (fine) |
| Versione app | v4.4 |
| Stato | ✅ Pollinations primario (gratis, illimitato) — CF come backup qualità, Together.ai scartato. CLAUDE.md ora allineato al template APP |
| Prossima task | Test funzionale `immaginai_admin.html` + flusso Modifica/compare/CTA (non ancora coperti — rimandati da S16 a S17 a S18) |
| Admin | ✅ Long press 3s logo → apre `immaginai_admin.html` in nuova scheda |
| Netlify | ✅ https://wonderspit-ai.netlify.app/ |
| GitHub | ✅ Repo attivo — https://github.com/Mondor89/ImmaginAI |

---

## Focus S17 — DA FARE

### Alta priorità
- [ ] Test funzionale `immaginai_admin.html` (login, tab, salvataggio impostazioni)
- [ ] Test flusso Modifica (compare overlay, keep/discard) — non coperto in S16
- [ ] Test click CTA "Usa nel Designer" (download + apertura Spreadshop) — non coperto in S16 (richiede permesso download)

### Media priorità
- [ ] Sanare escape mancante su `it.prompt` in `renderGallery()` — vedi gap in `immaginai_sicurezza.md`
- [ ] Valutare provider gratuito realmente illimitato con qualità migliore di Pollinations (Together.ai scartato — richiede deposito)

### Backlog
- [ ] (post P.IVA) Immagini di riferimento con analisi Claude API
- [ ] Login Google Firebase (storico cloud)
- [ ] Bilingue IT/EN
- [ ] Mockup prodotto in anteprima
- [ ] Upscaler immagine
- [ ] Rimuovi sfondo vero (Remove.bg o REMBG)

---

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
2. **generate.js** (Netlify Function) — prova in ordine:
   a. **Cloudflare Workers AI** — FLUX.1-schnell, 10k neuroni/giorno ≈ 20 img, 3-8s (Env: `CF_ACCOUNT_ID`+`CF_API_TOKEN`)
   b. **Together.ai** — FLUX.1-schnell-Free — **scartato S16, richiede deposito**, non attivare (Env: `TOGETHER_KEY` pronta ma non impostata)
   c. **HuggingFace** — SD fallback, qualità inferiore (Env: `HF_TOKEN`)
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
