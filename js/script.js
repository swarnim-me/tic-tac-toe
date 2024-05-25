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

    const getBoard = () => board;

    const markBoard = (index, value) => {
        board[index] = value;
        return checkWinner();
    }

    const checkWinner = () => {
        const checkLine = (...args) => {
            // console.log(args);
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
    return { init, getBoard, markBoard, symbols }
})();

const createPlayer = (username, symbol, isBot = false) => {
    const score = 0;
    const getUsername = () => username;
    const getScore = () => score;
    const addScore = () => score++;
    const isUserBot = () => isBot;
    return { symbol, getUsername, getScore, addScore, isUserBot };
}

const Renderer = (function () {
    const symbols = GameBoard.symbols;
    const printBoard = (board) => {
        // for (let i = 0; i < 9; i += 3) {
        //     for (let j = 0; j < 3; j++) {
        //         switch (board[j + i]) {
        //             case symbols.x: console.log('X'); break;
        //             case symbols.y: console.log('Y'); break;
        //             default: console.log(' ');
        //         }
        //     }
        //     console.log('\n');
        // }
        console.log(JSON.stringify(board));
    }
    return { printBoard };
})();

const GameController = (function () {
    GameBoard.init();
    const symbols = GameBoard.symbols;
    const player1 = createPlayer(prompt("Enter first player name"), symbols.x, false);
    const player2 = createPlayer(prompt("Enter second player name"), symbols.o, false);
    let currentPlayer = player1;
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
    while (true) {
        let input = prompt(`${currentPlayer.getUsername()}'s turn`);
        const { result, isWinner, cells } = GameBoard.markBoard(input, currentPlayer.symbol);
        Renderer.printBoard(GameBoard.getBoard());
        if (result) {
            if (isWinner) {
                console.log(`${currentPlayer.getUsername()} is the winner`);
            }
            else {
                console.log("It is a draw");
            }
            break;
        }
        switchPlayer();
    }
})();