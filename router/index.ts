import url from "url";
import { IncomingMessage } from "http";

/*
 * Definição da rota
 *
 */

export type Route = {
    path: string;
    method: string;
    params?: object;
    callback: Function;
};

type SimpleRequestData = {
    headers: object;
    statusCode: string | number | undefined;
    statusMessage: string | undefined;
    url: string | undefined;
};

/*
 * Classe com as ações das rotas
 *
 */

class RouterRules {

    protected routes: Route[] = [];
    protected requestTemp: object = {};

    public filterRoutesByMethod(method: string | undefined): Route[] {
        const routes: Route[] = this.routes.filter(route => route.method === method);
        return routes;
    }

    public findRouteByUrl(routes: Route[], url: string | undefined): Route | undefined {
        const route: Route | undefined = routes.find(route => route.path === url); 
        return route;
    }

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
                        paramsObject[element.replace(':', '')] = urlReal[index];
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

    private getPostRequestBody(request: IncomingMessage, requestTemporary: object, callback: Function): void {

        let body = '';

        if (request.method === 'POST') {
            request.on('data', chunk => {
                body += chunk.toString();
            });

            request.on('end', () => {
                requestTemporary['body'] = JSON.parse(body); 
                callback(requestTemporary);
            });
        }

    }

    public setRequestAndSwitchRoutes(request: IncomingMessage, route: Route, simpleRequestData: SimpleRequestData): void {

        this.requestTemp['headers']         = simpleRequestData.headers;
        this.requestTemp['method']          = route.method;
        this.requestTemp['statusCode']      = simpleRequestData.statusCode;
        this.requestTemp['statusMessage']   = simpleRequestData.statusMessage;
        this.requestTemp['path']            = route.path;
        this.requestTemp['url']             = simpleRequestData.url;
        this.requestTemp['params']          = route.params;

        const method = route.method;

        switch (method) {
            case 'GET':
                route.callback(this.requestTemp);
                break;
            case 'POST':
                this.getPostRequestBody(request, this.requestTemp, route.callback);
                break;
            default:
                throw new Error (`Method ${method} not allowed`);
                break;
        } 
    }
}

export default class Router extends RouterRules {

    public get(path: string, callback: Function): void { 
        this.routes.push({ path: path, method: 'GET', callback, params: {} });
    }

    public post(path: string, callback: Function): void { 
        this.routes.push({ path: path, method: 'POST', callback, params: {} });
    }

}

