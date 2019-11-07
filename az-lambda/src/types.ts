import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  CognitoUserPoolTriggerEvent,
} from 'aws-lambda';

export type IContext = Context;
export type IEvent = APIGatewayProxyEvent;
export type IEventCognito = CognitoUserPoolTriggerEvent;
export type IResult = APIGatewayProxyResult;
export type ILambda = (event: IEvent, context: IContext) => Promise<IResult>;
export type ILambdaCognito = (event: IEventCognito) => Promise<any>;
