#!/usr/bin/env node

import { resolve } from 'node:path';

import { sealPublicBridge } from './sealing.mjs';
import { validatePublicBridge } from './validation.mjs';

try {
  const { command, options } = parseArguments(process.argv.slice(2));
  if (!['validate', 'seal'].includes(command)) throw new TypeError('command must be validate or seal');
  const bridge = resolve(options.bridge);
  if (command === 'validate' && options.apply) throw new TypeError('--apply is only valid with seal');
  if (command === 'seal' && options.mode !== undefined) throw new TypeError('--mode is only valid with validate');
  const result =
    command === 'validate'
      ? await validatePublicBridge({ bridge, mode: options.mode, locale: options.locale })
      : await sealPublicBridge({ bridge, locale: options.locale, apply: options.apply });
  process.stdout.write(`${JSON.stringify(result)}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}

function parseArguments(args) {
  const command = args.shift();
  const options = {};
  const seen = new Set();
  while (args.length > 0) {
    const option = args.shift();
    if (seen.has(option)) throw new TypeError(`duplicate option: ${option}`);
    seen.add(option);
    if (option === '--apply') {
      options.apply = true;
      continue;
    }
    if (!['--bridge', '--mode', '--locale'].includes(option)) {
      throw new TypeError(`unknown option: ${option}`);
    }
    const value = args.shift();
    if (!value || value.startsWith('--')) throw new TypeError(`${option} requires a value`);
    options[option.slice(2)] = value;
  }
  if (!options.bridge) throw new TypeError('--bridge is required');
  return { command, options };
}
