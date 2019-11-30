import { file2ext, ext2enum } from '../file2extension';
import { fileExtensions, FileExtension } from '../fileTypeAndExt';

describe('file2ext', () => {
  it('should throw error on missing extension', () => {
    expect(() => file2ext('nada')).toThrowError(`filename does not have extension`);
    expect(() => file2ext('nada.')).toThrowError(`filename does not have extension`);
    expect(() => file2ext('.nada.')).toThrowError(`filename does not have extension`);
    expect(() => file2ext('.nada. ')).toThrowError(`filename does not have extension`);
    expect(() => file2ext('a.b.c.nada.')).toThrowError(`filename does not have extension`);
  });

  it('should return the extension in lowercase', () => {
    expect(file2ext('nada.jpeg')).toBe('jpeg');
    expect(file2ext('nada.jpg')).toBe('jpg');
    expect(file2ext('nada.png')).toBe('png');
    expect(file2ext('nada.pdf')).toBe('pdf');
    expect(file2ext('nada.doc')).toBe('doc');
  });
});

describe('ext2extension', () => {
  it('should throw error on wrong extension', () => {
    const msg = `file extension must be in: ${fileExtensions.join(',')}`;
    expect(() => ext2enum('' as FileExtension)).toThrowError(msg);
    expect(() => ext2enum(' ' as FileExtension)).toThrowError(msg);
    expect(() => ext2enum('doc' as FileExtension)).toThrowError(msg);
    expect(() => ext2enum('xls' as FileExtension)).toThrowError(msg);
    expect(() => ext2enum('DOC' as FileExtension)).toThrowError(msg);
    expect(() => ext2enum('XLS' as FileExtension)).toThrowError(msg);
    expect(() => ext2enum('gif' as FileExtension)).toThrowError(msg);
  });

  it('should return the right FileExtension', () => {
    expect(ext2enum('jpeg')).toBe('JPEG');
    expect(ext2enum('jpg')).toBe('JPG');
    expect(ext2enum('png')).toBe('PNG');
    expect(ext2enum('pdf')).toBe('PDF');
  });
});
