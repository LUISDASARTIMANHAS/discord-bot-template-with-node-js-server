const express = require("express");
const router = express.Router();
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  getRandomInt,
  getRandomBin,
  getRandomHex,
  generateToken,
  ordenarUsuario,
  pesqUsuario,
  validadeApiKey,
  unauthorized,
  forbidden,
  formatDate,
  conversorSimEnao,
  landingPage
} = require("npm-package-nodejs-utils-lda");

const files = __dirname + "/src/";
const path_css = files + "css/";
const path_js = files + "js/";
const path_pages = files + "pages/";
const indexFilePath = path.join(path_pages, "index.html");
const hostFilePath = path.join(path_pages, "host.html");

router.use(express.static(files));
console.log("LOAD STATIC ITENS: " + path_css);
console.log("LOAD STATIC ITENS: " + path_js);
console.log("LOAD STATIC ITENS: " + path_pages);

router.get("/", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  landingPage(res);
});

router.get('/status', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    cpuUsage: os.loadavg(),
    memoryUsage: process.memoryUsage(),
  };

  try {
    res.json(healthCheck);
  } catch (e) {
    healthCheck.message = e;
    res.status(503).send();
  }
});


router.get("/host", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.sendFile(hostFilePath);
});

router.get("/debugger", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.status(200);
});

module.exports = router;