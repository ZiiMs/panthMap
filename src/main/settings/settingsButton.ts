import { BrowserWindow, screen } from 'electron';
import path from 'path';

const createButtonWindow = () => {
  // Create the browser window.
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.size;

  const buttonWindow = new BrowserWindow({
    title: 'Settings Button',
    width: 45,
    height: 45,
    x: screenWidth - 42,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    skipTaskbar: true,
    frame: false,
    resizable: false,
    transparent: true,
  });

  buttonWindow.setAlwaysOnTop(true, 'screen-saver');
  // buttonWindow.hide();


  if (BUTTON_WINDOW_VITE_DEV_SERVER_URL) {
    buttonWindow.loadURL(`${BUTTON_WINDOW_VITE_DEV_SERVER_URL}/button.html`);
  } else {
    console.log(BUTTON_WINDOW_VITE_NAME);
    buttonWindow.loadFile(path.join(__dirname, `../renderer/${BUTTON_WINDOW_VITE_NAME}/button.html`));
  }


  return buttonWindow;

};

export default createButtonWindow;