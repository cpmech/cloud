export type FileContentType = 'image/jpeg' | 'image/png' | 'application/pdf';

export type FileExtension = 'jpeg' | 'jpg' | 'png' | 'pdf';

export type FileExtensionEnum = 'JPEG' | 'JPG' | 'PNG' | 'PDF';

export const fileExtensions: FileExtension[] = ['jpeg', 'jpg', 'png', 'pdf'];

export const fileExtensionEnums: FileExtensionEnum[] = ['JPEG', 'JPG', 'PNG', 'PDF'];

export const ext2type = (ext: FileExtension): FileContentType => {
  switch (ext) {
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'pdf':
      return 'application/pdf';
  }
  throw new Error(`cannot handle file extension = ${ext} at this time`);
};

export const type2ext = (ctype: FileContentType): FileExtension => {
  switch (ctype) {
    case 'image/jpeg':
      return 'jpeg';
    case 'image/png':
      return 'png';
    case 'application/pdf':
      return 'pdf';
  }
  throw new Error(`cannot handle content-type = ${ctype} at this time`);
};
