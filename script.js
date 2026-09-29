document.addEventListener("DOMContentLoaded", () => {
  // --- DONNÉES DES NIVEAUX (20 niveaux : Solfège, Théorie & Technique Vocale) ---
  const levels = [
    { name: "1. Les Notes", words: ["DO", "RE", "MI", "FA", "SOL", "LA", "SI"] },
    { name: "2. Altérations", words: ["DIESE", "BEMOL", "BECARRE", "TON", "DEMITON"] },
    { name: "3. Clefs & Portée", words: ["CLEF", "PORTEE", "SOL", "FA", "UT", "LIGNE"] },
    { name: "4. Notes Rythme", words: ["RONDE", "BLANCHE", "NOIRE", "CROCHE", "DOUBLE"] },
    { name: "5. Silences", words: ["PAUSE", "SOUPIR", "DEMI", "SILENCE"] },
    { name: "6. Technique Vocale", words: ["RIFF", "RUN", "BELT", "MIX", "BELCANTO", "SOUPLE"] },
    { name: "7. Ornements Vocaux", words: ["VIBRATO", "MELISME", "SCAT", "SCOOP", "GROWL"] },
    { name: "8. Registres Vocaux", words: ["POITRINE", "TETE", "SIFFLET", "MIXTE", "TIMBRE"] },
    { name: "9. Nuances", words: ["FORTE", "PIANO", "MEZZO", "CRES", "DECRES"] },
    { name: "10. Rythme & Temps", words: ["TEMPO", "MESURE", "TEMPS", "PULSE", "TRIOLET"] },
    { name: "11. Intervalles", words: ["SECONDE", "TIERCE", "QUARTE", "QUINTE", "OCTAVE"] },
    { name: "12. Types de Voix", words: ["SOPRANO", "ALTO", "TENOR", "BASSE", "BARYTON"] },
    { name: "13. Ensemble Vocal", words: ["CHOEUR", "DUO", "TRIO", "QUATUOR", "TUTTI"] },
    { name: "14. Modes & Gammes", words: ["MAJEUR", "MINEUR", "GAMME", "MODE", "ARMURE"] },
    { name: "15. Expression", words: ["LEGATO", "STACCATO", "ACCENT", "LENTO", "VIVACE"] },
    { name: "16. Performance", words: ["JUSTE", "SOUFFLE", "POSTURE", "ATTRAQUE", "ECHAUFF"] },
    { name: "17. Harmonie Vocale", words: ["ACCORD", "TIERCE", "CANON", "VOIX", "NUANCE"] },
    { name: "18. Style & Groove", words: ["SWING", "SOUL", "JAZZ", "GOSPEL", "GROOVE"] },
    { name: "19. Diction & Texte", words: ["TEXTE", "PROSODE", "DICTION", "VOYELLE", "CONSONE"] },
    { name: "20. Virtuosité", words: ["AGILITE", "SOUFFLE", "ENVERG", "TALENT", "ARTISTE"] }
  ];

  const GRID_SIZE = 10;
  let currentLevelIndex = 0;
  let grid = [];
  let foundWords = new Set();
  let isSelecting = false;
  let selectedCells = [];

  // --- ÉLÉMENTS DU DOM ---
  const gridContainer = document.getElementById("grid-container");
  const wordsListElement = document.getElementById("words-list");
  const selectLevelElement = document.getElementById("select-level");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const levelTitleElement = document.getElementById("level-title");

  // --- INITIALISATION DES OPTIONS DE NIVEAUX ---
  levels.forEach((lvl, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = lvl.name;
    selectLevelElement.appendChild(option);
  });

  selectLevelElement.addEventListener("change", (e) => {
    currentLevelIndex = parseInt(e.target.value, 10);
    loadLevel(currentLevelIndex);
  });

  // --- MODE CLAIR / SOMBRE ---
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // --- CHARGEMENT D'UN NIVEAU ---
  function loadLevel(index) {
    foundWords.clear();
    gridContainer.innerHTML = "";
    wordsListElement.innerHTML = "";
    
    const currentLevel = levels[index];
    levelTitleElement.textContent = `KOZE MIZIK - ${currentLevel.name.split(". ")[1] || ""}`;

    const wordsToPlace = currentLevel.words.map(w => 
      w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));

    wordsToPlace.forEach(word => placeWordInGrid(word));

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === "") {
          grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = grid[r][c];
        gridContainer.appendChild(cell);
      }
    }

    wordsToPlace.forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      li.id = `word-${word}`;
      wordsListElement.appendChild(li);
    });
  }

  // --- ALGORITHME DE PLACEMENT (8 directions) ---
  function placeWordInGrid(word) {
    const directions = [
      [0, 1],   // Droite
      [1, 0],   // Bas
      [1, 1],   // Diagonale bas-droite
      [-1, 1],  // Diagonale haut-droite
      [0, -1],  // Gauche
      [-1, 0],  // Haut
      [-1, -1], // Diagonale haut-gauche
      [1, -1]   // Diagonale bas-gauche
    ];

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * GRID_SIZE);
      const startCol = Math.floor(Math.random() * GRID_SIZE);

      const endRow = startRow + dir[0] * (word.length - 1);
      const endCol = startCol + dir[1] * (word.length - 1);

      if (endRow >= 0 && endRow < GRID_SIZE && endCol >= 0 && endCol < GRID_SIZE) {
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const r = startRow + dir[0] * i;
          const c = startCol + dir[1] * i;
          if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const r = startRow + dir[0] * i;
            const c = startCol + dir[1] * i;
            grid[r][c] = word[i];
          }
          placed = true;
        }
      }
    }
  }

  // --- GESTION DE LA SÉLECTION ---
  function getCellFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    return element && element.classList.contains("cell") ? element : null;
  }

  function startSelection(cell) {
    if (!cell) return;
    isSelecting = true;
    selectedCells = [cell];
    cell.classList.add("selected");
  }

  function moveSelection(cell) {
    if (!isSelecting || !cell) return;
    const startCell = selectedCells[0];
    const r1 = parseInt(startCell.dataset.row, 10);
    const c1 = parseInt(startCell.dataset.col, 10);
    const r2 = parseInt(cell.dataset.row, 10);
    const c2 = parseInt(cell.dataset.col, 10);

    const dr = r2 - r1;
    const dc = c2 - c1;

    if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / steps;
      const stepC = dc === 0 ? 0 : dc / steps;

      document.querySelectorAll(".cell.selected").forEach(c => c.classList.remove("selected"));
      selectedCells = [];

      for (let i = 0; i <= steps; i++) {
        const currR = r1 + stepR * i;
        const currC = c1 + stepC * i;
        const targetCell = gridContainer.querySelector(`[data-row="${currR}"][data-col="${currC}"]`);
        if (targetCell) {
          targetCell.classList.add("selected");
          selectedCells.push(targetCell);
        }
      }
    }
  }

  function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;

    const selectedWord = selectedCells.map(c => c.textContent).join("");
    const reversedWord = selectedWord.split("").reverse().join("");

    const currentLevelWords = levels[currentLevelIndex].words.map(w =>
      w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    let match = null;
    if (currentLevelWords.includes(selectedWord)) {
      match = selectedWord;
    } else if (currentLevelWords.includes(reversedWord)) {
      match = reversedWord;
    }

    if (match && !foundWords.has(match)) {
      foundWords.add(match);
      selectedCells.forEach(c => {
        c.classList.remove("selected");
        c.classList.add("found");
      });
      const listItem = document.getElementById(`word-${match}`);
      if (listItem) listItem.classList.add("found-word");

      if (foundWords.size === currentLevelWords.length) {
        setTimeout(() => {
          alert("Bravo ! Vous avez trouvé tous les mots de ce niveau !");
        }, 200);
      }
    } else {
      selectedCells.forEach(c => c.classList.remove("selected"));
    }
    selectedCells = [];
  }

  // Événements Souris
  gridContainer.addEventListener("mousedown", (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);
    startSelection(cell);
  });

  gridContainer.addEventListener("mousemove", (e) => {
    const cell = getCellFromPoint(e.clientX, e.clientY);
    moveSelection(cell);
  });

  document.addEventListener("mouseup", endSelection);

  // Événements Tactiles
  gridContainer.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    startSelection(cell);
  }, { passive: true });

  gridContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    moveSelection(cell);
  }, { passive: true });

  document.addEventListener("touchend", endSelection);

  // Lancer le premier niveau
  loadLevel(currentLevelIndex);
});