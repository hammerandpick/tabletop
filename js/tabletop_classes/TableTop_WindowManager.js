export class TableTop_WindowManager{
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
