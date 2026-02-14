const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("game-status");
const restartBtn = document.querySelector(".restart-btn");

const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modal h2");
const modalBtn = document.querySelector(".btn-primary");

let currentPlayer = "x";
let gameActive = true;

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

statusText.textContent = "Player X Turn";

cells.forEach(cell => {
  cell.addEventListener("click", () => {
    if (!gameActive) return;
    if (cell.classList.contains("x") || cell.classList.contains("o")) return;

    cell.classList.add(currentPlayer);

    if (checkWin()) {
      showPopup(`Player ${currentPlayer.toUpperCase()} Won`);
      gameActive = false;
      return;
    }

    if (checkDraw()) {
      showPopup("Match Draw");
      gameActive = false;
      return;
    }

    currentPlayer = currentPlayer === "x" ? "o" : "x";
    statusText.textContent = `Player ${currentPlayer.toUpperCase()} Turn`;
  });
});

function checkWin() {
  return winConditions.some(pattern =>
    pattern.every(i => cells[i].classList.contains(currentPlayer))
  );
}

function checkDraw() {
  return [...cells].every(cell =>
    cell.classList.contains("x") || cell.classList.contains("o")
  );
}

function showPopup(message) {
  modal.style.display = "flex";
  modalText.textContent = message;
}

function resetGame() {
  cells.forEach(cell => cell.classList.remove("x","o"));
  currentPlayer = "x";
  gameActive = true;
  statusText.textContent = "Player X Turn";
  modal.style.display = "none";
}

restartBtn.addEventListener("click", resetGame);
modalBtn.addEventListener("click", resetGame);
