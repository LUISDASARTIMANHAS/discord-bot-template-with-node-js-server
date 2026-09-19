import express from "express";
const router = express.Router();
import {
  exposeFolders,
} from "npm-package-nodejs-utils-lda";


exposeFolders(router,"src");

router.get("/debugger", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.status(200);
});

export default router;