export class Response {
  category: string;
  code: string;
  message: string;
  data?: any;

  constructor(
    category: string,
    code: string,
    message: string,
    data?: any
  ) {
    this.category = category;
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

