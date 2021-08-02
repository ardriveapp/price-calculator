# ArDrive Price Calculator

## Developer Setup

Follow these steps to get the developer environment up and running:

### Install Yarn 2

The ArDrive Price Calculator uses Yarn 2, so install the latest version with the [yarn installation instructions][yarn-install]. In most cases:

```shell
# Brew:
brew install yarn

# Or with NPM:
npm install -g yarn
```

We also use husky to manage the git commit hooks that help to improve the quality of our commits. Without installing husky, you risk committing non-compliant code to the repository.

Using husky triggers two pre-commit hooks. The first will run `lint-staged` on each staged file, which includes running prettier to format, eslint for linting, and also tsc-files for quickly checking that TypeScript can compile the code. The second hook will test the codebase prior to committing, ensuring that all tests must pass.

To enable hooks locally, you will need to run:

```shell
yarn husky install
```

### NVM

This repository uses NVM and an `.nvmrc` file to lock the Node version to the current version used by `ardrive-core-js`.

Note for Windows: **We recommend using WSL** for setting up NVM on Windows using the [instructions described here][wsl-install]

Follow these steps to get NVM up and running on your system:

1. Install NVM using [these installation instructions][nvm-install].
2. Navigate to this project's root directory
3. Ensure that the correct version of Node is installed by performing: `nvm install`
4. **Every time you start a new terminal session or switch to this project from another NPM project**, you should set the correct version of Node by running: `nvm use`

### Recommended Visual Studio Code extensions

To ensure your environment is compatible, we also recommend the following VSCode extensions:

-   [ES-Lint][eslint-vscode]
-   [Editor-Config][editor-config-vscode]
-   [Prettier][prettier-vscode]
-   [ZipFS][zipfs-vscode]

## Available Scripts

### yarn start

Runs the app in the development mode.
Open http://localhost:8080 to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### yarn build

Builds a static copy of your site to the `build/` folder.
Your app is ready to be deployed!

### yarn test

Launches the application test runner.
Run with the `--watch` flag (`yarn test -- --watch`) to run in interactive watch mode.

[yarn-install]: https://yarnpkg.com/getting-started/install
[nvm-install]: https://github.com/nvm-sh/nvm#installing-and-updating
[wsl-install]: https://code.visualstudio.com/docs/remote/wsl
[editor-config-vscode]: https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig
[prettier-vscode]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[zipfs-vscode]: https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs
[eslint-vscode]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
