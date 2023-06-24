import http, { IncomingMessage, ServerResponse } from "http";
import Router, { Route } from "./router";

/*
 * Classe Plakum que será a fonte dos componentes
 *
 */

class Plakum extends Router {

  public init(port: number, ...args): void {

    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

      this.request = this.clearRequestObject();
      this.response = this.clearResponseObject();

      var currentRoute: Route | undefined = undefined;

      // Configuração padrão de roteamento
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
        this.setReqAndResAndSwitchRoutes(req, res, currentRoute);
      } else {
        const url = req.url
        throw new Error (`Route ${url} is not defined!`);
      }

    });

    // Iniciando o servidor
    server.listen(port, ...args);
  }

  public setRouter(router): void {
    this.routes = router.routes;
  }

};

export default Plakum;

