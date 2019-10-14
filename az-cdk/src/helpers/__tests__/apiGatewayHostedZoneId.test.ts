import { apiGatewayHostedZoneId } from '../apiGatewayHostedZoneId';

describe('apiGatewayHostedZoneId', () => {
  it('is consistent', () => {
    expect(apiGatewayHostedZoneId('us-east-2')).toBe('ZOJJZC49E0EPZ');
    expect(apiGatewayHostedZoneId('us-east-1')).toBe('Z1UJRXOUMOOFQ8');
    expect(apiGatewayHostedZoneId('us-west-1')).toBe('Z2MUQ32089INYE');
    expect(apiGatewayHostedZoneId('us-west-2')).toBe('Z2OJLYMUO9EFXC');
    expect(apiGatewayHostedZoneId('ap-east-1')).toBe('Z3FD1VL90ND7K5');
    expect(apiGatewayHostedZoneId('ap-south-1')).toBe('Z3VO1THU9YC4UR');
    expect(apiGatewayHostedZoneId('ap-northeast-2')).toBe('Z20JF4UZKIW1U8');
    expect(apiGatewayHostedZoneId('ap-southeast-1')).toBe('ZL327KTPIQFUL');
    expect(apiGatewayHostedZoneId('ap-southeast-2')).toBe('Z2RPCDW04V8134');
    expect(apiGatewayHostedZoneId('ap-northeast-1')).toBe('Z1YSHQZHG15GKL');
    expect(apiGatewayHostedZoneId('ca-central-1')).toBe('Z19DQILCV0OWEC');
    expect(apiGatewayHostedZoneId('eu-central-1')).toBe('Z1U9ULNL0V5AJ3');
    expect(apiGatewayHostedZoneId('eu-west-1')).toBe('ZLY8HYME6SFDD');
    expect(apiGatewayHostedZoneId('eu-west-2')).toBe('ZJ5UAJN8Y3Z2Q');
    expect(apiGatewayHostedZoneId('eu-west-3')).toBe('Z3KY65QIEKYHQQ');
    expect(apiGatewayHostedZoneId('eu-north-1')).toBe('Z3UWIKFBOOGXPP');
    expect(apiGatewayHostedZoneId('me-south-1')).toBe('Z20ZBPC0SS8806');
    expect(apiGatewayHostedZoneId('sa-east-1')).toBe('ZCMLWB8V5SYIT');
    expect(() => apiGatewayHostedZoneId('au-east-1')).toThrowError(
      'cannot get API Gateway HostedId for region "au-east-1"',
    );
  });
});
