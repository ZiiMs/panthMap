import ActiveWindow from '@paymoapp/active-window';
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, screen, Tray } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';
import { startPacketCapture, stopPacketCapture } from '../tshark';
import ConfigManager from './config/configManager';
import createSettingsWindow from './settings/settings';
import createButtonWindow from './settings/settingsButton';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
ActiveWindow.initialize()




const createMapWindow = (config: Config) => {
  // Create the browser window.

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.size;

  const mainWindowX = screenWidth - 800 - 30;

  const mainWindow = new BrowserWindow({
    title: 'Map',
    width: config.width,
    height: config.height,
    x: config.x,
    y: config.y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    skipTaskbar: true,
    frame: false,
    resizable: false,
    opacity: config.opacity,
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.loadURL('https://shalazam.info/maps/1');
  mainWindow.hide();


  return mainWindow;

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const configManager = new ConfigManager();
  const iconPath = path.join(__dirname, '/assets/iconApp256.png');
  console.log(iconPath);

  const tray = new Tray(nativeImage.createFromPath(iconPath));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        settingsWindow.show();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    }

  ]);
  tray.setContextMenu(contextMenu);

  configManager.loadOrCreateConfig();
  const mapWindow = createMapWindow(configManager.getConfig());
  const settingsWindow = createSettingsWindow();
  const buttonWindow = createButtonWindow();

  // Tshark process
  if (configManager.getConfig().grabLocation)
    startPacketCapture((x: number, y: number) => {
      mapWindow.loadURL(`https://shalazam.info/maps/1?zoom=4&x=${x}&y=${y}&pin%5B%5D=${x}.${y}.Player+Location`)
    })

  globalShortcut.register('CommandOrControl+M', () => {
    const visible = mapWindow.isVisible();

    mapWindow[visible ? 'hide' : 'show']();
  });

  ipcMain.handle('is-settings-visible', () => settingsWindow.isVisible());

  ipcMain.on('show-settings', () => {
    console.log('show-settings');
    settingsWindow.show();
  });

  ipcMain.on('hide-settings', () => {
    console.log('hide-settings');
    settingsWindow.hide();
  });

  ipcMain.on('setWindowPosition', (x, y) => {
    mapWindow.setPosition(x, y, true);
  });

  ipcMain.on('setWindowSize', (width, height) => {
    mapWindow.setResizable(true);
    mapWindow.setSize(width, height, true);
    mapWindow.setResizable(false);

  });

  ipcMain.on('setWindowOpacity', (opacity) => {
    mapWindow.setOpacity(opacity);
  });

  ipcMain.on('setWindowGrabLocation', (grabLocation) => {
    if (grabLocation)
      startPacketCapture((x: number, y: number) => {
        mapWindow.loadURL(`https://shalazam.info/maps/1?zoom=4&x=${x}&y=${y}&pin%5B%5D=${x}.${y}.Player+Location`)
      })
    else
      stopPacketCapture();
  });


  ActiveWindow.subscribe((winInfo) => {
    // console.log(winInfo.title)
    if (winInfo.application === 'Pantheon.exe' || winInfo.title === 'Button!PMAP') {
      buttonWindow.show();
      // console.log('show button window')
    } else {
      buttonWindow.hide();
      // console.log('hide button window')
    }
  })


});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createMapWindow();
//   }
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
