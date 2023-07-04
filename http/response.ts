import { ServerResponse } from "http";
import { CORS, populateCorsBody } from './cors';

/*
 * Tipo padrão da resposta
 *
 */

type Response = { 
    headers: object; 
    method: string;
    statusCode: number;
    path: string;
    url: string;
    params: object;
    wasContentTypeSetted: boolean;
    setContentType: Function;
    setHeader: Function;
    setCors: Function;
    send: Function;
    serverResponse: ServerResponse;
}

/*
 * Classe que fornece os métodos para manipular a
 * resposta da requisição
 *
 */

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

    public setHeader(key: string, value: string | number | readonly string[]): void {
        this.serverResponse.setHeader(key, value);
    }

    public setCors(options: CORS): void {
        const cors = populateCorsBody(options); 
        for (const key in cors) {
            this.setHeader(key, cors[key]);
        }
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
