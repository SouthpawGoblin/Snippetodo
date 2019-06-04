import { screen, BrowserWindow, Rectangle } from 'electron'

export default class MyBrowserWindow extends BrowserWindow {
  private stickable: boolean = true;
  private sticking: boolean = false;
  private stickyDistance: number = 10;

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
      const screenSize = screen.getPrimaryDisplay().size;
      let leftDistance = screenSize.width - newBounds.x;
      if (leftDistance < newBounds.width + this.stickyDistance) {
        event.preventDefault();
        newBounds.x = screenSize.width - newBounds.width;
        this.setBounds(newBounds);
        this.sticking = true;
      } else {
        this.sticking = false;
      }
    });
    this.on('blur', () => {
      if (!this.sticking) return;
      const bounds = this.getBounds();
      bounds.x = screen.getPrimaryDisplay().size.width - this.stickyDistance;
      this.setBounds(bounds, true);
    });
    this.on('focus', () => {
      if (!this.sticking) return;
      const bounds = this.getBounds();
      bounds.x = screen.getPrimaryDisplay().size.width - bounds.width;
      this.setBounds(bounds, true);
    });
  }
}