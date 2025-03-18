// Global Variables
let currentPlayer;

const Gameboard = (function() {
  const board = Array(9).fill("");
  
  const setMove = (position, symbol) => {
    board[position] = symbol;
    return board;
  };
  
  const getBoard = () => {
    return board;
  };
  
  const resetBoard = () => {
    for (let i in board) {
      board[i] = "";
    }
  };
  
  return { setMove, getBoard, resetBoard };
})();

function createPlayer(name, symbol) {
  const getSymbol = () => {
    return symbol;
  };
  return {name, getSymbol}
}

const playerX = createPlayer("X", "X");
const playerO = createPlayer("O", "O");

const Game = (function() {
  const setPlayer = () => {
    currentPlayer = playerX;
  }

  const switchPlayer = () => {   
    if (currentPlayer) {
      currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
    }
  };
  
  const checkResult = () => {
    const board = Gameboard.getBoard();
    
    winningCombs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ];
    
    for (let i in winningCombs) {
      const [a, b, c] = winningCombs[i];
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a];
      }
    }

    return false;
  };
  
  return { setPlayer, switchPlayer, checkResult };
})();

Game.setPlayer();

const DOMHandler = (function() {
  const playerXInput = document.querySelector("#playerXInput");
  playerXInput.addEventListener("change", () => {
    playerX.name = playerXInput.value;
    localStorage.setItem("playerXName", playerX.name);
  })
  const playerOInput = document.querySelector("#playerOInput");
  playerOInput.addEventListener("change", () => {
    playerO.name = playerOInput.value;
    localStorage.setItem("playerOName", playerO.name);
  })

  const resultModal = document.querySelector("#resultModal");
  const resultModalText = resultModal.querySelector("p");
  const resultModalBtn = resultModal.querySelector("button");

  cellScratch = document.createElement("img");
  cellScratch.src = "./assets/images/scratch.png";
  cellScratch.classList.add("cell-scratch");

  const cells = document.querySelectorAll(".gameboard__cell");
  let counter = 0;
  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const cellPosition = cell.dataset.position;
      if (cell.textContent) {
        cell.appendChild(cellScratch);
        setTimeout(() => {
          cellScratch.remove()
        }, 1000)
      }
      else {
        counter++
        Gameboard.setMove(cellPosition, currentPlayer.getSymbol());
        cell.textContent = currentPlayer.getSymbol();

        let result = Game.checkResult();
        if (result ||
          (counter > 8 && !result)
        ) {
          if (result) {
            resultModalText.textContent = currentPlayer.name + " WINS!";
            resultModal.showModal();

            Gameboard.resetBoard();
            cells.forEach(cell => {
              cell.textContent = "";
            })
            counter = 0;
            result = null;
          }
          else if (counter > 8 && !result) {
            resultModalText.textContent = "Tie";
            resultModal.showModal();

            Gameboard.resetBoard();
            cells.forEach(cell => {
              cell.textContent = "";
            })
            counter = 0;
          }

          Game.setPlayer();
        } else {Game.switchPlayer()};
      }
    })
  })

  resultModalBtn.addEventListener("click", () => {
    resultModal.close();
  })

  const resetBtn = document.querySelector("#resetBtn");
  resetBtn.addEventListener("click", () => {
    if (Gameboard.getBoard().some(str => str)) {
      Gameboard.resetBoard();
      cells.forEach(cell => {
        cell.textContent = "";
      })
      counter = 0;
      Game.setPlayer();
    }
  })

  // Get data from Local Storage
  const playerXName = localStorage.getItem("playerXName");
  playerXInput.value = playerXName;

  const playerOName = localStorage.getItem("playerOName");
  playerOInput.value = playerOName;
})();