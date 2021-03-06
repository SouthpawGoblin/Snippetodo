'use strict'

declare const __static: string;
import { app, protocol, BrowserWindow, Tray, Menu, clipboard, globalShortcut } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import Lokijs from 'lokijs';
import MyGlobal from '@/classes/MyGlobal';
import fs from 'fs';
import path from 'path';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
let tray: Tray | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

const isDevelopment = process.env.NODE_ENV !== 'production';

const SHOW_WINDOW_HOTKEY = 'CommandOrControl+Alt+Q';

// global clipboard
(global as MyGlobal).clipboard = clipboard;

// load lokijs db
function initDB() {
  if (!fs.existsSync('./db')) {
    fs.mkdirSync('./db');
  }
  const lokiDB = new Lokijs('./db/st.db', {
    autoload: true,
    autoloadCallback: (err) => {
      if (!lokiDB.getCollection('snippets')) {
        lokiDB.addCollection('snippets', {
          unique: ['id'],
        });
      }
      if (!lokiDB.getCollection('todos')) {
        lokiDB.addCollection('todos', {
          unique: ['id'],
        });
      }
      lokiDB.saveDatabase();
    },
  });
  (global as MyGlobal).db = lokiDB;
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ 
    width: 450, 
    height: 750, 
    alwaysOnTop: true, 
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__static, 'butler-icon.png')
  })
  win.setMaximizable(false);
  win.setMinimumSize(400, 600);
  Menu.setApplicationMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  win.on('close', (e: any) => {
    if (!win) return;
    e.preventDefault();
    win.hide();
  })
  win.on('closed', () => {
    win = null
    tray = null
  })

  // create tray
  tray = new Tray(path.join(__static, 'butler-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Exit', 
      type: 'normal', 
      click: (menuItem, browserWindow, event) => {
        process.exit();
      }
    }
  ])
  tray.setToolTip('Butler')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (!win) return;
    win.show();
  });

  // register global hotkey
  globalShortcut.register(SHOW_WINDOW_HOTKEY, () => {
    if (!win) return;
    win.show();
  })
}

// single instance mode
if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  // Focus the first instance on second-instance
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (!win) return
    win.show()
    win.focus()
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      initDB()
      createWindow()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installVueDevtools()
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString())
      }
    }
    initDB()
    createWindow()
  })

  app.on('will-quit', () => {
    // unregister all hotkeys
    globalShortcut.unregisterAll()
  })
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
