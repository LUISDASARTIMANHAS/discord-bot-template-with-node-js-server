import express from "express";
const router = express.Router();
import fs  from "fs";
import path from "path";
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files2 = __dirname + "/src/";
const path_pages = files2 + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const notFoundFilePath = path.join(path_pages, "not-found.html");
import cors from "cors";

router.use(cors({ origin: "*" }));
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Rota blackhole para lidar com muitas requisições
router.use('/blackhole', (req, res) => {
  res.status(429);
  res.send('Too Many Requests // Muitas Solicitações!');
});

// Middleware para lidar com rotas não encontradas (404)
router.use((req, res, next) => {
  res.status(404);
  res.sendFile(notFoundFilePath);
});

export default router;