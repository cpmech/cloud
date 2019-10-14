/*
  The API Gateway HostedZoneId for each region has to be looked up here:
     https://docs.aws.amazon.com/general/latest/gr/rande.html#apigateway_region

  Examples:
    US East (N. Virginia)      us-east-1       execute-api.us-east-1.amazonaws.com       Z1UJRXOUMOOFQ8
    US West (N. California)    us-west-1       execute-api.us-west-1.amazonaws.com       Z2MUQ32089INYE
    US East (Ohio)             us-east-2       execute-api.us-east-2.amazonaws.com       ZOJJZC49E0EPZ
    US West (Oregon)           us-west-2       execute-api.us-west-2.amazonaws.com       Z2OJLYMUO9EFXC
    Asia Pacific (Hong Kong)   ap-east-1       execute-api.ap-east-1.amazonaws.com       Z3FD1VL90ND7K5
    Asia Pacific (Singapore)   ap-southeast-1  execute-api.ap-southeast-1.amazonaws.com  ZL327KTPIQFUL
    Asia Pacific (Sydney)      ap-southeast-2  execute-api.ap-southeast-2.amazonaws.com  Z2RPCDW04V8134
    South America (Sao Paulo)  sa-east-1       execute-api.sa-east-1.amazonaws.com       ZCMLWB8V5SYIT
*/

export const apiGatewayHostedZoneId = (region: string) => {
  switch (region.toLowerCase()) {
    case 'us-east-2':
      return 'ZOJJZC49E0EPZ';
    case 'us-east-1':
      return 'Z1UJRXOUMOOFQ8';
    case 'us-west-1':
      return 'Z2MUQ32089INYE';
    case 'us-west-2':
      return 'Z2OJLYMUO9EFXC';
    case 'ap-east-1':
      return 'Z3FD1VL90ND7K5';
    case 'ap-south-1':
      return 'Z3VO1THU9YC4UR';
    case 'ap-northeast-2':
      return 'Z20JF4UZKIW1U8';
    case 'ap-southeast-1':
      return 'ZL327KTPIQFUL';
    case 'ap-southeast-2':
      return 'Z2RPCDW04V8134';
    case 'ap-northeast-1':
      return 'Z1YSHQZHG15GKL';
    case 'ca-central-1':
      return 'Z19DQILCV0OWEC';
    case 'eu-central-1':
      return 'Z1U9ULNL0V5AJ3';
    case 'eu-west-1':
      return 'ZLY8HYME6SFDD';
    case 'eu-west-2':
      return 'ZJ5UAJN8Y3Z2Q';
    case 'eu-west-3':
      return 'Z3KY65QIEKYHQQ';
    case 'eu-north-1':
      return 'Z3UWIKFBOOGXPP';
    case 'me-south-1':
      return 'Z20ZBPC0SS8806';
    case 'sa-east-1':
      return 'ZCMLWB8V5SYIT';
  }
  throw new Error(`cannot get API Gateway HostedId for region "${region}"`);
};
