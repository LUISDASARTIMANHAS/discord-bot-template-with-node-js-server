import express from "express";
import ddos from "ddos";
const app = express();
import path from "path";
import fs from "fs";
import cors from "cors";
const port = 3000;
const params = {
  limit: 150,
  maxcount: 250,
  trustProxy: true,
  includeUserAgent: true,
  whitelist: [],
  testmode: false
};
const limiter = new ddos(params);
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = __dirname + "/src/";
const path_pages = files + "pages/";
const path_js = files + "js";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
import rotas from "./rotas.js";
import pages from "./pages.js";
// Configurar o CORS para permitir origens específicas
const corsOptions = {
  origin: /^https:\/\/.+/,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};
const checkHeaderMiddleware = (req, res, next) => {
  const origin = req.headers.referer || req.headers.referrer;
  const keyHeader = req.headers["authorization"];
  const blockedRoutes = [
    "/admin"
  ];
  const blockRoutesPresent = blockedRoutes.includes(req.path);
  const payload = JSON.stringify(req.body, null, 2);
  const keys = [
    "123456789",
    "1020251461274"
  ];
  const validKey = keys.some((key) => keyHeader === key);
  const auth = startRouteApi && !validKey;

  console.log("-------------------------");
  console.log("SISTEMA <CHECK> <OBTER>: " + req.url);
  console.log("SISTEMA <ORIGEM>: " + origin);
  console.log("SISTEMA <PAYLOAD>: " + payload);
  keys.forEach(key => {
    const auth = keyHeader === key;
    print(keyHeader, key, auth);
  });
  if (auth) {
    // Se estiver solicitando das rotas bloqueadas E não conter key, bloquea a solicitação
    forbidden(res);
  } else {
    // Cabeçalho "solicitador" presente ou rota não bloqueada, permite o acesso
    next();
  }
};
app.use(limiter.express);
app.use(cors(corsOptions));
app.use(checkHeaderMiddleware);
app.use(pages);
app.use(rotas);
import * as bot from "./src/index.js";


app.listen(port, () => {
  console.log(`Servidor Web rodando em http://localhost:${port}`);
});

// functions basicas
function print(keyHeader, key, auth1) {
  console.log("SISTEMA <VERIFICAÇÃO>: " + keyHeader + " == " + key);
  console.log("SISTEMA <AUTORIZAÇÃO>: " + conversorSimEnao(!auth1));
  console.log("----------------------------");
}

function forbidden(res) {
  res.status(403);
  res.sendFile(forbiddenFilePath);
}

function conversorSimEnao(value) {
  if (value) {
    return "✔Voce foi autorizado, esta tudo correto";
  }
  return "⚠Esta faltando algo ou não foi autorizado!";
}