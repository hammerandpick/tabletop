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

class TableTop_Die{
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
                document.getElementById('tabletop-dice').appendChild(this.divElement); // Append the dice container to the viewport
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
        /*
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
        } */
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

        this.Game = new ttGame("TableTop Game");
        this.ViewPort = new TableTop_ViewPort();
        this.WindowManager = new TableTop_WindowManager();
        this.Dice = {};
        this.Menu = []; // Initialize the menu object
        this.Menu['main'] = new TableTop_Menu(this, 'tabletop-menu-root','Main Menu'); // Main menu instance
        this.Menu['main'].addItem('New Game',  '#', 'Start a new game');
        this.Menu['main'].addItem('Configuration', '#', 'Game configuration settings');
        this.Menu['main'].addItem('Set Batch', '#', 'Get help and support', 'myTableTop.setBatch(5)');
        this.moduleList = []; // List of registered game modules
    }

    loadFile(file) {
        // Logic to load a game file

        if (!file || !file.name) {
            throw new Error("Invalid file provided");
        }
        console.log(`Loading file: ${file.name}`);
    }

    addDie(dieType, parentElement = null) {
        // Logic to add a die to the game
        const newDie = new TableTop_Die(dieType, parentElement);
        this.Dice[newDie.id] = newDie;
        console.log(`Added die: ${dieType} with ID: ${newDie.id}`);
        return newDie;
    }

    listDice() {
        // Logic to list all dice in the game
        console.log("Current dice in the game:");
        for (const [id, die] of Object.entries(this.Dice)) {
            console.log(`Die ID: ${id}, Type: ${die.diceType}, Last Roll: ${die.LastRoll}`);
        }
    }

    linkDiceToParent(dieID, parentElement) {
        // Logic to link a die to a parent element
        if (!parentElement || !(parentElement instanceof HTMLElement)) {
            parentElement = document.getElementById('tabletop-dice'); // Default to dice container
        }

        const die = this.Dice[dieID];
        if (typeof die === "undefined") {
            for (let [myDie, myDieObject] of Object.entries(this.Dice)) {
                document.getElementById('tabletop-dice').appendChild(myDieObject.divElement); // Append the dice container to the viewport
                console.log(`Linked die ID: ${myDie} to parent element.`);
            };
        }
        else
        {
            document.getElementById('tabletop-dice').appendChild(die.divElement); // Append the dice container to the viewport
            console.log(`Linked die ID: ${dieID} to parent element.`);
        }
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

    registerModule(module) {
        // Logic to register a game module
        if (!module || !module.name) {
            throw new Error("Invalid module provided");
        }
        try {
            this.moduleList.push(module);
            console.log(`Registering module: ${module.name}`);
        } catch (error) {
            console.error("Failed to register module:", error);
        }
        myTableTop.initializeModule();
    }

    initializeModule(){
        if (!this.moduleList || this.moduleList.length === 0) {
            console.warn("No modules registered to initialize.");
            return;
        }
        else {
            this.moduleList.forEach(module => {
                if (typeof module.initialize === 'function') {
                module.initialize(); // Call the module's initialize method if it exists
                }
                if (typeof module.prepare === 'function') {
                    module.prepare(); // Call the module's initialize method if it exists
                }
            });
        }
    }

}

class ttPlayer{
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

class ttGame {
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
        /*this.players.forEach(player => {
            player.score = 0; // Reset player scores
            player.active = true; // Set all players to active
        });*/
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

