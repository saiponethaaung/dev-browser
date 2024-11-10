import { desktopCapturer, dialog, ipcMain, session } from 'electron';
import * as fs from 'fs';
import { knex } from './db';
import { DisableNetworkLog, EnableNetworkLog } from './ipc/network-log';
import { BasePath } from './utils/base-path';
import { ExecuteQuery } from './ipc/execute-query';
import { SaveVideo } from './ipc/save-video';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('networkLog', EnableNetworkLog);

ipcMain.on('disableNetworkLog', DisableNetworkLog);

ipcMain.handle('runQuery', ExecuteQuery);

ipcMain.handle('getVideoSources', async () => {
  return desktopCapturer.getSources({ types: ['screen', 'window'] });
});

ipcMain.handle('showSaveDialog', async () => {
  return dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`,
  });
});

ipcMain.handle('saveVideo', SaveVideo);
