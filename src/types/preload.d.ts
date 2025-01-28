interface Config {
  grabLocation: boolean;
  opacity: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface Window {
  settingsAPI: {
    showSettings: () => void;
    getSettings: () => Promise<Config>;
    setSettings: (settings: any) => void;
    getIsSettingsVisible: () => Promise<boolean>;
    hideSettings: () => void;
  }
}