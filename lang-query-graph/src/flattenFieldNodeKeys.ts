import { FieldNode, DocumentNode, FragmentDefinitionNode } from 'graphql';

export const flattenFieldNodeKeys = (
  ast: DocumentNode,
  node: FieldNode,
  useBracesToIndicateNesting: boolean = true,
): string[] => {
  const results: string[] = [];
  results.push(node.name.value);
  if (node.selectionSet) {
    if (useBracesToIndicateNesting) {
      results.push('{');
    }
    node.selectionSet.selections.forEach(s => {
      if (s.kind === 'Field') {
        flattenFieldNodeKeys(ast, s, useBracesToIndicateNesting).forEach(v => results.push(v));
      } else if (s.kind === 'FragmentSpread') {
        const res = ast.definitions.find(
          d => d.kind === 'FragmentDefinition' && d.name.value === s.name.value,
        );
        if (res) {
          const r = res as FragmentDefinitionNode;
          r.selectionSet.selections.forEach(sel => {
            if (sel.kind === 'Field') {
              flattenFieldNodeKeys(ast, sel, useBracesToIndicateNesting).forEach(v =>
                results.push(v),
              );
            }
          });
        }
      }
    });
    if (useBracesToIndicateNesting) {
      results.push('}');
    }
  }
  return results;
};
