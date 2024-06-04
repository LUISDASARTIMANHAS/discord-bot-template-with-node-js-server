import fs from "fs";
import path from "path";
import xss from "xss";
import { fopen, fwrite } from "../modules/autoFileSysModule.js";
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filesServer = __dirname + "/../src/";
const path_pages = filesServer + "pages/";
const forbiddenFilePath = path.join(path_pages, "forbidden.html");
const configs = fopen("config.json");

function checkHeaderMiddleware(req, res, next) {
	const origin = req.headers.referer || req.headers.referrer;
	const keyHeader = req.headers["authorization"];
	const blockedRoutes = configs.blockedRoutes || [];
	const blockRoutesPresent = blockedRoutes.some((route) => {
		// Trata rotas com curingas
		const regex = new RegExp(`^${route.replace(/\*/g, ".*")}$`);
		return regex.test(req.path);
	});
	const payload = JSON.stringify(req.body, null, 2);
	const keys = configs.keys || [
		"ROOT:keyBypass"
	];
	const validKey = keys.some((key) => keyHeader === key);
	const auth = blockRoutesPresent && !validKey;

	console.log("-------------------------");
	console.log("SISTEMA <CHECK GERAL> <OBTER>: " + req.url);
	console.log("SISTEMA <ORIGEM>: " + origin);
	console.log("SISTEMA <PAYLOAD>: " + payload);
	keys.forEach((key) => {
		print(keyHeader, key, !auth, blockRoutesPresent);
	});
	for (const key in req.body) {
		req.body[key] = xss(req.body[key]);
	}
	if (auth) {
		// Se estiver solicitando das rotas bloqueadas E não conter key, bloquea a solicitação
		forbidden(res);
	} else {
		// Cabeçalho "solicitador" presente ou rota não bloqueada, permite o acesso
		next();
	}
};

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

// functions basicas
function print(keyHeader, key, auth, blockRoutes) {
	console.log("SISTEMA <VERIFICAÇÃO>: " + keyHeader + " == " + key);
	console.log("SISTEMA <AUTORIZAÇÃO>: " + conversorSimEnao(auth));
	console.log("SISTEMA <ROTA BLOQUEADA>: " + blockRoutes)
	console.log("----------------------------");
}

export default checkHeaderMiddleware;