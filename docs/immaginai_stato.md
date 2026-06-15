# ImmaginAI — Stato del Progetto
> Aggiorna ogni sessione con REGISTRA. Se supera 150 righe, snellire prima.

---

## Stato Attuale

| Campo | Valore |
|-------|--------|
| Ultimo aggiornamento | Giugno 2026 — S15 (fine) |
| Versione app | v4.4 |
| Stato | ⚠️ CF esaurito (10k neuroni/giorno ≈ 20 img) — fallback Pollinations attivo |
| Prossima task | Configurare Together.ai (FLUX gratis, illimitato) come provider principale |
| Admin | ✅ Long press 3s logo → apre `immaginai_admin.html` in nuova scheda |
| Netlify | ✅ https://wonderspit-ai.netlify.app/ |
| GitHub | ✅ Repo attivo — https://github.com/Mondor89/ImmaginAI |

---

## Focus S16 — DA FARE

### Alta priorità
- [ ] **Together.ai**: creare account, ottenere API key, aggiungere `TOGETHER_KEY` in Netlify env vars → trigger deploy
- [ ] Test generazione con Together.ai (FLUX.1-schnell-Free, gratis illimitato, 2-5s)

### Media priorità
- [ ] Test funzionale completo `Immaginai.html` (genera, galleria, FAQ, mobile)
- [ ] Test funzionale `immaginai_admin.html`
- [ ] Test flusso completo: prompt → DV → stile → genera → modifica → CTA

### Backlog
- [ ] (post P.IVA) Immagini di riferimento con analisi Claude API
- [ ] Login Google Firebase (storico cloud)
- [ ] Bilingue IT/EN
- [ ] Mockup prodotto in anteprima
- [ ] Upscaler immagine
- [ ] Rimuovi sfondo vero (Remove.bg o REMBG)

---

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

---

## Architettura Tecnica

```
app/
├── Immaginai.html          ← App principale v4.4 (~1310 righe)
├── immaginai_admin.html    ← Admin panel separato
├── immaginai_light.css     ← Override light theme (linkato in entrambi)
docs/
└── immaginai_stato.md      ← Questo file
```

### Cascata generazione (generate.js)
1. **Cloudflare Workers AI** — FLUX.1-schnell, 10k neuroni/giorno ≈ 20 img, 3-8s
   - Env: `CF_ACCOUNT_ID` + `CF_API_TOKEN`
2. **Together.ai** — FLUX.1-schnell-Free, gratis illimitato, 2-5s ← **DA ATTIVARE**
   - Env: `TOGETHER_KEY`
3. **HuggingFace** — SD 2.1 fallback, qualità inferiore
   - Env: `HF_TOKEN`
- Fallback browser 1: **Pollinations AI** — `?model=flux` solo (no dimensioni, watermark)
- Fallback browser 2: **Stable Horde** — lento, coda

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

---

## Log Sessioni

| Sessione | Attività |
|----------|----------|
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
