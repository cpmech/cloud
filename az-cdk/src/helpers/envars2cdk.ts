export interface Ienvars {
  [key: string]: string;
}

export interface ICDKenvar {
  value: any;
}

export interface ICDKenvars {
  [name: string]: ICDKenvar;
}

// envars2cdk converts Ienvars to AWS CDK format
export const envars2cdk = (envars: Ienvars): ICDKenvars => {
  return Object.keys(envars).reduce(
    (acc, curr) => ({ ...acc, [curr]: { value: envars[curr] } }),
    {},
  );
};
