import express from "express";
const router = express.Router();
import os from "os"
import {
  landingPage,
  exposeFolders,
  StatusDashboard,
  logsDashboard
} from "npm-package-nodejs-utils-lda";


exposeFolders(router,"src");

StatusDashboard(router);
logsDashboard(router);

router.get("/debugger", (req, res) => {
  console.log("SISTEMA <OBTER> <SITE>: " + req.url);
  res.status(200);
});

export default router;