import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";
import Request from "./http/request"; 

type Route = {
  path: string;
  method: string;
  params?: object;
  callback: Function;
}

class Plakum {

  private routes: Route[] = [];
  private requestTemp: object = {};

  public get(path: string, callback: Function): void { 
    this.routes.push({ path: path, method: 'GET', callback, params: {} });
  }

  public post(path: string, callback: Function): void { 
    this.routes.push({ path: path, method: 'POST', callback, params: {} });
  }

  public init(port: number, ...args): void {

    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

      this.requestTemp = {};
      var currentRoute: Route | undefined = undefined;

      const filterRouterByMethod: Route[] = this.routes.filter(route => route.method === req.method);
      const findRouteByName: Route | undefined = filterRouterByMethod.find(route => route.path === req.url);

      if (findRouteByName) {
        currentRoute = findRouteByName;
      } else {

        const findRouteByParam: Route | undefined = filterRouterByMethod.find(route => {

          let urlModel: string[] = [];
          let urlReal: string[] = [];

          urlModel = route.path.split('/');
          urlReal = req.url !== undefined ? req.url.split('/') : []; 

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

        if (findRouteByParam !== undefined && findRouteByParam.path !== '/')
          currentRoute = findRouteByParam;

      }

      if (currentRoute) {

        this.requestTemp['headers'] = req.headers;
        this.requestTemp['method'] = currentRoute.method;
        this.requestTemp['statusCode'] = req.statusCode;
        this.requestTemp['statusMessage'] = req.statusMessage;
        this.requestTemp['path'] = currentRoute.path;
        this.requestTemp['url'] = req.url;
        this.requestTemp['params'] = currentRoute.params;

        if (currentRoute.method === 'GET')
          currentRoute.callback(this.requestTemp);

        if (currentRoute.method === 'POST')
          this.getRequestBody(req, this.requestTemp, currentRoute.callback);

      } else {
        const url = req.url
        throw new Error (`Route ${url} is not defined!`);
      }

    });

    server.listen(port, ...args);
  }

  private getRequestBody(request: IncomingMessage, requestTemporary: object, callback: Function): void {

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

};

export default Plakum;

export {
  Request
};

