import { checkType } from '../checkType';

describe('checkType: nested arrays', () => {
  it("should throw error if reference's array does not have a single item", () => {
    const reference = {
      list: [],
    };
    expect(() => checkType(reference, { list: [] })).toThrowError(
      'each reference array must contain a single item',
    );
  });

  interface IPoint {
    x: number;
    y: number;
  }

  interface IPointGroup {
    color: string;
    points: IPoint[];
  }

  interface IDrawing {
    name: string;
    data: IPointGroup[];
  }

  interface IState {
    version: string;
    drawing: IDrawing;
  }

  const reference: IState = {
    version: '',
    drawing: {
      name: '',
      data: [
        {
          color: '',
          points: [{ x: 0, y: 0 }],
        },
      ],
    },
  };

  const bad0 = null;
  const bad1 = {};
  const bad2 = { version: '' };
  const bad3 = { version: '', drawing: {} };
  const bad4 = { version: '', drawing: { name: '' } };
  const bad5 = { version: '', drawing: { name: '', data: [1] } };
  const bad6 = { version: '', drawing: { name: '', data: [[]] } };
  const bad7 = { version: '', drawing: { name: '', data: [{}] } };
  const bad8 = { version: '', drawing: { name: '', data: [{ color: '' }] } };
  const bad9 = { version: '', drawing: { name: '', data: [{ color: '', points: '' }] } };
  const bad10 = { version: '', drawing: { name: '', data: [{ color: '', points: [1] }] } };
  const bad11 = { version: '', drawing: { name: '', data: [{ color: '', points: [1] }] } };
  const bad12 = { version: '', drawing: { name: '', data: [{ color: '', points: [{}] }] } };
  const bad13 = { version: '', drawing: { name: '', data: [{ color: '', points: [{ x: 0 }] }] } };
  const bad14 = { version: '', drawing: { name: '', data: [{ color: '', points: [{ x: '' }] }] } };
  const bad15 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: '' }] }] },
  };
  const bad16 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: [] }] }] },
  };
  const bad17 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: {} }] }] },
  };
  const bad18 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: 0 }, {}] }] },
  };
  const bad19 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: 0 }, { x: 0 }] }] },
  };
  const bad20 = {
    version: '',
    drawing: {
      name: '',
      data: [
        {
          color: '',
          points: [
            { x: 0, y: 0 },
            { x: 0, y: '' },
          ],
        },
      ],
    },
  };
  const bad21 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: 0 }, { y: 0 }] }] },
  };
  const bad22 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: 0 }, { x: 0, y: 0 }, {}] }] },
  };

  const ok1 = { version: '', drawing: { name: '', data: [] } };
  const ok2 = { version: '', drawing: { name: '', data: [{ color: '', points: [] }] } };
  const ok3 = {
    version: '',
    drawing: { name: '', data: [{ color: '', points: [{ x: 0, y: 0 }] }] },
  };
  const ok4 = {
    version: '1.0.0',
    drawing: {
      name: 'simple pointset',
      data: [
        {
          color: 'red',
          points: [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
            { x: 2, y: 3 },
          ],
        },
        {
          color: 'green',
          points: [
            { x: 10, y: 10 },
            { x: 11, y: 11 },
            { x: 12, y: 13 },
          ],
        },
        {
          color: 'blue',
          points: [
            { x: 100, y: 1000 },
            { x: 101, y: 101 },
            { x: 102, y: 103 },
          ],
        },
      ],
    },
  };

  it('should return null on bad input', () => {
    expect(checkType(reference, bad0)).toBeNull();
    expect(checkType(reference, bad1)).toBeNull();
    expect(checkType(reference, bad2)).toBeNull();
    expect(checkType(reference, bad3)).toBeNull();
    expect(checkType(reference, bad4)).toBeNull();
    expect(checkType(reference, bad5)).toBeNull();
    expect(checkType(reference, bad6)).toBeNull();
    expect(checkType(reference, bad7)).toBeNull();
    expect(checkType(reference, bad8)).toBeNull();
    expect(checkType(reference, bad9)).toBeNull();
    expect(checkType(reference, bad10)).toBeNull();
    expect(checkType(reference, bad11)).toBeNull();
    expect(checkType(reference, bad12)).toBeNull();
    expect(checkType(reference, bad13)).toBeNull();
    expect(checkType(reference, bad14)).toBeNull();
    expect(checkType(reference, bad15)).toBeNull();
    expect(checkType(reference, bad16)).toBeNull();
    expect(checkType(reference, bad17)).toBeNull();
    expect(checkType(reference, bad18)).toBeNull();
    expect(checkType(reference, bad19)).toBeNull();
    expect(checkType(reference, bad20)).toBeNull();
    expect(checkType(reference, bad21)).toBeNull();
    expect(checkType(reference, bad22)).toBeNull();
  });

  it('should return the object if ok', () => {
    expect(checkType(reference, ok1)).toStrictEqual(ok1);
    expect(checkType(reference, ok2)).toStrictEqual(ok2);
    expect(checkType(reference, ok3)).toStrictEqual(ok3);
    expect(checkType(reference, ok4)).toStrictEqual(ok4);
  });
});

describe('checkType: optional fields', () => {
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

  const bad1 = {};
  const bad2 = { kind: '' };
  const bad3 = { kind: '', wheels: '' };
  const bad4 = { kind: '', wheels: [1] };
  const bad5 = { kind: '', wheels: [{ color: '' }] };
  const bad6 = { kind: '', wheels: [{ color: '', size: 0 }] };
  const bad7 = { kind: '', wheels: [{ color: '', size: 0, sport: '' }] };

  const ok1 = {
    kind: 'hatchback',
    wheels: [
      { color: 'white', size: 18, sport: true },
      { color: 'white', size: 18, sport: true },
      { color: 'black', size: 21, sport: true },
      { color: 'black', size: 21, sport: true },
    ],
    owner: 'me',
  };
  const ok2 = {
    kind: 'hatchback',
    wheels: [
      { color: 'white', size: 18, sport: true },
      { color: 'white', size: 18, sport: true },
      { color: 'black', size: 21, sport: true },
      { color: 'black', size: 21, sport: true },
    ],
  };
  const ok3 = { kind: '', wheels: [{ color: '', size: 0, sport: true }], xowner: '' };

  it('should return null from on input', () => {
    expect(checkType(reference, bad1, optional)).toBeNull();
    expect(checkType(reference, bad2, optional)).toBeNull();
    expect(checkType(reference, bad3, optional)).toBeNull();
    expect(checkType(reference, bad4, optional)).toBeNull();
    expect(checkType(reference, bad5, optional)).toBeNull();
    expect(checkType(reference, bad6, optional)).toBeNull();
    expect(checkType(reference, bad7, optional)).toBeNull();
  });

  it('should return the object if ok', () => {
    expect(checkType(reference, ok1, optional)).toStrictEqual(ok1);
    expect(checkType(reference, ok2, optional)).toStrictEqual(ok2);
    expect(checkType(reference, ok3, optional)).toStrictEqual(ok3);
  });
});

describe('checkType: simple mixed-type objects', () => {
  it("should throw error if reference's array does not have a single item", () => {
    const reference = {
      delta: { p: '', q: { r: { s: 0, list: ['', ''] }, nums: [0, 0] } },
    };
    const data = {
      delta: { p: '', q: { r: { s: 0, list: ['', ''] }, nums: [0, 0] } },
    };
    expect(() => checkType(reference, data)).toThrowError(
      'each reference array must contain a single item',
    );
  });

  interface ISubReference {
    p: string;
    q: { r: { s: number; list: string[] }; nums: number[] };
  }

  interface IReference {
    alpha: string;
    beta: number;
    gamma: boolean;
    delta: ISubReference;
  }

  const reference: IReference = {
    alpha: '',
    beta: 0,
    gamma: false,
    delta: { p: '', q: { r: { s: 0, list: [''] }, nums: [0] } },
  };

  const bad1 = {};
  const bad2 = { alpha: 'alpha' };
  const bad3 = { alpha: 123 };
  const bad4 = { alpha: { a: 123 } };
  const bad5 = { delta: { p: 'pval', q: { r: { s: 666 } } } };
  const bad6 = {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 'pval', q: { r: { s: '666' } } }, // list and nums are missing
  };
  const bad7 = {
    alpha: 'alpha',
    beta: '123',
    gamma: true,
    delta: { p: 'pval', q: { r: { s: 666 } } },
  };
  const bad8 = {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 456, q: { r: { s: 666 } } },
  };
  const bad9 = {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: {
      p: 'pval',
      q: {
        r: { s: 666, t: 'more props', more: 'more, more, more', list: 'this goes in' }, // not array
        nums: [101, 202],
      },
    },
  };

  const ok1 = {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: { p: 'pval', q: { r: { s: 666, list: ['abra', 'kadabra'] }, nums: [123, 456] } },
  };
  const ok2 = {
    alpha: 'alpha',
    beta: 123,
    gamma: true,
    delta: {
      p: 'pval',
      q: {
        r: { s: 666, t: 'more props', more: 'more, more, more', list: ['abra', 'kadabra'] },
        nums: [123, 456],
      },
    },
  };

  it('should return null from on input', () => {
    expect(checkType(reference, bad1)).toBeNull();
    expect(checkType(reference, bad2)).toBeNull();
    expect(checkType(reference, bad3)).toBeNull();
    expect(checkType(reference, bad4)).toBeNull();
    expect(checkType(reference, bad5)).toBeNull();
    expect(checkType(reference, bad6)).toBeNull();
    expect(checkType(reference, bad7)).toBeNull();
    expect(checkType(reference, bad8)).toBeNull();
    expect(checkType(reference, bad9)).toBeNull();
  });

  it('should return the object if ok', () => {
    expect(checkType(reference, ok1)).toStrictEqual(ok1);
    expect(checkType(reference, ok2)).toStrictEqual(ok2);
  });
});
