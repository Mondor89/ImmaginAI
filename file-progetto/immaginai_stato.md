# ImmaginAI — Stato del Progetto
> Aggiorna ogni sessione con REGISTRA. Se supera 150 righe, snellire prima.

---

## Stato Attuale

| Campo | Valore |
|-------|--------|
| Ultimo aggiornamento | Giugno 2026 — S12 (inizio) |
| Versione app | v4.4 |
| Stato | 🟡 Separazione admin completata — da testare e caricare su GitHub |
| Admin | ✅ Long press 3s logo → apre `immaginai_admin.html` in nuova scheda |
| Netlify | ✅ https://wonderspit-ai.netlify.app/ |
| GitHub | ❌ Repo non ancora inizializzato — da creare |

---

## Focus S12 — In Corso

1. Aggiungere `<link rel="stylesheet" href="immaginai_light.css">` in entrambi gli HTML ← PRIMA COSA
2. Testare `Immaginai.html` — verifica che app funzioni senza admin
3. Testare `immaginai_admin.html` — login, tutte le sezioni, salvataggio localStorage
4. Verificare che le modifiche admin si riflettano nell'app al reload
5. Creare repo GitHub + push
6. Deploy Netlify aggiornato

---

## Task Aperte

### Alta priorità
- [ ] Aggiungere `<link rel="stylesheet" href="immaginai_light.css">` in entrambi gli HTML
- [ ] Test funzionale completo `Immaginai.html` (genera, galleria, FAQ, mobile)
- [ ] Test funzionale `immaginai_admin.html` (tutte le sezioni)
- [ ] Creare repo GitHub + `git init` + remote + push

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
- [ ] Rimuovi sfondo vero (Remove.bg o REMBG) se workaround AI non soddisfa

---

## Task Completate S11

- [x] Analisi stile grafico 3WS Product Designer
- [x] Creato `immaginai_light.css` — override CSS completo (Inter, navy, teal)
- [x] CLAUDE.md aggiornato — workflow diretto, REGISTRA scrive file
- [x] **Separazione admin** — `immaginai_admin.html` creato (stile Designer Admin)
- [x] `Immaginai.html` alleggerito: rimosso overlay admin + CSS admin + JS admin (552 righe)
- [x] Long press logo → apre `immaginai_admin.html` in nuova scheda
- [x] Admin mantiene localStorage condiviso con app — zero coupling

---

## Decisioni Prese

| Data | Decisione | Motivazione |
|------|-----------|-------------|
| Giu 2026 | Dark theme eliminato | Allineamento al Product Designer |
| Giu 2026 | Inter sostituisce Space Grotesk | Stesso font del Designer |
| Giu 2026 | Navy #1a237e come primario | Stesso colore Designer Admin |
| Giu 2026 | CSS separato immaginai_light.css | Non tocca l'HTML |
| Giu 2026 | Admin separato in immaginai_admin.html | Come il Product Designer — architettura più pulita |
| Giu 2026 | Long press → nuova scheda | Identico al Designer (long press → admin.html) |
| Giu 2026 | Comunicazione via localStorage | Nessun coupling tra i due file |
| Giu 2026 | Claude applica modifiche direttamente | Workflow copiato dal Product Designer |

---

## Architettura Tecnica

```
/file-progetto/
├── Immaginai.html          ← App principale v4.4 (~1303 righe)
├── immaginai_admin.html    ← Admin panel separato (stile Designer Admin)
├── immaginai_light.css     ← Override light theme (da linkare in entrambi)
└── immaginai_stato.md      ← Questo file
```

- API: Pollinations AI gratuito, cooldown 16s, retry 4 modelli (flux→turbo→flux-realism→flux-anime)
- Storage: localStorage condiviso (galleria max 50, settings, FAQ, categorie DV, stili)
- Admin session: `ig_admin_session` in localStorage (login persistente)
- Caricamento immagini: `new Image()` + onload/onerror — mai fetch()

---

## Spreadshop — Codice Definitivo (S8 FINALE)

### HTML Footer
```
<a id="ws-immaginai-btn2" href="https://wonderspit-ai.netlify.app/" target="_blank" style="position:fixed;top:70px;right:150px;z-index:999999;background:#ff00c8;color:#ffffff;text-decoration:none;font-family:Space Grotesk,Arial,sans-serif;font-size:13px;font-weight:700;padding:8px 14px;border-radius:20px;box-shadow:0 2px 12px rgba(255,0,200,0.4);letter-spacing:.5px;">🎨 Immagini AI ✨</a>
```

---

## Errori Storici — Non Ripetere

| # | Errore | Causa |
|---|--------|-------|
| 1 | Immagine non carica | fetch() bloccato da CORS — usare new Image() |
| 2 | Cooldown ignorato | Timer non resettato — ST.lastGenTime=Date.now() dopo ogni gen |
| 3 | Admin non si apre | Long press non registrato su mobile — usare touchstart |
| 4 | Modifica non recepita | enhance:true riscrive prompt — usare enhance:false in generateModifica |
| 5 | Negative prompt ignorato | Pollinations ignora parametro ?negative — incorporare nel testo |
| 6 | Accordion tagliato | overflow:hidden nel parent — spostato nel controls-footer |
| 7 | JS script Spreadshop bloccato | Non usare script nel footer/header Spreadshop |
| 8 | Contorno bianco stampa | sticker style nel prompt trasparenza — rimosso |

---

## Log Sessioni

| Sessione | Attività |
|----------|----------|
| S12 | Inizio sessione — CSS link da applicare, test, GitHub |
| S11 | Light theme CSS, separazione admin, CLAUDE.md aggiornato. App: 1855→1303 righe. |
| S10 | v2.7→v4.4: DV azzurri, SELECTED_TAGS, badge Attivi, stili, pill footer, Senza sfondo, FAQ |
| S9 | v2.6: fix mobile output, FAQ tab |
| S8 | Fix mobile. Bottone Spreadshop. CSS finale |
| S7 | Test CSS Spreadshop. URL Netlify: https://wonderspit-ai.netlify.app/ |
| S6 | v2.3: UI light, viola principale, Space Grotesk, logo PNG |
| S1-S5 | Architettura base, fix generazione, brand, admin panel, layout |
