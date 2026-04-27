import { runCompose } from '../lib/docker';

export async function statusCommand() {
  const installDir = '/opt/zenota';
  console.log('\n--- ZenOTA Service Status ---');
  runCompose('ps', installDir);
}
