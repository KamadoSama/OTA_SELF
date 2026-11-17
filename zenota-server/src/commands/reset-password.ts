import prompts from 'prompts';
import chalk from 'chalk';
import { spawnSync } from 'child_process';

export async function resetPasswordCommand(emailArg?: string) {
  let email = emailArg;

  if (!email) {
    const res = await prompts({
      type: 'text',
      name: 'email',
      message: 'Enter the account email:',
      validate: (v) => (v && v.includes('@') ? true : 'Valid email is required'),
    });
    email = res.email;
  }

  if (!email) {
    console.log(chalk.red('\nCancelled.'));
    process.exit(1);
  }

  const passRes = await prompts({
    type: 'password',
    name: 'password',
    message: 'Enter the new password (min 8 chars):',
    validate: (v) =>
      v && v.length >= 8 ? true : 'Password must be at least 8 characters',
  });

  if (!passRes.password) {
    console.log(chalk.red('\nCancelled.'));
    process.exit(1);
  }

  const script = `
    const bcrypt = require('bcrypt');
    const { Client } = require('pg');
    (async () => {
      const client = new Client({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      const hash = await bcrypt.hash(process.env.RESET_PASSWORD, 10);
      const res = await client.query(
        'UPDATE "Customer" SET "passwordHash" = $1, "resetTokenHash" = NULL, "resetTokenExpiresAt" = NULL WHERE email = $2 RETURNING id',
        [hash, process.env.RESET_EMAIL]
      );
      await client.end();
      if (res.rowCount === 0) {
        console.error('USER_NOT_FOUND');
        process.exit(2);
      }
      console.log('UPDATED');
    })().catch((err) => { console.error(err); process.exit(1); });
  `;

  const result = spawnSync(
    'docker',
    [
      'exec',
      '-e',
      `RESET_EMAIL=${email}`,
      '-e',
      `RESET_PASSWORD=${passRes.password}`,
      'ota_backend',
      'node',
      '-e',
      script,
    ],
    { encoding: 'utf-8' },
  );

  if (result.status === 2 || result.stderr?.includes('USER_NOT_FOUND')) {
    console.log(chalk.red(`❌ No user found with email: ${email}`));
    process.exit(1);
  }

  if (result.status !== 0) {
    console.log(
      chalk.red(
        '❌ Failed to reset password. Make sure ota_backend is running and you have Docker permissions (try sudo).',
      ),
    );
    if (result.stderr) console.error(result.stderr.trim());
    process.exit(1);
  }

  console.log(chalk.green(`✔ Password successfully updated for ${email}.`));
}
