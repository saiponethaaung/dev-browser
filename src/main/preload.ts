// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { mkdirSync, writeFile } from 'fs';
import { EnableNetworkProps } from './ipc/network-log';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    recordSession: (partition: EnableNetworkProps) => {
      ipcRenderer.send('networkLog', partition);
    },
    stopRecordSession: (partition: EnableNetworkProps) => {
      ipcRenderer.send('disableNetworkLog', partition);
    },
    runQuery: async (query: string, params: any) => {
      const res = await ipcRenderer.invoke('runQuery', {
        query,
        params,
      });
      console.log(res);
      return res;
    },
    getVideoSources: async () => {
      return ipcRenderer.invoke('getVideoSources');
    },
    showSaveDialog: async (buffer: any, params: EnableNetworkProps) => {
      // const { canceled, filePath } = await ipcRenderer.invoke('showSaveDialog');
      // if (canceled) return;
      // console.log('filepath', filePath);
      // writeFile(filePath, buffer, () => console.log('File saved'));
      await ipcRenderer.invoke('saveVideo', { buffer, params });
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
