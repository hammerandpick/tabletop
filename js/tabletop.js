// Basic classes for a tabletop game

class TableTop_ViewPort {
        constructor() {
            this.screenWidth = screen.width;
            this.screenHeight = screen.height;
            this.orientation = screen.orientation.type; 
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight; 
            this.rotation = 0; // Initial rotation in degrees
        }
        getViewportData() {
            return {
                width: this.screenWidth,
                height: this.screenHeight,
                orientation: this.orientation,
                windowHeight: this.windowHeight,
                windowWidth: this.windowWidth
            };
        }
        printViewportData() {
            const data = this.getViewportData();
            console.log(`Viewport Width: ${data.width}, Height: ${data.height}, Orientation: ${data.orientation}`);
            console.log(`Window Width: ${data.windowWidth}, Height: ${data.windowHeight}`);
        }
        lockViewport() {
            if (screen.orientation) {
                screen.orientation.lock('landscape').catch(error => {
                    console.error("Failed to lock orientation:", error);
                });
            } else {
                console.warn("Screen orientation API not supported");
            }
        }
        rotateViewPort(degrees) {
            degrees = parseInt(degrees);
            if (typeof degrees !== 'number' || degrees < 0 || degrees > 360) {
                console.log(degrees + typeof degrees);
                throw new Error("Invalid rotation value. Must be between 0 and 360 degrees." + degrees);
                
            }
            this.rotation = degrees;
            document.getElementById('tabletop-viewport').style.transform = `rotate(${this.rotation}deg)`;
            console.log(`Viewport rotated to ${this.rotation} degrees`);
        }
}


class TableTop {
    constructor() {
        this.Game = new Game("TableTop Game");
        this.ViewPort = new TableTop_ViewPort();
    }

    

    loadFile(file) {
        // Logic to load a game file

        if (!file || !file.name) {
            throw new Error("Invalid file provided");
        }
        console.log(`Loading file: ${file.name}`);
    }

    setBatch(count) {
        // Logic to set batch size for game actions
        if (typeof count !== 'number' || count <= 0) {
            throw new Error("Invalid batch count");
        }
        else {
            navigator.setAppBadge(count).catch(error => {
                console.error("Failed to set app badge:", error);
            });
        }
        console.log(`Batch size set to: ${count}`);
    }

    clearBatch() {
        navigator.setAppBadge(0).catch(error => {
            console.error("Failed to clear app badge:", error);
        });
    }
}

class Player{
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.score = 0;
    }

    updateScore(points) {
        this.score += points;
    }
}

class Game {
    constructor(name) {
        this.name = name;
        this.players = [];
        this.currentPlayerIndex = 0;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }
}

