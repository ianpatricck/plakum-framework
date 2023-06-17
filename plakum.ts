import http, { IncomingMessage, ServerResponse } from "http";
import Router, { Route } from "./router";

/*
 * Classe Plakum que será a fonte dos componentes
 *
 */

class Plakum extends Router {

  public init(port: number, ...args): void {

    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

      this.requestTemp = {};
      var currentRoute: Route | undefined = undefined;

      const filterRoutesByMethod: Route[] = this.filterRoutesByMethod(req.method);
      const findRouteByUrl: Route | undefined = this.findRouteByUrl(filterRoutesByMethod, req.url);

      if (findRouteByUrl) {
        currentRoute = findRouteByUrl;
      } else {

        const findRouteByParam: Route | undefined = this.findRouteByParam(filterRoutesByMethod, req.url); 

        if (findRouteByParam)
          currentRoute = findRouteByParam;

      }

      if (currentRoute) {

        this.setRequestAndSwitchRoutes(req, currentRoute, {
          headers: req.headers,
          statusCode: req.statusCode,
          statusMessage: req.statusMessage,
          url: req.url
        });

      } else {
        const url = req.url
        throw new Error (`Route ${url} is not defined!`);
      }

    });

    server.listen(port, ...args);
  }

};

export default Plakum;

