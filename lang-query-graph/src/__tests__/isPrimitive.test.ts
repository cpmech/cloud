import { isPrimitive } from '../isPrimitive';

/*
import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

const ast: DocumentNode = gql`
  type MySubType {
    value: String!
  }

  type MyType {
    id: ID!
    name: String!
    flag: Boolean!
    integer: Int!
    real: Float!
    subtype: MySubType!
  }
`;
*/

describe('isPrimitive', () => {
  it('should return the right value', () => {
    expect(isPrimitive('Int')).toBeTruthy();
    expect(isPrimitive('Float')).toBeTruthy();
    expect(isPrimitive('String')).toBeTruthy();
    expect(isPrimitive('Boolean')).toBeTruthy();
    expect(isPrimitive('ID')).toBeTruthy();
    expect(isPrimitive('MyType')).toBeFalsy();
  });
});
