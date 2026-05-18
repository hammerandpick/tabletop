export class TableTop_ViewPort {
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
        const el = document.getElementById('tabletop-viewport');
        if (el) el.style.transform = `rotate(${this.rotation}deg)`;
        console.log(`Viewport rotated to ${this.rotation} degrees`);
    }
}
