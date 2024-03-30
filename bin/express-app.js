#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const inquirer = require('inquirer');

program
  .version('1.0.0')
  .description('Generate a new Express application')
  .option('-n, --name <name>', 'Application name')
  .option('-d, --directory <directory>', 'Directory to create the application in')
  .parse(process.argv);

const run = async () => {
  let appName = program.name;
  let appDirectory = program.directory || appName;

  if (!appName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of your Express application:',
        validate: (input) => {
          if (!input) {
            return 'Please enter a name for your application.';
          }
          return true;
        },
      },
    ]);
    appName = name;
  }

  const templatePath = path.join(__dirname, 'templates');
  const appPath = path.join(process.cwd(), appDirectory);

  if (fs.existsSync(appPath)) {
    console.error(chalk.red(`Error: Directory ${appDirectory} already exists.`));
    process.exit(1);
  }

  const copyTemplateFiles = (source, destination) => {
    fs.readdirSync(source).forEach((file) => {
      const sourceFile = path.join(source, file);
      const destinationFile = path.join(destination, file);
      if (fs.lstatSync(sourceFile).isDirectory()) {
        fs.mkdirSync(destinationFile);
        copyTemplateFiles(sourceFile, destinationFile);
      } else {
        fs.copyFileSync(sourceFile, destinationFile);
      }
    });
  };

  fs.mkdirSync(appPath);
  copyTemplateFiles(templatePath, appPath);
  process.chdir(appPath);

  const packageJson = {
    name: appName,
    version: '1.0.0',
    description: 'Express application generated with create-express-app-js',
    main: 'index.js',
    scripts: {
      start: 'node index.js',
    },
    keywords: ['express', 'generator', 'cli', 'template'],
    author: '',
    license: 'MIT',
    dependencies: {
      express: '^4.17.1',
    },
  };

  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  console.log(chalk.green(`Success! Express application '${appName}' created in '${appDirectory}'`));
};

run();
