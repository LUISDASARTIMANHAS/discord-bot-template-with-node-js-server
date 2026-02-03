import express from "express";
const router = express.Router();
import {
  notfound,
} from "npm-package-nodejs-utils-lda";

// Middleware para lidar com rotas não encontradas (404)
router.use((req, res, next) => {
  notfound(res);
});

export default router;
