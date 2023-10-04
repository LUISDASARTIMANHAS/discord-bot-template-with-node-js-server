const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const port = 3000;

const files = __dirname + "/src/";
const path_pages = files + "pages/";
const path_js = files + "js";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const rotas = require("./rotas");
const pages = require("./pages");
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
  const key = "key";
  const key2 = "key2";
  const key3 = "key&Aplication";

  const validKey = keyHeader === key;
  const validKey2 = keyHeader === key2;
  const validKey3 = keyHeader === key3;
  const auth1 = blockRoutesPresent && !validKey;
  const auth2 = blockRoutesPresent && !validKey2;
  const auth3 = blockRoutesPresent && !validKey3;

  console.log("-------------------------");
  console.log("SISTEMA <CHECK> <OBTER>: " + req.url);
  console.log("SISTEMA <ORIGEM>: " + origin);
  console.log("SISTEMA <PAYLOAD>: " + payload);
  if (auth1 && auth2 && auth3) {
    // Se estiver solicitando das rotas bloqueadas E não conter key, bloquea a solicitação
    print(keyHeader, key, key2, key3, auth1, auth2, auth3);
    forbidden(res);
  } else {
    // Cabeçalho "solicitador" presente ou rota não bloqueada, permite o acesso
    print(keyHeader, key, key2, key3, auth1, auth2, auth3);
    next();
  }
};
app.use(cors(corsOptions));
app.use(checkHeaderMiddleware);
app.use(pages);
app.use(rotas);
require("./index");


app.listen(port, () => {
  console.log(`Servidor Web rodando em http://localhost:${port}`);
});

// functions basicas
function print(keyHeader, key, key2, key3, auth1, auth2, auth3) {
  console.log("SISTEMA <VERIFICAÇÃO 1>: " + keyHeader + " == " + key);
  console.log("SISTEMA <VERIFICAÇÃO 2>: " + keyHeader + " == " + key2);
  console.log("SISTEMA <VERIFICAÇÃO 2>: " + keyHeader + " == " + key3);
  console.log("SISTEMA <AUTORIZAÇÃO 1>: " + conversorSimEnao(!auth1));
  console.log("SISTEMA <AUTORIZAÇÃO 2>: " + conversorSimEnao(!auth2));
  console.log("SISTEMA <AUTORIZAÇÃO 3>: " + conversorSimEnao(!auth3));
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
