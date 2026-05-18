export class ttGame {
    constructor(name) {
        this.name = name;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.maxPlayers = 2;
        this.state = {};
        this.board = {
            width: 3,
            height: 3,
            layers: 1,
            grid: []
        };
    }

    addPlayer(playerName, playerColor = null, playerSymbol = null, playerEmoji = null) {
        /* Logic to add a player to the game
           if no color or symbol is provided, assign from predefined lists.
           Assume that all players are human players for now.
        */
        const playerColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'cyan', 'magenta', 'lime', 'pink' ,'teal','lavender','brown','beige','maroon','mint','olive','coral','navy','grey','white','black'];
        const playerSymbols = ['X', 'O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U']
        const playerEmojis = ['❌', '⭕', '😀', '😎', '🧙‍♂️', '🧛‍♀️', '🧟‍♂️', '🧞‍♀️', '🧜‍♂️', '🧚‍♀️', '🐱', '🐶', '🐵', '🦊', '🐸', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐔'];

        let selectColor=0;
        if (Object.keys(this.players).length === 0) {
            selectColor=0;
        } else {
            selectColor=Object.keys(this.players).length % playerColors.length;
        }

        if (playerColor === null) {
            playerColor = playerColors[selectColor];
        }
        if (playerSymbol === null) {
            playerSymbol = playerSymbols[selectColor];
        }
        if (playerEmoji === null) {
            playerEmoji = playerEmojis[selectColor];
        }

        const player = new ttPlayer(playerName, playerColor, playerSymbol, playerEmoji, true, false);
        this.players.push(player);
    }

    listPlayers(mode='html', activeOnly=false, consoleObj=false) {
        /* Logic to list players in the game
           html mode: returns an HTML string of players
           text mode: returns a plain text string of players
           json mode: returns a JSON object of players
           activeOnly: if true, only list active players
        */
        let output = '';
        let playerList = this.players;
        if (activeOnly) {
            playerList = this.players.filter(player => player.active);
        }
        switch (mode) {
            case 'html':
                output += '<ul>';
                playerList.forEach(player => {
                    output += `<li style="color:${player.color}">${player.name} (${player.symbol} ${player.emoji}) - Score: ${player.score} - ${player.active ? 'Active' : 'Inactive'}</li>`;
                });
                output += '</ul>';
                break; 
            case 'text':
                playerList.forEach(player => {
                    output += `${player.name} (${player.symbol} ${player.emoji}) - Score: ${player.score} - ${player.active ? 'Active' : 'Inactive'}\n`;
                });
                break;
            case 'json':
                output = JSON.stringify(playerList, null, 2);
                break;
            default:
                console.warn("Unsupported mode. Use 'html', 'text', or 'json'.");
                return null;
        }
        if (consoleObj) {
            console.log(playerList);
        }
        return output;
    }

    prepareBoard() {
        for (let layer = 0; layer < this.board.layers; layer++) {
            this.board.grid[layer] = Array.from({ length: this.board.height }, () => Array(this.board.width).fill(''));
        }
    }

    preparePlayers() {
        /* preapare players for a new game
              if no players exist, create default players up to maxPlayers
              set all players to active and reset their scores to zero
        */
       console.log(`No players found. Created ${this.currentPlayerIndex} default players.`);
        if (this.players.length === 0) {
            for (let i = 0; i < this.maxPlayers; i++) {
                this.addPlayer(`Player ${i + 1}`);
            }
            console.log(`No players found. Created ${this.maxPlayers} default players.`);
        }
        else
        {
            console.log(`Preparing ${this.players.length} players for the game.`);
        }
    }

    showBoard() {
        console.log("Current Board State:");
        console.table(this.board.grid);
        for (let layer = 0; layer < this.board.layers; layer++) {
            // [TODO] Write function to display each layer of the board

        }
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
}
