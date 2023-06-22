import { IncomingMessage } from 'http';

type ObjectSanitized = {
    [key: string]: string | boolean | number | null | undefined;
}

type Request = {
    method: string;
    path: string | undefined;
    params: ObjectSanitized;
    body: ObjectSanitized;
    headers: object;
    incomingMessage: IncomingMessage;
}

export { ObjectSanitized };
export default Request;

