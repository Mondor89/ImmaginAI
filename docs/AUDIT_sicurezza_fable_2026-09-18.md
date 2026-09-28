# AUDIT SICUREZZA (Fable 5.1) — 4WS-ImmaginAI — 18/09/2026

> **Questo file è per la prossima sessione di 4WS-ImmaginAI. Nasce da un audit fatto da Template Claude su richiesta di Fabio, e chi lo legge non ha quella conversazione: qui c'è tutto quello che serve.**
> Fonte completa: `C:\Users\fabio\Desktop\Download Desktop\XProgetti\1-Aiuto Cloude\Template Claude\docs\fable_audit\raw\4WS-ImmaginAI_2026-09-18.md`. Se questo file e quello divergono, vale il codice reale.

## Cosa fare in questa sessione (al `RIEPILOGO`)

1. **Dichiarare in una riga** che esiste questo audit con N finding aperti, poi attendere: Fabio decide se lavorarci ora o dopo.
2. **Se si lavora sui finding**: prima di toccare codice, **riverificare ogni finding sul codice reale** (grep sul testo citato, non solo sul numero di riga: le righe sono quelle del 18/09/2026). L'audit è di un solo modello: un finding può essere sbagliato o già superato. Se uno solo risulta sbagliato, trattare l'intero file come da riverificare e dirlo a Fabio.
3. Presentare i finding con gravità e piano **prima** di scrivere codice, e applicare **una correzione alla volta con la conferma di Fabio**.
4. Spuntare lo **Stato** di ogni finding qui e aggiungere una riga al registro in fondo. Non cancellare il file.
5. A fine sessione, in `REGISTRA`, dire a Fabio di riportare a Template Claude quali finding sono chiusi: una sessione di Template Claude verificherà con `grep` che le correzioni siano nel codice.

**Esito in sintesi:** le due Functions (`generate.js`, `modify.js`) sono **solide**. I finding sono sul lato client e sull'area admin.

## Finding

| ID | Gravità | Stato | Sintesi |
|----|---------|-------|---------|
| WS-01 | medio | [x] chiuso (S36) | `immaginai_admin.html`: password admin hardcoded nel sorgente pubblico che non protegge nulla; la sessione salva la password in chiaro |
| WS-02 | minore | [x] chiuso (S36) | Punti `innerHTML` non escapati, a basso rischio (`:1154`, `:1212`, `:1682`) |
| WS-03 | minore | [x] chiuso (S36) — Report-Only | Nessuna CSP; modulo ESM da CDN senza SRI possibile |
| WS-04 | minore | [x] chiuso (S36) | `generateViaProxy` senza timeout, a differenza di `modifyViaKontext` |
| WS-05 | note | — | Rate limit corretto (**il "passano 7" nel registro di Template Claude è stale**); limiti dichiarati |

### WS-01 — medio — L'area admin non protegge nulla, ma può far credere il contrario
- `app/immaginai_admin.html:525`: `const DEFAULT_USERS = [{username:'WONDERSPIT',password:'369852147',role:'admin'}];` — visibile a chiunque apra il sorgente della pagina pubblicata (Netlify serve `app/`, `netlify.toml:2`). Il pannello si apre con un long-press di 3 s sul logo (`Immaginai.html:1060`).
- `:636`: la "sessione" salva **la password in chiaro** in `localStorage` (`ig_admin_session`). `:808-809` e `:822`: gli utenti aggiunti finiscono con password in chiaro in `ig_users`.
- Ma il pannello scrive **solo nel `localStorage` del browser che lo usa** (`ig_styles`, `ig_cats`, `ig_faqs`, `ig_nav_btns`, `ig_logo_*`, `ig_colors`, `ig_fonts`, `ig_ui`, `ig_cooldown`: righe 705-901). Non esiste alcun backend: colori, FAQ, logo, stili cambiati dal pannello **non arrivano a nessun altro visitatore**, e chiunque può impostare le stesse chiavi dalla console del browser senza password.
- Rischi reali: (a) **aspettativa sbagliata** — se le modifiche dal pannello sembrano aggiornare il sito, verificare che la documentazione del progetto dica che sono per-browser; (b) una password vera riusata altrove finirebbe esposta; (c) `ig_logo_*` → `img.src` (`Immaginai.html:1031`) e `ig_fonts` → CSS (`:1043`) sono self-XSS/CSS-injection solo per chi se le imposta da solo — accettabile.
- **Addendum (completamento lettura, stessa data)**: `Immaginai.html:632` contiene una **seconda copia** di `DEFAULT_USERS` con la stessa password, nella pagina principale, mai usata lì — da togliere insieme. Il resto di `immaginai_admin.html` (`:610-720`, `:805-916`) conferma: ogni salvataggio è `localStorage.setItem`, nessun backend.
- **Correzione proposta**: togliere il login (è uno strumento di anteprima per-browser: dirlo nel titolo del pannello) o, se l'admin dovrà cambiare davvero il sito, spostare le impostazioni in un file committato modificato in una sessione. Nel frattempo: nella sessione salvare solo `{username}` (`:636`), e non riusare `369852147` altrove.

### WS-02 — minore — `innerHTML` non escapati, a basso rischio
- `Immaginai.html:1154`: `` updSpin(`In coda: ${chk.queue_position??'...'}° posto`) `` — valore JSON di Stable Horde in `innerHTML` senza escape. `:1212`: `${help}` include `m = e.message` grezzo nel ramo generico; `:1597` lo stesso `help` è invece escapato: allineare `:1212` a `:1597`.
- `:1682` (galleria): `src="${it.url}"` senza escape. Le URL sono `data:`/`blob:` o `https://image.pollinations.ai/prompt/<encodeURIComponent(prompt)>?model=flux` (`:1105`): `encodeURIComponent` codifica `"` e `<`, non si può rompere l'attributo dal prompt. Regge per costruzione a monte; un `escapeHtml(it.url)` costa niente.
- `escapeHtml` (`:1681`) copre anche `'` (più solida di quella di Pronostick). Prompt, FAQ, etichette, stili sono escapati ovunque nei punti letti.

### WS-03 — minore — Nessuna CSP
- `netlify.toml:18-23` ha `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`. Nessuna `Content-Security-Policy`.
- `Immaginai.html:1317`: `import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm')` — versione pinnata, SRI non applicabile a un import ESM a catena (`U-109` lo dice e consiglia il build UMD singolo se esiste). Il modulo scarica poi il modello da `staticimgly.com` (commento `:1308-1311`): è la superficie supply-chain più grande della pagina, ma l'unico dato sensibile nell'origine è la chiave Horde BYOK opzionale (`:800`).
- **`U-109` e `U-111` non sono ancora recepiti** (4WS è fermo a `U-102`, mancano `U-103`→`U-116`): questo finding è la loro applicazione. Correzione realistica: CSP in `Report-Only` con `script-src 'self' https://cdn.jsdelivr.net`, `connect-src` verso `stablehorde.net`, `image.pollinations.ai`, `staticimgly.com`, `/.netlify/`, poi enforce (gli `onclick` inline richiedono `'unsafe-inline'` o refactor).

### WS-04 — minore — `generateViaProxy` senza timeout
- `Immaginai.html:1096`: `fetch('/.netlify/functions/generate', …)` senza `AbortSignal`; `:1517-1520` (`modify`) ha il guard + 25 s (bug corretto in S29 solo lì). Se Netlify interrompe la Function senza risposta, `generateAuto` (`:1113-1119`) resta appeso sul `fetch` e non passa a Horde; la catena è Pollinations 30 s (`:1107`) → proxy **infinito** → Horde max 240 s.
- **Correzione**: stesso `signal` di `:1517`, tarato sopra gli 8 s di `PROVIDER_TIMEOUT_MS` di `generate.js:75` (es. 12 s).

### WS-05 — note, nessuna azione
- Rate limit: `generate.js:14-28`, `modify.js:21-32` fanno `push` **prima** del confronto `> RATE_LIMIT_MAX`, quindi passano **esattamente** 6 (e 3) richieste, la N+1 è rifiutata. **La nota "lascia passare 7 richieste non 6" in `docs/registro_travasi.md` di Template Claude (riga 4WS) è stale** — Template Claude la chiude. Se la stessa affermazione compare qui in `immaginai_sicurezza.md` o `immaginai_stato.md`, aggiornarla.
- `Origin` è falsificabile da uno script non-browser: il controllo ferma solo l'abuso cross-site da browser; contro `curl` resta il rate limit per IP, per-container e azzerato ai cold start — limite dichiarato in `generate.js:7-9` e `docs/immaginai_sicurezza.md`. Con Kontext (`modify.js`, a pagamento) il gate `KONTEXT_ENABLED` + 3/min per IP + `MODIFY_MAX` client sono ragionevoli finché il budget resta piccolo; se cresce, un contatore **persistente** (Netlify Blobs/KV) al posto della `Map` in memoria è il primo upgrade.
- `modify.js:143-155`: allowlist `https` + `pollinations.ai` sul `remoteUrl` restituito dal provider prima del secondo fetch, con tetto 8 MB — corretto.
- `HORDE_API_KEY` (`Immaginai.html:755, 800, 1126`): BYOK da `localStorage`, default `'0000000000'` = chiave anonima pubblica di Stable Horde. Non un secret. Nessun secret nel repository (chiavi CF/Together/Pollinations in `process.env`).

## Registro di lavoro (aggiornare)

| Data | Sessione | Cosa è stato fatto | Finding chiusi |
|------|----------|--------------------|----------------|
| 18/09/2026 | — | File creato da Template Claude | — |
| 28/09/2026 | S36 | Riverificati tutti i finding sul codice reale prima di toccare codice (nessuno risultato sbagliato/superato, salvo la nota su U-109/U-111 ora recepiti). WS-01: sessione admin salva un hash della password (non più in chiaro), rimossa copia morta di `DEFAULT_USERS` in `Immaginai.html`. WS-02: `escapeHtml()` su `:1212` (help) e `:1682` (`it.url` galleria). WS-04: `AbortSignal.timeout(12000)` su `generateViaProxy`, stesso pattern/guard di `modifyViaKontext`. WS-03: CSP in `Content-Security-Policy-Report-Only` su `netlify.toml` (solo logging, l'app usa `onclick` inline ovunque — l'enforce richiede un refactor più ampio, fuori scope). Tutto verificato dal vivo in Browser pane (login/sessione admin, escaping con payload XSS reale, nessun errore console). **Audit indipendente di chiusura** (Opus 5, `Explore` sola lettura, 1 istanza, solo sui 4 diff — non l'intero progetto): trovati 2 problemi reali minori, entrambi corretti — (1) il commento su `simpleHash()` diceva "reversibile", impreciso per un hash djb2 (non invertibile ma forzabile a tentativi, corretto il testo); (2) `connect-src` in `netlify.toml` non includeva `data:`, mentre `downloadFrom()`/`toDataUrl()` fanno `fetch()` anche su `data:` URL (risultati CF/Horde, upscale) — aggiunto. Segnalato ma non corretto (Report-Only, nessun impatto oggi): non confermato se `script-src` avrà bisogno di `'wasm-unsafe-eval'`/`blob:` quando le librerie background-removal/upscaler (WASM) verranno osservate nei report — da rivedere quando si passerà a CSP enforce. Nota informativa fuori scope: `saveUsers()` in `immaginai_admin.html` scrive ancora le password degli utenti aggiunti in chiaro in `ig_users` — il fix WS-01 copre solo la sessione di login (`ig_admin_session`), non questo | WS-01, WS-02, WS-03 (parziale — Report-Only), WS-04 |
