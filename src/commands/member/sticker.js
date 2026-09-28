import fs from 'fs/promises';
import { downloadQuotedMedia, removeFile } from '../../lib/sticker/download-media.js';
import { createSticker } from '../../lib/sticker/create-sticker.js';

function getPackAndPublisher(args, pushName) {
    const defaultPack = 'ϟ B0tx';
    const defaultAuthor = `࿓ 👤 ${pushName || 'Usuário'}`;

    if (!args?.length) {
        return {
            packName: defaultPack,
            publisher: defaultAuthor
        };
    }

    const packName = args[0]?.trim() || defaultPack;
    const publisher = args.length > 1
        ? args.slice(1).join(' ').trim() || defaultAuthor
        : defaultAuthor;

    return { packName, publisher };
}

export default {
    name: 'sticker',
    aliases: ['s', 'fig', 'figurinha'],
    async execute(sock, msg, from, t, command, sender, args) {
        let downloaded = null;
        let generated = null;

        try {
            downloaded = await downloadQuotedMedia(msg);

            if (!downloaded) {
                await sock.sendMessage(from, { text: t.stickerMsg1() }, { quoted: msg });
                return;
            }

            await sock.sendMessage(from, { react: { text: '🖼️', key: msg.key } });

            const pushName = msg.pushName || msg.pushname || 'Usuário';
            const { packName, publisher } = getPackAndPublisher(args, pushName);

            generated = await createSticker({ inputPath: downloaded.inputPath, type: downloaded.type, packName, publisher });

            const buffer = await fs.readFile(generated);

            await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });

        } catch (error) {
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });

            let text = t.stickerMsg2();

            if (error?.code === 'VIDEO_TOO_LONG') {
                text = t.stickerMsg3();
            }

            await sock.sendMessage(from, { text },{ quoted: msg });

        } finally {
            if (downloaded?.inputPath) {
                await removeFile(downloaded.inputPath);
            }

            if (generated) {
                await removeFile(generated);
            }
        }
    }
};
