# ImmaginAI — Test Manuale
> File persistente, non un report di una sessione. Aggiornarlo (aggiungere/togliere prove) ogni volta che cambia un comportamento visibile dell'app — non lasciarlo decadere. Organizzato per area funzionale, non per sessione: segui l'ordine mentre usi l'app dal vivo.
>
> Per ogni prova: **Come** (cosa fare) → **Risposta attesa** (cosa deve succedere). Se qualcosa non corrisponde, segnalalo così com'è — non serve capire la causa, basta il sintomo.

App pubblica: https://wonderspit-ai.netlify.app/
Admin: long press 3s sul logo (desktop o mobile) → apre `immaginai_admin.html` in nuova scheda. Login: `WONDERSPIT` / `369852147`.

---

## 1. Generazione base

1. **Come:** apri l'app, scrivi un prompt semplice (es. "un gatto arancione"), premi "✨ Genera immagine".
   **Risposta attesa:** appare uno spinner con testo "Generando…" seguito da "Pollinations FLUX — gratis". Entro 15-30s appare l'immagine. Sotto compaiono 3 bottoni: "⬇ Scarica", "🔁 Rigenera", "✏️ Modifica", più la card "Usa nel Designer →".
2. **Come:** premi "Genera" senza scrivere nulla nel prompt.
   **Risposta attesa:** il box del prompt si colora di rosso (bordo) e appare il messaggio "⚠ Scrivi cosa vuoi vedere!" sotto il box. Nessuna generazione parte.
3. **Come:** premi il dado 🎲 accanto al prompt.
   **Risposta attesa:** il prompt si riempie con un'idea casuale in italiano, e se l'idea ha uno stile associato, il bottone stile corrispondente si attiva.
4. **Come:** genera un'immagine, poi entro 16 secondi premi di nuovo "Genera".
   **Risposta attesa:** appare una barra rosa "⏳ Attendi Xs…" che si svuota, e la nuova generazione parte solo dopo che il cooldown è scaduto — non prima.

## 2. Dettagli visivi, stile, formato

5. **Come:** apri una categoria di Dettagli visivi (es. "Luce"), clicca un paio di chip (es. "Luce cinema", "Neon").
   **Risposta attesa:** i chip cliccati diventano viola pieno con testo bianco (S29 — prima erano ciano). In alto compare il badge "✓ Attivi 2", anch'esso viola.
6. **Come:** clicca il badge "✓ Attivi".
   **Risposta attesa:** la vista cambia mostrando solo i tag selezionati, ciascuno con una ✕ per rimuoverlo. Rimuovendone uno il contatore scende.
7. **Come:** seleziona uno Stile artistico (es. "Anime") e un Formato (es. "16:9"), poi genera.
   **Risposta attesa:** l'immagine generata rispetta approssimativamente lo stile scelto e ha proporzioni coerenti col formato (panoramica per 16:9).
8. **Come:** apri "✕ Cosa non vuoi", scrivi qualcosa (es. "sfondo confuso"), genera.
   **Risposta attesa:** il pannello si apre con un placeholder di esempio; la generazione parte normalmente (l'effetto sul risultato non è verificabile a occhio in modo affidabile, ma non deve dare errori).
9. **Come (S29 — comportamento cambiato):** attiva "✂️ Senza sfondo" (il bottone diventa pieno/evidenziato con la spunta), poi genera.
   **Risposta attesa:** dopo che l'immagine è pronta, parte **in automatico** anche la vera rimozione sfondo (stesso messaggio "Rimozione sfondo in corso…" del bottone "🪄 Sfondo") e si apre l'overlay di confronto Precedente/Nuova — devi comunque premere "✓ Tieni questa" o "↩ Torna alla precedente" per decidere. Non è più solo un suggerimento testuale al prompt: il file finale ha davvero lo sfondo trasparente se tieni il risultato.

## 3. Modifica (S30: un solo bottone, tetto di 3 modifiche per immagine — verifica anche il retry)

10. **Come:** dopo aver generato un'immagine, premi "✏️ Modifica", scrivi un'aggiunta (es. "aggiungi un cappello"), premi il bottone "✨ Modifica (3 rimaste)".
    **Risposta attesa:** appare un overlay a confronto: "Precedente" a sinistra, "Nuova" a destra. In basso 2 bottoni: "↩ Torna alla precedente" e "✓ Tieni questa". Dopo aver riaperto il pannello, il bottone mostra "✨ Modifica (2 rimaste)".
10bis. **Come:** ripeti la modifica altre 2 volte sulla stessa immagine (senza generarne una nuova).
    **Risposta attesa:** dopo la terza modifica il bottone mostra "Limite modifiche raggiunto" ed è disattivato — un quarto tentativo non parte, appare un avviso "Hai raggiunto il limite di 3 modifiche per questa immagine". Generando una nuova immagine (Genera o Rigenera) il contatore torna a "3 rimaste".
11. **Come:** nell'overlay di confronto, premi "✓ Tieni questa".
    **Risposta attesa:** l'overlay si chiude, l'immagine nuova resta visibile, viene aggiunta in Galleria con il prompt completo (base + aggiunta).
12. **Come:** ripeti la modifica ma questa volta premi "↩ Torna alla precedente".
    **Risposta attesa:** l'overlay si chiude, torna visibile l'immagine di prima (non quella appena generata), che NON viene aggiunta in Galleria.
13. **Come (retry mirato):** apri gli strumenti sviluppatore del browser (F12 → Console) — non è necessario per l'uso normale, solo per questa prova — e disattiva temporaneamente il WiFi/dati subito dopo aver premuto "✨ Modifica", così da forzare un errore.
    **Risposta attesa:** appare il box "⚠️ GENERAZIONE FALLITA" con un bottone "🔄 RIPROVA". Riattiva la connessione e premi Riprova: **deve ripartire la Modifica** (stesso prompt base + la tua aggiunta), non un Genera da zero col prompt box vuoto.

## 4. Rigenera

14. **Come:** dopo aver generato un'immagine, premi "🔁 Rigenera".
    **Risposta attesa:** parte una nuova generazione con lo stesso prompt/stile/formato di prima (rispetta il cooldown se applicabile), sostituisce l'immagine mostrata e la aggiunge in Galleria come voce separata.
15. **Come (retry mirato, come al punto 13):** forza un errore durante un Rigenera, poi premi Riprova dopo aver ripristinato la connessione.
    **Risposta attesa:** riparte un Rigenera (stesso prompt/stile salvati), non un Genera dal prompt box.

## 5. Galleria

16. **Come:** vai sulla tab Galleria dopo aver generato almeno 2-3 immagini.
    **Risposta attesa:** il contatore mostra "X / 12 immagini — le più vecchie vengono rimosse automaticamente". Ogni card mostra l'immagine, il prompt (troncato), e 3 bottoni: ⬇ (scarica), ↺ Riusa, 🗑 (elimina).
17. **Come:** premi "↺ Riusa" su un'immagine della galleria.
    **Risposta attesa:** torni sulla tab Crea, il prompt e lo stile di quella voce vengono ripristinati nei rispettivi campi.
18. **Come:** premi 🗑 su una voce.
    **Risposta attesa:** la voce sparisce dalla galleria, il contatore scende di uno.
19. **Come:** genera più di 12 immagini in totale nella stessa sessione browser.
    **Risposta attesa:** la galleria non supera mai 12 voci — la più vecchia sparisce automaticamente ad ogni nuova aggiunta.

## 6. Download

20. **Come:** dopo una generazione, premi "⬇ Scarica".
    **Risposta attesa:** il browser scarica un file immagine (`WS-immagine.png` o `.jpg`/`.webp` a seconda del provider) — nessun hang, nessun errore in console.
21. **Come:** clicca l'immagine generata per aprirla a schermo intero (modale), poi premi "⬇ Scarica" nel modale.
    **Risposta attesa:** stesso comportamento del punto 20, dal modale.

## 7. FAQ

22. **Come:** vai sulla tab FAQ, clicca una domanda.
    **Risposta attesa:** la risposta si espande sotto la domanda con un'icona che ruota (+ diventa ✕ inclinata). Cliccando un'altra domanda nella stessa categoria, la precedente si chiude.
23. **Come:** confronta il numero di domande visibili qui con quelle nell'admin (tab FAQ).
    **Risposta attesa:** devono coincidere (a meno di FAQ disattivate volontariamente dall'admin).

## 8. Sicurezza — escape XSS (prova rapida, non serve competenza tecnica)

24. **Come:** genera un'immagine con un prompt che contiene `<img src=x onerror=alert(1)>` come testo.
    **Risposta attesa:** il prompt appare come **testo normale** nella didascalia della galleria (incluse le parentesi angolari) — **nessun popup/alert deve comparire**.
25. **Come (admin):** in una categoria di Tag visivi, admin → Tag visivi, prova a rinominare una categoria con lo stesso payload `<img src=x onerror=alert(1)>`.
    **Risposta attesa:** nessun popup, il testo resta visibile come stringa nel campo/nella lista, il markup della pagina non si rompe.

## 9. Admin — Colori (S26)

26. **Come:** admin → tab Colori. Guarda i valori di default dei 3 color-picker (senza aver mai salvato nulla prima).
    **Risposta attesa:** "Accento principale" e "Viola/Primario" sono **viola** (`#5B35C8`), "Accento secondario" è **viola scuro** (`#3D2F8F`) — non più navy/teal.
27. **Come:** guarda le sub-label sotto ai 3 campi.
    **Risposta attesa:** descrivono cosa controllano davvero: "Viola, stato/spinner/CTA" per il principale, "estremo dei gradienti" per il secondario, "Bordi/sfondi attivi" per Viola/Primario.
28. **Come:** apri il menu "Palette Brand Kit" in cima alla tab Colori.
    **Risposta attesa:** la prima voce si chiama "ImmaginAI (default)" (non più "Designer (default)") ed è viola/viola scuro. Più sotto resta selezionabile "Teal + Navy (Designer, storico)" con i vecchi colori — quella è intenzionale, non un errore.
29. **Come:** cambia un colore, premi "💾 Salva colori", poi apri l'app pubblica in un'altra scheda (stesso browser).
    **Risposta attesa:** il colore scelto si riflette davvero sull'app (statusBar, spinner, CTA) — verifica che non sia più coerente col vecchio default se lo hai cambiato.

## 10. Admin — altre tab (giro veloce)

30. **Come:** admin → tab Tema.
    **Risposta attesa:** l'unica opzione selezionabile è "☀️ Light" (niente Dark).
31. **Come:** admin → tab API.
    **Risposta attesa:** Pollinations è marcato "✓ PRIMARIO", Cloudflare come fallback, Together.ai "(disattivato)", Stable Horde come ultimo fallback — nessun riferimento a HuggingFace.
32. **Come:** admin → tab Stili AI / Tag visivi / FAQ — prova ad attivare/disattivare un elemento col toggle, poi salva.
    **Risposta attesa:** il toggle cambia visivamente stato subito; dopo "Salva", ricaricando la pagina admin lo stato resta quello salvato (non torna al default).
33. **Come:** admin → tab Utenti — prova ad aggiungere un utente con password di 3 caratteri.
    **Risposta attesa:** appare un alert che richiede almeno 6 caratteri, l'utente non viene aggiunto.

## 11. Mobile / responsive

34. **Come:** apri l'app su un telefono reale (o riduci la finestra del browser sotto ~768px di larghezza).
    **Risposta attesa:** sparisce la sidebar laterale, compare l'header in alto col logo e la barra di navigazione in basso (Crea/Galleria/FAQ). Il bottone Genera è in-flow sotto i controlli, grande e ben visibile.
35. **Come:** su mobile, genera un'immagine, poi ruota il telefono o richiama la tastiera (es. toccando un campo di testo) e richiudila.
    **Risposta attesa:** l'immagine generata resta visibile a schermo intero (overlay), non deve sparire né rompersi per un semplice cambio di altezza della viewport.
36. **Come:** su mobile, genera un'immagine e forza un errore di quota o di rete (difficile da simulare manualmente — se capita spontaneamente, verificalo).
    **Risposta attesa:** un eventuale avviso (statusBar) deve comparire ben visibile in alto, non nascosto dietro l'immagine.

## 12. Rimozione sfondo vera (S28, modello aggiornato in S29)

37. **Come:** dopo una generazione, premi "🪄 Sfondo" nella riga di bottoni sotto l'anteprima.
    **Risposta attesa:** appare un messaggio "Rimozione sfondo in corso… (al primo utilizzo scarica ~80MB, poi resta in cache)" (S29 — prima ~40MB, ora un modello più preciso), il bottone mostra "⏳ Elaboro…" e gli altri bottoni della riga si disattivano. Al primo utilizzo l'attesa può essere di qualche decina di secondi in più rispetto a prima (download del modello più pesante); le volte successive è molto più veloce (modello in cache del browser).
38. **Come:** dopo l'elaborazione, guarda l'overlay di confronto che appare (stesso stile di "Modifica precisa").
    **Risposta attesa:** a sinistra "Precedente" (l'immagine originale), a destra "Nuova" (con lo sfondo rimosso — visibile come area vuota/trasparente, che nell'anteprima del browser appare bianca o a scacchiera a seconda del tema). Premi "✓ Tieni questa": l'immagine con sfondo rimosso sostituisce quella corrente e viene aggiunta in Galleria con didascalia "...sfondo rimosso (elaborazione locale)".
39. **Come:** ripeti il punto 37 ma questa volta premi "↩ Torna alla precedente".
    **Risposta attesa:** torna visibile l'immagine originale (con sfondo), che NON viene aggiunta in Galleria — identico comportamento a "Modifica precisa".
40. **Come (S29 — bug corretto, verifica che non sia tornato):** dopo aver premuto "✓ Tieni questa" al punto 38 (o "↩ Torna alla precedente" al punto 39), controlla i 4 bottoni sotto l'immagine (Scarica/Rigenera/Modifica/Sfondo).
    **Risposta attesa:** sono tutti cliccabili normalmente, non grigi/disattivati. (Prima di S29 restavano bloccati per sempre dopo un "Tieni questa" riuscito.)

## 13. Dettagli visivi — tab a scorrimento (S29)

41. **Come:** su schermo stretto (mobile, o finestra ridotta sotto ~500px), guarda la riga di tab principali di Dettagli visivi (Luce, Colore, Sfondo, Qualità, Prospettiva, Atmosfera).
    **Risposta attesa:** stanno tutte su una riga sola (non vanno a capo su più righe), con una freccia "›" sul bordo destro per scorrere.
42. **Come:** premi la freccia "›" ripetutamente fino in fondo, poi la freccia "‹" per tornare indietro.
    **Risposta attesa:** la riga scorre orizzontalmente mostrando le categorie nascoste; la freccia destra sparisce quando non c'è più nulla a destra da mostrare, la sinistra sparisce quando sei tornato all'inizio. I chip dentro una categoria (es. "Luce cinema", "Ora dorata"...) restano invece a capo su più righe come sempre, non scorrono.

---

## Come segnalare un problema trovato

Per ogni prova che non dà il risultato atteso, segnala: **numero della prova**, cosa hai fatto di diverso (se non hai seguito i passi alla lettera), cosa è successo davvero invece del risultato atteso, e se possibile uno screenshot. Non serve altro — la diagnosi la facciamo insieme in sessione.
