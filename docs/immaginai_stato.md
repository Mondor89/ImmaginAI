# ImmaginAI — Stato del Progetto
> Aggiorna ogni sessione con REGISTRA. Se supera 150 righe, snellire prima.

---

## Stato Attuale

| Campo | Valore |
|-------|--------|
| Ultimo aggiornamento | Giugno 2026 — S12 (fine) |
| Versione app | v4.4 |
| Stato | 🔴 Generazione immagini rotta — tutti i modelli Pollinations falliscono con onerror |
| Admin | ✅ Long press 3s logo → apre `immaginai_admin.html` in nuova scheda |
| Netlify | ✅ https://wonderspit-ai.netlify.app/ |
| GitHub | ✅ Repo attivo — https://github.com/Mondor89/ImmaginAI — auto-push ad ogni modifica |

---

## Focus S13 — DA FARE

**Problema critico**: generazione immagini non funziona. Tutti i modelli Pollinations restituiscono `onerror` su `new Image()`. L'app mostra "Servizio non disponibile" dopo aver provato tutti i modelli.

### Cosa è già stato provato in S12 (senza successo):
1. Rimosso double-retry che scartava i risultati buoni
2. Ridotto wait tra modelli: 10s → 3s, timeout: 80s → 45s
3. Rimosso parametri vietati: `enhance`, `nologo`, `safe` (causavano 402)
4. Rimosso `?negative=` da generateModifica e regenImage
5. MODELS: primo tentativo senza parametro `model` (API default flux)

### URL attuale (primo tentativo):
`https://image.pollinations.ai/prompt/{prompt}?width=512&height=512&seed=42`

### Ipotesi da verificare in S13:
- **Testare URL direttamente nel browser** → capire se ritorna immagine o errore HTTP
- **Aprire DevTools → Network** mentre si genera → vedere il codice HTTP (402? 429? 503?)
- Pollinations potrebbe aver cambiato API: verificare docs aggiornate
- Rate limiting IP da troppi test → provare dopo attesa lunga (30+ min)
- Problema specifico di Netlify (CSP header? redirect HTTPS?)

---

## Task Aperte

### Alta priorità
- [ ] **Fix generazione immagini** — debug con DevTools Network tab (S13 dedicata)
- [ ] Test funzionale completo `Immaginai.html` (genera, galleria, FAQ, mobile)
- [ ] Test funzionale `immaginai_admin.html` (tutte le sezioni)

### Media priorità
- [ ] Verifica layout no-scroll su diverse risoluzioni desktop
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

## Task Completate S12

- [x] GitHub repo connesso e auto-push attivo (ogni modifica → push immediato)
- [x] UI desktop: spaziatura equalizzata tra sezioni (justify-content: space-between)
- [x] DV tab: stile viola visibile di default (non solo su hover)
- [x] Fix critico generazione: rimosso double-retry che scartava risultati ok
- [x] MODELS: `['','turbo','flux-realism','flux-anime']` — primo tentativo senza model param
- [x] Mobile footer: più compatto (padding ridotto, bottoni più piccoli)

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

---

## Log Sessioni

| Sessione | Attività |
|----------|----------|
| S13 | DA FARE: debug generazione con DevTools Network |
| S12 | GitHub, auto-push, fix UI (spazi, DV tab, mobile footer), fix generazione parziale — ancora rotta |
| S11 | Light theme CSS, separazione admin, CLAUDE.md aggiornato. App: 1855→1303 righe. |
| S10 | v2.7→v4.4: DV azzurri, SELECTED_TAGS, badge Attivi, stili, pill footer, Senza sfondo, FAQ |
| S9 | v2.6: fix mobile output, FAQ tab |
| S8 | Fix mobile. Bottone Spreadshop. CSS finale |
| S7 | Test CSS Spreadshop. URL Netlify: https://wonderspit-ai.netlify.app/ |
| S6 | v2.3: UI light, viola principale, Space Grotesk, logo PNG |
| S1-S5 | Architettura base, fix generazione, brand, admin panel, layout |

---

## Spreadshop — Codice Definitivo (S8 FINALE)

```html
<a id="ws-immaginai-btn2" href="https://wonderspit-ai.netlify.app/" target="_blank" style="position:fixed;top:70px;right:150px;z-index:999999;background:#ff00c8;color:#ffffff;text-decoration:none;font-family:Space Grotesk,Arial,sans-serif;font-size:13px;font-weight:700;padding:8px 14px;border-radius:20px;box-shadow:0 2px 12px rgba(255,0,200,0.4);letter-spacing:.5px;">🎨 Immagini AI ✨</a>
```
