module.exports = {
  preset: 'ts-jest',
  coverageDirectory: '/tmp/jest_coverage',
  testRegex: '((\\.|/)(integ))\\.[jt]sx?$',
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/cdk.out/'],
};
