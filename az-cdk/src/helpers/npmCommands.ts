export interface INPMCommands {
  install: string[];
  build: string[];
}

export const npmCommands = (extraBeforeTest = '', useYarn = false): INPMCommands => {
  if (useYarn) {
    return {
      install: [
        'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -',
        'echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list',
        'sudo apt-get update && sudo apt-get install yarn',
        'yarn',
      ],
      build: ['yarn test', 'yarn build'],
    };
  }
  return {
    install: ['npm install'],
    build: extraBeforeTest
      ? [extraBeforeTest, 'npm run test', 'npm run build']
      : ['npm run test', 'npm run build'],
  };
};
