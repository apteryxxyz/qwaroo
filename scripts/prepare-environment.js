/**
 * Prepares the current environment for deploying, which is either production or staging.
 * It renames the .env.{environment} file to .env.local, and renames the docker-compose.{environment}.yml file to docker-compose.override.yml.
 */

const fs = require('fs');
const { glob } = require('glob');

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
    const files = await glob(`**/.env.local.${environment}`);
    for (const file of files) {
        const newFile = file.replace(`.env.local.${environment}`, '.env.local');
        fs.copyFileSync(file, newFile);
        console.info(`[Prepare Enviroment] Copied ${file} to ${newFile}`)
    }
}

async function resetFiles() {
    const files = await glob('**/.env.local');
    for (const file of files) {
        fs.rmSync(file);
        console.info(`[Prepare Enviroment] Removed ${file}`);
    }
}
