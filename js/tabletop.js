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

class TableTop_Dice{
    constructor(diceType,parentElement) {
        this.diceID = "diceID-" + Math.random().toString(36).substring(2, 15); // Unique ID for the dice
        this.diceName= "TableTop Standard Dice"; // Default name for the dice
        this.diceType = diceType || "d6"; // Default die type
        this.diceMin= 1; // Minimum value for the dice
        if(this.diceType !== "d6") {
            this.diceMax= parseInt(this.diceType.substring(1)); // Set maximum value based on die type (e.g., d20, d10)
        }
        else {
            this.diceMax= 6; // Maximum value for the dice
        }
        this.lastRoll= null; // Store the last roll result
        this.rollCount = 0; // Count of rolls made
        this.rollHistory = []; // History of rolls
        this.divElement = document.createElement('div'); // Create a container for the dice
        this.parentElement = parentElement || null; // Parent element for the dice, if specified
        this.divElement.id = this.diceID; // Set the ID for the dice container
        this.divElement.className = 'dice'; // Set the class for styling
        this.dieArray = [];
    }

    roll() {
        if (!this.diceType || !this.diceMax) {
            console.warn("Dice type or maximum value not set. Cannot roll.");
            return;
        }
        const rollResult = Math.floor(Math.random() * this.diceMax) + this.diceMin; // Generate a random roll
        this.lastRoll = rollResult; // Store the last roll result
        this.rollCount++; // Increment the roll count
        this.rollHistory.push(rollResult); // Add the roll result to the history
        if(this.rollHistory.length > 10) {
            this.rollHistory.shift(); // Keep only the last 10 rolls in history
        }
        this.dieArray=[]; // Initialize the die array
        
        // first half of the die array 
        for (let i = this.lastRoll; i <= this.diceMax; i++) {
            this.dieArray.push(i); // Create an array of shifted dice values
        }
        for (let i = 1; i < this.lastRoll; i++) {
            this.dieArray.push(i); // Create an array of shifted dice values
        }
        console.log(`Rolled a ${this.diceType}: ${rollResult}`);

    }

    linkToParent() {
        if (this.parentElement && typeof this.parentElement === 'string') {
            const parentElement = document.getElementById(this.parentElement);
            if (parentElement) {
                parentElement.appendChild(this.divElement); // Append the dice container to the specified parent element
                console.log(`Dice linked to parent: ${this.parentElement}`);
            } else {
                console.warn(`Parent element with ID ${this.parentElement} not found. Appending to viewport instead.`);
                document.getElementById('tabletop-viewport').appendChild(this.divElement); // Fallback to viewport
            }
        }
        else if (this.parentElement && this.parentElement instanceof HTMLElement) {
            this.parentElement.appendChild(this.divElement); // Append the dice container to the specified parent element
            console.log(`Dice linked to parent: ${this.parentElement.id}`);
        } else {
            document.getElementById('tabletop-viewport').appendChild(this.divElement); // Append the dice container to the viewport
            console.log("Dice appended to viewport");
        }
        return this.divElement; // Return the dice container element
    }
    
    getLastRoll() {
        if (this.lastRoll === null) {
            console.warn("No rolls have been made yet.");
            return null;
        }
        return this.lastRoll; // Return the last roll result
    }

    shiftDiceArray(diceNumber,diceArrayLength) {
        return  (diceNumber + this.lastRoll) > diceArrayLength ?  ( (diceNumber + this.lastRoll)-diceArrayLength) : (diceNumber + this.lastRoll); // Shift the dice array based on the last roll
    }

    show() {
        if (!this.divElement) {
            console.warn("Dice element not found. Cannot show dice.");
            return;
        }
        else {
            let inverseDiceArray = this.dieArray.flatMap(x => this.dieArray.length+1-x); // Create an inverse array of the die values
            console.log("Inverse Dice Array:", inverseDiceArray);
            switch (this.diceType) {
            
                case 'd6':  
                    this.divElement.innerHTML = `<div class="dice_side front">${this.lastRoll}</div>`
                    + `<div class="dice_side back">${inverseDiceArray[0]}</div>`
                    + `<div class="dice_side right">${this.dieArray[2]}</div>`
                    + `<div class="dice_side left">${inverseDiceArray[2]}</div>`
                    + `<div class="dice_side top">${this.dieArray[4]}</div>`
                    + `<div class="dice_side bottom">${inverseDiceArray[4]}</div>`;
                    break;
                case 'd20':
                    this.divElement.innerHTML = `<div class="dice_side front">${this.lastRoll}</div>`
                    + `<div class="dice_side back">${21 - this.lastRoll}</div>` 
                    break;
                default:
                    this.divElement.innerHTML = `<div class="dice_side front">${this.lastRoll}</div>`
                    + `<div class="dice_side back">TT</div>`;
                    break;
            }
            this.divElement.style.display = 'block'; // Show the dice container
            return this.divElement; // Return the dice container element
        }
    }

    /*
    showDice() {
        if (this.dice.length === 0) { this.dice.
            console.warn("No dice to show");
            return;
        }
        console.log("Current dice:", this.dice.join(', '));
        console.log("Last roll:", this.lastRoll ? this.lastRoll.join(', ') : "No rolls yet");
        const diceContainer = document.getElementById('tabletop-dice');
        if (!diceContainer) {
            console.warn("Dice container not found in the DOM");
            return;
        }
        diceContainer.innerHTML = ''; // Clear previous dice display
        this.dice.forEach((die,index) => {
            const dieElement = document.createElement('div');
            dieElement.className = 'dice';
            dieElement.textContent = die; // Display the type of die
            if(die === 'd6') {
                // Example for a D6 die, you can customize this for other dice types
                dieElement.innerHTML = `<div class="dice_side front">`+ this.lastRoll.at(index) + `</div>
                <div class="dice_side back">`+ (7-this.lastRoll.at(index)) +`</div>
                <div class="dice_side right">`+ (4-this.lastRoll.at(index)) +`</div>
                <div class="dice_side left">3</div>
                <div class="dice_side top">5</div>
                <div class="dice_side bottom">2</div>`;
            }
            diceContainer.appendChild(dieElement);
        })
    }*/
}

class TableTop_Window{
    constructor(windowObject){
        // This class represents a window in the tabletop game, with properties for ID, name, dimensions, and rotation.
        this.element=document.createElement('div'); // Create a new div element for the window
        this.element.id = 'window-' + Math.random().toString(36).substring(2, 15); // Unique ID for the window
        this.element.title = "TableTop Window"; // Default name if none provided
        this.element.style.border = '1px dotted yellow'; // Basic styling for the window
        this.element.style.width = Math.max(window.innerWidth/10, 320)+"px"; // Minimum width of 320px or 10% of the window width
        this.element.style.height = Math.max(window.innerHeight/10, 240)+"px"; // Minimum height of 240px or 10% of the window height
        this.element.style.transform = `rotate(`+Math.round(Math.random()*360)+`deg)`; // Apply rotation
        this.element.style.display = 'block'; // Ensure the window is displayed
        this.element.style.position = 'absolute'; // Position the window absolutely
        this.childOf = null; // Parent element for the window, if specified
        if(typeof windowObject === "object") {
            for (const [key, value] of Object.entries(windowObject)) {
                console.log(`Setting property ${key} to ${value}`);
                if (key === 'id') {
                    // nope id has to be unique and be set by the constructor
                    console.warn("ID is already set by the constructor, ignoring:", value);
                } else if (key === 'childOf') {
                    this.childOf= value; // Set the parent element if specified
                } else if (key === 'style' && typeof value === 'object') {
                    // Apply styles if provided as an object
                    for (const [styleKey, styleValue] of Object.entries(value)) {
                        this.element.style[styleKey] = styleValue; // Set each style property
                    }
                }
                else {
                    this.element.setAttribute(key, value); // Set other attributes on the element
                }
            }
        }
        if (this.childOf && typeof this.childOf === 'string' && this.childOf instanceof HTMLElement) 
        {
            const parentElement = document.getElementById(this.childOf);
            if (parentElement) {
                parentElement.appendChild(this.element); // Append the window to the specified parent element
                console.log(`Window appended to parent: ${this.childOf}`);
            } else {
                console.warn(`Parent element with ID ${this.childOf} not found. Appending to viewport instead.`);
                document.getElementById('tabletop-viewport').appendChild(this.element); // Fallback to viewport
                this.childOf = null; // Reset childOf to null since it was not found
            }
        }
        else  
        {
            document.getElementById('tabletop-viewport').appendChild(this.element); // Append the window to the viewport
        }
    }

    showWindow() {
        // Logic to display the window
        console.log(`Showing window: ${this.windowName} with ID: ${this.windowID}`);
        document.getElementById('tabletop-viewport').style.display = 'block';
    }
}

class TableTop_WindowManager{
    // This class manages the viewport for a tabletop game, including screen dimensions and orientation.
    constructor() {
        this.windows = []; // Array to hold all windows
    }

    createWindow(windowName) {
        const newWindow = new TableTop_Window(windowName);
        this.windows.push(newWindow);
        console.log(`Created new window: ${newWindow.element.title} with ID: ${newWindow.element.id}`);
        return newWindow;
    }    
}

class TableTop_Menu{
    constructor(parent, parentNode, menuName, startHidden = true) {
        const MenuItem = {
            name: 'Undefined',
            link: '#',
            click: null, // function to call on click
            title: 'Sorry, no title provided',
            disabled: false,
            display: false,
            style: '' // menu style from css file
        };
        Object.seal(MenuItem); //allows modifications, but prevents additions and deletions of properties.
        MenuItem.display = !startHidden; // Set display based on startHidden parameter
        this.menuName = menuName;
        this.element = document.createElement('div');
        document.getElementById(parentNode).appendChild(this.element); // Append the menu to the body
        this.element.id = 'menu-' + Math.random().toString(36).substring(2, 15);
        this.element.className = 'tabletop-menu';
        this.element.style.display = 'none';
        this.items = []; // Use an array
        this.childOf = parent || null;
        this.element.innerHTML = `<h2>${this.menuName}</h2>`;
        this.itemTemplate = MenuItem; // Template for menu items
    }

    addItem(item, itemLink = "#", itemTitle = "No title provided", itemFunction = null) {
        const tempMenuObject = Object.create(this.itemTemplate); // Create a new object based on the template
        if (Array.isArray(item)) {
            item.forEach(subItem => {
                if (typeof subItem === 'object' && subItem.name && subItem.link && subItem.title) {
                    tempMenuObject.assign(subItem); // Use the MenuItem template
                    this.items.push(tempMenuObject);
                }
            });
        } else if (typeof item === 'object') {
            if (item.name && item.link && item.title) {
                tempMenuObject.assign(item); // Use the MenuItem template
                this.items.push(tempMenuObject);
            } else {
                console.warn("Invalid item object. Must have name, link, and title properties.");
            }
        } else if (typeof item === 'string') {
            tempMenuObject.name = item || 'Menu Item';
            tempMenuObject.title = itemTitle || 'No title provided';
            tempMenuObject.link = itemLink || '#';
            tempMenuObject.click = itemFunction || null;
            this.items.push(tempMenuObject);
        } else {
            console.warn("Unsupported item type.");
        }
    }

    show() {
        if(!this.element) {
            console.warn("Menu element not found. Cannot show menu.");
            return false;
        }
        else if (this.items.length === 0) {
            this.element.innerHTML = `<h2>${this.menuName}</h2>`; // Show a message if no items
            console.warn("No items in the menu to display.");
            this.element.style.display = 'block'; // Show the menu even if empty
            return true;
        }
        else {
            this.element.innerHTML = `<h2 onClick="${this.childOf.GameObject.variableName}">${this.menuName}</h2><ul></ul>`; // Reset the menu title
            const ulElement = this.element.querySelector('ul'); // Get the ul element to append items
            if (!ulElement) {
                console.warn("No ul element found in the menu. Cannot append items.");
                return false;
            }
            else
            {
                ulElement.innerHTML = ''; // Clear previous items
                this.items.forEach(item => {
                const itemElement = document.createElement('li'); // Create a new list item for each menu item
                itemElement.className = 'menu-item'; // Set class for styling
                itemElement.innerHTML = `<a href="${item.link}" onClick="${item.click}" title="${item.title}">${item.name}</a>`; // Set the item content
                this.element.appendChild(itemElement); // Append the item to the menu
                });
            }
        }
        this.element.style.display = 'block'; // Show the menu
    }

    hide() {
        this.element.style.display = 'none'; // Hide the menu
    }
}


// Basic classes for a tabletop game


class TableTop {
    constructor() {
        const GameObject = {
            name: 'TableTop Game',
            variableName: 'myTableTop' 
        };
        this.GameObject = Object.create(GameObject); // Create a new object based on the template
        Object.seal(this.GameObject); // Prevent additions or deletions of properties

        this.Game = new Game("TableTop Game");
        this.ViewPort = new TableTop_ViewPort();
        this.WindowManager = new TableTop_WindowManager();
        this.Dice = {};
        this.Dice['d6'] = new TableTop_Dice('d6'); // Default dice type
        this.Menu = []; // Initialize the menu object
        this.Menu['main'] = new TableTop_Menu(this, 'tabletop-menu-root','Main Menu'); // Main menu instance
        this.Menu['main'].addItem('New Game',  '#', 'Start a new game');
        this.Menu['main'].addItem('Configuration', '#', 'Game configuration settings');
        this.Menu['main'].addItem('Set Batch', '#', 'Get help and support', 'myTableTop.setBatch(5)');
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

    openMenu(menuName) {
        // Logic to open the main menu
        console.log("Opening menu:", menuName);
        const menu = document.getElementById(menuName);
        if (menu) {
            if (menu.style.display === 'none' || menu.style.display === '') {
                menu.style.display = 'block'; // Show the menu if it's hidden
            }
            else { 
                menu.style.display = 'none'; // Hide the menu if it's visible
            }
        } else {
            console.warn("Main menu element not found in the DOM");
        }
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

