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

const createPlayer = (isBot, symbol) => {
    const score = 0;
    const playerSymbol = symbol;
    const getScore = () => score;
    const addScore = () => score++;
    const isUserBot = () => isBot;
    const getPlayerSymbol = () => playerSymbol;
    const resetPlayerScore = () => score = 0;
    return { getPlayerSymbol, getScore, addScore, isUserBot, resetPlayerScore };
}

const GameController = (function () {
    let player1;
    let player2;
    let currentPlayer;
    const gameSymbols = GameBoard.getGameSymbols();
    const initPlayers = (player1Input, player2Input) => {
        GameBoard.init();
        player1 = createPlayer(player1Input, gameSymbols.x);
        player2 = createPlayer(player2Input, gameSymbols.o);
        currentPlayer = player1;
    }
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
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
        GameBoard.init();
    }

    const resetGame = () => {
        player1.resetPlayerScore();
        player2.resetPlayerScore();
        resetBoard();
    }

    const getPlayers = () => { player1, player2 };
    const getActivePlayer = () => currentPlayer;

    const getActiveBoard = () => GameBoard.getBoard();
    return { initPlayers, playRound, getActiveBoard, getPlayers, getActivePlayer, resetBoard, resetGame };
})();

const displayController = (function () {
    const game = GameController;
    let player1Bot = false;
    let player2Bot = true;
    const player1Arrows = Array.from(document.querySelectorAll(".player1 .arrow"));
    const player2Arrows = Array.from(document.querySelectorAll(".player2 .arrow"));
    const player1Title = document.querySelector(".player1 .player-type");
    const player2Title = document.querySelector(".player2 .player-type");
    const player1Image = document.querySelector(".player1 .player-img");
    const player2Image = document.querySelector(".player2 .player-img");
    const startGameBtn = document.querySelector(".play-btn");
    const gameBoard = document.querySelector(".game-board");
    const init = () => {
        startGameController();
        playerTypeController();
        createBoard();
    }

    const startGameController = () => {
        startGameBtn.addEventListener("click", () => {
            const player1 = player1Bot ? "Bot" : "Human";
            const player2 = player2Bot ? "Bot" : "Human";
            createPlayers();
        })
    }

    const renderGame = () => {
        const activeBoard = game.getActiveBoard();
        // Get Board
    }

    const createPlayers = () => {
        game.initPlayers(player1Bot, player2Bot)
        gameLoop();
    }

    const createBoard = () => {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.height = "33.33%";
            cell.style.width = "33.33%";
            cell.style.border = "6px solid black";
            cell.setAttribute("data-index", i);
            gameBoard.appendChild(cell);
        }
    }

    const playerTypeController = () => {
        const human = {
            title: "Human",
            imgSrc: "../assets/images/player.png"
        }

        const bot = {
            title: "Bot",
            imgSrc: "../assets/images/bot.png"
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



    const gameLoop = () => {
        console.log("Game Started");
        // while (true) {
        //     const input = prompt("Input Please");
        //     const roundResult = game.playRound(input);
        //     if (roundResult.error) console.log("The cell is already occupied");
        //     renderGame();
        //     if (roundResult.result) {
        //         if (roundResult.isWinner) {
        //             console.log("The winner is " + game.getActivePlayer().getUsername());
        //         }
        //         else {
        //             console.log("It is a draw");
        //         }
        //         game.getActivePlayer().addScore();
        //         game.resetBoard();
        //     }
        // }
    }
    init();
})();