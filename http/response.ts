import { ServerResponse } from "http";

type Response = { 
    headers: object; 
    method: string;
    statusCode: number;
    path: string;
    url: string;
    params: object;
    serverResponse: ServerResponse;
    send: Function;
}

export class ResponseData {

    headers: object = {}; 
    method: string = '';
    statusCode: number = 200;
    path: string = '';
    url: string = '';
    params: object = {};
    serverResponse: ServerResponse = Object.create(ServerResponse.prototype);

    constructor(serverResponse: ServerResponse) {
        this.serverResponse = serverResponse;
    } 

    public send(jsonData: JSON, statusCode: Response["statusCode"] = 200): void {

        var response = this.serverResponse;
        
        response.statusCode = statusCode;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(jsonData)); 
    }

}

export default Response;
