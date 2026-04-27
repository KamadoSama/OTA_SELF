import { runCompose } from '../lib/docker';

export async function logsCommand(service?: string) {
  const installDir = '/opt/zenota';
  const action = service ? `logs -f ${service}` : 'logs -f';
  runCompose(action, installDir);
}
