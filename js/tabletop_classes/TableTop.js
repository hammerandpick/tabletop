export class TableTop {
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
                const container = document.getElementById('tabletop-dice');
                if (container) container.appendChild(myDieObject.divElement); // Append the dice container to the viewport
                console.log(`Linked die ID: ${myDie} to parent element.`);
            };
        }
        else
        {
            const container = document.getElementById('tabletop-dice');
            if (container) container.appendChild(die.divElement); // Append the dice container to the viewport
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
