import { BrowserWindow } from 'electron';
import path from 'path';

const createSettingsWindow = () => {
  // Create the browser window.

  const settingsWindow = new BrowserWindow({
    title: 'Settings',
    width: 250,
    height: 306,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    skipTaskbar: true,
    frame: false,
    resizable: false,
  });

  settingsWindow.setAlwaysOnTop(true, 'screen-saver');


  if (SETTINGS_WINDOW_VITE_DEV_SERVER_URL) {
    settingsWindow.loadURL(SETTINGS_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    settingsWindow.loadFile(path.join(__dirname, `../renderer/${SETTINGS_WINDOW_VITE_NAME}/index.html`));
  }
  settingsWindow.hide();


  return settingsWindow;

};

export default createSettingsWindow;