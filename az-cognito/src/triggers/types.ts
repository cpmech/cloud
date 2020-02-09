import { CognitoUserPoolTriggerEvent } from 'aws-lambda';

export type IEventCognito = CognitoUserPoolTriggerEvent;
export type ILambdaCognito = (event: IEventCognito) => Promise<any>;
