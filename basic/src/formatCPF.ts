export const formatCPF = (input: string): string => {
  const value = input.replace(/[\D\s._-]+/g, '');
  let split = 4;
  const chunk = [];
  for (let i = 0, len = value.length; i < len; i += split) {
    split = i < 9 ? 3 : 2;
    chunk.push(value.substr(i, split));
  }
  if (chunk.length >= 4) {
    return chunk.slice(0, 3).join('.') + '-' + chunk[3];
  }
  return chunk.join('.');
};
