# ImmaginAI — Modulo 3

Generatore immagini AI gratuito. Tool di valore aggiunto per il brand WonderSpit.
Modulo 3 dell'ecosistema WonderSpit.

## Identità del progetto

**Nome:** ImmaginAI
**Cosa fa:** Genera immagini AI gratuite per i clienti WonderSpit, da usare anche sui prodotti Spreadshop
**Target:** Pubblico (clienti finali WonderSpit)
**Stack tecnico:** HTML+CSS+JS vanilla, single-file (`app/Immaginai.html`) + Netlify Functions per il proxy API key
**Backend/hosting:** Netlify + Netlify Functions (`netlify/functions/generate.js`, `netlify/functions/modify.js`)
**API esterne usate:** Pollinations AI (gratis, no key) → Cloudflare Workers AI (CF_ACCOUNT_ID+CF_API_TOKEN, 10k neuroni/giorno) → Together.ai (TOGETHER_KEY + TOGETHER_ENABLED='true', non attivo — richiede deposito) → Stable Horde (ultimo fallback). HuggingFace rimosso in S22: dominio `api-inference.huggingface.co` dismesso. **S27**: Pollinations Kontext (editing immagine, a pagamento) per il bottone opzionale "Modifica precisa" — non fa parte della cascata sopra, gate POLLINATIONS_KEY + KONTEXT_ENABLED='true', non attivo finché Fabio non crea la chiave
**Repository:** https://github.com/Mondor89/ImmaginAI
**Deploy:** https://wonderspit-ai.netlify.app/

---

## Regole

- Rispondi SEMPRE in italiano
- Modalità caveman attiva per il TONO (risposte brevi, niente fronzoli) — non per saltare REVISIONA/VERIFICA-SICUREZZA quando servono: quegli output restano strutturati (✅/⚠/❌) ma già compatti di loro
- Spiega sempre in modo semplice — Fabio non ha esperienza di programmazione
- NON ripartire da zero — continua dal punto esatto in cui ci si era fermati
- Fai domande di chiarimento PRIMA di rispondere in dettaglio
- Vedi sotto "Fast-path vs approvazione" per quando applicare subito e quando aspettare conferma

## Regole ferree sviluppo (non derogare MAI)
- SOLO file .html — mai .jsx React Vue o framework con compilazione
- Nome file FISSO: `Immaginai.html`
- Cooldown 16s OBBLIGATORIO tra generazioni (rate limit provider gratuiti)
- Caricamento immagini con `new Image()` + onload/onerror — MAI `fetch()`
- Breakpoint: mobile <768px · tablet 768-1099px · desktop ≥1100px

## Stack
HTML + CSS + JS vanilla · singolo file · Pollinations AI gratuita come primaria · Netlify (hosting)
Cascata generazione: Pollinations → Cloudflare Workers AI → Together.ai (da attivare, gate TOGETHER_ENABLED) → Stable Horde

## URL reali
- Spreadshop: https://wonderspit.myspreadshop.net
- Designer Spreadshop: https://wonderspit.myspreadshop.net/create
- ImmaginAI Netlify: https://wonderspit-ai.netlify.app/
- GitHub: https://github.com/Mondor89/ImmaginAI

## CTA Spreadshop — variante attiva
```javascript
const CTA_VARIANT = 'B'; // A=semplice · B=card elaborata · C=banner fisso
```
File CSS Spreadshop pronto: `wonderspit_spreadshop.css` (manca URL Netlify reale)

## File di riferimento
- @docs/immaginai_stato.md → stato, task, log, note tecniche (fonte di verità per lo stato — non duplicare qui)
- @docs/immaginai_sicurezza.md → invarianti di sicurezza, superficie di attacco, gap noti
- @docs/immaginai_test_manuale.md → checklist di test manuali persistente per Fabio (per area funzionale, non per sessione) — aggiornarla quando cambia un comportamento visibile, non lasciarla decadere
- @docs/immaginai_resoconto_s16_s26.md → resoconto narrativo (S16→S26) di tutte le modifiche fatte da quando è nato il processo strutturato — documento una tantum, non va aggiornato ad ogni sessione come gli altri file di riferimento
- @app/Immaginai.html → ultima versione funzionante
- @app/immaginai_light.css → override CSS light theme
- @app/immaginai_admin.html → pannello admin separato
- @spreadshop/wonderspit_spreadshop.css → CSS pronto per pannello Spreadshop
- @../_Condivisi/WonderSpit_Ecosistema_Visione.html → visione 3 moduli
- @../_Condivisi/wonderspit_brand_kit.html → colori e font
- `docs/immaginai_memoria_progetto.md` → ⚠ **obsoleto** (v2.6, S10). Non è più fonte di verità, sostituito da `immaginai_stato.md`. Tenuto solo per storia architetturale, da valutare se archiviare.

---

## Come lavoriamo

- Si lavora **una funzionalità alla volta**: costruisci → testa → valida → avanti
- Fabio decide sempre la direzione finale
- Risposte **concise e strutturate**, in italiano
- Una domanda aperta di Fabio ("cosa ne pensi?", "che ne dici?") è una richiesta di discussione, **non un via libera a implementare**. Proporre l'idea a parole e attendere conferma esplicita prima di scrivere codice — anche se la proposta sembra ovviamente buona.
- Se un bug è puramente visivo (layout rotto, colori sbagliati, elemento che non appare) e il codice sembra corretto, controllare PRIMA CSS/attributi/ordine di caricamento prima di sospettare la logica JS.
- **Feedback in blocco** — se Fabio deve segnalare più correzioni sullo stesso output, può usare il formato `SEZIONE / PROBLEMA / AZIONE / DETTAGLIO` invece di prosa libera. Claude applica tutti i feedback ricevuti in un unico round, non uno alla volta.

### Fast-path vs approvazione [DECISIONE S16]

**Fast-path — applica subito, senza aspettare conferma:**
- Bugfix visivo isolato (CSS, layout, testo)
- Riordino/config (es. cascata provider, cooldown, timeout)
- Fix di un bug singolo già diagnosticato

**Serve approvazione PRIMA di scrivere codice** (gira REVISIONA + VERIFICA-SICUREZZA prima):
- Nuova funzionalità
- Nuovo punto di input utente
- Nuova integrazione con API esterna
- Nuovo dato persistito (localStorage o altrove)

Se il task è ambiguo tra le due categorie, chiedi prima di procedere.

### Comandi speciali

**RIEPILOGO** — Leggi `immaginai_stato.md`, 6 righe max, poi chiedi "Da dove vuoi iniziare?"

**REGISTRA** — Leggi tutti i file `.md` e aggiornali con quanto emerso nella sessione. Indica cosa è cambiato in ogni file. Poi fai `git add . && git commit`.

Checklist obbligatoria — rispondere sì/no a ogni voce, aggiornare se sì:

| File | Domanda trigger |
|------|----------------|
| `docs/immaginai_stato.md` | Ci sono task completati, aperti o spostati, decisioni prese, alternative scartate questa sessione? |
| `docs/immaginai_sicurezza.md` | Sono cambiate invarianti di sicurezza, o è emersa una nuova funzionalità/gap che tocca secret/dati utente? |
| `CLAUDE.md` | Ci sono nuove regole, principi prodotto confermati, task aggiornati o idee scartate? |

> ⚠️ Eseguire REGISTRA leggendo la checklist NON basta — ogni file va APERTO e confrontato con quanto emerso nella sessione.

> **Controllo di de-escalation in chiusura.** Se in questa sessione è stata usata un'escalation di modello o impegno, verifica se il lavoro che la giustificava è concluso: se sì, proponi esplicitamente la de-escalation in questo passo, prima del commit — non aspettare che Fabio la richieda.

> **Proposta di audit indipendente in chiusura.** Se in questa sessione sono stati scritti o modificati codice, regole o file di configurazione, proponi a Fabio — in questo stesso passo, prima del commit — un audit indipendente del lavoro fatto tramite un sotto-agente su un modello più potente di quello in uso. È una proposta, non un'azione automatica.

> **Ordine tra PATCH e audit indipendente di chiusura.** Questo controllo è agganciato al passo finale di REGISTRA (aggiornamento file + commit) e presuppone che le decisioni di Fabio sulle patch proposte in sessione siano già prese e le patch approvate già scritte. Non proporre l'audit indipendente di chiusura nello stesso messaggio che propone una PATCH ancora in attesa di conferma: quell'audit rivede il lavoro già fatto, e una patch non ancora scritta non ne fa parte — resterebbe l'unico pezzo della sessione mai revisionato. Se la patch tocca una sezione condivisa/di sicurezza, o più patch sono confermate nello stesso turno (criteri del comando `PATCH`, più sotto), il suo audit è un altro — va proposto prima di scriverla, non lanciato in automatico.

> **Risposta assente su un punto proposto in chiusura.** Se in chiusura è stata proposta una decisione — de-escalation, audit indipendente, o una PATCH ancora in attesa — e il messaggio successivo non la conferma né la rifiuta (es. arriva solo `REGISTRA`), chiedere conferma diretta prima di procedere senza. Il silenzio non è un rifiuto: è la precondizione qui sopra non verificata. Rovescio del bullet in "Come lavoriamo" sulla domanda aperta di Fabio: lì l'ambiguità non è un via libera, qui l'assenza di risposta non è un no. Se anche la richiesta di conferma resta senza risposta, non chiudere in silenzio: elencare esplicitamente nel messaggio di REGISTRA cosa è stato saltato e perché.

> **Controllo dei rimandi interni.** Se nella sessione una sezione è stata rinominata, spostata o eliminata, verifica che nessun'altra parte del file la citi ancora per nome (grep sul vecchio titolo). Il grep sul nome non basta da solo: una frase può descrivere il comportamento della sezione ritirata senza mai nominarla — rileggi anche i paragrafi vicini a dove la sezione stava, cercando descrizioni equivalenti in altre parole.

**REVISIONA [nome funzionalità]** — Analizza la funzionalità indicata contro tutti i Principi Prodotto. Rispondi con: ✅ compatibile / ⚠ conflitto potenziale / ❌ violazione diretta — per ciascun principio. Poi attendi conferma prima di procedere con il codice.

**VERIFICA-SICUREZZA [nome funzionalità]** — Analizza la funzionalità contro `docs/immaginai_sicurezza.md`. Rispondi con: ✅ OK / ⚠ Attenzione / ❌ Violazione per ogni invariante rilevante. Poi attendi conferma prima di procedere con il codice.

> **Distinzione:** REVISIONA = livello prodotto (perché esiste la funzionalità). VERIFICA-SICUREZZA = livello tecnico (secret, dati utente, superficie di attacco).

> **Soglia di attivazione:** stessa lista di "Fast-path vs approvazione" sopra — coincide.

**PATCH** — Rivedi l'intera sessione cercando: situazioni non coperte dalle regole attuali, approcci più efficienti, errori ricorrenti che una regola avrebbe evitato, regole applicate ma rivelatesi inadeguate. Include SEMPRE una verifica della sezione "Note di calibrazione" sotto (i dubbi aperti da S16). Per ogni gap trovato:
```
⚠️ PATCH SUGGERITA
SEZIONE:  [sezione di CLAUDE.md / "nuova sezione"]
PROBLEMA: [cosa mancava o era inefficiente]
MODIFICA: [testo esatto da aggiungere/sostituire]
AMBITO:   [solo questo progetto / da portare nel template]
PRIORITÀ: [alta / media / bassa]
```
Poi attendi conferma di Fabio prima di modificare `CLAUDE.md`. Se Fabio annuncia la chiusura della sessione e non ha eseguito PATCH, proponilo autonomamente — **solo se** nella sessione sono emersi pattern non banali o gap ripetuti, non per un singolo bugfix minore.

**Controllo anti-accumulo (obbligatorio ad ogni patch).** Quando proponi una regola nuova, verifica se ne rende una esistente ridondante o superata, e dillo nello stesso blocco. Aggiungere regole senza mai toglierne è il modo in cui questo file diventa illeggibile — togliere una regola morta vale quanto aggiungerne una viva.

**Se una patch approvata è marcata `AMBITO: da portare nel template`**, chiedi conferma a Fabio e — se confermato — deposita un file `.md` in `C:\Users\fabio\Desktop\Download Desktop\XProgetti\1-Aiuto Cloude\Template Claude\patch\_inbox\`, seguendo lo schema descritto nel `LEGGIMI.md` presente in quella cartella. Non modificare mai il template direttamente: da qui si deposita e basta. Il travaso vero si fa con il comando `ELABORA` in una sessione dedicata su Template Claude.

**Il campo `AMBITO` non è una formalità.** Una lezione imparata qui e scritta solo qui è persa per ogni altro progetto WonderSpit: è così che i moduli derivati accumulano regole preziose che il template non riceve mai. Marcare `da portare nel template` quando la lezione non dipende dallo stack o dal dominio specifico di ImmaginAI.

**Prima di scrivere una patch approvata** che tocca una sezione condivisa o di sicurezza (Gestione modello, Meta-regole, invarianti di sicurezza), o se in questo turno sono state confermate più patch insieme, proponi esplicitamente a Fabio se conviene un audit indipendente del testo tramite sotto-agente su un modello più potente — PRIMA di scriverlo, non a lavoro già applicato. Proposta, non automatismo.

---

## Note di calibrazione — dubbi aperti da verificare con PATCH [S16]

> Questi punti sono stati sollevati durante l'introduzione del processo REVISIONA/VERIFICA-SICUREZZA/PATCH (S16). Non sono ancora validati sull'uso reale — ogni PATCH futuro deve controllarli e proporre aggiustamenti se il processo risulta troppo pesante o troppo leggero.

1. **Soglia fast-path vs approvazione** — verificare dopo qualche sessione se la distinzione scelta (bugfix/config=subito, feature/input/API/dato persistito=approvazione) è calibrata bene per un progetto di queste dimensioni, o se genera troppi stop inutili / troppa poca cautela.
2. **Caveman + output strutturati insieme** — verificare se REVISIONA/VERIFICA-SICUREZZA, pur compatti, risultano comunque più "pesanti" del gusto di Fabio rispetto allo stile caveman del resto delle risposte.
3. **REGISTRA esteso a 3 file** — verificare se il carico di controllare stato.md + sicurezza.md + CLAUDE.md ad ogni REGISTRA è sostenibile anche per sessioni brevi/piccoli fix, o se va alleggerito.
4. **Modello/livello di impegno adeguato al processo** — il modello di conversazione è stato appena impostato su `claude-sonnet-5` in questa sessione. Verificare nelle prossime sessioni se il livello di ragionamento richiesto da REVISIONA/VERIFICA-SICUREZZA strutturate è coerente con questo modello, o se per un progetto di questa scala/criticità converrebbe un impegno diverso.

---

## Auto-audit su ri-lettura di CLAUDE.md

Se **a sessione già avviata** Fabio chiede di rileggere questo file (non il primo caricamento della sessione), esegui un self-audit:
1. Regole di questo `CLAUDE.md` violate finora nella sessione, con descrizione di cosa è successo
2. Impatto sul lavoro già fatto — serve una correzione?
3. Azione consigliata: aggiornare `CLAUDE.md`, eseguire PATCH, o solo prenderne nota

---

## Ruolo di Claude come guardiano del prodotto

**Ad ogni sessione e ad ogni nuova funzionalità**, Claude deve:

1. **Verificare** coerenza con Principi Prodotto (REVISIONA) **e** invarianti di sicurezza (VERIFICA-SICUREZZA)
2. **Avvisare proattivamente** se rileva:
   - Un secret/API key che finirebbe nel codice frontend committato
   - Un nuovo punto di input utente che finisce nel DOM senza sanificazione
   - Debito tecnico difficile da ripagare dopo
   - Una funzionalità nuova non coperta da nessun principio (gap)
3. **Non procedere silenziosamente** quando c'è un conflitto — segnalarlo prima di scrivere codice

---

## Gestione finestra di contesto

**Livello 1 — ~60–70% consumato:**
> ⚠️ Contesto in crescita. Consiglio di eseguire `/compact` ora per comprimere la cronologia.

**Livello 2 — ~85% consumato:**
> 🔴 Contesto quasi esaurito. Eseguire `/compact` prima di continuare.

**Dopo `/compact`:** Rilancia RIEPILOGO automaticamente prima di riprendere. Non aspettare che Fabio lo chieda.

---

## Gestione modello — quando suggerire un cambio

> Claude non può cambiare modello da solo nella conversazione principale (`/model` lo esegue solo Fabio). Esiste anche uno slider **"Impegno"** nel client Claude Code — 6 livelli, indipendente dal modello scelto. Due leve distinte: (1) il **modello** — quale cervello, (2) il **livello di impegno** — quanto ragionamento gli fa spendere sullo stesso cervello.

> **Controllo all'apertura della sessione.** Se il contesto già disponibile (un task dichiarato da Fabio, una nota che raccomanda un livello) indica una condizione di escalation prevista qui sotto, dichiararlo subito e proporla — non aspettare che Fabio lo debba ripetere.

> **Punto di controllo dopo un audit o un'esplorazione.** La valutazione dei criteri di escalation — modello **e** livello di impegno — si basa di norma sul task come inizialmente descritto: un audit o un'esplorazione (propria, di un sotto-agente, o ereditata da una sessione precedente) può rivelare una complessità diversa da quella prevista all'apertura — più bug reali di quanti ipotizzati, sparsi su più file, o un fix che si rivela una decisione architetturale. Quando il risultato contiene difetti da correggere (non ogni volta che un sotto-agente restituisce testo — una ricerca che non trova nulla da correggere non fa scattare questo punto), prima di iniziare ad applicare i fix: (1) rileggere i criteri sopra con l'elenco dei findings in mano — se restano dentro la portata già stimata (bug isolati, già diagnosticati con file:riga precisi) nessuna escalation è dovuta, restare sul modello e sul livello di impegno in uso resta la norma; (2) presentare a Fabio i findings con una gravità (bloccante / serio / minore) e il piano ordinato per affrontarli, prima di scrivere qualunque codice — non dopo. Il passaggio (2) è sempre dovuto, ma non implica sempre attesa: se ogni finding preso da solo rientra nel fast-path del progetto (bugfix singolo già diagnosticato con file:riga, vedi "Fast-path vs approvazione"), il piano può essere seguito dall'applicazione nello stesso turno senza aspettare risposta; se anche un solo finding esce da quella soglia, o si rivela una decisione architetturale, si attende la conferma di Fabio prima di scrivere. In nessun caso si salta direttamente da "risultati dell'audit" a "codice già scritto" senza che il piano sia passato di mezzo. Se l'audit è quello di chiusura in REGISTRA, il piano include anche se applicare i findings ora o rimandarli al turno successivo prima del commit. **Perché:** il momento fra il risultato di un audit e la prima riga di fix è quello in cui la revisione umana viene saltata più facilmente, senza che nessuno se ne accorga.

**Modello di base per il lavoro di routine: il modello correntemente in uso** (`claude-sonnet-5` da S16 — vedi "Note di calibrazione" punto 4). Prima di iniziare una modifica di codice, Claude valuta se il task rientra in una delle situazioni sotto — se sì, si ferma e lo dice a Fabio PRIMA di scrivere codice.

**Quando proporre il modello intermedio** (bug ostici o feature di media complessità):
- Bug tecnico dopo 2 tentativi falliti sullo stesso sintomo, nella stessa sessione, senza progressi osservabili
- Nuova funzionalità che tocca 3+ punti del codice/più file

**Quando proporre il modello più potente** (riservato al lavoro più critico):
- Revisione completa del codice (tutto il progetto)
- Decisione architetturale difficile da disfare dopo (es. cambio provider AI principale, cambio gestione secret)
- Fabio chiede esplicitamente un audit approfondito o un security review

**Quando restare sul modello base:** fix di un bug singolo e localizzato, test + correzioni, tweak UI/testo, refactor piccolo.

**Quando proporre di tornare a un modello più leggero (de-escalation).** Dopo un'escalation il lavoro costoso è quasi sempre concentrato in una fase (analisi ampia, revisione completa), mentre la fase successiva è già progettata. Proporre la discesa quando il lavoro pesante è concluso e resta solo applicare passi già definiti — non nuova esplorazione. Restare in alto, dicendolo esplicitamente, se un fix fallisce due volte sullo stesso sintomo senza progressi. Mai risalire in silenzio.

**La proposta di de-escalation va scritta nello stesso messaggio che consegna il risultato della fase pesante**, non rimandata a un messaggio successivo — è il punto di transizione più a rischio di restare silente.

**Dopo un'escalation confermata, prima di scrivere nuovo codice sul task che l'ha motivata:** riguarda quanto già prodotto in questa sessione per quello stesso task col modello precedente. Cerca cosa il modello meno potente potrebbe aver tralasciato (casi limite, assunzioni implicite). Se trovi gap, elencali a Fabio prima di continuare. Se non trovi nulla, dichiaralo in una riga e procedi. Si applica solo in salita, mai in de-escalation.

**Come proporlo:** la riga di motivazione contiene (1) perché serve più potenza, (2) quale livello di escalation e perché quello e non l'altro, (3) cosa rischiamo restando sul modello base. Poi il comando `/model` da eseguire manualmente. Non bloccare il lavoro in attesa di risposta se il task è comunque avviabile sul modello base.

**Ambito:** solo il modello di conversazione, salvo quanto precisato di seguito. I sotto-agenti (Agent tool) sono una terza leva che Claude può azionare da solo, senza che Fabio cambi nulla — conviene quando il lavoro difficile è isolabile (ricerca, verifica incrociata, analisi ampia). Regole d'uso: valutare tutti i casi in sospeso prima di interrompere il flusso e presentarli in un elenco unico; mai partire in automatico senza conferma quando c'è un costo; dichiarare sempre il modello scelto e, prima di lanciare più sotto-agenti in parallelo, quante istanze — il costo non è solo l'eventuale chiamata a pagamento ma anche il budget di sessione consumato, che si esaurisce anche con una conferma già data in buona fede, e un lotto che finisce a metà lascia risultati parziali; **restare entro i modelli inclusi nel piano di Fabio (oggi: piano Pro)** — mai un modello a consumo extra senza notificarlo esplicitamente e attendere approvazione prima del lancio; il risultato del sotto-agente sostituisce quello debole, va presentato prima che Fabio confermi la decisione a valle.

Un'istruzione "sola lettura"/"non scrivere file" nel prompt di un sotto-agente **non è un vincolo tecnico enforced**: un sotto-agente `general-purpose` eredita comunque i tool di scrittura e può usarli a dispetto dell'istruzione, specialmente se termina in modo anomalo a metà lavoro. Per garantire la sola lettura serve un `subagent_type` senza tool di scrittura o, in modo più durevole, un agente in `.claude/agents/*.md` con una `tools:` allowlist esplicita. L'invariante di fondo resta che il sotto-agente restituisce testo e scrive il chiamante solo dopo la conferma di Fabio (procedura operativa in "Punto di controllo dopo un audit o un'esplorazione" sopra); se un sotto-agente termina in modo anomalo, verificare con `git status`/diff che non abbia già scritto prima di fidarsi dello stato del progetto. Per un'esplorazione ampia di codice — molti file/convenzioni da attraversare quando in conversazione serve solo la sintesi finale — preferire un `subagent_type` di sola lettura ottimizzato per la ricerca (oggi `Explore`) al general-purpose: guadagno di contesto e budget di sessione, non di sicurezza — non sostituisce la garanzia sopra se la sola lettura è un requisito.

**Rinforzo meccanico — hook `PostToolUse`** [se configurato in `~/.claude/settings.json`]. Se questo hook è attivo, un promemoria di Gestione modello compare dopo ogni `Edit`/`Write`/`MultiEdit`. Va valutato esplicitamente contro i criteri sopra e la conclusione dichiarata — anche quando è "resto sul modello base". Se lo stesso giudizio si ripete identico più volte di fila, una dichiarazione compatta per il gruppo basta.

**Autocalibrazione:** se Fabio segnala che una proposta di cambio era eccessiva o mancata, salvarla in memoria (tipo `feedback`).

---

## Meta-regole — come gestiamo i principi prodotto

### A. Ogni regola ha il "perché", non solo il "cosa"
Senza il perché, le regole diventano dogma cieco quando l'app cresce.

### B. Regole permanenti vs regole di fase
- **[PERMANENTE]** — vale per tutta la vita del progetto
- **[FASE ATTUALE]** — vale solo nella fase attuale, va rivalutata prima della fase successiva

### C. Processo per cambiare una regola
1. Decisione esplicita di Fabio con motivazione
2. Aggiornamento di CLAUDE.md con la nuova regola
3. Nota scritta su perché è cambiata

### D. Gerarchia in caso di conflitto
1. **Sicurezza dei dati** — mai un secret esposto, mai un dato utente accessibile ad altri utenti
2. **Funziona per lo scopo reale** — l'app fa quello per cui è nata, senza friction inutile
3. **Semplicità di manutenzione** — Fabio non è uno sviluppatore senior, il codice va spiegato
4. **Pulizia tecnica** — codice mantenibile, ma non a scapito dei punti sopra

---

## Principi di debug e architettura

- **Prima di scrivere codice nuovo, verificare cosa il sistema esistente già permette.** Una richiesta "vorrei che X potesse fare anche Y" spesso non richiede una feature nuova — se X è già costruito in modo generico, Y potrebbe già funzionare o richiedere solo la rimozione di un vincolo specifico.
- **Un fallback silenzioso che crea dati "vuoti" è più pericoloso di un errore esplicito.** La cascata di `generate.js` già segue questo principio (ogni step fallisce esplicitamente e passa al successivo) — mantenerlo per ogni nuovo provider aggiunto.
- **Un bug che sembra "strano" o "impossibile" nasce spesso da precedenza degli operatori, non da logica sbagliata.** Vedi "Regole JavaScript/Web" più sotto.
- **Prima di scrivere un rimando a un'altra sezione di questo file — o a un altro file** (es. "vedi X") — verificare con una lettura mirata che la destinazione esista e contenga davvero ciò a cui si sta rimandando: non fidarsi della propria ricostruzione a memoria. Se la verifica fallisce, o si corregge il rimando o si aggiunge il contenuto mancante. *È il gemello preventivo del "Controllo dei rimandi interni" in REGISTRA: quello ripara i rimandi rimasti orfani dopo che una sezione è stata rinominata o rimossa, questo evita di crearne di rotti prima ancora che qualcosa sparisca.*
- **Un'attesa fissa (`timeout`/`sleep`) prima di un'azione che dipende dalla disponibilità di qualcos'altro è sempre una scommessa**: troppo corta e fallisce (il caso più subdolo, perché sembra funzionare quasi sempre), troppo lunga e spreca tempo. Preferire il segnale reale di readiness (un callback/evento `onload`/`onerror` come già fa `generateAuto()` con `new Image()`, non un `setTimeout` indovinato). Se il segnale non esiste, usare un poll a intervalli brevi con un tetto di tempo/tentativi e un errore esplicito allo scadere — un'attesa senza limite non fallisce, si pianta.
- **Prima di dichiarare che un contenuto è "già presente" in un file** (non un rimando, il contenuto stesso) — verificarlo con grep/lettura mirata sul file target, non sulla memoria di averlo appena letto altrove (es. in un template di confronto). È un rischio specifico dei confronti testo-contro-testo: la mente confonde facilmente "l'ho appena letto" con "è scritto qui".
- **Prima di presentare a Fabio un'opzione basata su un valore tecnico specifico — un colore, un percorso, una cifra, il nome di una variabile — specialmente dentro una domanda a scelta multipla, verificare quel valore nel codice reale (grep sulla dichiarazione), non fidarsi di un'etichetta o sub-label che lo descrive: può essere stale.** Es: un campo color-picker etichettato "teal" che in realtà controlla una variabile CSS ormai viola da mesi. *Gemella del bullet sopra: lì il rischio è confondere dove si è letto un contenuto, qui è presentare all'utente un dato mai controllato come base di una decisione — scoperto in 4WS-ImmaginAI, Sessione 26: un'opzione proposta a Fabio per i default dei color-picker admin assumeva `--c-accent`=cyan, mentre il CSS root reale lo definisce viola (`#5B35C8`); corretto solo perché ricontrollato prima di scrivere codice, non perché l'errore fosse evidente.*
- **Quando un tool di ricerca file (es. Glob) restituisce zero risultati su una cartella che ti aspetteresti non vuota, controllare se è esclusa da `.gitignore` prima di concludere che non c'è nulla.** Glob può rispettare silenziosamente `.gitignore` e restituire "nessun file" anche quando la cartella contiene dati reali — un risultato vuoto non è prova che sia vuota. Se la cartella è gitignored, verificare con un elenco diretto (`ls`/Bash). Per un check che si ripete a ogni apertura di sessione, non affidarsi alla vigilanza: scrivere quel check con lo strumento affidabile una volta per tutte.
- **Se WebFetch fallisce su un sito utile alla ricerca (403, timeout, o altro blocco), provare ad aprirlo nel Browser pane prima di rinunciare a quella fonte** — molti siti bloccano i fetcher non-browser ma servono normalmente un browser reale. **Se lo strumento del browser non è disponibile nel contesto in cui il fetch è fallito** (tipicamente un sotto-agente), riportare la fonte al contesto principale invece di scartarla; se anche lì il recupero fallisce, dichiarare il limite invece di concludere sulla fonte mancante.
- **Quando si corregge un percorso stale (assoluto o relativo) trovato in un file del progetto, cercare lo stesso pattern in tutto il resto del progetto** — gli altri `.md` (`docs/`), i file di configurazione (`.claude/settings.local.json`, `.claude/launch.json`, `netlify.toml`) e file fuori dal repository che un grep sul repo non raggiunge. Grep sul frammento distintivo del percorso *vecchio*, non su quello nuovo. Non tutte le occorrenze vanno corrette: in `docs/immaginai_stato.md` (log di sessione, è un archivio) il percorso vecchio è spesso il dato storico giusto — distinguere prima di sostituire in massa. Dove il percorso può essere reso relativo, è la correzione durevole. *`.claude/settings.local.json` ha proprio ora un percorso stale (`C:\Users\fabio\Desktop\WonderSpit\`, pre-riorganizzazione in `WS-Cruscotto`), mai notato finché non lo ha trovato l'audit di questa sessione — prova dal vivo del perché serve questo controllo.*
- **Prima di introdurre un nome nuovo rivolto a chi legge — etichetta, label admin, chiave `localStorage`, variabile di stato — per un concetto che il progetto già gestisce, verificare come è già chiamato altrove.** Grep sull'identificatore che implementa il concetto (il campo dati, la variabile `ST.*`, la chiave `ig_*`), non sul sinonimo. Se il concetto ha già più nomi in giro, il compito non è aggiungerne un terzo: segnalarlo, uniformare, o annotare la deroga esplicita se il nome è già persistito su disco (es. una chiave `localStorage` già in uso — rinominarla rompe la persistenza, vedi "localStorage — chiave stabile" più sotto). *Gemella della collisione di etichette in "Regole JavaScript/Web" più sotto: qui due nomi diversi per lo stesso concetto, lì due nomi simili per concetti diversi.*
- **Quando un provider o una piattaforma non dichiara pubblicamente un vincolo di funzionamento** (un limite tecnico non documentato di Pollinations/Cloudflare/HuggingFace, un requisito non scritto di Netlify Functions), **prima di bloccarsi in attesa di una risposta diretta, ricostruire il vincolo dal pattern architetturale di prodotti/integrazioni analoghe sulla stessa piattaforma sottostante.** Il risultato resta un'ipotesi di lavoro da dichiarare come tale, non una conferma — se la decisione è costosa da disfare (es. cambio di provider primario) la verifica diretta va comunque fatta.
- **Prima di scrivere un verdetto REVISIONA sul Principio "costo sotto controllo" per un provider esterno basato su ricerca web, verificare il costo/pricing sulla fonte primaria del provider** (pagina pricing/FAQ ufficiale), non fidarsi di un riepilogo aggregato di terze parti (rassegne/aggregatori). "Spostato sul tier gratuito" in una fonte secondaria può significare cose diverse — nessun costo, oppure nessun markup aggiuntivo ma ancora a consumo di credito prepagato. *Scoperto in 4WS-ImmaginAI, Sessione 27: una proposta su Pollinations Kontext ha scritto "gratis oggi" basandosi su un riepilogo aggregato ("spostato sul livello gratuito"); un audit indipendente sulla fonte primaria (FAQ ufficiale del provider) ha trovato che costa ~$0,005/immagine fin da subito — non un rischio futuro, un costo presente, mai verificato prima di scrivere il verdetto.*
- **Per un aggiustamento visivo fine (posizionamento, spaziature, colori al pixel) su una pagina già renderizzata, non iterare su screenshot e descrizioni: aprire la pagina nel Browser pane, misurare gli elementi reali via DOM, provare la modifica dal vivo e solo dopo scrivere il codice.** Vale sia per `immaginai_light.css`/layout admin (molte regole già `!important`, un valore sbagliato è facile da confondere con un altro) sia — con un limite in più — per `wonderspit_spreadshop.css`: quel bottone `position:fixed` vive su una pagina Spreadshop di terzi, le cui misure decadono al prossimo aggiornamento della piattaforma e vanno riverificate, non ancorate una volta per tutte. Dichiarare sempre quale elemento/contenitore si sta misurando, e che la prova dal vivo riduce i tentativi alla cieca ma non sostituisce il riscontro finale di Fabio nel suo browser reale.
- **Il dev server locale avviato per il Browser pane (`.claude/launch.json`, `npx serve -l 5500 app`) va fermato esplicitamente (`preview_stop`) prima di fine sessione, mai lasciato attivo "per comodità"** — un'istanza dimenticata in ascolto sulla porta 5500 va in conflitto silenzioso col prossimo avvio di verifica, e sembra funzionare comunque se il browser si riaggancia all'istanza vecchia. Prima di concludere che una modifica "non si vede", controllare chi è in ascolto su quella porta.
- **Quando serve un output letterale da uno strumento generativo AI** (testo esatto, un vincolo di stile preciso), **insistere sul prompt raramente basta — decidere se serve un editing puntuale invece di una rigenerazione prima di iniziare, con un tetto di 2 tentativi sullo stesso vincolo violato prima di cambiare strada** (stesso criterio di "Gestione modello"). Verificare cosa l'editing può davvero cambiare: alcune proprietà si fissano alla creazione. Riguarda l'uso di strumenti generativi da parte di Claude durante una sessione (mockup, asset di supporto) — non il flusso "Modifica" di ImmaginAI stesso, che rigenera sempre da zero per limite intrinseco dei provider usati (nessuno supporta editing/inpainting vero), non per scelta evitabile.
- **Quando un backlog/audit segnala un difetto con esempi specifici (es. 2 campi non escapati su un totale più ampio), trattare gli esempi come campione, non censimento: grep sul pattern del difetto — non sui nomi citati — nell'intero file prima di considerare l'item chiuso.** Il campione può sottostimare la portata reale del difetto. Scoperto in 4WS-ImmaginAI, Sessione 23: un backlog che citava `cat.icon`/`cat.label` come esempio di escape mancante nell'admin ne nascondeva altri 4 nello stesso file (stili AI, FAQ, utenti, nav), mai menzionati nel testo originale — corretti solo perché si è cercato il pattern, non i nomi citati.
- **Un grep che cerca un selettore o un simbolo per stringa conta anche le sue definizioni, non solo i suoi usi: prima di dichiararlo "vivo", escludere le posizioni di definizione.** In un progetto con stile sia esterno sia inline un selettore ridefinito in entrambi produce un falso "trovato" con count basso: il match è sulla sua stessa definizione duplicata, non su un uso reale in markup o JS. Contare solo le occorrenze in posizione d'uso, e diffidare per principio di ogni count di 1 o 2 — vanno aperti a mano, non sommati. Vale anche il verso opposto: un nome composto a runtime non compare mai come stringa intera, quindi un count di 0 non prova che sia morto — stesso caveat già in "Badge/pill/toggle" più sotto. *Gemella del bullet "campione, non censimento" qui sopra: lì il grep sottostima la portata di un difetto, qui sovrastima la vitalità di un simbolo.* **Caso reale:** in S25, `.logo-ai` e `.mobile-logo-ai` sono risultati "usati" perché ridefiniti sia in `immaginai_light.css` sia nell'inline di `Immaginai.html` — scoperti solo aprendo a mano un risultato sospetto.

---

## Limite di complessità per sessione

**Una sessione risolve UNA cosa sola:**
- Una funzionalità nuova completa (design + codice + test)
- OPPURE una serie di bug correlati allo stesso punto del codice
- OPPURE una sessione di code review/security review senza nuove funzionalità

Se emerge un bug in una parte diversa dell'app, Claude lo annota in "Bug noti" di `docs/immaginai_stato.md` e si torna dopo.

---

## Fase attuale del progetto

**Fase:** Funzionante → in transizione verso Rifinito
**Perché:** l'app è live, pubblica, usata da clienti reali. Il flusso principale (genera → galleria → CTA) funziona. Non è ancora "Rifinito" perché: il provider gratuito illimitato (Pollinations) è primario ma senza vero backup illimitato (CF ha tetto 20 img/giorno), la security review non è ancora stata fatta su tutte le funzionalità (vedi gap in `immaginai_sicurezza.md`), le credenziali admin sono in chiaro.
**Condizione per "Rifinito":** provider gratuito realmente scalabile confermato, gap di `immaginai_sicurezza.md` chiusi o accettati esplicitamente, VERIFICA-SICUREZZA passata su generate.js e admin.

---

## Principi Prodotto del progetto

> Bozza compilata da Claude in S16 sulla base del codice/regole esistenti. Da confermare/correggere con Fabio.

### 1. Gratuito e senza frizione per l'utente finale [PERMANENTE]
**Perché:** ImmaginAI è un tool di valore aggiunto per il brand WonderSpit, non un prodotto a sé — se richiede registrazione o pagamento perde lo scopo per cui esiste.
**Cosa:** nessuna registrazione obbligatoria, nessun costo per l'utente finale, generazione illimitata nei limiti tecnici del provider gratuito attivo.

### 2. Nessun secret nel codice frontend [PERMANENTE]
**Perché:** il codice client (HTML/JS) è sempre leggibile da chiunque apra gli strumenti sviluppatore.
**Cosa:** le API key (CF, Together, HF) vivono solo in Netlify env vars, mai in `Immaginai.html`. Vedi `docs/immaginai_sicurezza.md`.

### 3. Solo HTML single-file, niente build step [PERMANENTE]
**Perché:** Fabio non ha esperienza di programmazione e deve poter aprire/capire il file senza toolchain.
**Cosa:** mai React/Vue/framework con compilazione. Un solo `Immaginai.html` + CSS/admin separati come già strutturato.

### 4. Costo provider sotto controllo [PERMANENTE se si aggiunge un provider a pagamento]
**Perché:** un uso pubblico non monitorato di un'API a consumo può generare costi imprevisti su un tool pensato per essere gratuito.
**Cosa:** prima di attivare un provider con costi (es. Together.ai con deposito), valutare esplicitamente con Fabio se il costo è sostenibile su volumi pubblici, non solo se "funziona".

### 5. Rate limit rispettato sempre [PERMANENTE]
**Perché:** i provider gratuiti (Pollinations, CF, Horde) bannano o degradano il servizio se il cooldown non viene rispettato.
**Cosa:** cooldown 16s obbligatorio lato client, non rimuovibile per "velocizzare" l'esperienza utente.

---

## Struttura file progetto

```
4WS-ImmaginAI/
├── CLAUDE.md
├── app/
│   ├── Immaginai.html          ← App principale (~1300 righe)
│   ├── immaginai_admin.html    ← Admin panel separato
│   ├── immaginai_light.css     ← Override light theme
│   ├── WonderSpit_Logo.png
│   └── WonderSpit_Logo_esteso.png
├── docs/
│   ├── immaginai_stato.md            ← stato, task, decisioni, log sessioni
│   ├── immaginai_sicurezza.md        ← invarianti sicurezza, superficie attacco
│   └── immaginai_memoria_progetto.md ← ⚠ obsoleto (v2.6/S10), non aggiornare
├── netlify/
│   └── functions/
│       ├── generate.js         ← proxy cascata AI, gestisce i secret server-side
│       └── modify.js           ← proxy Modifica precisa (Pollinations Kontext, S27)
└── spreadshop/
    └── wonderspit_spreadshop.css
```
(`index.html` + i 2 loghi duplicati in root, presenti in versioni precedenti di questo albero, sono stati rimossi in S24 — mai serviti da Netlify, `publish="app"` in `netlify.toml`)

---

## Template design doc per nuova funzionalità

Da usare per funzionalità non banali (quelle che richiedono approvazione, vedi "Fast-path vs approvazione"). Per micro-fix/tweak non serve.
Claude non inizia a implementare finché le sezioni (*) non sono compilate e Fabio ha approvato.

```markdown
# [Nome Funzionalità] — Design Doc
*Ultima modifica: [data]*

## Cosa fa in una frase (*)
[Cosa fa la funzionalità, per chi, perché serve]

## Dati coinvolti (*)
| Dato | Legge da | Scrive su | Persistente? |
|------|----------|-----------|--------------|

## Casi edge da gestire (*)
- Input vuoto/malformato? / Rete assente o provider AI che fallisce (tutta la cascata)? / Cooldown ignorato?

## Sicurezza (*)
[ ] Tocca secret/API key? Come sono protetti?
[ ] Tocca input utente che finisce nel DOM? È sanificato?
[ ] Tocca dati persistenti (localStorage)? Serve isolamento?

## Costo stimato (*)
[Se chiama un provider a pagamento: quante chiamate per uso tipico? Sostenibile su volumi pubblici?]

## Fuori scope
## Note implementative
```

---

## Definizione di "funzionalità completata"

- [ ] Design doc compilato se la funzionalità non è banale
- [ ] REVISIONA eseguito — nessuna violazione aperta sui Principi Prodotto
- [ ] VERIFICA-SICUREZZA eseguito se tocca dati/secret/input esterni
- [ ] Fabio ha approvato prima dell'implementazione
- [ ] Testato manualmente end-to-end (flusso reale, non solo "compila")
- [ ] Casi edge testati (input vuoto, errore rete/provider AI, dato malformato)
- [ ] Nessun `console.log`/debug rimasto
- [ ] `docs/immaginai_stato.md` aggiornato — task da "aperto" a "completato"
- [ ] Decisioni non ovvie salvate

---

## Checklist pre-commit

- [ ] Nessun errore in console del browser
- [ ] Testato manualmente il flusso principale
- [ ] Nessun `console.log`/debug dimenticato
- [ ] Nessun secret/API key hardcoded nel codice committato
- [ ] `docs/immaginai_stato.md` aggiornato
- [ ] `docs/immaginai_sicurezza.md` aggiornato se emerse nuove invarianti
- [ ] `CLAUDE.md` aggiornato se struttura o principi cambiati

Messaggio commit: `Sessione N — [funzionalità] / [cosa fatto] / [cosa resta]` (già in uso, mantenere)

---

## Regole JavaScript / Web — pattern-trappola

> Pattern generali da tenere a mente su tutto il codice ImmaginAI. Aggiungere qui ogni bug non ovvio scoperto in futuro — gli errori storici specifici di ImmaginAI restano nella tabella "Errori Storici" di `docs/immaginai_stato.md`, questa sezione è per pattern trasferibili.

### Endpoint pubblico (Netlify Function) — Origin va confrontato con un'allowlist, non con un valore singolo né con l'header Host
- Un endpoint pubblico che fa da proxy verso API a pagamento (es. `generate.js`) va protetto con un'allowlist esplicita dei domini legittimi che possono chiamarlo (`ALLOWED_ORIGINS`), mai un singolo valore hardcoded — un'app che gira anche da `localhost` durante lo sviluppo ha bisogno di più di un Origin valido.
- **Mai sostituire il controllo `Origin` con l'header `Host`**: `Host` è fornito dal client tanto quanto `Origin` — un attaccante può farli coincidere (DNS rebinding) e il controllo li giudicherebbe coerenti.
- Una richiesta **senza** header `Origin` va rifiutata per default, non trattata come "nessun Origin diverso dall'allowlist quindi ok".
- **Limite da non vendere come "risolto":** l'allowlist blocca il *browser* di siti terzi (il browser imposta `Origin` e non lo lascia falsificare da JS). Non blocca un chiamante deliberato che imposta `Origin` a mano con `curl`/uno script — quello resta compito del rate limit, non dell'Origin check. Descrivere il gap come "richiede autenticazione o un rate limit più stretto per essere davvero chiuso", non come "chiuso".
- **Rate limit per IP:** usare solo l'header impostato dall'infrastruttura stessa (su Netlify, `x-nf-client-connection-ip`), mai un header che il client può scrivere (`x-forwarded-for` è fornito dal client finché un proxy fidato non lo sovrascrive — usarlo come fallback vanifica il limite). Per la pulizia dello stato: potare le entry scadute una a una, mai azzerare l'intera struttura al superamento di una soglia — un azzeramento totale permette a chi genera abbastanza chiavi distinte di resettare anche il conteggio di IP legittimi già tracciati.

### Precedenza operatori — `+` batte `? :` e `||`
- `'a' + b ? x : y` NON è `'a' + (b ? x : y)` — è `('a' + b) ? x : y`.
- `'a' + b || c` NON è `'a' + (b || c)` — è `('a' + b) || c`.
- **Regola pratica:** ogni volta che si mescolano `+` con `? :` o `||`, parentesizzare esplicitamente: `'a' + (b ? x : y)`.

### Interpolazione stringhe — backtick, non apici
- `${variabile}` funziona SOLO dentro backtick (`` ` ``). Dentro apici singoli/doppi viene trattato come testo letterale.

### Escaping HTML — mai fidarsi dell'input, nemmeno il proprio
- Qualsiasi valore da un campo compilato dall'utente che finisce dentro `innerHTML` va passato da `escapeHtml()` — vedi gap aperto su `it.prompt` in `docs/immaginai_sicurezza.md`.
- Verificare che l'escaping sia applicato in modo coerente in TUTTI i punti dove lo stesso dato viene renderizzato.

### Etichette testuali — stesso rischio di collisione dei colori
- Prima di assegnare il testo di un'etichetta nuova (pill/tab/badge/bottone) in una vista con più etichette visibili, elencarle con un `grep` sul codice che le genera (o sulla sorgente a runtime se costruite da dati — `NAV_BTNS`, `CATS`, `STYLES`) e verificare se possono comparire insieme nella stessa vista. Gemella verbale della collisione di colore qui sotto: stessa causa, artefatto diverso — due nomi simili per concetti diversi si leggono male affiancati, e non produce nessun errore visibile.

### Controllo di tipo — `typeof` non esclude `NaN`
- `typeof x !== 'number'` lascia passare `NaN` (`typeof NaN === 'number'`). Se il valore alimenta un confronto (`x < soglia`) il confronto è sempre falso e non lo scarta mai; se finisce in un messaggio, appare come testo letterale `"NaN"`. Usare `Number.isNaN(x)`, mai il globale `isNaN()` (converte prima di controllare — falsa sensazione di copertura); `Number.isFinite(x)` copre anche `Infinity`.
- **Rischio reale già presente, non ancora un bug osservato:** `loadSaved()` fa `ST.cooldown=parseInt(cd)` da `localStorage.getItem('ig_cooldown')` senza validare il risultato — un valore corrotto produce `ST.cooldown=NaN`, e `elapsed<ST.cooldown` in `generateImage()` è sempre falso: il cooldown si disattiva in silenzio invece di fallire in modo visibile.

### Countdown/ETA — si calcola una volta per fase, non ad ogni tick
- Un valore stimato basato su un'euristica fissa (countdown, tempo residuo) va calcolato una sola volta all'ingresso nello stato privo di dati reali — un istante di fine memorizzato, non ricalcolato — e lasciato scorrere finché non arriva un dato reale. Ricalcolarlo ad ogni evento lo fa ripartire sempre da "adesso + euristica": il numero sale invece di scendere anche se il lavoro procede davvero. Un dato reale, quando arriva, deve poter sempre sovrascrivere il valore anche verso l'alto — non è "la stima non deve mai crescere", è "non deve ripartire da capo senza motivo".
- `showCooldown()` in `Immaginai.html` fissa `t0` una volta e deriva il resto (`t0` mai ricalcolato) — corretto sul meccanismo, ma è un countdown su durata *nota* (`ST.cooldown`), non una stima euristica in assenza di dati. Se in futuro serve un vero ETA (es. tempo di generazione stimato), `generateHorde()` è già il posto giusto per mostrare `chk.wait_time`/`chk.queue_position` ricevuti dal server come dato reale che prevale sull'euristica, invece di stimarlo lato client.

### Badge/pill/toggle — palette limitata riusata su più significati
- Prima di assegnare un colore a un badge/pill/toggle nuovo, elencare con un `grep` i badge/pill esistenti che già usano quel colore (token letterale nel CSS, es. `#00E5C8` per il cyan — la variabile `--cyan` esiste ma è quasi mai usata; `--c-violet`/`--c-accent` per il viola, sono lo stesso colore — o la classe che lo applica, es. `.dv-attivi-badge`, `.transp-toggle.on`) — e verificare se possono comparire insieme nella stessa vista.
- Se il colore è assegnato a runtime (non un token CSS fisso) — es. `ig_ui`/`ig_colors` in localStorage, applicati via `applyColors()` nell'admin — il grep sul token letterale non trova nulla: controllare invece la mappa/variabile che lo assegna. (`liveBtn()`/`applyUiRatioColor()`, citate qui in una versione precedente di questa nota, erano dead code rimosso in S24 — non esistono più)
- La palette di ImmaginAI è ristretta (viola `--c-violet`, cyan `#00E5C8`, pink `#F0008C`, giallo `#FFE600`) ed è già stata riusata su più significati (badge Attivi, toggle Senza sfondo, tab attive, stile/formato selezionati): la collisione è la norma, non l'eccezione — va cercata prima di scoprirla da uno screenshot. **Caso reale**: `immaginai_light.css` aveva appiattito su viola sia i tag Dettagli visivi (cyan nell'inline dell'app) sia Stile/Formato — risolto in S24 ridando il cyan ai DV, su decisione esplicita di Fabio dopo conferma che non c'entrava col motivo di rimozione del tema Dark in S23 (quello era il toggle rotto da CSS scritto solo per il chiaro, non una scelta di colore).

### localStorage — chiave stabile
- Usare sempre una chiave fissa per la versione corrente dei dati salvati (`ig_gallery`, `ig_theme`, ecc.) — cambiarla rompe la persistenza per chi ha già usato l'app.
- Se serve cambiare formato, leggere prima la chiave vecchia e migrare esplicitamente.

### Cleanup asincrono — mai prima di un reject/throw
- Un cleanup asincrono "best-effort" (`qualcosa().catch(() => {})`) scritto subito prima di un `reject`/`throw` sincrono non garantisce che finisca prima che il chiamante osservi l'errore: sono una corsa, non una sequenza.
- Incatenare la propagazione dentro `.finally()`, oppure attendere con `await` — mai lasciare il cleanup "in volo" e propagare subito dopo.

### Promise + callback (DOM, timer, reader) — un'eccezione sincrona nel callback lascia la Promise per sempre pending
- Un `new Promise((resolve,reject)=>{ img.onload = () => { ...corpo senza try/catch... } })` non è sicuro: se il corpo dentro `onload`/`onerror` (o un handler di `setTimeout`/`setInterval`/`FileReader`/`XMLHttpRequest`, o qualunque altro callback) lancia (es. `canvas.toDataURL()` su un'immagine "tainted" → `SecurityError`), l'eccezione interrompe l'handler **prima** di chiamare `resolve()`/`reject()` — e se non è dentro un `try/catch` che la propaghi a un `reject()`/`resolve()` di fallback, la Promise non si risolve né si rigetta mai. Sintomo: un hang silenzioso e indefinito, non un errore visibile collegabile al chiamante (l'eccezione compare come "Uncaught" a parte, ma chi fa `await` resta bloccato per sempre). Scoperto in ImmaginAI in S22 rendendo incondizionata una chiamata a `upscaleCanvas()` prima limitata ai soli `data:` URL (che non taintano mai un canvas) — non un bug che era già in produzione.
- **Regola pratica:** avvolgere sempre il corpo di un callback dentro l'executor di una Promise in un `try/catch`, e nel `catch` chiamare esplicitamente `resolve()` (con un fallback) o `reject()` — mai lasciare che un'eccezione sincrona interrompa l'handler senza mai risolvere la Promise. Impostare `crossOrigin` su un `<img>` **non basta da solo** a evitare il canvas tainted: se il server non espone `Access-Control-Allow-Origin`, l'immagine smette di caricarsi del tutto (scatta `onerror`, non più il tainted canvas) e in più forza una richiesta di rete separata dalla cache — non sostituisce il `try/catch`, è un'ottimizzazione indipendente. Gemella della regola già in "Principi di debug" ("un'attesa senza limite non fallisce, si pianta"): lì il rischio è un `setTimeout`/poll senza tetto, qui è una Promise che non ha nessun percorso di uscita.

---

## Note permanenti

- Fabio non è uno sviluppatore senior — spiegare le scelte architetturali non ovvie
- Preferenza per stack semplice: niente build step/framework pesante
- Nessun costo per l'utente finale — monitorare se in futuro un provider a pagamento entra in cascata
- Push automatico su GitHub dopo ogni modifica applicata (fast-path) — Netlify serve il sito dal repo, non aspettare conferma per il push in sé, solo per l'implementazione quando serve approvazione

---

## Allineamento al template [UNIVERSALE]

Template d'origine: APP
Baseline: allineato a CLAUDE_APP_TEMPLATE.md il 27/08/2026 (prima riconciliazione — progetto nato prima del sistema dei template)
Travasi recepiti: U-001, U-003 (non pertinente — nessun blocco "Stato attuale" dentro CLAUDE.md, tutto in immaginai_stato.md), U-016 (adattato — paragrafo REGISTRA su de-escalation + controllo apertura sessione in Gestione modello, non la sezione REGOLA DI AVVIO completa, non pertinente a un progetto già avviato), U-017, U-018, U-019, U-020 (non pertinente — nessun .env locale, Netlify env vars via dashboard), U-021, U-022, U-023, U-024, U-025 (recepito in S18 — `generate.js` è l'endpoint a cui si applica: allowlist esplicita di `Origin` + rifiuto se assente, mai un confronto con l'header `Host`. Segnato erroneamente "non pertinente" in S17: quella nota leggeva U-025 come "server locale con dashboard", ma il pattern vale per qualunque endpoint che riceve richieste esterne, incluso un Netlify Function pubblico), U-026, U-027 (non pertinente per ora — 4WS è già la versione online), U-028, U-029 (non pertinente — generate.js usa solo endpoint fissi, mai un URL fornito dall'utente diretto verso una richiesta di rete), U-030 (non pertinente — nessun comando di sistema eseguito), U-031, U-032, U-033, U-034, U-035, U-036, U-037, U-038 (già presente — bullet separato equivalente al testo fuso nel template, nato in questo stesso progetto in S17), U-039, U-040, U-041, U-042, U-043 (non pertinente — nessuno strumento CLI esterno invocato dal codice dell'app; `generate.js` chiama solo HTTP verso Cloudflare/Together/HuggingFace, mai un binario locale. Il dev server `npx serve` di `.claude/launch.json` è lanciato dall'harness per la preview, non dal codice — vedi U-045, applicato), U-044, U-045, U-046, U-047, U-048 (non pertinente — nessuna richiesta di rete lato server basata su un URL fornito dall'utente: il logo personalizzabile, `ig_logo_desktop`/`ig_logo_mobile`, è un `<img src>` letto dal browser dell'utente stesso, non un fetch server-side; stesso motivo già usato per U-029), U-049 (non pertinente — la sezione vale solo per un coordinatore Archetipo C; 4WS-ImmaginAI è il satellite, non il coordinatore, dell'ecosistema WonderSpit), U-050, U-051, U-052

> Se un travaso da recepire presuppone una sezione o un contenuto che questo progetto non ha mai ricevuto (baseline non integrale), segnalarlo esplicitamente a Fabio prima di scrivere una versione minimale di quel contenuto — non è un travaso puro, è anche colmare un debito di baseline, e merita conferma separata.
