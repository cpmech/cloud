import Enquirer from 'enquirer';
import { IEnvars, initEnvars } from '@cpmech/envars';
import { ICognitoEnvars, initCognitoTools, signUpAskCode } from './cognitoUtil';

const envars: IEnvars = {
  CLOUD_COGNITO_POOLID: '',
  CLOUD_COGNITO_CLIENTID: '',
  CLOUD_RECV_DOMAIN: '',
  CLOUD_RECV_QUEUE_URL: '',
  CLOUD_BENDER_PASSWORD: '',
  CLOUD_LEELA_PASSWORD: '',
};

initEnvars(envars);

const cognitoEnvars: ICognitoEnvars = {
  COGNITO_POOLID: envars.CLOUD_COGNITO_POOLID,
  COGNITO_CLIENTID: envars.CLOUD_COGNITO_CLIENTID,
  RECV_DOMAIN: envars.CLOUD_RECV_DOMAIN,
  RECV_QUEUE_URL: envars.CLOUD_RECV_QUEUE_URL,
};

initCognitoTools(cognitoEnvars);

const main = async () => {
  const response = await Enquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'What is the email?',
    },
    {
      type: 'input',
      name: 'password',
      message: 'What is the password?',
    },
  ]);
  const email = (response as any).email as string;
  const password = (response as any).password as string;
  const res = await signUpAskCode(email, password);
  console.log(res);
};

(async () => {
  try {
    await main();
  } catch (error: any) {
    console.warn(error);
  }
})();
