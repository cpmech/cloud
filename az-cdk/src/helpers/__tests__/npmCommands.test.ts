import { npmCommands } from '../npmCommands';

describe('npmCommands', () => {
  it('use npm works', () => {
    const res = npmCommands();
    expect(res).toEqual({
      install: ['npm install'],
      build: ['npm run test', 'npm run build'],
    });
  });

  it('use Yarn works', () => {
    const res = npmCommands('', true);
    expect(res).toEqual({
      install: [
        'curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -',
        'echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list',
        'sudo apt-get update && sudo apt-get install yarn',
        'yarn',
      ],
      build: ['yarn test', 'yarn build'],
    });
  });
});
