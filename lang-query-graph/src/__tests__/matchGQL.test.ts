import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { matchGQL } from '../matchGQL';

interface MyType {
  name: string;
  email: string;
  address: string;
}

const myType: MyType = {
  name: 'my name',
  email: 'my@email.com',
  address: 'testing place where we test things',
};

interface MyAnotherType {
  name: string;
  email: string;
  address: string;
  somethingElse: string;
}

const myAnotherType: MyAnotherType = {
  name: 'my another name',
  email: 'my.another@email.com',
  address: 'somewhere else where we test things',
  somethingElse: 'this is just for the test',
};

interface MyNestedType {
  firstLevel: string;
  nested: {
    secondLevel: number;
    nestedAgain: {
      thirdLevel: boolean;
    };
  };
}

const myNestedType: MyNestedType = {
  firstLevel: '1, first level',
  nested: {
    secondLevel: 2,
    nestedAgain: {
      thirdLevel: true,
    },
  },
};

interface MyAnotherNestedType {
  firstLevel: string;
  nested: {
    secondLevel: number;
    nestedAgain: {
      thirdLevel: boolean;
      nestedAgainAgain: {
        fourthLevel: number;
      };
    };
  };
}

const myAnotherNestedType: MyAnotherNestedType = {
  firstLevel: '1, first level (another one)',
  nested: {
    secondLevel: 2,
    nestedAgain: {
      thirdLevel: true,
      nestedAgainAgain: {
        fourthLevel: 4,
      },
    },
  },
};

const ast: DocumentNode = gql`
  type MyType {
    name: String!
    email: String!
    address: String!
  }

  fragment MyTypeFrag on MyType {
    name
    email
    address
  }

  type MyAnotherType {
    name: String!
    email: String!
    address: String!
    somethingElse: String!
  }

  fragment MyAnotherTypeFrag on MyAnotherType {
    name
    email
    address
    somethingElse
  }

  type FourthLevel {
    fourthLevel: Float!
  }

  type AnotherThirdLevel {
    thirdLevel: Boolean!
    nestedAgainAgain: FourthLevel!
  }

  type ThirdLevel {
    thirdLevel: Boolean!
  }

  type SecondLevel {
    secondLevel: Float!
    nestedAgain: ThirdLevel!
  }

  type AnotherSecondLevel {
    secondLevel: Float!
    nestedAgain: AnotherThirdLevel!
  }

  type MyNestedType {
    firstLevel: String!
    nested: SecondLevel!
  }

  type MyAnotherNestedType {
    firstLevel: String!
    nested: AnotherSecondLevel!
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

  fragment MyAnotherNestedTypeFrag on MyAnotherNestedType {
    firstLevel
    nested {
      secondLevel
      nestedAgain {
        thirdLevel
        nestedAgainAgain {
          fourthLevel
        }
      }
    }
  }
`;

describe('matchGQL', () => {
  describe('reference and ast', () => {
    it('should succeed if object and AST are equivalent', () => {
      expect(() => matchGQL(myType, ast, 'MyType')).not.toThrow();
      expect(() => matchGQL(myAnotherType, ast, 'MyAnotherType')).not.toThrow();
    });

    it('should throw error if object and AST are not equivalent', () => {
      expect(() => matchGQL(myType, ast, 'MyAnotherType')).toThrowError(
        'object and GraphQL type are different',
      );
      expect(() => matchGQL(myAnotherType, ast, 'MyType')).toThrowError(
        'object and GraphQL type are different.\nkeys of object:\nname,email,address,somethingElse\nkeys of gql:\nname,email,address',
      );
    });
  });

  describe('reference, ast and fragment', () => {
    it('should succeed if they are all equivalent', () => {
      expect(() => matchGQL(myType, ast, 'MyType', 'MyTypeFrag')).not.toThrow();
    });

    it('should throw error if any is different', () => {
      expect(() => matchGQL(myType, ast, 'MyType', 'MyAnotherTypeFrag')).toThrowError(
        'object and fragment are different.\nkeys of object:\nname,email,address\nkeys of fragment:\nname,email,address,somethingElse',
      );
    });
  });

  describe('nested: reference and ast', () => {
    it('should succeed if object and AST are equivalent', () => {
      expect(() => matchGQL(myNestedType, ast, 'MyNestedType')).not.toThrow();
      expect(() => matchGQL(myAnotherNestedType, ast, 'MyAnotherNestedType')).not.toThrow();
    });

    it('should throw error if object and AST are not equivalent', () => {
      expect(() => matchGQL(myNestedType, ast, 'MyAnotherNestedType')).toThrowError(
        'object and GraphQL type are different.\nkeys of object:\nfirstLevel,nested,{,secondLevel,nestedAgain,{,thirdLevel,},}\nkeys of gql:\nfirstLevel,nested,{,secondLevel,nestedAgain,{,thirdLevel,nestedAgainAgain,{,fourthLevel,},},}',
      );
      expect(() => matchGQL(myAnotherNestedType, ast, 'MyNestedType')).toThrowError(
        'object and GraphQL type are different.\nkeys of object:\nfirstLevel,nested,{,secondLevel,nestedAgain,{,thirdLevel,nestedAgainAgain,{,fourthLevel,},},}\nkeys of gql:\nfirstLevel,nested,{,secondLevel,nestedAgain,{,thirdLevel,},}',
      );
    });
  });

  describe('nested: reference, ast and fragment', () => {
    it('should succeed if they are all equivalent', () => {
      expect(() => matchGQL(myNestedType, ast, 'MyNestedType', 'MyNestedTypeFrag')).not.toThrow();
      expect(() =>
        matchGQL(myAnotherNestedType, ast, 'MyAnotherNestedType', 'MyAnotherNestedTypeFrag'),
      ).not.toThrow();
    });

    it('should throw error if any is different', () => {
      expect(() =>
        matchGQL(myNestedType, ast, 'MyNestedType', 'MyAnotherNestedTypeFrag'),
      ).toThrowError(
        'object and fragment are different.\nkeys of object:\nfirstLevel,nested,{,secondLevel,nestedAgain,{,thirdLevel,},}\nkeys of fragment:\nfirstLevel,nested,{,secondLevel,nestedAgain,{,thirdLevel,nestedAgainAgain,{,fourthLevel,},},}',
      );
    });
  });
});
