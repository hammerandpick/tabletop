export class TableTop_Die{
    #lastRoll=null;
    #rollCount=0;
    constructor(diceType='d6') {
        this.divElement = document.createElement('input'); // Create a div element for the dice
        Object.defineProperty(this, 'id', {
            value: "wuerfelID_" + Math.random().toString(36).substring(2, 15), // Unique ID for the dice
            writable: false,
            configurable: false
        });
        this.divElement.id = this.id; // Set the ID of the div element
        this.name= "TableTop Standard Dice"; // Default name for the dice
        this.min = 1; // Minimum value for the dice        
        try {
            if (typeof diceType === 'number' && diceType > 1) {
                this.max = diceType; // Maximum value for the dice
            }  
            else if (typeof diceType === 'string' && diceType.startsWith('d')) {
                this.max  = parseInt(diceType.substring(1))
            }
        } catch (error) {
            console.warn("Invalid dice type provided. Defaulting to d6.");
            this.max = 6; // Default die type
        }
        this.divElement.className = 'tabletop-die'; // Set the class name for styling'
        //this.divElement.style.display = 'none'; // Initially hide the dice container
        this.divElement.type = 'number';
        this.divElement.min = this.min;
        this.divElement.max = this.max;
        this.divElement.value = this.min;
        this.rollHistory = []; // History of rolls
        this.diceType = 'd' + this.max; // Type of dice (e.g., d6, d20)
        this.dieArray = []; // Array to hold shifted die valuesS
    }
    
    roll() {
        if (!this.diceType || !this.max) {
            console.warn("Dice type or maximum value not set. Cannot roll.");
            return;
        }
        const rollResult = Math.floor(Math.random() * this.max) + this.min; // Generate a random roll
        this.#lastRoll = rollResult; // Store the last roll result
        this.#rollCount++; // Increment the roll count
        this.rollHistory.push(rollResult); // Add the roll result to the history
        if(this.rollHistory.length > 10) {
            this.rollHistory.shift(); // Keep only the last 10 rolls in history
        }
        
        // first half of the die array 
        this.dieArray = []; // Reset the die array
        for (let i = this.#lastRoll; i <= this.max; i++) {
            this.dieArray.push(i); // Create an array of shifted dice values
        }
        for (let i = this.min; i < this.lastRoll; i++) {
            this.dieArray.push(i); // Create an array of shifted dice values
        }
        console.log(`Rolled a ${this.diceType}: ${rollResult}`);
        this.divElement.value = rollResult; // Update the dice container value
        return rollResult; // Return the roll result
    }

    get RollCount(){ return this.#rollCount; }

    get LastRoll() {
        if (this.#lastRoll === null) {
            console.warn("No rolls have been made yet.");
            this.roll(); // Make a roll if none exist
            return null;
        }
        return this.#lastRoll; // Return the last roll result
    }

    shiftDiceArray(diceNumber,diceArrayLength) {
        return  (diceNumber + this.#lastRoll) > diceArrayLength ?  ( (diceNumber + this.#lastRoll)-diceArrayLength) : (diceNumber + this.#lastRoll); // Shift the dice array based on the last roll
    }

    show(parentElement = null) {
        if (!this.divElement) {
            console.warn("Dice element not found. Cannot show dice.");
            return;
        }
        else {
            if (parentElement && parentElement instanceof HTMLElement) {
                parentElement.appendChild(this.divElement); // Append the dice container to the specified parent element
            }
            else {
                const container = document.getElementById('tabletop-dice');
                if (container) container.appendChild(this.divElement); // Append the dice container to the viewport
            }
            this.divElement.style.display = 'block'; // Show the dice container
        }
        return document.getElementById(this.id);
    }

    hide() {
        if (!this.divElement) {
            console.warn("Dice element not found. Cannot hide dice.");
            return;
        }
        else {
            this.divElement.style.display = 'none'; // Hide the dice container
        }
    }
}
