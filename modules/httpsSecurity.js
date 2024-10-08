import cors from "cors";
import { hsts } from "helmet";

function httpsSecurityMiddleware(req, res, next) {
  console.log("executando https security");
  const corsOptions = {
    origin: [
      /^https:\/\/.+/,
      /^http:\/\/.+/,
      "https://discord.com",
      "https://brasil-eternity.glitch.me/",
      "brasil-eternity.glitch.me",
    ],
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: [
      "Content-Type",
      "Access-Control-Allow-Origin",
      "authorization",
      "id",
      "key",
      "urlParams",
      "cache-control",
    ],
    optionsSuccessStatus: 204,
  };
  const hstsOptions = {
    maxAge: 365 * 24 * 60 * 60,
    includeSubDomains: true,
    preload: true,
  };

  // Chamando o middleware cors
  cors(corsOptions)(req, res, () => {
    // Configurar cabeçalhos de resposta para OPTIONS
    if (req.method === "OPTIONS") {
      console.log("SISTEMA OPTIONS CORS");
      res.set("Access-Control-Allow-Origin", corsOptions.origin);
      res.set("Access-Control-Allow-Methods", corsOptions.methods);
      res.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders);
    }

    // Chamando o middleware helmet
    hsts(hstsOptions)(req, res, next);
  });
}

export default httpsSecurityMiddleware;
