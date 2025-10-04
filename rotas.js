import express from "express";
const router = express.Router();
import {
  fetchGet,
  fetchPost,
  notfound,
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
} from "npm-package-nodejs-utils-lda";

// Middleware para lidar com rotas não encontradas (404)
router.use((req, res, next) => {
  notfound(res);
});

module.exports = router;
