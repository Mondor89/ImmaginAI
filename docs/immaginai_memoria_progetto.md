# MEMORIA PROGETTO — ImmaginAI v2.6
> Allega in nuova chat con immaginai_stato.md e immaginai.html per riprendere subito.

---

## Identità

- **App:** ImmaginAI — generatore immagini AI gratuito, tool di valore per WonderSpit
- **Brand:** WonderSpit | **Utente:** Fabio (designer, no coding)
- **File:** HTML singolo — apri nel browser, niente Node/bundler
- **Hosting:** GitHub (index.html + 2 PNG logo) → Netlify auto-deploy
- **URL Netlify:** https://wonderspit-ai.netlify.app/
- **Admin:** Long press 3s su logo → WONDERSPIT / 369852147

---

## Stack tecnico

- **API immagini:** Pollinations AI (gratuito, no key) — cooldown 16s, retry flux→turbo→flux-realism→flux-anime
- **Caricamento:** `new Image()` onload/onerror — **mai fetch()**
- **Breakpoint:** mobile <768px / desktop ≥768px
- **Storage:** localStorage (galleria max 50, impostazioni admin, utenti)

---

## Brand Kit

```css
--c-violet: #5B35C8   /* principale — bordi attivi, nav, bottoni */
--c-accent: #5B35C8   /* stesso viola */
--c-accent2: #3D2F8F  /* viola scuro */
--bg dark:  #080810   --surface: #1A1A2E   --card: #141428
--bg light: #FFFFFF   --surface: #F5F5F7   --card: #EBEBF0
--font-title: 'Space Grotesk' (Bangers rimosso dall'UI)
--font-body:  'Space Grotesk'
```

**Light mode = default** (coerenza con Spreadshop WonderSpit)

---

## Architettura v2.6

```
<body>
├── #themeToggleFixed (position:fixed top-right, pill Light/Dark)
├── #mobile-header (position:fixed top, solo mobile, logo PNG senza .AI)
├── #adminOverlay (position:fixed z-index:1000)
├── #app (display:flex height:100svh)
│   ├── #sidebar (desktop 200px — logo esteso PNG, nav Crea/Galleria, footer vuoto)
│   ├── #controls (desktop 500px | mobile 100% scroll padding-bottom:160px)
│   │   ├── prompt-wrap (sfondo bianco) + #diceBtn (viola, solo emoji ruota)
│   │   ├── .pa-accordion (viola pieno, font 12px — Suggerimenti prompt)
│   │   ├── .style-grid (6 stili visibili)
│   │   ├── .ratio-row (4 formati)
│   │   ├── .accordion (viola pieno, font 12px — Opzioni avanzate)
│   │   └── #genBtn (viola, font 15px — bottone principale)
│   ├── #preview-col (desktop flex:1 | mobile: nascosto, diventa fixed con classe output-active)
│   │   ├── #previewPlaceholder
│   │   ├── #outputArea (immagine generata + azioni)
│   │   └── #ctaWrap (CTA "Mettila su un prodotto!" → /create Spreadshop)
│   └── #screen-gallery
├── #genBtnMobile (position:fixed bottom:76px, solo tab Crea)
├── #bottom-nav (position:fixed, tab bar 64px con divisore verticale)
└── #modal
```

---

## Funzionalità v2.6

**UI/UX**
- Light mode default, dark disponibile via pill toggle top-right
- Logo desktop: WonderSpit_Logo_esteso.png (h:44px) caricato da GitHub
- Logo mobile: WonderSpit_Logo.png (h:38px)
- Icona tab Crea: ✨ (sparkle — sostituisce ✦)
- Dado 🎲: bottone viola fisso, solo emoji ruota, genera sempre prompt completo
- Accordion Suggerimenti e Opzioni avanzate: viola pieno
- Zone scrittura: sfondo bianco
- Nav mobile: tab bar con divisore, sfondo viola leggero su tab attiva
- Info API nascoste all'utente — solo in admin
- **Mobile output:** dopo generazione #preview-col riceve classe `output-active` → position:fixed schermo intero. Rimossa quando si cambia tab.
- **CTA sotto immagine:** "Mettila su un prodotto!" → link a /create del designer Spreadshop

**Admin (tab):** Tema / Colori / Font / Logo&Nav / Stili AI / API / Utenti / Info

**Generazione:** Prompt assistant 8 cat 360°, dado, stili 6+6, 4 ratio, cooldown, retry, galleria

---

## Spreadshop — Integrazione CSS/HTML

**Scoperte chiave:**
- CSS aggiuntivo funziona ovunque incluso il designer /create
- HTML header viene rimosso dalla SPA del designer → usare FOOTER
- HTML footer sopravvive nel designer
- JavaScript custom bloccato da Spreadshop (alert, script, setInterval non eseguiti)
- Banner promozionale ha altezza variabile → top:70px fisso su desktop

**Bottone "Immagini - AI ✨" — codice finale:**

HTML Header:
```html
<a id="ws-immaginai-btn" href="https://wonderspit-ai.netlify.app/" target="_blank" style="display:none">
  Immagini - AI ✨
</a>
```

HTML Footer:
```html
<!-- Google tag (gtag.js) -->
<a id="ws-immaginai-btn2" href="https://wonderspit-ai.netlify.app/" target="_blank" style="position:fixed;top:8px;right:150px;z-index:999999;background:#ff00c8;color:#ffffff;text-decoration:none;font-family:Space Grotesk,Arial,sans-serif;font-weight:700;font-size:15px;letter-spacing:0.04em;border-radius:8px;padding:10px 14px;border:1.5px solid rgba(0,229,200,0.35);box-shadow:0 4px 18px rgba(255,0,200,0.45);">
  <span class="ws-full">Immagini - AI ✨</span><span class="ws-mini">AI ✨</span>
</a>
```

CSS: vedi wonderspit_spreadshop.css (top:70px desktop, top:8px right:90px mobile)

---

## In sviluppo — Prossimo step (S10)

1. **Caricare v2.6 su GitHub** e testare FAQ + fix mobile output
2. **Revisione UI Reference** → approvazione → implementazione tag
3. **Tag "Dettagli visivi"** — sostituisce Suggerimenti prompt, multipli, invisibili
4. **Opzioni avanzate** — valutare se solo in admin
5. **Rimuovi sfondo** — post-generazione immagine
6. *(post P.IVA)* Immagini di riferimento con analisi Claude API


## Regole d'oro — non violare mai

1. Solo **.html** singolo — niente React/Vue/bundler
2. **Cooldown 16s** minimo per Pollinations
3. **`new Image()`** per caricare immagini — mai fetch()
4. **PNG** per export template (JPEG non supporta trasparenza)
5. **node --check** dopo ogni modifica JS importante
6. File > 1000 righe: riscrivere intero invece di str_replace a cascata
7. **Mai JavaScript** nel footer/header Spreadshop — viene bloccato

---

## Come riprendere

1. Allega questo file
2. Allega `immaginai_stato.md`
3. Allega `immaginai.html` (v2.6)
4. Scrivi RIEPILOGO per stato rapido

**Prossima sessione S10:** revisione UI Reference → implementazione Tag + FAQ + Rimuovi sfondo
