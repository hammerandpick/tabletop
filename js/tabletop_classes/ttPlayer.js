export class ttPlayer{
    constructor(name, color, symbol='', emoji='', active=true, ai) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.symbol = symbol;
        this.emoji= emoji;
        this.active = true;
        this.ai = false; // Is this player controlled by AI?
        this.ready= false; // Is this player ready to play?
    }

    activate() {
        this.active = true;
    }
    deactivate() {
        this.active = false;
    }

    updateScore(points) {
        this.score += points;
    }
}
