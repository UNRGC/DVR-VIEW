const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const VIDEO_DIR = "/";

const USER = "admin";
const PASS = "12345678";

app.use(
    session({
        secret: "secreto_super_seguro",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static("public"));

function authMiddleware(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    }

    const auth = req.headers.authorization;
    if (!auth) {
        res.setHeader("WWW-Authenticate", 'Basic realm="Videos"');
        return res.status(401).send("Authentication required.");
    }

    const [type, credentials] = auth.split(" ");
    const [user, pass] = Buffer.from(credentials, "base64").toString().split(":");

    if (user === USER && pass === PASS) {
        req.session.authenticated = true;
        return next();
    }

    res.status(403).send("Access denied");
}

app.use(authMiddleware);

// Lista de videos
app.get("/api/videos", (req, res) => {
    fs.readdir(VIDEO_DIR, (err, files) => {
        if (err) return res.status(500).json({ error: "No se pudo leer el directorio." });

        const videos = files.filter((file) => file.endsWith(".mkv"));
        res.json(videos);
    });
});

// Reproducir video
app.get("/video/:filename", (req, res) => {
    const filePath = path.join(VIDEO_DIR, req.params.filename);
    res.sendFile(filePath);
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
