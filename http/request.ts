import { IncomingMessage } from 'http';

type Request = {
    method: string;
    path: string | undefined;
    params: any;
    body: any;
    headers: object;
    incomingMessage: IncomingMessage;
}

export default Request;

