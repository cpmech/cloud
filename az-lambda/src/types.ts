import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type IContext = Context;
export type IEvent = APIGatewayProxyEvent;
export type IResult = APIGatewayProxyResult;
export type ILambda = (event: IEvent, context: IContext) => Promise<IResult>;
