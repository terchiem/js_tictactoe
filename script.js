/*================
      Game Logic
  ================*/
const cells = document.querySelectorAll('.cell');
const marks = document.querySelectorAll('.mark');
const playersObj = [ document.querySelector('[data-player="0"]'),
                  document.querySelector('[data-player="1"]')];

const Player = (name, mark, score) => {
  return {name, mark, score}
}

const gameBoard = (() => {
  const board = ['','','','','','','','',''];

  const render = () => {
    marks.forEach((mark, i) => {
      mark.innerHTML = board[i] || '';
    });
  };

  const resetBoard = () => {
    board.fill('');
    marks.forEach(mark => {
      mark.classList.remove('winning');
    });
    render();
  };

  const showWinning = (squares) => {
    squares.forEach(index => {
      const cell = document.querySelector(`[data-index="${index}"]`);
      cell.classList.add("winning");
    })
  }

  const get = (index) => {
    return board[index];
  }

  const set = (index, value) => {
    board[index] = value;
  }

  const length = () => {
    return board.length;
  }

  return { render, resetBoard, showWinning, get, set, length };
})();

const gameControl = (() => {
  let gameRunning = false;
  let currentPlayer = 0;
  let resultMessage = '';
  const players = [];
  const winning = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Public
  const startGame = () => {
    gameRunning = true;
    createNewPlayers();
    resetGame();
  };

  const restartGame = () => {
    gameRunning = true;
    resetGame();
  }

  const makeMove = (e) => {
    const index = e.target.dataset.index;
    if (!gameRunning || gameBoard.get(index)) { return; }

    gameBoard.set(index, players[currentPlayer].mark);
    gameBoard.render();

    if (checkGameOver()) {
      gameRunning = false;
      updateScore();
      displayResult();
    }
    else {
      switchPlayer();
    }
  };

  // Private
  function checkWinner() {
    let result = false;
    winning.forEach((cells) => {
      if (gameBoard.get(cells[0]) == gameBoard.get(cells[1]) && 
          gameBoard.get(cells[0]) == gameBoard.get(cells[2]) && 
          gameBoard.get(cells[0])) {
        gameBoard.showWinning(cells);
        result = true;
      };
    });
    return result;
  }

  function checkTie() {
    const length = gameBoard.length();
    for (let i = 0; i < length; i++) {
      if (!gameBoard.get(i)) {
        return false;
      }
    }
    return true;
  }

  function checkGameOver() {
    if (checkWinner()) {
      resultMessage = `${players[currentPlayer].name} wins!`;
      players[currentPlayer].score += 1;
      return true;
    }
    else if (checkTie()) {
      resultMessage = "Tie game!"
      return true;
    }
    else {
      return false;
    }
  }

  function createNewPlayers() {
    players[0] = Player(inputs.player1.value, "x", 0);
    players[1] = Player(inputs.player2.value, "o", 0);
  }

  function resetGame() {
    currentPlayer = 0;
    gameBoard.resetBoard();
    setCurrentBorder(currentPlayer);
    updateScore();
    closeForm();
    closeResult();
  }

  function switchPlayer() {
    currentPlayer = currentPlayer ? 0 : 1;
    setCurrentBorder(currentPlayer);
  }

  function setCurrentBorder(num) {
    const other = num ? 0 : 1;
    playersObj[num].classList.add("current");
    playersObj[other].classList.remove("current");
  }

  function updateScore() {
    playersObj.forEach((player, i) => {
      player.querySelector('.score-name').innerHTML = players[i].name;
      player.querySelector('.score').innerHTML = players[i].score;
    })
  }

  function displayResult() {
    resultMessageObj.innerHTML = resultMessage;
    openResult();
    resultMessage = '';
  }

  return { makeMove, restartGame, startGame };
})();

// Cells
cells.forEach((cell) => {
  cell.addEventListener('click', gameControl.makeMove);
})

/*==================   
    New Game Form   
==================*/
const openFormButton = document.querySelector('.form-open');
const closeFormButton = document.querySelector('.form-close');
const startButton = document.querySelector('.start-button')
const headerRestartButton = document.querySelector('.head-restart');
const gameForm = document.querySelector('.game-form');
const inputs = {
  player1: document.querySelector('[name=player1]'),
  player2: document.querySelector('[name=player2]')
};

openFormButton.addEventListener('click', openForm);
closeFormButton.addEventListener('click', closeForm);
startButton.addEventListener('click', gameControl.startGame);
headerRestartButton.addEventListener('click', gameControl.restartGame);

function openForm() {
  gameForm.classList.add('open');
  closeResult();
}
function closeForm() {
  gameForm.classList.remove('open');
  inputs.player1.value = "Player 1";
  inputs.player2.value = "Player 2";
}

/*==================
    Result Display
==================*/
const resultWindow = document.querySelector('.results');
const resultMessageObj = document.querySelector('.result-message')
const resultClose = document.querySelector('.result-close');

resultClose.addEventListener('click', closeResult);

function openResult() {
  resultWindow.classList.add('open');
}
function closeResult() {
  resultWindow.classList.remove('open');
}

// initialize
gameControl.startGame();
