import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';
import { flattenFieldNodeKeys } from '../flattenFieldNodeKeys';
import { FieldNode } from 'graphql';

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

const astSpread = gql`
  type EnergyLimitsEntry {
    max: Float!
    minEpop: Float!
    minProvider: Float!
  }

  fragment EnergyLimitsEntryFrag on EnergyLimitsEntry {
    max
    minEpop
    minProvider
  }

  type EnergyLimits {
    monophasic: EnergyLimitsEntry!
    biphasic: EnergyLimitsEntry!
    triphasic: EnergyLimitsEntry!
  }

  fragment EnergyLimitsFrag on EnergyLimits {
    monophasic {
      ...EnergyLimitsEntryFrag
    }
    biphasic {
      ...EnergyLimitsEntryFrag
    }
    triphasic {
      ...EnergyLimitsEntryFrag
    }
  }
`;

const nodeNested: FieldNode = {
  kind: 'Field',
  name: { kind: 'Name', value: 'nested' },
  arguments: [],
  directives: [],
  selectionSet: {
    kind: 'SelectionSet',
    selections: [
      {
        kind: 'FragmentSpread',
        directives: [],
        name: { kind: 'Name', value: 'NADA' },
      },
      {
        kind: 'Field',
        name: { kind: 'Name', value: 'secondLevel' },
        arguments: [],
        directives: [],
      },
      {
        kind: 'Field',
        name: { kind: 'Name', value: 'nestedAgain' },
        arguments: [],
        directives: [],
        selectionSet: {
          kind: 'SelectionSet',
          selections: [
            {
              kind: 'Field',
              name: { kind: 'Name', value: 'thirdLevel' },
              arguments: [],
              directives: [],
            },
          ],
        },
      },
    ],
  },
};

const nodeSpread: FieldNode = {
  kind: 'Field',
  name: { kind: 'Name', value: 'monophasic' },
  arguments: [],
  directives: [],
  selectionSet: {
    kind: 'SelectionSet',
    selections: [
      {
        kind: 'FragmentSpread',
        name: {
          kind: 'Name',
          value: 'EnergyLimitsEntryFrag',
        },
        directives: [],
      },
    ],
  },
};

describe('flattenFieldNodeKeys', () => {
  describe('Field', () => {
    it('should return the right values ', () => {
      expect(flattenFieldNodeKeys(astNested, nodeNested)).toEqual([
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

    it('no-braces: should return the right values ', () => {
      expect(flattenFieldNodeKeys(astNested, nodeNested, false)).toEqual([
        'nested',
        'secondLevel',
        'nestedAgain',
        'thirdLevel',
      ]);
    });
  });

  describe('FragmentSpread', () => {
    it('should return the right values', () => {
      expect(flattenFieldNodeKeys(astSpread, nodeSpread)).toEqual([
        'monophasic',
        '{',
        'max',
        'minEpop',
        'minProvider',
        '}',
      ]);
    });
  });
});
