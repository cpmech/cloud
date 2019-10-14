import { App } from '@aws-cdk/core';

// synthApp synthetizes App and returns object
export const synthApp = (app: App): any => {
  const assembly = app.synth();
  const synthesized = assembly.stacks[0];
  return synthesized.template;
};

// synthAppString synthetizes App and returns stringifyied object
export const synthAppString = (app: App): string => {
  return JSON.stringify(synthApp(app), undefined, 2);
};
