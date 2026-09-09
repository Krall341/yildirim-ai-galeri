const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("⚡ YILDIRIM AI SUNUCU AKTİF");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Yıldırım AI sunucusu çalışıyor: " + PORT);
});
