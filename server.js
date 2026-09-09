const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json({ limit: "1mb" }));

// Yıldırım AI frontend bağlantısı
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

// OpenAI bağlantısı
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Sunucu kontrolü
app.get("/", (req, res) => {
    res.send("⚡ YILDIRIM AI SUNUCU AKTİF");
});

// Araç analiz endpoint'i
app.post("/api/analyze", async (req, res) => {
    try {
        const {
            marka,
            model,
            yil,
            km,
            sehir,
            istenen,
            paket,
            ekspertiz,
            noter,
            diger,
            minimumKar
        } = req.body;

        if (!marka || !model || !yil || !km || !istenen) {
            return res.status(400).json({
                success: false,
                error: "Araç bilgileri eksik."
            });
        }

        const prompt = `
Sen Yıldırım Oto Galeri için çalışan profesyonel
ikinci el araç alım asistanısın.

Aşağıdaki aracı analiz et:

Marka: ${marka}
Model: ${model}
Model yılı: ${yil}
Kilometre: ${km}
Şehir: ${sehir || "Belirtilmedi"}
İstenen fiyat: ${istenen} TL
Donanım/Paket: ${paket || "Belirtilmedi"}

Ekspertiz masrafı: ${ekspertiz || 0} TL
Noter masrafı: ${noter || 0} TL
Diğer masraflar: ${diger || 0} TL

Galericinin minimum istediği kâr:
${minimumKar || 0} TL

Analizi Türkçe yap.

Şu başlıklarla cevap ver:

1. ARAÇ DEĞERLENDİRMESİ
2. TAHMİNİ PİYASA DEĞERİ
3. İDEAL ALIŞ FİYATI
4. MAKSİMUM ALIŞ FİYATI
5. TOPLAM MALİYET
6. ÖNERİLEN SATIŞ FİYATI
7. TAHMİNİ NET KÂR
8. KARAR
9. NEDEN

Karar seçeneklerinden yalnızca birini kullan:

🟢 AL
🟡 PAZARLIKLA AL
🔴 ALMA

Önemli kurallar:

- Gerçek piyasa verisine erişimin yoksa kesin fiyat varmış
  gibi davranma.
- Tahmin olduğunu açıkça belirt.
- Ekspertiz yapılmadan mekanik, boya ve hasar hakkında
  kesin hüküm verme.
- Minimum kâr hedefini dikkate al.
- Kullanıcıya galerici gözüyle mantıklı ve açık bir değerlendirme yap.
`;

        const response = await client.responses.create({
            model: "gpt-5.6-luna",
            input: prompt
        });

        res.json({
            success: true,
            analysis: response.output_text
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Yıldırım AI analiz sırasında bir hata oluştu."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        "⚡ Yıldırım AI sunucusu çalışıyor: " + PORT
    );
});
