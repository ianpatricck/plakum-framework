import { ServerResponse } from "http";

type Response = { 
    headers: object; 
    method: string;
    statusCode: number;
    path: string;
    url: string;
    params: object;
    wasContentTypeSetted: boolean;
    setContentType: Function;
    send: Function;
    serverResponse: ServerResponse;
}

export class ResponseData {

    headers: object = {}; 
    method: string = '';
    statusCode: number = 200;
    path: string = '';
    url: string = '';
    params: object = {};
    serverResponse: ServerResponse = Object.create(ServerResponse.prototype);

    wasContentTypeSetted: boolean = false;

    constructor(serverResponse: ServerResponse) {
        this.serverResponse = serverResponse;
    } 

    public setContentType(contentType: string): void {
        this.wasContentTypeSetted = true;
        this.serverResponse.setHeader('Content-Type', contentType);
    }

    public send(data: JSON | string, statusCode: Response["statusCode"] = 200): void { 
        
        this.serverResponse.statusCode = statusCode;

        if (this.wasContentTypeSetted) {
            this.serverResponse.end(data); 
        } else {
            this.serverResponse.setHeader('Content-Type', 'application/json');
            this.serverResponse.end(JSON.stringify(data)); 
        }
    }
}

export default Response;
