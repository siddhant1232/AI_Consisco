import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "./core";


export const routeHandler = createRouteHandler({
  router: ourFileRouter,
});

export { routeHandler as GET, routeHandler as POST };