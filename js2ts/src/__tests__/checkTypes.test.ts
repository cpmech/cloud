import { checkTypes } from '../checkTypes';

describe('checkTypes', () => {
  interface IWheels {
    color: string;
    size: number;
    sport: boolean;
  }

  interface ICar {
    kind: string;
    wheels: IWheels[];
    owner?: string; // only first level may be optional
  }

  const reference: ICar = {
    kind: '',
    wheels: [{ color: '', size: 0, sport: false }],
    owner: '',
  };

  type IOptional = {
    [P in keyof Required<Omit<ICar, 'kind' | 'wheels'>>]: boolean;
  };

  const optional: IOptional = {
    owner: true, // it doens't matter if it's true of false
  };

  const bad0 = null;
  const bad1 = [{}];
  const bad2 = [{ nada: [] }];
  const bad3 = [{ kind: '' }];
  const bad4 = [{ kind: '', wheels: '' }];
  const bad5 = [{ kind: '', wheels: [1] }];
  const bad6 = [{ kind: '', wheels: [{ color: '', size: 0, sport: '' }] }];
  const bad7 = [{ kind: '', wheels: [{ color: '', size: 0, sport: true }] }, {}];
  const bad8 = [
    { kind: '', wheels: [{ color: '', size: 0, sport: '' }] },
    { kind: '', wheels: [{ color: '', size: 0, sport: true }] },
  ];
  const bad9 = [{ kind: '', wheels: [{ color: '', size: 0, sport: true }] }, { 1: [] }];
  const bad10 = [{ kind: '', wheels: [{ color: '', size: 0, sport: true }] }, { 2: '' }];
  const bad11 = [{ kind: '', wheels: [{ color: '', size: 0, sport: true }] }, { nada: '' }];
  const bad12 = [
    { kind: '', wheels: [{ color: '', size: 0, sport: true }] },
    { kind: '', wheels: [{ color: 0, size: '', sport: true }] },
  ];
  const bad13 = [
    { kind: '', wheels: [{ color: '', size: 0, sport: true }] },
    { kind: '', wheels: [{ color: '', size: 0, sport: true }] },
    { kind: '', wheels: [{ color: '', size: 0, sport: '' }] },
  ];

  const ok1 = [{ kind: '', wheels: [{ color: '', size: 0, sport: true }] }];
  const ok2 = [{ kind: '', wheels: [{ color: '', size: 0, sport: true }], xowner: '' }];
  const ok3 = [
    { kind: 'a', wheels: [{ color: 'r', size: 1, sport: true }] },
    { kind: 'b', wheels: [{ color: 'g', size: 2, sport: false }] },
    { kind: 'c', wheels: [{ color: 'b', size: 3, sport: true }] },
  ];

  it('should return null from bad input', () => {
    expect(checkTypes(reference, bad0, optional)).toBeNull();
    expect(checkTypes(reference, bad1, optional)).toBeNull();
    expect(checkTypes(reference, bad2, optional)).toBeNull();
    expect(checkTypes(reference, bad3, optional)).toBeNull();
    expect(checkTypes(reference, bad4, optional)).toBeNull();
    expect(checkTypes(reference, bad5, optional)).toBeNull();
    expect(checkTypes(reference, bad6, optional)).toBeNull();
    expect(checkTypes(reference, bad7, optional)).toBeNull();
    expect(checkTypes(reference, bad8, optional)).toBeNull();
    expect(checkTypes(reference, bad9, optional)).toBeNull();
    expect(checkTypes(reference, bad10, optional)).toBeNull();
    expect(checkTypes(reference, bad11, optional)).toBeNull();
    expect(checkTypes(reference, bad12, optional)).toBeNull();
    expect(checkTypes(reference, bad13, optional)).toBeNull();
  });

  it('should return the object if ok', () => {
    expect(checkTypes(reference, ok1, optional)).toStrictEqual(ok1);
    expect(checkTypes(reference, ok2, optional)).toStrictEqual(ok2);
    expect(checkTypes(reference, ok3, optional)).toStrictEqual(ok3);
  });
});
