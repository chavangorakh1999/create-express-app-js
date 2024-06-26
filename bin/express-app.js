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
//   sanitized = sanitized.replace(/[^a-z0-9-]/g, "");
  return sanitized;
};

const generateReadme = async(appName,appPath, author) => {
    const readmeContent = `# ${appName}
  
  This project was bootstrapped with [create-express-app-js](https://github.com/chavangorakh1999/create-express-app-js).
  
  ## Available Scripts
  
  In the project directory, you can run:
  
  ### \`npm start\`
  
  Runs the app in development mode.
  
  ### \`npm test\`
  
  Launches the test runner.
  
  ### \`npm run build\`
  
  Builds the app for production to the \`build\` folder.
  
  ## Learn More
  
  To learn more about Express, check out the [Express documentation](https://expressjs.com/).
  
  You can also learn more about the [create-express-app-js](https://github.com/yourusername/create-express-app-js) in its GitHub repository.
  
  ## Author
  
  ${author}
  `;
  
    // Write content to README.md file
    fs.writeFileSync(path.join(appPath, "README.md"), readmeContent);
  };
const validateFolderName = (name) => {
  // Ensure the folder name is not empty
  if (!name) {
    console.error("Error: Folder name cannot be empty.");
    return false;
  }
  // Ensure the folder name doesn't contain any special characters except hyphens
  if (!/^[a-z0-9-]+$/.test(name)) {
    console.error(
      "Error: Folder name can only contain lowercase letters, numbers, and hyphens."
    );
    return false;
  }
  return true;
};

const run = async () => {
  const inquirer = await import("inquirer");
  const chalk = await import("chalk");

  let nameArg = process.argv[2];
  let appName=nameArg;

  // Check if the first argument is a dot (indicating current directory)
  if (nameArg === "." && process.argv.length === 3) {
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
    // Validate folder name
    if (!validateFolderName(appName)) {
      process.exit(1);
    }
    // Create new directory with sanitized name
    appPath = path.join(process.cwd(), program.opts().directory || appName);
    if(nameArg === "." && process.argv.length === 3){
        appPath = path.join(process.cwd(), program.opts().directory);
    }

    // Check if directory already exists
    if (fs.existsSync(appPath) && nameArg !== ".") {
      console.error(
        chalk.default.red(`Error: Directory ${appPath} already exists.`)
      );
      process.exit(1);
    }
  }

  const authorPrompt = await inquirer.default.prompt([
    {
      type: "input",
      name: "author",
      message: "Enter the name of the author:",
    },
  ]);

  const author = authorPrompt.author || "";

  const templatePath = path.join(__dirname, "../app_template");

  const copyTemplateFiles = (source, destination) => {
    fs.mkdirSync(destination, { recursive: true });

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
  await generateReadme(appName,appPath, author);
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
