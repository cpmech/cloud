import { blank2empty } from '../blank2empty';

const files = {
  userId: 'iam-bender',
  aspect: 'FILES',
  cpf: '',
  conta: '',
  acordo: '',
  contrato: '',
  procuracao: '',
};

describe('empty2blank', () => {
  it('should replace EMPTY with blank strings', () => {
    expect(blank2empty(files)).toEqual({
      userId: 'iam-bender',
      aspect: 'FILES',
      cpf: '__EMPTY__',
      conta: '__EMPTY__',
      acordo: '__EMPTY__',
      contrato: '__EMPTY__',
      procuracao: '__EMPTY__',
    });
  });
});
