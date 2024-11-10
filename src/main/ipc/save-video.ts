import * as fs from 'fs';
import { BasePath } from '../utils/base-path';
import { EnableNetworkProps } from './network-log';

interface SaveVideoProps {
  buffer: any;
  params: EnableNetworkProps;
}

export async function SaveVideo(
  event: Electron.IpcMainInvokeEvent,
  { buffer, params }: SaveVideoProps,
) {
  const partitionPath = `${BasePath}/session_log/${params.id}/${params.ref}`;

  await fs.mkdirSync(`${BasePath}/session_log/${params.id}/${params.ref}`, {
    recursive: true,
  });

  await fs.writeFile(partitionPath + '/video.webm', buffer, () => {
    console.log('Video File saved!');
  });
}
