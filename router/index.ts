import url from "url";
import { IncomingMessage, ServerResponse } from "http";
import Request from '../http/request';
import Response, { ResponseData } from "../http/response";

/*
 * Definição da rota
 *
 */

export type Route = {
    path: string;
    method: string;
    params: object;
    callback: Function;
};

/*
 * Classe com as ações das rotas
 *
 */

class RouterRules {

    protected routes: Route[] = [];
    protected request: Request = this.clearRequestObject();
    protected response: Response = this.clearResponseObject();

    private isJsonRequest: boolean = false;

    protected clearRequestObject(): Request {
        return {
            method: '',
            path: '',
            params: {},
            body: {},
            headers: {},
            incomingMessage: Object.create(IncomingMessage.prototype)
        }
    }

    protected clearResponseObject(): Response {
        return {
            headers: {},
            method: '',
            statusCode: 200,
            path: '',
            url: '',
            params: {},
            send: () => null,
            serverResponse: Object.create(ServerResponse.prototype)
        }
    }

    /*
     * Filtra as rotas pelo método da requisição
     *
     */

    public filterRoutesByMethod(method: string | undefined): Route[] {
        const routes: Route[] = this.routes.filter(route => route.method === method);
        return routes;
    }

    /*
     * Encontra a rota pela URL da requisição 
     *
     */

    public findRouteByUrl(routes: Route[], url: string | undefined): Route | undefined {
        const route: Route | undefined = routes.find(route => route.path === url); 
        return route;
    }

    /*
     * Encontra a rota pelo argumento passado
     *
     */

    public findRouteByParam(routes: Route[], requestUrl: string | undefined): Route | undefined {
        const routeFound: Route | undefined = routes.find(route => {
            let urlModel: string[] = [];
            let urlReal: string[] = [];

            urlModel = route.path.split('/');
            urlReal = requestUrl !== undefined ? requestUrl.split('/') : []; 

            if (urlReal[urlReal.length - 1] == '')
                urlReal.pop(); 

            if (urlModel.length === urlReal.length) { 

                let paramsObject: object = {};
                urlModel.forEach((element, index) => {

                    const startsWith = /^:/;
                    if (startsWith.test(element)) {
                        paramsObject[element.replace(':', '')] = Number(urlReal[index]) ? Number(urlReal[index]) : urlReal[index];
                    }

                });

                route.params = paramsObject;
                return route;
            }

        });

        if (routeFound !== undefined && routeFound.path !== '/')
            return routeFound;
        else
            return undefined;
    }

    /*
     * Se o método da requisição for POST, faz o 'dispatch' populando o body da resposta
     * e convertendo-o para o formato JSON
     *
     */

    private getRequestBody(request: Request, response: Response, callback: Function): void {
        let body = '';

        if (request.method === 'POST' || request.method === 'PATCH' || request.method === 'PUT') {
            request.incomingMessage.on('data', chunk => {
                body += chunk.toString();
            });

            request.incomingMessage.on('end', () => {

                if (this.isJsonRequest)
                    request.body = body ? JSON.parse(body) : {}; 
                else
                    request.body = body;

                callback(request, response); 
            });
        }

    }

    /*
     * Implementa a requisição e resposta e faz o 'Switch' nas rotas por meio dos métodos
     *
     */

    public setReqAndResAndSwitchRoutes(incomingMessage: IncomingMessage,  serverResponse: ServerResponse, route: Route): void {
        this.request = {
            method: route.method,
            path: route.path,
            params: route.params,
            body: {},
            headers: incomingMessage.headers,
            incomingMessage: incomingMessage
        };

        this.response = new ResponseData(serverResponse);

        const method = route.method;

        switch (method) {
            case 'GET':
                route.callback(this.request, this.response);
                break;
            case 'POST':
                this.getRequestBody(this.request, this.response, route.callback);
                break;
            case 'PATCH':
                this.getRequestBody(this.request, this.response, route.callback);
                break;
            case 'PUT':
                this.getRequestBody(this.request, this.response, route.callback);
                break;
            case 'DELETE':
                route.callback(this.request, this.response);
                break;
            default:
                throw new Error (`Method ${method} not allowed`);
                break;
        } 
    }

    /*
     * Define que o tipo da requisição é JSON
     *
     */

    public json(): void {
        this.isJsonRequest = true;
    }
}

/*
 * Classe que engloba os verbos das rotas
 *
 */

export default class Router extends RouterRules {

    public get(path: string, callback: Function): void { 
        this.routes.push({ path: path, method: 'GET', callback, params: {} });
    }

    public post(path: string, callback: Function): void { 
        this.routes.push({ path: path, method: 'POST', callback, params: {} });
    }

    public patch(path: string, callback: Function): void { 
        this.routes.push({ path: path, method: 'PATCH', callback, params: {} });
    }

    public put(path: string, callback: Function): void { 
        this.routes.push({ path: path, method: 'PUT', callback, params: {} });
    } 

    public delete(path: string, callback: Function): void { 
        this.routes.push({ path: path, method: 'DELETE', callback, params: {} });
    }
}

