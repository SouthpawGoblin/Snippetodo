import { screen, BrowserWindow, Rectangle } from 'electron'

export default class STBrowserWindow extends BrowserWindow {
  private stickable: boolean = true;
  private sticky: boolean = false;
  private stickyDistance: number = 20;

  getStickable() {
    return this.stickable;
  }

  setStickable(flag: boolean) {
    this.stickable = flag;
  }

  constructor(options?: Electron.BrowserWindowConstructorOptions | undefined) {
    super(options);
    this.on('will-move', (event: Event, newBounds: Rectangle) => {
      if (!this.stickable) return;
      const screenSize = screen.getPrimaryDisplay().workAreaSize;
      let leftDistance = screenSize.width - newBounds.x;
      if (leftDistance < newBounds.width + this.stickyDistance) {
        event.preventDefault();
        newBounds.x = screenSize.width - newBounds.width;
        this.setBounds(newBounds, true);
      }
    });
  }
}