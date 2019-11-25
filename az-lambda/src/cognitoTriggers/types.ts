export interface IEmailMakerResults {
  subject: string;
  message: string;
}

export type IEmailMaker = (email: string, name?: string, provider?: string) => IEmailMakerResults;
