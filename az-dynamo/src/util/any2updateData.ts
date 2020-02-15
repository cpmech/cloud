import { Iany } from '@cpmech/js2ts';
import { IUpdateData } from '../types';

// any2updateData converts object of 'Iany' to IUpdateData
export const any2updateData = (update: Iany, primaryKeyNames: string[]): IUpdateData => {
  const keys = Object.keys(update).filter(k => !primaryKeyNames.includes(k));
  const UpdateExpression = 'SET ' + [...keys.map((_, i) => `#y${i} = :x${i}`)].join(', ');
  const ExpressionAttributeNames = keys.reduce(
    (acc, curr, i) => ({ ...acc, [`#y${i}`]: curr }),
    {},
  );
  const ExpressionAttributeValues = keys.reduce(
    (acc, curr, i) => ({ ...acc, [`:x${i}`]: update[curr] }),
    {},
  );
  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};
