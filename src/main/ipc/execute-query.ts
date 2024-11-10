import { knex } from '../db';

export async function ExecuteQuery(
  event: Electron.IpcMainInvokeEvent,
  arg: any,
): Promise<any> {
  const query = await knex.raw(arg.query, arg.params);
  return query;
}
