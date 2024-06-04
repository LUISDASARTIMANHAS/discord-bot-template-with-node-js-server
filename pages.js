import express from "express";
const router = express.Router();
import path from "path";
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = __dirname + "/src/";
const path_css = files + "css/";
const path_js = files + "js/"
const path_pages = files + "pages/";
const indexFilePath = path.join(path_pages, "index.html");

router.use(express.static(files));
console.log("LOAD STATIC ITENS: " + path_css);
console.log("LOAD STATIC ITENS: " + path_js);
console.log("LOAD STATIC ITENS: " + path_pages);


router.get("/", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.sendFile(indexFilePath);
});

router.get("/debugger", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.status(200)
});
export default router;