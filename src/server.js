import express from 'express';
import { translateLang, pt } from './languages/total-languages.js';

const app = express();

app.get('/', function (req, res) {
    res.send('Server online');
});

app.use(express.json());

app.post("/reset-link", async (req, res) => {
    try {
        const { token, link } = req.body;
        if (token !== "arquimar") {
            return res.status(401).json({
                ok: false,
                error: "Token inválido"
            });
        }

        if (!link || !link.includes("chat.whatsapp.com/")) {
            return res.status(400).json({
                ok: false,
                error: "Link do WhatsApp inválido"
            });
        }

        const inviteCode = link
            .split("chat.whatsapp.com/")[1]
            .split(/[?#\s]/)[0];

        if (!global.sock) {
            return res.status(503).json({
                ok: false,
                error: "Bot ainda não está conectado"
            });
        }
        
        const groupInfo = await global.sock.groupGetInviteInfo(inviteCode);

        if (!groupInfo?.id) {
            return res.status(404).json({
                ok: false,
                error: "Grupo não encontrado pelo convite"
            });
        }

        const groupJid = groupInfo.id;

        const newInviteCode = await global.sock.groupRevokeInvite(groupJid);

        if (!newInviteCode) {
            throw new Error("WhatsApp não retornou um novo convite");
        }

        const newLink = `https://chat.whatsapp.com/${newInviteCode}`;

        console.log(`✅ Novo link gerado: ${newLink}`);

        return res.json({
            ok: true,
            groupJid,
            oldLink: link,
            newCode: newInviteCode,
            newLink
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(translateLang['consoleMsg11'](PORT));
});
