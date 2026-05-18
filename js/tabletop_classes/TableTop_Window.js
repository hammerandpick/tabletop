export class TableTop_Window{
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
    }

    showWindow() {
        // Logic to display the window
        console.log(`Showing window: ${this.windowName} with ID: ${this.windowID}`);
        const vp = document.getElementById('tabletop-viewport');
        if (vp) vp.style.display = 'block';
    }
}
