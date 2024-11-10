import * as fs from 'fs';
import { session } from 'electron';
import { BasePath } from '../utils/base-path';
import { knex } from '../db';

export interface EnableNetworkProps {
  id: string;
  ref: string;
}

export async function EnableNetworkLog(
  event: Electron.IpcMainEvent,
  { id, ref }: EnableNetworkProps,
) {
  const record = (
    await knex('record')
      .insert({
        session_id: id,
        ref,
      })
      .returning('id')
  )[0].id;

  const partitionPath = `${BasePath}/session_log/${id}/${ref}`;
  await fs.mkdirSync(partitionPath, {
    recursive: true,
  });

  const ses = session.fromPartition(id);
  ses.webRequest.onBeforeSendHeaders(
    { urls: [], types: ['xhr'] },
    async (details, callback) => {
      await fs.writeFileSync(
        `${partitionPath}/${details.id}-${new Date().getTime()}.request.json`,
        JSON.stringify(details),
      );
      await knex('record_log').insert({
        record_id: record,
        data: {
          request: details,
          response: null,
        },
        ref: details.id,
      });

      callback({ requestHeaders: details.requestHeaders });
    },
  );

  ses.webRequest.onHeadersReceived(
    {
      urls: [],
      types: ['xhr'],
    },
    async (details, callback) => {
      await fs.writeFileSync(
        `${partitionPath}/${details.id}-${new Date().getTime()}.response.json`,
        JSON.stringify(details),
      );

      const recordLog = await knex('record_log')
        .where('record_id', record)
        .where('ref', details.id)
        .first();

      recordLog.data = JSON.parse(recordLog.data);
      recordLog.data.response = details;

      await knex('record_log')
        .where('id', recordLog.id)
        .update({
          data: JSON.stringify(recordLog.data),
          updated_at: new Date().toISOString(),
        });

      callback({ responseHeaders: details.responseHeaders });
    },
  );
}

export async function DisableNetworkLog(
  event: Electron.IpcMainEvent,
  { id, ref }: EnableNetworkProps,
) {
  const update = await knex('record')
    .where('ref', ref)
    .update({ end_timestamp: new Date().toISOString() });

  const ses = session.fromPartition(id);
  ses.webRequest.onBeforeSendHeaders(null);
}
