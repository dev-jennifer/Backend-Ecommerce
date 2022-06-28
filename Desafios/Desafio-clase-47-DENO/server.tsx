import { Application, Router } from "https://deno.land/x/oak@v6.0.1/mod.ts";
import { React, ReactDOMServer } from "./deps.ts";
import App from "./app.tsx";
import Colores from "./colores.tsx"
const app = new Application();

const router = new Router();
router.get("/", handlePage);

let colores;
function init() {
  colores = [];
}
init();
router
  .post("/", async (context: any) => {
    const body = await context.request.body({ type: 'form-data'})
    const data = await body.value.read()
    const newColor=data.fields.colorList
  
    colores.push(newColor)
    const color = ReactDOMServer.renderToString(
    colores.map(function(e){
          return  <Colores prop={e}/> ;
    })
 
    );
    context.response.body = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <title>Document</title>
  </head>
  <body >
    <div id="root">
        <div className="container" style="background-color:black">
            <h1 style="color:white">Listado de colores</h1>
            <ul>${color}</ul>
        </div>
    </div>
    <script  src="http://localhost:8000/static/client.js" defer></script>
  </body>
  </html>`;
  });

const serverrouter = new Router();

app.use(router.routes());
app.use(serverrouter.routes());

app.use(router.allowedMethods());

console.log("server is running on http://localhost:8000/");
await app.listen({ port: 8080 });

function handlePage(ctx: any) {
  try {
    const body = ReactDOMServer.renderToString(
      <App />, // change here to pass todos as props
    );
    ctx.response.body = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <title>Document</title>
  </head>
  <body >
    <div id="root">${body}</div>
    <script  src="http://localhost:8000/static/client.js" defer></script>
  </body>
  </html>`;
  } catch (error) {
    console.error(error);
  }
}

//denon run --allow-net server.tsx
