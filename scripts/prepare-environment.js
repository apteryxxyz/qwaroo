/**
 * Prepares the current environment for deploying, which is either production or staging.
 * It renames the .env.{environment} file to .env.local, and renames the docker-compose.{environment}.yml file to docker-compose.override.yml.
 */

const fs = require('fs');
const path = require('path');

const directories = ['.', './apps/www'];
const environments = ['production', 'development', 'staging', 'reset'];

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