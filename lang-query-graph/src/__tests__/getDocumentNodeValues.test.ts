import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { getDocumentNodeValues } from '../getDocumentNodeValues';

const astCorrect: DocumentNode = gql`
  enum MyEnum {
    ACCESS
    CONNECTION
    CONTRACT
    PERSONAL
  }

  enum AnotherEnum {
    HELLO
    WORLD
  }

  type MyType {
    name: String!
    email: String!
    address: String!
    aspect: MyEnum!
  }

  fragment MyTypeKeys on MyType {
    name
    email
    address
  }

  type AnotherType {
    preference: ID!
    group: Int!
  }
`;

const astWrong2: DocumentNode = gql`
  enum MyEnumWithWrongName {
    ACCESS
    CONNECTION
    CONTRACT
    PERSONAL
  }

  type MyTypeWithWrongName {
    name: String!
    email: String!
  }
`;

const astWrong3: DocumentNode = {
  kind: 'Document',
  definitions: [
    {
      kind: 'EnumTypeDefinition',
      name: {
        kind: 'Name',
        value: 'MyEnumWithNoValues',
      },
      directives: [],
    },
    {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'MyTypeWithNoFields',
      },
      directives: [],
    },
  ],
};

const astNested: DocumentNode = gql`
  type ThirdLevel {
    thirdLevel: Boolean!
  }

  type SecondLevel {
    secondLevel: Float!
    nestedAgain: ThirdLevel!
  }

  type MyNestedType {
    firstLevel: String!
    nested: SecondLevel!
    list: [String]
  }

  fragment MyNestedTypeFrag on MyNestedType {
    firstLevel
    nested {
      secondLevel
      nestedAgain {
        thirdLevel
      }
    }
  }
`;

describe('getDocumentNodeValues', () => {
  describe('enums', () => {
    it('works with correct input (MyEnum)', () => {
      expect(getDocumentNodeValues(astCorrect, 'MyEnum')).toEqual([
        'ACCESS',
        'CONNECTION',
        'CONTRACT',
        'PERSONAL',
      ]);
    });

    it('works with correct input (AnotherEnum)', () => {
      expect(getDocumentNodeValues(astCorrect, 'AnotherEnum')).toEqual(['HELLO', 'WORLD']);
    });

    it('fails because the enum name is incorrect', () => {
      expect(() => getDocumentNodeValues(astWrong2, 'MyEnum')).toThrowError(
        'cannot find definition named MyEnum from given DocumentNode',
      );
    });

    it('fails because the are no values', () => {
      expect(() => getDocumentNodeValues(astWrong3, 'MyEnumWithNoValues')).toThrowError(
        'enum named MyEnumWithNoValues has no values',
      );
    });
  });

  describe('types', () => {
    it('works with correct input (MyType)', () => {
      expect(getDocumentNodeValues(astCorrect, 'MyType')).toEqual([
        'name',
        'email',
        'address',
        'aspect',
      ]);
    });

    it('works with correct input (MyType) / recurse into enums', () => {
      expect(getDocumentNodeValues(astCorrect, 'MyType', true, true)).toEqual([
        'name',
        'email',
        'address',
        'aspect',
        '{',
        'ACCESS',
        'CONNECTION',
        'CONTRACT',
        'PERSONAL',
        '}',
      ]);
    });

    it('works with correct input (AnotherType)', () => {
      expect(getDocumentNodeValues(astCorrect, 'AnotherType')).toEqual(['preference', 'group']);
    });

    it('fails because the type name is incorrect', () => {
      expect(() => getDocumentNodeValues(astWrong2, 'MyType')).toThrowError(
        'cannot find definition named MyType from given DocumentNode',
      );
    });

    it('fails because the are no values', () => {
      expect(() => getDocumentNodeValues(astWrong3, 'MyTypeWithNoFields')).toThrowError(
        'type named MyTypeWithNoFields has no values',
      );
    });
  });

  describe('fragments', () => {
    it('works with correct input', () => {
      expect(getDocumentNodeValues(astCorrect, 'MyTypeKeys')).toEqual(['name', 'email', 'address']);
    });
  });

  describe('nested: types', () => {
    it('works with correct input', () => {
      expect(getDocumentNodeValues(astNested, 'MyNestedType')).toEqual([
        'firstLevel',
        'nested',
        '{',
        'secondLevel',
        'nestedAgain',
        '{',
        'thirdLevel',
        '}',
        '}',
        'list',
      ]);
    });

    it('no-braces: works with correct input', () => {
      expect(getDocumentNodeValues(astNested, 'MyNestedType', false)).toEqual([
        'firstLevel',
        'nested',
        'secondLevel',
        'nestedAgain',
        'thirdLevel',
        'list',
      ]);
    });
  });

  describe('nested: fragments', () => {
    it('works with correct input', () => {
      expect(getDocumentNodeValues(astNested, 'MyNestedTypeFrag')).toEqual([
        'firstLevel',
        'nested',
        '{',
        'secondLevel',
        'nestedAgain',
        '{',
        'thirdLevel',
        '}',
        '}',
      ]);
    });

    it('no-braces: works with correct input', () => {
      expect(getDocumentNodeValues(astNested, 'MyNestedTypeFrag', false)).toEqual([
        'firstLevel',
        'nested',
        'secondLevel',
        'nestedAgain',
        'thirdLevel',
      ]);
    });
  });
});
