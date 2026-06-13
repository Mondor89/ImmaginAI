# ImmaginAI — Stato del Progetto
> Aggiorna ogni sessione con REGISTRA. Se supera 150 righe, snellire prima.

---

## Stato Attuale

| Campo | Valore |
|-------|--------|
| Ultimo aggiornamento | Giugno 2026 — S13 (fine) |
| Versione app | v4.4 |
| Stato | 🟡 Generazione: fix GC applicato, da confermare con test reale |
| Admin | ✅ Long press 3s logo → apre `immaginai_admin.html` in nuova scheda |
| Netlify | ✅ https://wonderspit-ai.netlify.app/ |
| GitHub | ✅ Repo attivo — https://github.com/Mondor89/ImmaginAI — auto-push ad ogni modifica |

---

## Focus S14 — DA FARE

### Alta priorità
- [ ] **Confermare fix generazione** — testare con DevTools Network aperti, verificare che le immagini arrivino (fix GC _imgCache applicato in S13)
- [ ] Test funzionale completo `Immaginai.html` (genera, galleria, FAQ, mobile)
- [ ] Test funzionale `immaginai_admin.html` (tutte le sezioni)

### Media priorità
- [ ] Test flusso completo: prompt → DV → stile → genera → modifica → CTA
- [ ] Testare flusso completo social → ImmaginAI → Spreadshop

### Backlog
- [ ] (post P.IVA) Immagini di riferimento con analisi Claude API
- [ ] Login Google Firebase (storico cloud)
- [ ] Bilingue IT/EN
- [ ] Mockup prodotto in anteprima
- [ ] Upscaler immagine
- [ ] Rimuovi sfondo vero (Remove.bg o REMBG)

---

## Task Completate S13

- [x] Fix GC generazione: aggiunto `_imgCache = new Set()` in `Immaginai.html` — impedisce il garbage collection di `new Image()` durante la Promise (causa del fallimento con "operazione annullata" 0 bytes ~150ms)
- [x] Fix "tab tagliata" desktop: `overflow: hidden` → `overflow-y: auto` su `#controls-scroll` — le sezioni non vengono più tagliate a viewport piccole
- [x] Footer grigio (`#d8dce6`) confermato come design intenzionale, ripristinato dopo tentativo errato di rimozione colore

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

- API: Pollinations AI gratuito, cooldown 16s, retry 4 modelli
- MODELS: `['', 'turbo', 'flux-realism', 'flux-anime']` — vuoto = no model param = default flux
- Storage: localStorage condiviso (galleria max 50, settings, FAQ, categorie DV, stili)
- Admin session: `ig_admin_session` in localStorage
- Caricamento immagini: `new Image()` + onload/onerror — **MAI fetch()**
- GC fix: `_imgCache = new Set()` mantiene riferimento ai Image() pendenti — **NON rimuovere**

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
| 10 | model=flux causava 402 | Parametro model esplicito = paid — usare stringa vuota |
| 11 | Generazione "operazione annullata" 0 bytes | new Image() GC'd in Promise — aggiunto _imgCache Set |
| 12 | Tab tagliata desktop | overflow:hidden + space-evenly taglia sezioni a viewport basse — usare overflow-y:auto |

---

## Log Sessioni

| Sessione | Attività |
|----------|----------|
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
