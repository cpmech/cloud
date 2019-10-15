const CRL_DIR_PROD = 'node_modules/@cpmech/az-cdk-crl/dist/';
const CRL_DIR_TEST = 'src/custom-resources/__tests__/az-cdk-crl/dist/';

export const crlDir = process.env.NODE_ENV === 'test' ? CRL_DIR_TEST : CRL_DIR_PROD;
