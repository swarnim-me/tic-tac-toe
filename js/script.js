const GameBoard = (function () {
    const board = [];
    const symbols = {
        'x': 1,
        'o': 2,
        'empty': -1,
    }
    const init = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = symbols.empty;
        }
    }

    const getGameSymbols = () => symbols;

    const getBoard = () => board;

    const markBoard = (index, value) => {
        board[index] = value;
        return checkWinner();
    }

    const isCellAvailable = (cellIndex) => {
        if (board[cellIndex] === -1) return true;
        return false;
    }
    const checkWinner = () => {
        const checkLine = (...args) => {
            // We don't need to compare empty values
            for (let i = 0; i < args.length; i++) {
                if (board[args[i]] === symbols.empty) return { result: false, isWinner: false, cells: [] };
            }
            if (board[args[0]] === board[args[1]] && board[args[1]] === board[args[2]]) {
                const result = true;
                const isWinner = true;
                const cells = args;
                return { result, isWinner, cells }
            }
            else {
                return { result: false, isWinner: false, cells: [] };
            }
        }
        // Checks rows for winner
        for (let i = 0; i <= 6; i += 3) {
            const output = checkLine(i, i + 1, i + 2);
            if (output.result) return output;
        }

        // Check columns for winner
        for (let i = 0; i < 3; i++) {
            const output = checkLine(i, i + 3, i + 6);
            if (output.result) return output;
        }

        // Check Diagonals for winner
        let diagonalResult = checkLine(0, 4, 8);
        if (diagonalResult.result) return diagonalResult;
        diagonalResult = checkLine(2, 4, 6);
        if (diagonalResult.result) return diagonalResult;

        // Check if draw
        if (board.indexOf(symbols.empty) === -1) {
            return { result: true, isWinner: false, cells: [] };
        }
        return { result: false, isWinner: false, cells: [] };
    }
    return { init, getBoard, isCellAvailable, markBoard, getGameSymbols }
})();

const createPlayer = (playerName, isBot, symbol) => {
    const username = playerName;
    let score = 0;
    const playerSymbol = symbol;
    const getScore = () => score;
    const getUsername = () => username;
    const addScore = () => score++;
    const isUserBot = () => isBot;
    const getPlayerSymbol = () => playerSymbol;
    const resetPlayerScore = () => score = 0;
    return { getUsername, getPlayerSymbol, getScore, addScore, isUserBot, resetPlayerScore };
}

const GameController = (function () {
    let player1;
    let player2;
    let currentPlayer;
    const gameSymbols = GameBoard.getGameSymbols();
    const initPlayers = (player1Input, player2Input) => {
        GameBoard.init();
        player1 = createPlayer("Player 1", player1Input, gameSymbols.x);
        player2 = createPlayer("Player 2", player2Input, gameSymbols.o);
        currentPlayer = player1;
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    const getBotResponse = () => {
        let index = Math.floor(Math.random() * 10);
        while (!GameBoard.isCellAvailable(index)) {
            index = Math.floor(Math.random() * 10);
        }
        return index;
    }

    const playRound = (input) => {
        if (GameBoard.isCellAvailable(input)) {
            const roundResult = GameBoard.markBoard(input, currentPlayer.getPlayerSymbol());
            switchPlayer();
            return roundResult;
        }
        return { error: true };
    }

    const resetBoard = () => {
        currentPlayer = player1;
        GameBoard.init();
    }

    const resetGame = () => {
        player1.resetPlayerScore();
        player2.resetPlayerScore();
        resetBoard();
    }

    const getPlayers = () => ({ player1, player2 });
    const getActivePlayer = () => currentPlayer;

    const getActiveBoard = () => GameBoard.getBoard();
    return { initPlayers, playRound, getActiveBoard, getPlayers, getActivePlayer, getBotResponse, resetBoard, resetGame };
})();

const displayController = (function () {
    const game = GameController;
    let player1Bot = false;
    let player2Bot = true;

    // Player Selection
    const player1Arrows = Array.from(document.querySelectorAll(".player1 .arrow"));
    const player2Arrows = Array.from(document.querySelectorAll(".player2 .arrow"));
    const player1Title = document.querySelector(".player1 .player-type");
    const player2Title = document.querySelector(".player2 .player-type");
    const player1Image = document.querySelector(".player1 .player-img");
    const player2Image = document.querySelector(".player2 .player-img");

    // Screens
    const menuScreen = document.querySelector(".menu-screen");
    const gameScreen = document.querySelector(".game-screen");

    // Game Screen
    const gameResult = document.querySelector(".game-result");
    const player1Score = document.querySelector(".player1-score");
    const player2Score = document.querySelector(".player2-score");

    // Buttons
    const startGameBtn = document.querySelector(".menu-screen .play-btn");

    // Game Board
    const gameBoard = document.querySelector(".game-board");


    const init = () => {
        playerTypeController();
        startGameController();
    }

    const startGameController = () => {
        startGameBtn.addEventListener("click", () => {
            createPlayers();
            menuScreen.style.display = "none";
            gameScreen.style.display = "grid";
            createBoard();
            startGame();
        })
    }



    const createPlayers = () => {
        game.initPlayers(player1Bot, player2Bot)
    }

    const createBoard = () => {
        gameBoard.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-index", i);
            // cell.addEventListener("click", cellListener);
            gameBoard.appendChild(cell);
        }
    }

    const endRound = () => {
        const cells = Array.from(gameBoard.children);
        console.log(cells);
        cells.forEach(cell => cell.removeEventListener("click", cellListener));
    }

    const updateScore = () => {
        console.log(game.getPlayers());
        player1Score.textContent = game.getPlayers().player1.getScore();
        player2Score.textContent = game.getPlayers().player2.getScore();
    }

    const paintWinner = (indexes) => {
        const cells = gameBoard.children;
        indexes.forEach(index => {
            cells[index].style.background = "black";
            cells[index].style.color = "white";
        })
    }

    const restartRound = () => {
        game.resetBoard();
        createBoard();
        gameResult.textContent = "Start Game";
        gameResult.removeEventListener("click", restartRound);
        startGame();
    }

    const restartGame = () => {
        menuScreen.style.display = "grid";
        gameScreen.style.display = "none";
        game.resetGame();
        gameResult.textContent = "Start Game";
        gameResult.removeEventListener("click", restartGame);
        createBoard();
        updateScore();
    }

    const addCellListeners = () => {
        const cells = Array.from(gameBoard.children);
        cells.forEach(cell => {
            cell.addEventListener("click", cellListener);
        })
    }

    const removeCellListeners = () => {
        const cells = Array.from(gameBoard.children);
        cells.forEach(cell => {
            cell.removeEventListener("click", cellListener);
        })
    }

    const cellListener = (event) => {
        // const symbol = game.getActivePlayer().getSymbol() === 1 ? "x" : "o";
        // event.target.textContent = symbol;
        playRound(event.target.dataset.index);
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function sleep(fn, ...args) {
        await timeout(800);
        return fn(...args);
    }

    const playBotTurn = async () => {
        const response = await sleep(playRound, game.getBotResponse());
        return response;
    }

    const startGame = () => {
        const activePlayer = game.getActivePlayer();
        if (activePlayer.isUserBot()) {
            removeCellListeners();
            playBotTurn();
        }
        else {
            addCellListeners();
        }
    }

    const playRound = (index) => {
        const activePlayer = game.getActivePlayer();
        const roundResult = game.playRound(index);
        if (!roundResult.error) {
            gameBoard.children[index].textContent = activePlayer.getPlayerSymbol() === 1 ? "x" : "o";
            if (roundResult.result) {
                if (roundResult.isWinner) {
                    paintWinner(roundResult.cells);
                    activePlayer.addScore();
                    updateScore();
                    if (activePlayer.getScore() === 3) {
                        gameResult.textContent = `${activePlayer.getUsername()} wins! Restart Game?}`;
                        gameResult.addEventListener("click", restartGame);
                    }
                    else {
                        gameResult.textContent = `${activePlayer.getUsername()} wins the round. Play Again?`;
                        gameResult.addEventListener("click", restartRound);
                    }
                }
                else {
                    gameResult.textContent = `Draw`;
                    gameResult.addEventListener("click", restartRound);
                }
            }
            else {
                startGame();
            }
        }
    }

    const playerTypeController = () => {
        const human = {
            title: "Human",
            imgSrc: "./assets/images/player.png"
        }

        const bot = {
            title: "Bot",
            imgSrc: "./assets/images/bot.png"
        }

        const flipValues = (playerBot, playerTitle, playerImage) => {
            if (!playerBot) {
                playerTitle.textContent = bot.title.toUpperCase();
                playerImage.setAttribute("src", bot.imgSrc);
                return true;
            }
            else {
                playerTitle.textContent = human.title.toUpperCase();
                playerImage.setAttribute("src", human.imgSrc);
                return false;
            }
        }

        player1Arrows.forEach(arrow => {
            arrow.addEventListener("click", () => {
                player1Bot = flipValues(player1Bot, player1Title, player1Image);
                if (player1Bot) {
                    player1Image.style.transform = "scaleX(-1)";
                }
                else {
                    player1Image.style.transform = "scaleX(1)";
                }
            })
        })

        player2Arrows.forEach(arrow => {
            arrow.addEventListener("click", () => {
                player2Bot = flipValues(player2Bot, player2Title, player2Image);
                if (!player2Bot) {
                    player2Image.style.transform = "scaleX(-1)";
                }
                else {
                    player2Image.style.transform = "scaleX(1)";
                }
            })
        })
    }
    init();
})();