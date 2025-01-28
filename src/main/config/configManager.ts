import { app, ipcMain, screen } from 'electron';
import fs from 'fs';
import path from 'path';



const configPath = path.join(app.getPath('userData'), 'config.json');


class ConfigManager {

  private config: Config;


  constructor(config: Config | null = null) {

    console.log(configPath);
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth } = primaryDisplay.size;

    const mainWindowX = screenWidth - 800 - 30;

    this.config = {
      grabLocation: config?.grabLocation ?? false,
      opacity: config?.opacity ?? 0.7,
      width: config?.width ?? 800,
      height: config?.height ?? 600,
      x: config?.x ?? mainWindowX,
      y: config?.y ?? 30,
    }

    ipcMain.on("set-settings", (event, settings: Config) => {
      console.log(settings);
      this.config = settings;
      this.saveConfig();
      this.setWindowPosition(settings.x, settings.y);
      this.setWindowSize(settings.width, settings.height);
      this.setWindowOpacity(settings.opacity);
      this.setWindowGrabLocation(settings.grabLocation);
    });

    ipcMain.handle('get-settings', () => this.config);
  }

  public getConfig() {
    return this.config;
  }

  public setConfig(config: Config) {
    this.config = config;
  }

  public saveConfig() {
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }

  public loadConfig() {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  public setWindowPosition(x: number, y: number) {
    this.config.x = x;
    this.config.y = y;
    console.log(x, y);
    this.saveConfig();
    ipcMain.emit('setWindowPosition', x, y);
  }

  public setWindowSize(width: number, height: number) {
    this.config.width = width;
    this.config.height = height;
    this.saveConfig();
    ipcMain.emit('setWindowSize', width, height);
  }

  public setWindowOpacity(opacity: number) {
    this.config.opacity = opacity;
    this.saveConfig();
    ipcMain.emit('setWindowOpacity', opacity);
  }

  public setWindowGrabLocation(grabLocation: boolean) {
    this.config.grabLocation = grabLocation;
    this.saveConfig();
    ipcMain.emit('setWindowGrabLocation', grabLocation);
  }

  public loadOrCreateConfig() {
    if (fs.existsSync(configPath)) {
      this.loadConfig();
    } else {
      this.saveConfig();
    }
  }
}



export default ConfigManager;
