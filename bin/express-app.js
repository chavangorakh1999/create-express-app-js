#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Parse command-line arguments
program
  .version("1.0.4")
  .description("Generate a new Express application")
  .option(
    "-d, --directory <directory>",
    "Directory to create the application in"
  )
  .parse(process.argv);

// Function to sanitize folder names
const sanitizeFolderName = (name) => {
  // Convert to lowercase
  let sanitized = name.toLowerCase();
  // Remove special characters except hyphens
  sanitized = sanitized.replace(/[^a-z0-9-]/g, "");
  return sanitized;
};

const run = async () => {
  let appName = process.argv[2];

  // Check if the first argument is a dot (indicating current directory)
  if (appName === "." && process.argv.length === 3) {
    // Get the base name of the current working directory
    appName = path.basename(process.cwd());
    // Update appPath to current working directory
    appPath = process.cwd();
  } else if (!appName || process.argv.length !== 3) {
    console.error("Error: Application name must be provided.");
    process.exit(1);
  } else {
    // Sanitize folder name
    appName = sanitizeFolderName(appName);
    // Create new directory with sanitized name
    appPath = path.join(process.cwd(), program.opts().directory || appName);
  }

  const inquirer = await import("inquirer");
  const chalk = await import("chalk");

  const authorPrompt = await inquirer.default.prompt([
    {
      type: "input",
      name: "author",
      message: "Enter the name of the author:",
    },
  ]);

  const author = authorPrompt.author || "";

  const templatePath = path.join(__dirname, "../app_template");

  if (fs.existsSync(appPath)) {
    console.error(
      chalk.default.red(`Error: Directory ${appPath} already exists.`)
    );
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

  copyTemplateFiles(templatePath, appPath);
  process.chdir(appPath);

  const packageJson = {
    name: appName,
    version: "1.0.0",
    description: "Express application generated with create-express-app-js",
    main: "index.js",
    scripts: {
      start: "node index.js",
    },
    keywords: ["express", "generator", "cli", "template"],
    author,
    license: "MIT",
    dependencies: {
      "body-parser": "^1.20.2",
      cheerio: "^1.0.0-rc.12",
      cors: "^2.8.5",
      dotenv: "^16.4.5",
      express: "^4.19.2",
      path: "^0.12.7",
      jsonwebtoken: "^9.0.2",
      mongoose: "^8.2.4",
    },
  };

  fs.writeFileSync(
    path.join(appPath, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );
  console.log(
    chalk.default.cyan(`\nExpress application '${appName}' created'`)
  );
  console.log(chalk.default.cyan(`\nInstalling node modules..`));
  // Run npm install in the newly created directory
  execSync("npm install", { stdio: "inherit", cwd: appPath });

  console.log(
    chalk.default.green(`\nExpress server is ready for action!\n`),
    "\n",
    chalk.default.cyan(`To start the server run: \n \n npm start \n \n`)
  );
};

run();
