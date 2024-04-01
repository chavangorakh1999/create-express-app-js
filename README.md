# Create Express App Js [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/chavangorakh1999/create-express-app-js/blob/main/CONTRIBUTING.md)

create-express-app-js is a command-line tool for generating a new Express.js application with a predefined project structure and dependencies.

## Installation

You can install create-express-app-js globally using npm:

`npm install -g create-express-app-js`


## Usage

To create a new Express.js application, simply run the following command in your terminal:

`npx create-express-app-js <app-name>`

Replace `<app-name>` with the desired name of your Express.js application.

### Options

- `-d, --directory <directory>`: Specify the directory to create the application in. If not provided, the application will be created in the current directory.

### Example

`npx create-express-app-js my-express-app`

This command will generate a new Express.js application named `my-express-app` in the current directory.

## Features

- Easy-to-use CLI tool for generating Express.js applications.
- Preconfigured project structure with essential files and folders.
- Automatically installs required dependencies using npm.

## Project Structure

After generating a new Express.js application, the project structure will look like this:

```
my-express-app/
├── node_modules/
├── controllers/
├── models/
├── routes/
├── views/
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Scripts

The generated `package.json` file includes the following scripts:

- `start`: Runs the Express.js application in development mode.

## Learn More

To learn more about Express.js, check out the [Express.js documentation](https://expressjs.com/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
