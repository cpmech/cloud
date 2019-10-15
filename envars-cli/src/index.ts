import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { readEnvars } from './readEnvars';

console.log(chalk.yellow(figlet.textSync('ENVARS', { horizontalLayout: 'full' })));

async function main() {
  const defaultProject = path.basename(process.cwd());
  const answers = await inquirer.prompt([
    {
      name: 'project',
      type: 'input',
      message: 'What is the project name?',
      default: defaultProject,
    },
    {
      name: 'stage',
      type: 'input',
      default: 'dev',
      message: 'What stage (e.g. dev, test, prod)?',
    },
  ]);
  const stage = (answers as any).stage;
  const project = (answers as any).project;
  const dbPath = process.env.ENVARS_JSON_PATH || '';
  try {
    const envars = readEnvars(dbPath, project, stage);
    let buffer = '';
    Object.keys(envars).forEach(key => {
      buffer += `export ${key}="${envars[key]}"\n`;
    });
    const outputPath = `/tmp/envars-${project}`;
    fs.writeFileSync(outputPath, buffer, { encoding: 'UTF-8' });
    console.log();
    console.log(chalk.blueBright('Now, you just need to run:'));
    console.log();
    console.log(chalk.yellowBright(`source ${outputPath}\n`));
  } catch (err) {
    const msg = err.message || JSON.stringify(err);
    console.warn(chalk.red(msg));
  }
}

main();
