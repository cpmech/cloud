module.exports = {
  preset: 'ts-jest',
  testRegex: '(/__integ__/.*|(\\.|/)(integ))\\.[jt]sx?$',
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/cdk.out/'],
};
