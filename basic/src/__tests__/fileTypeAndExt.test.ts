import { ext2type, FileExtension, type2ext, FileContentType } from '../fileTypeAndExt';

describe('ext2type', () => {
  it('should return the right type', () => {
    expect(ext2type('jpeg')).toBe('image/jpeg');
    expect(ext2type('jpg')).toBe('image/jpeg');
    expect(ext2type('png')).toBe('image/png');
    expect(ext2type('pdf')).toBe('application/pdf');
  });

  it('should throw error on wrong extension', () => {
    expect(() => ext2type('doc' as FileExtension)).toThrowError(
      'cannot handle file extension = doc at this time',
    );
  });
});

describe('type2ext', () => {
  it('should return the right extension', () => {
    expect(type2ext('image/jpeg')).toBe('jpeg');
    expect(type2ext('image/png')).toBe('png');
    expect(type2ext('application/pdf')).toBe('pdf');
  });

  it('should throw error on wrong type', () => {
    expect(() => type2ext('application/doc' as FileContentType)).toThrowError(
      'cannot handle content-type = application/doc at this time',
    );
  });
});
