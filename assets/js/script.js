/*
REGOLE
- Le risposte vanno scritte in JavaScript sotto questi commenti.
- Pattern fondamentale: stato -> render() -> eventi.
  Tutto cio' che vedi a schermo dipende dallo stato.
  Gli eventi modificano lo stato e poi chiamano render().
- Apri index.html nel browser. Apri la console (DevTools) per gli errori.
- Cerca su MDN solo i concetti dichiarati come "cerca tu":
  localStorage, Blob/URL.createObjectURL, FileReader.
  Tutto il resto e' stato visto in settimana.
- Niente AI per generare codice. Niente template scaricati.
*/

/* STATO
   In cima al file definisci poche variabili globali:
   - un array di oggetti come dato principale (es. libri, ricette, film, ...)
   - una variabile per il filtro corrente
   - una variabile per l'ordinamento corrente
   - una variabile per la stringa di ricerca corrente
*/

/* SCRIVI QUI LA TUA RISPOSTA */
let ricette = [
  { id: 1, combinazione: "Riso + Lenticchie", categoria: "Proteine", score: 95, validato: true },
  { id: 2, combinazione: "Cavolo nero + Tahina", categoria: "Calcio", score: 75, validato: false },
  { id: 3, combinazione: "Quinoa + Fagioli Neri", categoria: "Proteine", score: 90, validato: true },
  { id: 4, combinazione: "Mandorle + Yogurt", categoria: "Calcio", score: 60, validato: false },
  { id: 5, combinazione: "Tofu + Broccoli", categoria: "Ferro", score: 88, validato: true },
  { id: 6, combinazione: "Hummus + Pane Int.", categoria: "Proteine", score: 80, validato: false },
  { id: 7, combinazione: "Semi di Chia + Latte Avena", categoria: "Calcio", score: 92, validato: true },
  { id: 8, combinazione: "Noci + Mela", categoria: "Ferro", score: 70, validato: false },
  { id: 9, combinazione: "Avocado + Pane Segale", categoria: "Proteine", score: 96, validato: true },
  { id: 10, combinazione: "Ceci + Spinaci", categoria: "Ferro", score: 85, validato: false },
  { id: 11, combinazione: "Piselli + Riso", categoria: "Proteine", score: 89, validato: true },
  { id: 12, combinazione: "Tempeh + Asparagi", categoria: "Proteine", score: 82, validato: false },
  { id: 13, combinazione: "Avena + Frutti di Bosco", categoria: "Ferro", score: 94, validato: true },
  { id: 14, combinazione: "Burro Arachidi + Banana", categoria: "Proteine", score: 78, validato: false },
  { id: 15, combinazione: "Edamame + Riso", categoria: "Proteine", score: 91, validato: true },
  { id: 16, combinazione: "Patate + Hummus", categoria: "Calcio", score: 74, validato: false },
  { id: 17, combinazione: "Zucca + Semi Girasole", categoria: "Ferro", score: 86, validato: true },
  { id: 18, combinazione: "Fagioli Azuki + Riso", categoria: "Proteine", score: 87, validato: false },
  { id: 19, combinazione: "Seitan + Broccoli", categoria: "Proteine", score: 90, validato: true },
  { id: 20, combinazione: "Lenticchie + Carote", categoria: "Ferro", score: 83, validato: false }
];
let isDarkMode = false;

/* RENDER()
   Una sola funzione che ridipinge la lista. A ogni chiamata:
   1) parte dall'array completo,
   2) filtra,
   3) ordina,
   4) svuota il container DOM,
   5) ricrea gli elementi DOM per gli oggetti risultanti.
   Aggiorna anche conteggi e statistiche.
   Salva lo stato in localStorage in fondo a render() (cerca tu come funziona).
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function render() {
  const container = document.getElementById("lista-laboratorio");
  const ricerca = document.getElementById("input-ricerca").value.toLowerCase();
  const filtroStato = document.getElementById("filtro-stato").value;
  const ordine = document.getElementById("ordine-selezionato").value;

  let visualizzati = ricette.filter(item => {
    const matchRicerca = item.combinazione.toLowerCase().includes(ricerca) || item.categoria.toLowerCase().includes(ricerca);
    const matchStato = filtroStato === "tutti" ? true : (filtroStato === "validato" ? item.validato : !item.validato);
    return matchRicerca && matchStato;
  });

  if (ordine === "score-crescente") visualizzati.sort((a, b) => a.score - b.score);
  else if (ordine === "score-decrescente") visualizzati.sort((a, b) => b.score - a.score);
  else if (ordine === "alpha-az") visualizzati.sort((a, b) => a.combinazione.localeCompare(b.combinazione));
  else if (ordine === "alpha-za") visualizzati.sort((a, b) => b.combinazione.localeCompare(a.combinazione));

  container.innerHTML = "";

  visualizzati.forEach(item => {
    const li = document.createElement("li");
    li.className = `lab-item ${item.validato ? "validato" : "da-validare"}`;
    li.innerHTML = `
      <span class="testo-alimento">${item.combinazione}</span>
      <span class="dettaglio-alimento">${item.categoria} — Score: ${item.score}</span>
      <div class="gruppo-pulsanti">
        <button class="${item.validato ? "btn-stato-visitato" : "btn-stato-da-validare"}" data-id="${item.id}" data-action="toggle">
          ${item.validato ? "Validato" : "Da validare"}
        </button>
        <button class="btn-modifica" data-id="${item.id}" data-action="modifica">Modifica</button>
        <button class="btn-elimina" data-id="${item.id}" data-action="elimina">Elimina</button>
      </div>
    `;
    container.appendChild(li);
  });

  const tot = ricette.length;
  const validati = ricette.filter(i => i.validato).length;
  document.getElementById("stat-totale").textContent = tot;
  document.getElementById("stat-visitati").textContent = validati;
  document.getElementById("stat-da-visitare").textContent = tot - validati;
  document.getElementById("barra-riempimento").style.width = tot > 0 ? (validati / tot) * 100 + "%" : "0%";
}

/* FORM CON VALIDAZIONE
   addEventListener("submit") sul form.
   event.preventDefault().
   Leggi i valori con .value.trim().
   Se uno dei campi obbligatori e' vuoto, mostra errore e return.
   Altrimenti push allo stato, form.reset(), render().
   Id univoco con Date.now().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("form-combinazione").addEventListener("submit", (e) => {
  e.preventDefault();
  const comb = document.getElementById("input-combinazione").value.trim();
  const cat = document.getElementById("input-categoria").value;
  const score = parseInt(document.getElementById("input-score").value);
  const stato = document.getElementById("select-stato").value === "true";

  if (!comb || isNaN(score)) {
    mostraNotifica("Errore: compila i campi correttamente!");
    return;
  }

  ricette.push({ id: Date.now(), combinazione: comb, categoria: cat, score, validato: stato });
  e.target.reset();
  render();
  mostraNotifica("Combinazione aggiunta");
});

/* INTERAZIONI BASE — eliminare, modificare, contare
   - Elimina: filter per id, render(). Event delegation sul container.
   - Modifica in-place: button "Modifica". Al click il testo diventa <input>,
     si conferma con Invio o blur.
   - Conteggi dinamici dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("lista-laboratorio").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const item = ricette.find(i => i.id === id);

  if (action === "elimina") {
    ricette = ricette.filter(i => i.id !== id);
    render();
    mostraNotifica("Elemento eliminato");
  } else if (action === "toggle") {
    item.validato = !item.validato;
    render();
  } else if (action === "modifica") {
    avviaModifica(item, btn.closest("li"));
  }
});

/* RICERCA, FILTRO, ORDINAMENTO
   - Ricerca live: <input> con event "input". Salva in stato e render().
   - Filtro: <select> con event "change". Salva in stato e render().
   - Ordinamento: due button (o select). Salva in stato e render().
   I tre si compongono dentro render() in fila.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("input-ricerca").oninput = render;
document.getElementById("filtro-stato").onchange = render;
document.getElementById("ordine-selezionato").onchange = render;

/* NOTIFICHE TEMPORANEE
   Funzione notifica(testo) che imposta il testo del <div id="notifica">,
   lo mostra (display: block), poi dopo 3000ms (setTimeout) lo nasconde.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function mostraNotifica(testo) {
  const notifica = document.getElementById("notifica");
  notifica.textContent = testo;
  notifica.style.display = "block";
  setTimeout(() => notifica.style.display = "none", 2000);
}

/* TEMA CHIARO/SCURO
   Un button che chiama document.body.classList.toggle("dark").
   In CSS scrivi le regole opposte (es. body.dark { background: #111; ... }).
*/

/* SCRIVI QUI LA TUA RISPOSTA */
document.getElementById("btn-tema").onclick = () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode", isDarkMode);
};

/* PERSISTENZA — localStorage (cerca tu su MDN)
   - In fondo a render(), salva lo stato:
       localStorage.setItem("dati", JSON.stringify(stato));
   - All'avvio, prima della prima render(), carica:
       const salvato = localStorage.getItem("dati");
       if (salvato) stato = JSON.parse(salvato);
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* RIORDINO ↑ ↓
   Due button su ogni elemento. Click su ↑ scambia con il precedente nell'array,
   ↓ con il successivo. Event delegation. Poi render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* ESPORTAZIONE / IMPORTAZIONE JSON (cerca tu su MDN)
   - Esporta: crea un Blob con JSON.stringify(stato), genera un URL con
     URL.createObjectURL e simula il click su un <a download>.
   - Importa: <input type="file"> + FileReader per leggere il contenuto come
     teosto, JSON.parse, sostituisci lo stato, render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* STATISTICHE GRAFICHE
   Almeno due indicatori: contatori grandi e/o barre orizzontali
   (<div> con width: X% in base al dato). Aggiorna dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* MULTI-VISTA — lista / card / tabella
   Una variabile globale "vista" che render() legge per decidere quale HTML
   produrre. Tre button cambiano "vista" e chiamano render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

/* CATEGORIE
   Aggiungi un campo categoria nello schema. Nel form un <select> per sceglierla.
   In render(), raggruppa con reduce in { categoria: [elementi] } e disegna un
   header per categoria con sotto la lista di quella categoria.
*/

/* SCRIVI QUI LA TUA RISPOSTA */
function avviaModifica(item, li) {
  const span = li.querySelector(".testo-alimento");
  const input = document.createElement("input");
  input.className = "input-modifica";
  input.value = item.combinazione;
  input.style.width = "100%";
 
  const salva = () => {
    item.combinazione = input.value;
    render();
    mostraNotifica("Elemento aggiornato");
  };

  input.onblur = salva;
  input.onkeydown = (e) => { if (e.key === "Enter") salva(); };
 
  span.replaceWith(input);
  input.focus();
}

render();