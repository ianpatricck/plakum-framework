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
    middleware: Function | undefined;
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
            wasContentTypeSetted: false,
            setContentType: () => null,
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
     * Se no método da requisição existir algum conteúdo no corpo, faz o 'dispatch' populando o body da resposta
     * e convertendo-o para o formato JSON ou seja qual for.
     *
     */

    private callRouteWithBody(request: Request, response: Response, callback: Function, middleware: Function | undefined): void {
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

                if (middleware)
                    middleware(request, response);

                callback(request, response); 
            });
        }

    }

    /*
     * Chama o callback caso não tenha um corpo definido na requisição
     *
     */

    private callRouteWithoutBody(request: Request, response: Response, callback: Function, middleware: Function | undefined): void {

        if (middleware)
            middleware(request, response);

        callback(request, response); 
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
                this.callRouteWithoutBody(this.request, this.response, route.callback, route.middleware);
                break;
            case 'POST':
                this.callRouteWithBody(this.request, this.response, route.callback, route.middleware);
                break;
            case 'PATCH':
                this.callRouteWithBody(this.request, this.response, route.callback, route.middleware);
                break;
            case 'PUT':
                this.callRouteWithBody(this.request, this.response, route.callback, route.middleware);
                break;
            case 'DELETE':
                this.callRouteWithoutBody(this.request, this.response, route.callback, route.middleware);
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

    public get(path: string, ...args: Function[]): void { 
        if (args.length == 2)
            this.routes.push({ path, method: 'GET', middleware: args[0], callback: args[1], params: {} });
        else if (args.length == 1)
            this.routes.push({ path, method: 'GET', middleware: undefined, callback: args[0], params: {} });
    }

    public post(path: string, ...args: Function[]): void { 
        if (args.length == 2)
            this.routes.push({ path, method: 'POST', middleware: args[0], callback: args[1], params: {} });
        else if (args.length == 1)
            this.routes.push({ path, method: 'POST', middleware: undefined, callback: args[0], params: {} });
    }

    public patch(path: string, ...args: Function[]): void { 
        if (args.length == 2)
            this.routes.push({ path, method: 'PATCH', middleware: args[0], callback: args[1], params: {} });
        else if (args.length == 1)
            this.routes.push({ path, method: 'PATCH', middleware: undefined, callback: args[0], params: {} });
    }

    public put(path: string, ...args: Function[]): void { 
        if (args.length == 2)
            this.routes.push({ path, method: 'PUT', middleware: args[0], callback: args[1], params: {} });
        else if (args.length == 1)
            this.routes.push({ path, method: 'PUT', middleware: undefined, callback: args[0], params: {} });
    } 
    
    public delete(path: string, ...args: Function[]): void { 
        if (args.length == 2)
            this.routes.push({ path, method: 'DELETE', middleware: args[0], callback: args[1], params: {} });
        else if (args.length == 1)
            this.routes.push({ path, method: 'DELETE', middleware: undefined, callback: args[0], params: {} });
    }
}

