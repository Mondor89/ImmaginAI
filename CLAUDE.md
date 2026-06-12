# ImmaginAI — Modulo 3

Generatore immagini AI gratuito. Tool di valore aggiunto per il brand WonderSpit.
Modulo 3 dell'ecosistema WonderSpit.

## Regole
- Rispondi SEMPRE in italiano
- Modalità caveman attiva (risposte brevi, niente fronzoli)
- Spiega sempre in modo semplice — Fabio non ha esperienza di programmazione
- NON ripartire da zero — continua dal punto esatto in cui ci si era fermati
- Fai domande di chiarimento PRIMA di rispondere in dettaglio
- Applica le modifiche ai file direttamente con i tool — non aspettare conferma manuale

## Regole ferree sviluppo (non derogare MAI)
- SOLO file .html — mai .jsx React Vue o framework con compilazione
- Nome file FISSO: immaginai.html
- Cooldown 16s OBBLIGATORIO tra generazioni (rate limit Pollinations)
- Caricamento immagini con new Image() + onload/onerror — MAI fetch()
- Breakpoint: mobile <768px · tablet 768-1099px · desktop ≥1100px

## Stack
HTML + CSS + JS vanilla · singolo file · Pollinations AI gratuita · Netlify (hosting)
Modelli in cascata: flux → turbo → flux-realism → flux-anime

## URL reali
- Spreadshop: https://wonderspit.myspreadshop.net
- Designer Spreadshop: https://wonderspit.myspreadshop.net/create
- ImmaginAI Netlify: https://wonderspit-ai.netlify.app/
- GitHub: https://github.com/Mondor89/ImmaginAI

## CTA Spreadshop — variante attiva
```javascript
const CTA_VARIANT = 'B'; // A=semplice · B=card elaborata · C=banner fisso
```
File CSS Spreadshop pronto: wonderspit_spreadshop.css (manca URL Netlify reale)

## File di riferimento
- @docs/immaginai_stato.md → stato, task, log, note tecniche
- @app/Immaginai.html → ultima versione funzionante
- @app/immaginai_light.css → override CSS light theme
- @app/immaginai_admin.html → pannello admin separato
- @spreadshop/wonderspit_spreadshop.css → CSS pronto per pannello Spreadshop
- @../_Condivisi/WonderSpit_Ecosistema_Visione.html → visione 3 moduli
- @../_Condivisi/wonderspit_brand_kit.md → colori e font

## Comandi rapidi
**RIEPILOGO** → leggi immaginai_stato.md, 6 righe max, poi chiedi "Da dove vuoi iniziare?"
**REGISTRA** → leggi immaginai_stato.md, aggiornalo con le attività della sessione corrente e scrivi il file direttamente
