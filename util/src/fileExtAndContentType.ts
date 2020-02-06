export type FileExt =
  | 'jpeg'
  | 'jpg'
  | 'png'
  | 'pdf'
  | 'txt'
  | 'xml'
  | 'json'
  | 'doc'
  | 'docx'
  | 'xls'
  | 'xlsx';

export type ContentType =
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'text/plain'
  | 'text/xml'
  | 'application/json'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const fileExt2contentType: { [ext in FileExt]: ContentType } = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf',
  txt: 'text/plain',
  xml: 'text/xml',
  json: 'application/json',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export const name2fileExt = (filename: string): FileExt => {
  const array = filename.split('.');
  if (array.length < 2) {
    throw new Error('filename does not have extension');
  }
  const ext = array.pop();
  if (!ext) {
    throw new Error('filename does not have extension');
  }
  const e = ext.trim();
  if (!e) {
    throw new Error('filename does not have extension');
  }
  const res = e.toLowerCase() as FileExt;
  if (!fileExt2contentType[res]) {
    throw new Error(`file extension (${res}) is invalid`);
  }
  return res;
};
