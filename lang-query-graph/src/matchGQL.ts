import { DocumentNode } from 'graphql';
import { shallowCompareArrays, getObjectKeys } from '@cpmech/basic';
import { getDocumentNodeValues } from './getDocumentNodeValues';
import { Iany } from './types';

// matchGQL checks if object, GraphQL Type and Fragment keys all match each other
export const matchGQL = (
  reference: Iany,
  ast: DocumentNode,
  gqlTypeName: string,
  gqlFragmentName?: string,
  useBracesToIndicateNesting: boolean = true,
) => {
  const keys = getObjectKeys(reference);
  const vals = getDocumentNodeValues(ast, gqlTypeName, useBracesToIndicateNesting, false);
  if (!shallowCompareArrays(keys, vals)) {
    throw new Error(
      `object and GraphQL type are different.\nkeys of object = ${keys}\nkeys of gql = ${vals}`,
    );
  }
  if (gqlFragmentName) {
    const fkeys = getDocumentNodeValues(ast, gqlFragmentName, useBracesToIndicateNesting, false);
    if (!shallowCompareArrays(keys, fkeys)) {
      throw new Error(
        `object and fragment are different.\nkeys of object = ${keys}\nkeys of fragment = ${fkeys}`,
      );
    }
  }
};
