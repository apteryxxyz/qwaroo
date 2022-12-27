// Custom start script to allow for port configuration from env file
const { loadEnvConfig } = require('@next/env');
const cli = require('next/dist/cli/next-start');

const { combinedEnv } = loadEnvConfig(process.cwd());
cli.nextStart(['-p', combinedEnv['PORT'] ?? 3_000]);
