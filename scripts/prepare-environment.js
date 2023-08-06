/**
 * Prepares the current environment for deploying, which is either production or staging.
 * It renames any .env.local.{environment} files to .env.local.
 */

const fs = require('fs');
const path = require('path');
const environments = ['production', 'development', 'staging', 'reset'];

void main(process.argv.length, process.argv);
async function main(argc, argv) {
  const environment = argv[2];
  if (!environments.includes(environment))
    return console.error(
      `[Prepare Enviroment] Invalid environment: ${environment}`,
    );

  resetFiles();
  if (environment !== 'unset') copyEnvFiles(environment);

  console.info(
    `[Prepare Enviroment] Finished preparing environment: ${environment}`,
  );
}

function resetFiles() {
  try {
    fs.rmSync('.env');
    console.info(`[Prepare Enviroment] Removed .env`);
  } catch {}
}

function copyEnvFiles(environment) {
  fs.copyFileSync(`.env.${environment}`, '.env');
  console.info(`[Prepare Enviroment] Copied .env to .env.${environment}`);
}

/*
void main(process.argv.length, process.argv);
async function main(argc, argv) {
    const environment = argv[2];
    if (!environments.includes(environment))
        return console.error(`[Prepare Enviroment] Invalid environment: ${environment}`);

    await resetFiles();
    if (environment !== 'unset') await copyEnvFiles(environment)

    console.info(`[Prepare Enviroment] Finished preparing environment: ${environment}`);
}

async function copyEnvFiles(environment) {
    for (const file of findAllOf(`.env.local.${environment}`)) {
        const newFile = file.replace(`.env.local.${environment}`, '.env.local');
        fs.copyFileSync(file, newFile);
        console.info(`[Prepare Enviroment] Copied ${file} to ${newFile}`)
    }
}

async function resetFiles() {
    for (const file of findAllOf('.env.local')) {
        fs.rmSync(file);
        console.info(`[Prepare Enviroment] Removed ${file}`);
    }
}

function findAllOf(match) {
    const files = [];
    for (const directory of directories) {
        const file = lookInDirectoryFor(directory, match);
        if (file) files.push(file);
    }

    return files;
}

function lookInDirectoryFor(directory, match) {
    for (const file of fs.readdirSync(directory))
        if (file === match) return path.join(directory, file);
    return null;
}
*/
