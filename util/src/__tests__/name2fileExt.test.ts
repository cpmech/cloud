import { name2fileExt } from '../fileExtAndContentType';

describe('name2fileExt', () => {
  it('should throw error on missing extension', () => {
    expect(() => name2fileExt('nada')).toThrowError(`filename does not have extension`);
    expect(() => name2fileExt('nada.')).toThrowError(`filename does not have extension`);
    expect(() => name2fileExt('.nada.')).toThrowError(`filename does not have extension`);
    expect(() => name2fileExt('.nada. ')).toThrowError(`filename does not have extension`);
    expect(() => name2fileExt('a.b.c.nada.')).toThrowError(`filename does not have extension`);
  });
  it('should throw error on invalid extension', () => {
    expect(() => name2fileExt('name.wav')).toThrowError(`file extension (wav) is invalid`);
    expect(() => name2fileExt('name.mid')).toThrowError(`file extension (mid) is invalid`);
    expect(() => name2fileExt('name.mod')).toThrowError(`file extension (mod) is invalid`);
    expect(() => name2fileExt('name.mp3')).toThrowError(`file extension (mp3) is invalid`);
  });
  it('should return the extension in lowercase', () => {
    expect(name2fileExt('nada.jpeg')).toBe('jpeg');
    expect(name2fileExt('nada.jpg')).toBe('jpg');
    expect(name2fileExt('nada.png')).toBe('png');
    expect(name2fileExt('nada.pdf')).toBe('pdf');
    expect(name2fileExt('nada.txt')).toBe('txt');
    expect(name2fileExt('nada.xml')).toBe('xml');
    expect(name2fileExt('nada.json')).toBe('json');
    expect(name2fileExt('nada.doc')).toBe('doc');
    expect(name2fileExt('nada.docx')).toBe('docx');
    expect(name2fileExt('nada.xls')).toBe('xls');
    expect(name2fileExt('nada.xlsx')).toBe('xlsx');
  });
});
