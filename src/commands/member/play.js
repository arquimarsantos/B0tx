import { cfg } from '../../config.js';
import {
    downloadMusic,
    removeMusicFile,
    isYTUrl
} from '../../lib/music/ytdl.js';
import fs from 'fs/promises';

export default {
    name: 'play',
    aliases: ['song', 'musica', 'msc', 'cancion', 'p'],
    async execute(sock, msg, from, t, command, sender, args) {
        return;
        const query = args.join(' ').trim();

        if (!query) {
            await sock.sendMessage(from, { text: t.playMsg1(cfg.prefix, command) }, { quoted: msg });
            return;
        }

        if (query.startsWith('http') && !isYTUrl(query)) {
            await sock.sendMessage(from, { text: t.playMsg2() }, { quoted: msg });
            return;
        }

        let musicPath = null;

        try {
            await sock.sendMessage(from, { react: { text: '🎵', key: msg.key } });
            await sock.sendMessage(from, { text: t.playMsg3(query) }, { quoted: msg });

            const result = await downloadMusic(query);
            musicPath = result.path;

            const stat = await fs.stat(musicPath);
            if (!stat.size || stat.size < 1000) {
                throw new Error('O arquivo MP3 foi criado, mas está vazio ou inválido.');
            }

            const infoMessage = await sock.sendMessage(from, {
                image: { url: result.meta.thumbnail },
                caption: t.playCaption(result.meta.title, result.meta.author, result.meta.timestamp, result.meta.url)
            }, { quoted: msg });

            await sock.sendMessage(
                from,
                {
                    audio: { url: musicPath },
                    mimetype: 'audio/mpeg',
                    ptt: false
                },
                { quoted: infoMessage }
            );
        } catch (error) {
            //console.error(error);
            await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });

            let errorText = t.playMsg4();

            switch (error?.code) {
                case 'TOO_LONG':
                    errorText = t.playMsg5();
                    break;
                case 'YTDLP_LOGIN_REQUIRED':
                    errorText = t.playMsg6();
                    break;
                case 'YTDLP_PRIVATE':
                    errorText = t.playMsg7();
                    break;
                case 'YTDLP_MEMBERS_ONLY':
                    errorText = t.playMsg8();
                    break;
                case 'YTDLP_UNAVAILABLE':
                    errorText = t.playMsg9();
                    break;
                case 'YTDLP_BOT_CHECK':
                    errorText = t.playMsg10();
                    break;
                case 'YTDLP_FFMPEG':
                    errorText = t.playMsg11();
                    break;
                case 'YTDLP_FAILED':
                case 'YTDLP_ERROR':
                    errorText = t.playMsg12();
                    break;
            }

            await sock.sendMessage(from, { text: errorText }, { quoted: msg });
        } finally {
            if (musicPath) {
                await removeMusicFile(musicPath);
            }
        }
    }
};
