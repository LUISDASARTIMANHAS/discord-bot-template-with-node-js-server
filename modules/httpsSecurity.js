import cors from "cors"
import helmet from "helmet"

const httpsSecurityMiddleware = (req, res, next) => {
    const corsOptions = {
        origin: [/^https:\/\/.+/],
        methods: "GET,PUT,POST,DELETE",
        optionsSuccessStatus: 204,
    };

    cors(corsOptions)(req, res, () => { }); // Executa o middleware cors
    helmet.hsts({
        maxAge: 365 * 24 * 60 * 60,
        includeSubDomains: true,
        preload: true,
    })(req, res, next); // Executa o middleware helmet
};

export default httpsSecurityMiddleware;
