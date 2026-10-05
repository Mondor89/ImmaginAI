# Archivio del CLAUDE.md — 05/10/2026

> **Cos'è:** storia spostata fuori da `CLAUDE.md` il 05/10/2026 (potatura secondo `C:\Users\fabio\Desktop\Download Desktop\XProgetti\1-Aiuto Cloude\Template Claude\docs\PROCEDURA_potatura_claude_md_2026-10-03.md`, travaso `U-199`).
> **Da dove viene:** dalla riga `Travasi recepiti:` della sezione `## Allineamento al template` del `CLAUDE.md` di 4WS-ImmaginAI (riga 624, 14,5 KB, le note per ID scritte in linea).
> **Come:** le parole sono identiche all'originale, spostate e non riscritte; nella riga restano gli stessi ID nello stesso ordine, ciascuno con una nota breve.
> **Non si legge all'avvio:** non importarlo con `@`, non aprirlo nel `RIEPILOGO` né nel passo «Leggi tutti i file `.md`» di `REGISTRA`. Si apre solo per ritrovare il perché di un ID.

---

## Parte A — Note per ID di `Travasi recepiti` (com'erano)

Una riga per ID, nell'ordine in cui comparivano. Il testo dopo il trattino lungo è la nota originale, tra le parentesi.

- **U-003** — non pertinente — nessun blocco "Stato attuale" dentro CLAUDE.md, tutto in immaginai_stato.md
- **U-016** — adattato — paragrafo REGISTRA su de-escalation + controllo apertura sessione in Gestione modello, non la sezione REGOLA DI AVVIO completa, non pertinente a un progetto già avviato
- **U-020** — non pertinente — nessun .env locale, Netlify env vars via dashboard
- **U-025** — recepito in S18 — `generate.js` è l'endpoint a cui si applica: allowlist esplicita di `Origin` + rifiuto se assente, mai un confronto con l'header `Host`. Segnato erroneamente "non pertinente" in S17: quella nota leggeva U-025 come "server locale con dashboard", ma il pattern vale per qualunque endpoint che riceve richieste esterne, incluso un Netlify Function pubblico
- **U-027** — non pertinente per ora — 4WS è già la versione online
- **U-029** — non pertinente — generate.js usa solo endpoint fissi, mai un URL fornito dall'utente diretto verso una richiesta di rete
- **U-030** — non pertinente — nessun comando di sistema eseguito
- **U-038** — già presente — bullet separato equivalente al testo fuso nel template, nato in questo stesso progetto in S17
- **U-043** — non pertinente — nessuno strumento CLI esterno invocato dal codice dell'app; `generate.js` chiama solo HTTP verso Cloudflare/Together/HuggingFace, mai un binario locale. Il dev server `npx serve` di `.claude/launch.json` è lanciato dall'harness per la preview, non dal codice — vedi U-045, applicato
- **U-048** — non pertinente — nessuna richiesta di rete lato server basata su un URL fornito dall'utente: il logo personalizzabile, `ig_logo_desktop`/`ig_logo_mobile`, è un `<img src>` letto dal browser dell'utente stesso, non un fetch server-side; stesso motivo già usato per U-029
- **U-049** — non pertinente — la sezione vale solo per un coordinatore Archetipo C; 4WS-ImmaginAI è il satellite, non il coordinatore, dell'ecosistema WonderSpit
- **U-053** — già presente — nato in questa sessione stessa, "Promise + callback (DOM, timer, reader)"
- **U-054** — già presente — "Punto di controllo dopo un audit o un'esplorazione" in Gestione modello
- **U-055** — già presente — "campione, non censimento" in Principi di debug
- **U-056** — già presente — "grep conta anche le definizioni" in Regole JavaScript/Web
- **U-057** — già presente — "Risposta assente su un punto proposto in chiusura"
- **U-058** — già presente — "verificare quel valore nel codice reale" in Principi di debug
- **U-059** — già presente — verifica costo su fonte primaria
- **U-060** — già presente — coerenza dato di log col commento dichiarato
- **U-061** — già presente — "Overlay/modale riusato" in Regole JavaScript/Web
- **U-062** — già presente — estensione stessa voce, "chiamata reale alla libreria/API"
- **U-063** — già presente — "test dal vivo deve controllare i dintorni" in Principi di debug
- **U-064** — già presente — "ripristino nel punto di uscita comune" nella stessa voce Overlay/modale
- **U-065** — già presente — "Fetch verso una propria Function — sempre un AbortSignal"
- **U-066** — già presente — "Elemento nascosto/mostrato — display:none cambia la geometria dei fratelli"
- **U-067** — già presente — nato in questo stesso progetto in S30, bullet sul calcolo pesante che blocca il thread UI; qui solo taggato
- **U-068** — già presente ma integrato in questa sessione — la voce "asset corrente → data: URL" copriva il caso generativo/instabile, mancava la preferenza per blob:/createObjectURL quando la dimensione conta senza attraversare un endpoint server, aggiunta ora
- **U-069** — recepito — "L'audit di chiusura può far emergere altre patch" in REGISTRA
- **U-070** — recepito — eccezione "patch nata a ridosso della chiusura" in PATCH + rimando in REGISTRA
- **U-071** — recepito — verifica dello strumento di continuazione di un sotto-agente, in Gestione modello
- **U-072** — recepito — hook JSON via script dedicato, non echo/printf inline, in Principi di debug
- **U-073** — recepito — non presumere un tool installato, verificarlo, in Principi di debug
- **U-074** — recepito — aggiornare un fatto duplicato in prosa nello stesso turno, in Principi di debug
- **U-075** — recepito — estesa, non sostituita, la checklist Sicurezza del design doc con il rimando a immaginai_sicurezza.md
- **U-076** — recepito — dipendenza di terze parti che blocca al caricamento del modulo, adattato a import() dinamico, in Principi di debug
- **U-081** — recepito — un tool MCP può fatturare per conto proprio, fuori dal vincolo di piano sui sotto-agenti, in Gestione modello
- **U-086** — già presente — nato in questo stesso progetto in S31, bullet "controllo automatico che confronta un file con una frase esatta" in Principi di debug, qui solo taggato
- **U-088** — recepito — nome esatto del livello di impegno, in coda a "Come proporlo" in Gestione modello
- **U-090** — recepito — salvare l'ultimo modello/livello confermato da Fabio come ipotesi di partenza, in Gestione modello; omessa deliberatamente la riconciliazione con "mai fidarsi di un elenco memorizzato" del template, perché quella riga non è mai stata recepita in questo CLAUDE.md
- **U-091** — recepito — i findings di un sotto-agente vanno verificati a campione prima di essere presentati come confermati, in Principi di debug
- **U-092** — recepito — un elemento statico sostituito con innerHTML di fallback sparisce per sempre, in Regole JavaScript/Web, con ancoraggio a `#spinnerMsg`/`#spinnerBox`
- **U-093** — recepito — include per intero il bullet base "Se un passaggio di verifica non è eseguibile dallo strumento di automazione" (casi a-d), mai ricevuto prima da questo progetto: debito di baseline colmato insieme all'estensione sul caso *(d)*, confermato da Fabio separatamente prima di scriverlo
- **U-094** — recepito — bullet `.gitignore` per materiale esterno voluminoso in Principi di debug + voce nella Checklist pre-commit
- **U-097** — recepito — estensione del bullet "I findings di un sotto-agente..." su verificare anche i numeri/esempi interni ai finding riverificati, non solo la tesi principale
- **U-098** — recepito — estensione del blockquote "Proposta di audit indipendente in chiusura" in REGISTRA: il trigger scatta anche senza modifiche a codice/config se c'è una conclusione di sicurezza/escaping non riverificata
- **U-101** — recepito — estensione del bullet WebFetch/Browser pane sul caso SPA/risposta vuota che sembra un successo
- **U-102** — recepito — nuova sottosezione "Elemento UI nuovo posizionato su uno esistente assumendo esclusività per fase/stato" in Regole JavaScript/Web
- **U-103** — non pertinente — estende la sezione "Evolvere un progetto esistente in una versione online", mai ricevuta: U-027 già scartato con lo stesso motivo, "4WS è già la versione online"
- **U-104** — recepito — estesa la condizione dell'eccezione "patch nata a ridosso della chiusura" in PATCH al caso REGISTRA imminente, + frase di chiusura sul criterio unico
- **U-105** — recepito — nuovo bullet "effetto visibile solo sulle prossime scritture" in Principi di debug e architettura
- **U-106** — recepito — nuovo bullet sulla granularità di una chiave di ordinamento a data in Principi di debug e architettura
- **U-107** — recepito — nuovo bullet "cercare tutti i lettori di un dato condiviso prima di cambiarne il formato" in Principi di debug e architettura, con riferimento a `ST.currentUrl`/`ST.gallery`
- **U-108** — recepito — nuova sezione "Strumenti di design disponibili"
- **U-109** — recepito — nuova sottosezione CDN in Regole JavaScript/Web, verificato nel codice reale che `@imgly/background-removal`/`UpscalerJS` sono già pinnate a versione esatta — rischio residuo SRI-non-applicabile dichiarato esplicitamente
- **U-110** — recepito — nuovo callout "Commit/push prima della chiusura REGISTRA" in REGISTRA
- **U-111** — non pertinente — nessuna Content-Security-Policy attiva in questo progetto
- **U-112** — recepito — nuova sottosezione "Evento singolo in un callback ricorrente" in Regole JavaScript/Web
- **U-113** — recepito — nuovo periodo sul confronto reciproco degli output di sotto-agenti paralleli, in Gestione modello
- **U-114** — recepito — nuovo bullet "un'integrazione esterna che promette un effetto automatico non è detto sia istantanea" in Principi di debug e architettura
- **U-115** — recepito — nuovo paragrafo "Prima di misurare, capire la richiesta" in Gestione modello, prima dei criteri di escalation
- **U-116** — recepito — nuovo bullet "un componente riusabile va reso generico anche nei testi visibili" in Principi di debug e architettura
- **U-117** — non pertinente — nessun rimando posizionale rotto in questo progetto: i rimandi di Gestione modello qui sono già per nome, non per posizione
- **U-118** — recepito — tolto "(oggi: piano Pro)" dal paragrafo Ambito/sotto-agenti in Gestione modello, riformulato senza nomi di piano + aggiunta la verifica del piano attivo al momento dell'uso
- **U-119** — non pertinente — corregge un rimando interno al testo del template stesso, non presente in questa forma qui
- **U-120** — già conforme — verificato: nessun rimando a "R21 in Documenti e Ricerche" nel paragrafo "Dopo un'escalation confermata"
- **U-124** — non pertinente — sei correzioni interne di rimandi/soglie del testo del template APP: verificato che nessuno dei 6 punti esiste in questa forma nel CLAUDE.md di questo progetto, es. nessuno script pre-commit configurato qui
- **U-128** — recepito — precisata l'ultima frase di "Come proporlo" in Gestione modello: "avviabile sul modello base" vale solo per il lavoro che non dipende dalla decisione
- **U-129** — recepito — corretta la frase sul campo AMBITO: da "non dipende dallo stack o dal dominio" a "non dipende dal dominio", con la clausola che una lezione legata allo stack va comunque marcata e finisce nella sezione Pattern per stack/Regole JavaScript-Web
- **U-135** — recepito — nuovo bullet "verificare nel codice reale prima di giudicare un travaso non pertinente" in Principi di debug e architettura, con verifica concreta sulle librerie CDN del progetto
- **U-136** — non pertinente — la sezione "Struttura file progetto" esiste in questo CLAUDE.md, ma senza la scelta esplicita fra archetipi A/B/C a cui U-136 si aggancia, mai ricevuta
- **U-137** — non pertinente — solo nascita progetto
- **U-138** — recepito — nuovo riferimento proposto `docs/immaginai_configurazione.md` in "File di riferimento", file non ancora creato — da confermare con Fabio prima di crearlo davvero
- **U-139** — recepito — nuova sottosezione "Lookup su un oggetto-dizionario" in Regole JavaScript/Web
- **U-140** — pertinente, rischio basso e accettato — non un caso server, ma `ST.gallery` in localStorage: due schede del browser aperte sullo stesso progetto possono sovrascriversi a vicenda leggendo/riscrivendo per intero `ig_gallery`; non un pattern read-modify-write coperto dal travaso in senso stretto, ma la stessa famiglia di rischio — annotato, non corretto in questa sessione
- **U-141** — recepito — estensione di RIEPILOGO sulla portata del glob e sui `.md` non tracciati, applicata al caso reale osservato in questa stessa sessione — `docs/AUDIT_sicurezza_fable_2026-09-18.md` risultava `??` in `git status`
- **U-142** — non pertinente — nessun comando di sistema eseguito lato server
- **U-145** — non pertinente per ora — nessun hook locale di progetto con `${CLAUDE_PROJECT_DIR}` configurato in questo CLAUDE.md
- **U-149** — recepito — estensione del blockquote "Proposta di audit indipendente in chiusura": il passo si dichiara sempre, anche "nessun audit necessario"
- **U-150** — recepito — nuova riga "Audit indipendente di chiusura" nella tabella Checklist obbligatoria REGISTRA
- **U-154** — recepito — nuovo periodo "sola critica vs ibrido" per gli audit tramite sotto-agente, in Gestione modello
- **U-155** — recepito — nuovo bullet sulla riverifica con ls/Glob di una riga di stato su una cartella esterna (`patch/_inbox/`), in Principi di debug e architettura
- **U-156** — non pertinente — sezione "Come nasce un modulo satellite" mai ricevuta
- **U-157** — recepito — estensione del bullet U-155: grep sul nome della cartella esterna in tutti i `.md` del progetto
- **U-158** — recepito — corretto il bullet "sola lettura" in Gestione modello: un `subagent_type` "di sola ricerca" può avere comunque una shell
- **U-159** — non pertinente — stessa sezione di U-156, mai ricevuta
- **U-160** — recepito — nuovo bullet "prompt d'incarico" in Principi di debug e architettura
- **U-130** — recepito — colmato insieme il debito di baseline delle Meta-regole E/F, mai ricevute prima da questo progetto, confermato da Fabio prima di scriverle; Meta-regola F scritta direttamente con la soglia relativa già corretta da U-130, adattata al fatto che questo progetto non ha una "lunghezza di nascita dal template" in senso stretto — vedi il blockquote "Soglia d'allarme, non limite" in Meta-regola F
- **U-148** — recepito — aggiunto il bullet base "affermazione numerica verificabile" in Principi di debug e architettura, debito di baseline colmato insieme all'estensione, confermato da Fabio
- **U-133** — recepito, Sessione 35 — con due adattamenti dichiarati rispetto al testo del registro: **(a)** i due paragrafi "PRIMA di formalizzare una decisione nei `.md`"/"PRIMA di valutare opzioni in chat" in *Gestione modello* erano un debito di baseline mai ricevuto da questo progetto — non solo riorganizzazione ma contenuto nuovo scritto ex novo nello stile del progetto, confermato da Fabio prima di scriverlo; **(b)** i 38 bullet di *Principi di debug e architettura* non erano già contigui per famiglia come nel template APP (verificato mappandoli uno per uno) — su decisione esplicita di Fabio, riordinati nelle 10 famiglie invece di limitarsi ad aggiungere sottotitoli sul posto. Audit indipendente pre-scrittura (Opus 5, 1 istanza, sola critica) ha trovato un rimando rimasto rotto dalla classificazione iniziale del bullet "Verificare l'API di una dipendenza... I/O bloccante al caricamento del modulo" (assegnato a *Integrazioni e dipendenze esterne* invece che ad *Attese, readiness e blocchi* come nel template) — corretto spostandolo, tutto il resto confermato senza problemi

## Parte B — Blocco `Stato attuale` com'era

Nessun blocco da spostare: il `CLAUDE.md` di questo progetto non ha mai avuto una sezione `Stato attuale` (lo stato vive tutto in `docs/immaginai_stato.md`). Misurato il 05/10/2026: 0 byte.

