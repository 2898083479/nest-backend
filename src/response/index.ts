

export enum ResponseCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const ResponseMessage: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: 'Success',
  [ResponseCode.BAD_REQUEST]: 'Bad Request',
  [ResponseCode.UNAUTHORIZED]: 'Unauthorized',
  [ResponseCode.FORBIDDEN]: 'Forbidden',
  [ResponseCode.NOT_FOUND]: 'Not Found',
  [ResponseCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};