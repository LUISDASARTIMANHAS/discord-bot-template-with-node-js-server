const express = require("express");
const app = express();
const files = __dirname + "/src/";
const path_js = files + "js";
const port = 3000;
const rotas = require("./rotas");
const pages = require("./pages");
app.use(pages);
app.use(rotas);

app.use(express.static(path_js, { type: "text/javascript" }));
require("./index");


app.listen(port, () => {
  console.log(`Servidor Web rodando em http://localhost:${port}`);
});
