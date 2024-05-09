type ResponseStatus = 'error' | 'success';
interface Error {
  code: string;
  message: string;
  details: string;
}

export interface ResponseDTO {
  status: ResponseStatus;
  data?: any;
  errors?: Error[];
}
