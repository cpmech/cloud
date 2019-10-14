import {
  DocumentNode,
  EnumTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  FragmentDefinitionNode,
} from 'graphql';
import { flattenFieldNodeKeys } from './flattenFieldNodeKeys';
import { isPrimitive } from './isPrimitive';

// getDocumentNodeValues extracts the values from a DocumentNode (GraphQL Abstract Syntax Tree - AST)
// NOTE:
//       (1) this should be used for TESTING
//       (2) this function is recursive for custom types,
//           however it will not recurse on [arrays of type]
//       (3) handles 'EnumTypeDefinition' | 'ObjectTypeDefinition' | 'FragmentDefinition'
export const getDocumentNodeValues = (
  ast: DocumentNode,
  name: string,
  useBracesToIndicateNesting: boolean = true,
  recurseEnums: boolean = false,
  isRecursion: boolean = false,
): string[] => {
  // find the definition with the right type and name
  const definition = ast.definitions.find(
    def =>
      (def.kind === 'EnumTypeDefinition' ||
        def.kind === 'ObjectTypeDefinition' ||
        def.kind === 'FragmentDefinition') &&
      def.name.value === name,
  );

  // check if found
  if (!definition) {
    throw new Error(`cannot find definition named ${name} from given DocumentNode`);
  }

  // set results array
  const results: string[] = [];

  // skip enums in recursion
  if (isRecursion) {
    if (definition.kind === 'EnumTypeDefinition' && !recurseEnums) {
      return results;
    }
    if (useBracesToIndicateNesting) {
      results.push('{');
    }
  }

  // return values or fields
  switch (definition.kind) {
    case 'EnumTypeDefinition':
      const dEnum = definition as EnumTypeDefinitionNode;
      if (dEnum.values) {
        dEnum.values.forEach(v => results.push(v.name.value));
      } else {
        throw new Error(`enum named ${name} has no values`);
      }
      break;

    case 'ObjectTypeDefinition':
      const dObj = definition as ObjectTypeDefinitionNode;
      if (dObj.fields) {
        dObj.fields.forEach(f => {
          results.push(f.name.value);
          let gtype = '';
          if (f.type.kind === 'NamedType') {
            gtype = f.type.name.value;
          }
          if (f.type.kind === 'NonNullType' && f.type.type.kind === 'NamedType') {
            gtype = f.type.type.name.value;
          }
          if (gtype && !isPrimitive(gtype)) {
            getDocumentNodeValues(
              ast,
              gtype,
              useBracesToIndicateNesting,
              recurseEnums,
              true,
            ).forEach(v => results.push(v));
          }
        });
      } else {
        throw new Error(`type named ${name} has no values`);
      }
      break;

    case 'FragmentDefinition':
      const dFrag = definition as FragmentDefinitionNode;
      dFrag.selectionSet.selections.forEach(s => {
        if (s.kind === 'Field') {
          flattenFieldNodeKeys(ast, s, useBracesToIndicateNesting).forEach(v => results.push(v));
        } else {
          throw new Error(`cannot handle fragment with selection kind = ${s.kind} yet`);
        }
      });
      break;

    default:
      throw new Error(
        `definition named ${name} with type = ${definition.kind} cannot be handled yet`,
      );
  }

  // return results
  if (isRecursion && useBracesToIndicateNesting) {
    results.push('}');
  }
  return results;
};
