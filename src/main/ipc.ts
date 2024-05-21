import { ipcMain, session } from 'electron';
import * as fs from 'fs';
import { knex } from './db';

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('networkLog', async (event, arg) => {
  const partitionPath = __dirname + `/session_log/${arg}`;
  await fs.mkdirSync(__dirname + `/session_log/${arg}`, { recursive: true });

  const ses = session.fromPartition(arg);

  ses.webRequest.onBeforeSendHeaders(
    { urls: [], types: ['xhr'] },
    async (details, callback) => {
      await fs.writeFileSync(
        partitionPath + `/${new Date().getTime()}.request.json`,
        JSON.stringify(details),
      );
      callback({ requestHeaders: details.requestHeaders });
    },
  );
  // event.reply('ipc-example', 'network');
});

ipcMain.on('disableNetworkLog', async (event, arg) => {
  const ses = session.fromPartition(arg);
  ses.webRequest.onBeforeSendHeaders(null);
  // event.reply('ipc-example', 'network');
});

ipcMain.handle('runQuery', async (event, arg) => {
  console.log("Running query", arg)
  const query = await knex.raw(arg.query, arg.params);
  return query;
});
