import { IEnvars, initEnvars } from '@cpmech/envars';
import { ICognitoEnvars, initCognitoTools } from './cognitoUtil';
import { signIn } from './cognitoUtil';

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
  const bender = await signIn(
    `tester+bender@${envars.CLOUD_RECV_DOMAIN}`,
    envars.CLOUD_BENDER_PASSWORD,
    true,
  );
  console.log(JSON.stringify(bender));
  const leela = await signIn(
    `tester+leela@${envars.CLOUD_RECV_DOMAIN}`,
    envars.CLOUD_LEELA_PASSWORD,
    true,
  );
  console.log('\n\n');
  console.log(JSON.stringify(leela));
};

(async () => {
  try {
    await main();
  } catch (error: any) {
    console.warn(error);
  }
})();
