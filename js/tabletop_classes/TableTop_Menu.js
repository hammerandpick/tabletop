export class TableTop_Menu{
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
