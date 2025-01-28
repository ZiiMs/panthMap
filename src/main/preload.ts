// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('settingsAPI', {
  showSettings: () => ipcRenderer.send('show-settings'),
  hideSettings: () => ipcRenderer.send('hide-settings'),
  getIsSettingsVisible: () => ipcRenderer.invoke('is-settings-visible'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  setSettings: (settings: Config) => ipcRenderer.send('set-settings', settings),
});
