import { Iany } from '@cpmech/js2ts';
export { Iany };

export interface Istring {
  [key: string]: string;
}

export interface IUpdateData {
  UpdateExpression: string;
  ExpressionAttributeNames: Istring;
  ExpressionAttributeValues: Iany;
}

export interface IPrimaryKey {
  [partitionOrSort: string]: string;
}
