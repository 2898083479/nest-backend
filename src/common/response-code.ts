import { Response } from ".";

export const EXPAY_CATEGORY = '00';

export enum ResponseCode {
  OPERATING_SUCCESSFULLY = '0000',
  EMPTY_CONTENT = '0001',
  NOTHING_CHANGED = '0002',
  OPERATING_FAILED = '2000',
  ILLEGAL_PARAMETERS = '2001',
  UNAUTHORIZED = '2002',
  FORBIDDEN = '2003',
  NOT_FOUND = '2004',
  METHOD_NOT_ALLOWED = '2005',
  REQUEST_TIMEOUT = '2006',
  SYSTEM_ERROR = '3000',
}

const RESPONSE_MESSAGE: { [key: string]: string } = {
  [ResponseCode.OPERATING_SUCCESSFULLY]: 'Operating Successfully',
  [ResponseCode.EMPTY_CONTENT]: 'Empty Content',
  [ResponseCode.NOTHING_CHANGED]: 'Nothing Changed',
  [ResponseCode.OPERATING_FAILED]: 'Operating Failed',
  [ResponseCode.ILLEGAL_PARAMETERS]: 'Illegal Parameters',
  [ResponseCode.UNAUTHORIZED]: 'Unauthorized',
  [ResponseCode.FORBIDDEN]: 'Forbidden',
  [ResponseCode.NOT_FOUND]: 'Not Found',
  [ResponseCode.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [ResponseCode.REQUEST_TIMEOUT]: 'Request Timeout',
  [ResponseCode.SYSTEM_ERROR]: 'System Error',
};

const NATIVE_RESPONSE: { [key: string]: string } = {
  400: ResponseCode.ILLEGAL_PARAMETERS,
  401: ResponseCode.UNAUTHORIZED,
  403: ResponseCode.FORBIDDEN,
  404: ResponseCode.NOT_FOUND,
  405: ResponseCode.METHOD_NOT_ALLOWED,
  408: ResponseCode.REQUEST_TIMEOUT,
  500: ResponseCode.SYSTEM_ERROR,
};

export const getResponseMessage = (code: ResponseCode | string) => {
  return RESPONSE_MESSAGE[code] ?? '';
};

export const getNativeResponse = (status: number) => {
  return NATIVE_RESPONSE[status] ?? ResponseCode.SYSTEM_ERROR;
};



export const handleSuccess = (message?: string, data?: any) => {
  return new Response(
    "0000",
    ResponseCode.OPERATING_SUCCESSFULLY,
    message ? message : getResponseMessage(ResponseCode.OPERATING_SUCCESSFULLY),
    data ? data : null
  )
}

export const handleFailed = (message?: string) => {
  return new Response(
    "0001",
    ResponseCode.OPERATING_FAILED,
    message ? message : getResponseMessage(ResponseCode.OPERATING_FAILED)
  )
}