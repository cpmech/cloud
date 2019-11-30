import { empty2blank } from '../empty2blank';

const files = {
  userId: 'iam-bender',
  aspect: 'FILES',
  cpf: '__EMPTY__',
  conta: '__EMPTY__',
  acordo: '__EMPTY__',
  contrato: '__EMPTY__',
  procuracao: '__EMPTY__',
};

describe('empty2blank', () => {
  it('should replace EMPTY with blank strings', () => {
    expect(empty2blank(files)).toEqual({
      userId: 'iam-bender',
      aspect: 'FILES',
      cpf: '',
      conta: '',
      acordo: '',
      contrato: '',
      procuracao: '',
    });
  });
});
