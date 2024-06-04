import express from "express";
import ddos from "ddos";
const app = express();
import path from "path";
import httpsSecurity from "./modules/httpsSecurity.js";
import checkHeaderMiddleware from "./modules/checkHeaderMiddleware.js";
import ddosModule from "./modules/ddosModule.js";
import { fopen, fwrite } from "./modules/autoFileSysModule.js";
import {fileURLToPath} from 'url';


const configs = fopen("./config.json");
const hostname = "";
const porta = configs.porta;
const dinamicPort = (porta || 8080);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = __dirname + "/src/";
const path_pages = files + "pages/";
const path_js = files + "js";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
import rotas from "./rotas.js";
import pages from "./pages.js";
import * as bot from "./src/index.js";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(httpsSecurity);
app.use(ddosModule().express);

app.use(pages);
app.use(rotas);

var server = app.listen(dinamicPort, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Servidor rodando em http://%s:%s",hostname, port);
  console.log("IP Obtido: http://%s:%s",host, port);
})